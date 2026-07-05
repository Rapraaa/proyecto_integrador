Simulador de Entrevistas Técnicas con IA

API REST construida con **NestJS** que simula entrevistas técnicas potenciadas por Inteligencia Artificial (Google Gemini). Integra **PostgreSQL** (relacional) y **MongoDB** (NoSQL) de forma simultánea, con autenticación **JWT**, control de roles y documentación **Swagger**.

---

## Información General

- **Nombre del proyecto:** Simulador de Entrevistas Técnicas con IA
- **Integrantes del equipo:**
  - _[Rahí Ruilova]_
  - _[Carlos Baños]_
  - _[Domenica Carrera]_
  - _[Renato ]_  
- **Descripción funcional:**
  Plataforma donde un desarrollador configura una entrevista (rol, seniority, tecnologías), conversa por chat con una IA que actúa como entrevistador técnico, y al finalizar recibe un reporte con puntaje y feedback. Incluye gestión de usuarios con roles, autenticación segura y persistencia híbrida.

---

## rquitectura

Estructura modular siguiendo las buenas prácticas de NestJS. Todo el código vive bajo `src/modules/`:

```
src/
├── app.module.ts                 # Módulo raíz: conexiones a BD + registro de módulos
├── main.ts                       # Bootstrap: ValidationPipe global + Swagger
└── modules/
    ├── auth/                     # Autenticación JWT (register, login, guards, strategy)
    ├── users/                    # Gestión de usuarios (PostgreSQL / TypeORM)
    ├── interviews/               # Entrevistas y chat (MongoDB / Mongoose)
    └── ai/                       # Integración con el proveedor de IA (Gemini)
```

- **PostgreSQL** (vía TypeORM): usuarios, roles, credenciales.
- **MongoDB** (vía Mongoose): entrevistas, historial de chat, evaluaciones.

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **NestJS** | Framework backend (TypeScript) |
| **TypeORM** | ORM para PostgreSQL |
| **PostgreSQL** | Base de datos relacional |
| **MongoDB** | Base de datos NoSQL |
| **Mongoose** | ODM para MongoDB |
| **JWT** (`@nestjs/jwt`, `passport-jwt`) | Autenticación basada en tokens |
| **bcrypt** | Hashing seguro de contraseñas |
| **class-validator / class-transformer** | Validación de DTOs |
| **Swagger** (`@nestjs/swagger`) | Documentación automática de la API |
| **Google Gemini** (`@google/generative-ai`) | Motor de IA del entrevistador |

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-integrador/simulador_entrevistas
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear un archivo `.env` en `simulador_entrevistas/` con:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=simulador_entrevistas

# MongoDB
MONGO_URI=mongodb://localhost:27017/simulador_entrevistas

# JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=3600s

# IA (Google Gemini)
GEMINI_API_KEY=tu_api_key_de_gemini

# Servidor
PORT=3000
```

### 4. Ejecutar el proyecto
```bash
# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API queda disponible en `simulador-entrevistas-api.uaeftt-ute.site`.
La documentación Swagger en `http://simulador-entrevistas-api.uaeftt-ute.site/api/docs`.

---

##  Uso — Autenticación

### 1. Registrar un usuario
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "seniorityLevel": "mid"
}
```

### 2. Iniciar sesión y obtener el token JWT
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```
Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Consumir un endpoint protegido
Incluir el token en la cabecera `Authorization`:
```bash
GET /interviews
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> En Swagger: usar el botón **"Authorize"** y pegar el token para probar las rutas protegidas.

---

## 📋 Listado de Endpoints

### Autenticación (`/auth`)
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrar un nuevo usuario | ❌ |
| POST | `/auth/login` | Iniciar sesión y obtener token JWT | ❌ |

### Usuarios (`/users`) — PostgreSQL
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/users` | Listar todos los usuarios | ✅ |
| GET | `/users/:id` | Obtener un usuario por ID | ✅ |
| PATCH | `/users/:id` | Actualizar un usuario | ✅ |
| DELETE | `/users/:id` | Eliminar un usuario | ✅ |

### Entrevistas (`/interviews`) — MongoDB
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/interviews` | Crear/iniciar una entrevista (la IA da la 1ª pregunta) | ✅ |
| POST | `/interviews/:id/messages` | Responder y recibir la siguiente pregunta de la IA | ✅ |
| POST | `/interviews/:id/finish` | Finalizar y generar el reporte de evaluación | ✅ |
| GET | `/interviews` | Historial de entrevistas del usuario | ✅ |
| GET | `/interviews/:id` | Detalle de una entrevista | ✅ |

---

## Roles y Permisos

| Rol | Permisos |
|---|---|
| **Usuario** (`user`) | Consultar información, gestionar sus propias entrevistas |
| **Administrador** (`admin`) | Crear, actualizar y eliminar registros, gestionar usuarios |

El control de acceso se implementa con `JwtAuthGuard` (autenticación) y `RolesGuard` + decorador `@Roles()` (autorización por rol).

---

## Manejo de Errores

La API usa las excepciones nativas de NestJS y devuelve los códigos HTTP estándar:

| Código | Significado |
|---|---|
| `400` | Bad Request — datos inválidos (validación de DTOs) |
| `401` | Unauthorized — token ausente o inválido |
| `403` | Forbidden — sin permisos para el recurso |
| `404` | Not Found — recurso inexistente |
| `500` | Internal Server Error — error inesperado |

---

## Documentación (Swagger)

Disponible en: **`http://simulador-entrevistas-api.uaeftt-ute.site/api/docs`**

Incluye descripción de cada endpoint, parámetros, códigos de respuesta y ejemplos de uso.

---

##  Pruebas

Colección de **Postman / Thunder Client** incluida en el repositorio con todos los endpoints configurados.

### Ejecutar pruebas unitarias
```bash
npm run test
```

### Ejecutar pruebas específicas
```bash
npm test -- --runInBand src/modules/auth/auth.service.spec.ts src/modules/auth/auth.controller.spec.ts
```

### Generar reporte de cobertura
```bash
npm run test:cov
```

El reporte queda en la carpeta `coverage/` y puedes abrirlo con:
```bash
coverage/lcov-report/index.html
```

### Requisitos para las pruebas
- Node.js 20+
- npm 10+
- Dependencias instaladas con `npm install`

