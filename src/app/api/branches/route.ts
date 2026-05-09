import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Branch from '@/models/Branch';

export async function GET() {
  try {
    await dbConnect();
    const branches = await Branch.find({}).sort({ createdAt: -1 });
    return NextResponse.json(branches);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener las sucursales', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.location) {
      return NextResponse.json({ error: 'Faltan campos requeridos (name, location)' }, { status: 400 });
    }

    const newBranch = await Branch.create(body);
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'El nombre de la sucursal ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear la sucursal', details: error.message }, { status: 400 });
  }
}
