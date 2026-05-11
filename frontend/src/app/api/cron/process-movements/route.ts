import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { processPendingMovements } from '@/services/movement.service';

// Forzar ejecución dinámica en Next.js App Router (No Cachear)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Nota de Seguridad: En un entorno de producción en Vercel, 
    // se debe validar un CRON_SECRET para asegurar que solo Vercel ejecute este endpoint.
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    await dbConnect();
    
    // Invocamos la lógica del worker separada en el servicio
    const result = await processPendingMovements();

    return NextResponse.json({
      message: 'Procesamiento de movimientos finalizado',
      result
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error crítico al procesar movimientos',
      details: error.message
    }, { status: 500 });
  }
}
