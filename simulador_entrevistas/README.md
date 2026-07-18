# Simulador de Entrevistas Técnicas con IA — Backend

API REST construida con **NestJS** que impulsa el simulador de entrevistas técnicas.
Gestiona autenticación con JWT, catálogos, usuarios y el flujo de entrevistas con una
IA entrevistadora (Google Gemini). Usa **PostgreSQL** (datos relacionales) y **MongoDB**
(entrevistas y logs de IA).

## Integrantes

- Rahí Ruilova
- Carlos Baños
- Domenica Carrera

## Tecnologías

- NestJS + TypeScript
- PostgreSQL (TypeORM) — usuarios, catálogos y entidades relacionales
- MongoDB (Mongoose) — entrevistas, banco de preguntas y logs de IA
- Autenticación JWT (Passport)
- Google Generative AI (Gemini)
- Swagger (documentación de la API)

## Instalación

```bash
npm install
cp .env.example .env   # configurar las variables (ver abajo)
npm run seed           # poblar los catálogos (roles, seniority, etc.)
npm run start:dev
```

La API queda en `http://localhost:3000` y la documentación en `/api/docs`.

> **`npm run seed` es obligatorio** antes de registrar usuarios: el rol por defecto se
> resuelve contra la tabla `roles`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Conexión a PostgreSQL |
| `MONGO_URI` | Cadena de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar los JWT (**obligatorio y fuerte**; nunca usar un valor por defecto) |
| `JWT_EXPIRES_IN` | Expiración del token (ej. `3600s`) |
| `GEMINI_API_KEY` | API key de Google Gemini |
| `PORT` | Puerto de la API (por defecto 3000) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Bootstrap del primer administrador al arrancar (opcional) |

## Administradores (buenas prácticas)

- El registro siempre crea usuarios con rol `user`; nadie puede auto-asignarse `admin`.
- El **primer admin** se crea con el bootstrap: si defines `ADMIN_EMAIL` y `ADMIN_PASSWORD`,
  al arrancar el backend se crea (o promueve) ese administrador de forma idempotente.
- Los siguientes admins se promueven con `PATCH /users/:id/role` (endpoint solo-admin).

## Scripts

```bash
npm run start:dev   # desarrollo (watch)
npm run start:prod  # producción
npm run build       # compilar
npm run seed        # poblar catálogos
npm run test        # pruebas unitarias
```

## Despliegue

Configuración recomendada (VPS): Ubuntu + Nginx (reverse proxy) + HTTPS (Let's Encrypt).
Definir todas las variables de entorno en el servidor (nunca commitear el `.env`).
Tras el primer despliegue, ejecutar `npm run seed` contra la base de datos de producción.

## Documentación

Swagger disponible en `/api/docs` con todos los endpoints y esquemas.
