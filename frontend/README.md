# StockFlow

Plataforma de control de inventario multi-sucursal construida con Next.js, React, TailwindCSS y MongoDB.

## Arquitectura y Decisiones Técnicas
StockFlow es un Monolito Modular desarrollado con el App Router de Next.js.
- **Frontend y Backend unificados**: Eliminamos problemas de CORS y latencia de red innecesaria.
- **Base de Datos**: MongoDB Atlas con Mongoose.
- **Operaciones Atómicas**: Se utiliza `$inc` y Transacciones de Mongoose para el procesamiento de stock, garantizando consistencia en entornos de alta concurrencia.
- **Worker Serverless**: En lugar de RabbitMQ o un proceso de fondo Node.js permanente (los cuales mueren o son difíciles de gestionar en Vercel), implementamos un patrón "Cron Endpoint". Vercel Cron llama a `/api/cron/process-movements` para buscar los movimientos pendientes y aplicarlos asíncronamente.

## Setup Local
1. Instalar dependencias: `npm install`
2. Configurar variables de entorno: Renombrar o copiar `.env.local` y agregar un `MONGODB_URI` válido.
3. Iniciar desarrollo: `npm run dev`
4. Abre `http://localhost:3000` en tu navegador.

## Scripts Adicionales
- `npm run test`: Ejecuta las pruebas unitarias básicas del worker (requiere configuración previa de Jest).

## Despliegue en Vercel
1. Importa el repositorio a tu cuenta de Vercel.
2. Agrega la variable de entorno `MONGODB_URI` en los settings del proyecto.
3. Vercel leerá automáticamente el archivo `vercel.json` y configurará el cron job para procesar el inventario automáticamente cada minuto.

## Trade-offs
- **Worker**: El polling basado en Cron es ideal para este reto (es cloud-native y serverless friendly). Si la escala fuera masiva a nivel global (millones de movimientos por minuto), se separaría en un SQS + Worker en ECS.
- **Transacciones**: Requieren que el cluster de MongoDB sea un Replica Set (Atlas lo es por defecto), por eso es totalmente estable.
