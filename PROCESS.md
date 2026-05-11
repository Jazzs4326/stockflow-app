# Proceso de Desarrollo y Toma de Decisiones

## 1. Cómo abordé el problema
- **El inicio:** Comencé analizando los requisitos del control de inventarios. Empecé diseñando la estructura y el esquema de la base de datos (Sucursales, Productos, Stock y Movimientos) para tener cimientos sólidos desde el principio e igual el usar lo que es la IA fue de mucha ayuda para avanzar mas rapido en el desarrollo de este proyecto.
- **Decisiones intermedias:** Decidí crear la lógica principal y el motor de base de datos, priorizando las operaciones atómicas (como transacciones de MongoDB) para evitar problemas.
- **El final:** Dejé para el final la interfaz de usuario (UI), enfocándome en que fuera limpia y funcional. En la última fase del desarrollo se decidió realizar una reestructuración hacia un esquema de **Monorepo** separando Frontend en Next.js y Backend en Express para mejorar el mantenimiento del sistema a futuro.

## 2. Herramientas del Flujo de Trabajo
- **IDE:** Visual Studio Code
- **Control de Versiones:** Git y GitHub.
- **Base de Datos:** MongoDB Atlas 
- **Despliegue:** Vercel 
- **Pruebas de API:** Postman 
- **Asistente de IA:** Antigravity AI 

## 3. Decisiones Técnicas Más Importantes
1. **Reestructuración a Monorepo (Frontend y Backend Separados)**:
   - *Por qué:* Inicialmente la idea era hacer un monolito en Next.js, pero decidí separar el Backend en un proyecto de Node.js puro con Express. Esto aumenta la flexibilidad y desacopla la carga del servidor de la interfaz, aunque a cambio requiere gestionar dos despliegues en lugar de uno.
2. **Uso de Transacciones ACID en MongoDB**:
   - *Por qué:* Para los movimientos de stock críticos (ej. transferencias entre dos sucursales), se debe restar producto en una y sumarlo en la otra de manera estrictamente atómica. Si ocurre un fallo a mitad del proceso, la transacción entera hace *rollback*, evitando descuadres catastróficos en el inventario.
3. **Enfoque en Asincronismo**:
   - *Por qué:* Para garantizar que el usuario no tenga que esperar bloqueado mientras el sistema consolida el inventario si el volumen es alto. Diseñar los movimientos para que puedan procesarse de forma asíncrona mantiene la plataforma sumamente responsiva y ágil para el cliente final.
