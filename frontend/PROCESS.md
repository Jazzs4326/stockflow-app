# PROCESS.md - Flujo de Trabajo y Toma de Decisiones

## 1. Análisis y Enfoque Inicial
El requerimiento era construir un control de inventarios estable, sin sobreingeniería (nada de Docker, RabbitMQ o microservicios innecesarios) en 48 horas.
Prioridad: Funcionalidad, arquitectura limpia y deploy funcional en Vercel.

## 2. Decisiones Arquitectónicas
- **Framework**: Next.js App Router (React Server/Client Components).
- **Almacenamiento**: MongoDB Atlas porque su modelo documental encaja perfecto para agrupar reportes, y soporta Transacciones ACID para la consistencia del stock.
- **Asincronismo**: El requerimiento de procesar movimientos "asíncronamente" sin RabbitMQ se abordó mediante una cola en base de datos (estado `pending`) procesada por un endpoint `/api/cron/...` configurado vía Vercel Cron. Esto es 100% cloud-native y serverless friendly.

## 3. Flujo de Trabajo
1. Diseño de Arquitectura y validación con el cliente.
2. Inicialización estricta del proyecto Next.js y conexión de Mongoose en formato Singleton para evitar memory leaks en Serverless.
3. Creación de los Modelos (Product, Branch, Stock, Movement) con validaciones e índices apropiados.
4. Implementación de los Endpoints CRUD (REST).
5. Desarrollo del Worker asíncrono utilizando Sesiones y Transacciones de MongoDB para garantizar Atomicidad de stock.
6. Construcción del Frontend (Dashboard con simulación del cron, gestión completa de CRUD y vistas).

## 4. Qué se dejó fuera
- Autenticación/Autorización (no requerido en el prompt explícitamente).
- Borrado lógico (se usa borrado físico para simplificar la prueba de concepto).
- Pruebas E2E completas (solo se dejan pruebas unitarias core sugeridas en Jest).
- UI súper animada compleja. Se prefirió una UI limpia, funcional y directa (TailwindCSS Vanilla + Lucide Icons) para priorizar estabilidad funcional.
