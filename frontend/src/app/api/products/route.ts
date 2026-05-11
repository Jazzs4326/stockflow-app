import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener los productos', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validación básica
    if (!body.sku || !body.name || !body.price || !body.category) {
      return NextResponse.json({ error: 'Faltan campos requeridos (sku, name, price, category)' }, { status: 400 });
    }

    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'El SKU ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al crear el producto', details: error.message }, { status: 400 });
  }
}
