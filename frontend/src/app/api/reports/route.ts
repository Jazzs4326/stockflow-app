import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Movement from '@/models/Movement';
import Stock from '@/models/Stock';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (type === 'stock') {
      const stock = await Stock.find({})
        .populate('productId', 'name sku')
        .populate('branchId', 'name');
      return NextResponse.json(stock);
    }

    let query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const movementsAgg = await Movement.aggregate([
      { $match: query },
      {
        $group: {
          _id: { type: "$type", status: "$status" },
          count: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);

    return NextResponse.json({ movementsAgg });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al generar reporte', details: error.message }, { status: 500 });
  }
}
