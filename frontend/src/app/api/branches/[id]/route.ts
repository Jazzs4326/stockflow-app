import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Branch from '@/models/Branch';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const branch = await Branch.findById(id);
    
    if (!branch) {
      return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(branch);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener la sucursal', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    const updatedBranch = await Branch.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBranch) {
      return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updatedBranch);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'El nombre de la sucursal ya está en uso' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al actualizar la sucursal', details: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const deletedBranch = await Branch.findByIdAndDelete(id);

    if (!deletedBranch) {
      return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Sucursal eliminada con éxito' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar la sucursal', details: error.message }, { status: 500 });
  }
}
