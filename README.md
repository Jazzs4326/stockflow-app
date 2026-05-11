# StockFlow - Inventory Control Platform

Plataforma de control de inventario multi-sucursal desarrollada bajo una arquitectura Monorepo.

## URL de Producción
https://stockflow-app-c9gr.vercel.app/

> Para desplegar el frontend en Vercel, se debe seleccionar la carpeta `frontend` como **Root Directory** dentro de la configuración del proyecto.

---

# Setup Local

## 1. Clonar repositorio

```bash
git clone <repo-url>
cd stockflow
```

## 2. Estructura del proyecto

El proyecto está dividido en dos aplicaciones principales:

- `frontend/` → Aplicación Next.js
- `backend/` → API REST con Node.js y Express

---

# Frontend

```bash
cd frontend
npm install
npm run dev
```

Disponible en:

```txt
http://localhost:3000
```

---

# Backend

```bash
cd backend
npm install
npm run dev
```

Disponible en:

```txt
http://localhost:5000
```

---

# Variables de Entorno

## frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## backend/.env

```env
MONGODB_URI=tu_cadena_mongodb_atlas
PORT=5000
```

---

# Decisiones de Arquitectura

## Arquitectura Monorepo
Se separó el frontend y backend en aplicaciones independientes para mantener una mejor organización y permitir escalabilidad futura de ambos servicios.

## MongoDB Atlas + Mongoose
MongoDB Atlas fue seleccionado por su facilidad de integración cloud y por adaptarse bien al modelo documental requerido para productos, sucursales y movimientos de inventario.

## Backend desacoplado
Se optó por un backend independiente con Express para mantener una API REST clara y reutilizable, permitiendo futuras integraciones con aplicaciones móviles o servicios externos.

## Procesamiento asíncrono
Los movimientos de inventario se procesan de manera asíncrona para evitar bloqueos y mantener consistencia en las operaciones de stock.

---

# Trade-offs

- Se priorizó funcionalidad y estabilidad sobre una arquitectura distribuida más compleja.
- No se implementó autenticación/autorización debido al límite de tiempo y porque no era un requerimiento explícito.
- No se implementó Docker ni microservicios para reducir complejidad operacional.
- El backend requiere despliegue independiente fuera de Vercel (Render, Railway, etc.), ya que Express no opera de forma serverless nativa dentro de esta arquitectura.

---

# ¿Qué mejoraría con más tiempo?

1. Implementar autenticación y roles con NextAuth.js o Clerk.
2. Integrar un sistema de colas real como RabbitMQ o BullMQ.
3. Agregar pruebas E2E con Playwright o Cypress.
4. Configurar pipelines CI/CD con GitHub Actions.
5. Implementar métricas, logs y monitoreo centralizado.