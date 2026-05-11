import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movement from '@/models/Movement';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status');

    let query: any = {};
    if (branchId) {
      query.$or = [{ sourceBranch: branchId }, { destinationBranch: branchId }];
    }
    if (status) {
      query.status = status;
    }

    await dbConnect();
    // Poblar las referencias para mostrar datos legibles en el frontend
    const movements = await Movement.find(query)
      .populate('productId', 'name sku')
      .populate('sourceBranch', 'name')
      .populate('destinationBranch', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(movements);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener movimientos', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Aseguramos que el estado siempre inicie en pending para el Worker
    const newMovement = await Movement.create({
      ...body,
      status: 'pending',
      retryCount: 0
    });

    // 202 Accepted: La solicitud ha sido aceptada para procesamiento, pero el procesamiento no ha sido completado.
    return NextResponse.json(newMovement, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al registrar el movimiento', details: error.message }, { status: 400 });
  }
}
