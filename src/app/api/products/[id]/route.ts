import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener el producto', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true, // Devuelve el documento actualizado
      runValidators: true, // Ejecuta las validaciones de Mongoose en la actualización
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'El SKU ya está en uso por otro producto' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al actualizar el producto', details: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    
    // Aquí podríamos validar si el producto tiene stock o movimientos antes de borrarlo.
    // Para simplificar según requerimientos, permitimos borrar (o se podría hacer borrado lógico).
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado con éxito' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar el producto', details: error.message }, { status: 500 });
  }
}
