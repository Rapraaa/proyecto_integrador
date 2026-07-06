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

## 🧪 Pruebas Unitarias

El proyecto cuenta con una suite completa de pruebas unitarias implementadas con **Jest** y **@nestjs/testing**.

### Ejecutar las pruebas

```bash
cd simulador_entrevistas

# Ejecutar todos los tests unitarios
npm test

# Ejecutar con reporte de cobertura
npm run test:cov

# Ejecutar en modo watch (desarrollo)
npm run test:watch
```

### Reporte de cobertura

El reporte se genera en `simulador_entrevistas/coverage/` y puede visualizarse abriendo `coverage/lcov-report/index.html` en el navegador.

La configuración de Jest excluye de la medición de cobertura los archivos que no contienen lógica testeable:
- `main.ts` (bootstrap de la aplicación)
- `seeds/**` (scripts de seeding)
- `**/*.module.ts` (definiciones de módulos — solo configuración)
- `**/*.entity.ts` (entidades TypeORM — solo decoradores)
- `**/*.schema.ts` (schemas Mongoose — solo decoradores)

Se requiere un **mínimo de 70% de cobertura** en statements, functions y lines.

### Arquitectura de pruebas

- **Servicios**: se mockean los repositorios (TypeORM `Repository` y Mongoose `Model`) para verificar operaciones CRUD, manejo de errores y casos excepcionales.
- **Controladores**: se mockean los servicios para verificar que los endpoints delegan correctamente las operaciones.
- **Autenticación**: se mockean `UsersService`, `JwtService` y `bcrypt` para verificar registro, login, generación de JWT, guards y strategy.
- **No se usan bases de datos reales** — todo se ejecuta con mocks.

### Inventario de pruebas

#### Pruebas de Servicios (17)

| # | Servicio | Archivo de prueba |
|---|----------|-------------------|
| 1 | AppService | `src/app.service.spec.ts` |
| 2 | AuthService | `src/modules/auth/auth.service.spec.ts` |
| 3 | UsersService | `src/modules/users/users.service.spec.ts` |
| 4 | InterviewsService | `src/modules/interviews/interviews.service.spec.ts` |
| 5 | AiService | `src/modules/ai/ai.service.spec.ts` |
| 6 | CompaniesService | `src/modules/catalogs/services/companies.service.spec.ts` |
| 7 | DifficultyLevelsService | `src/modules/catalogs/services/difficulty-levels.service.spec.ts` |
| 8 | InterviewTypesService | `src/modules/catalogs/services/interview-types.service.spec.ts` |
| 9 | JobRolesService | `src/modules/catalogs/services/job-roles.service.spec.ts` |
| 10 | RolesService | `src/modules/catalogs/services/roles.service.spec.ts` |
| 11 | SeniorityLevelsService | `src/modules/catalogs/services/seniority-levels.service.spec.ts` |
| 12 | TechCategoriesService | `src/modules/technologies/services/tech-categories.service.spec.ts` |
| 13 | EvaluationCriteriaService | `src/modules/prompts/services/evaluation-criteria.service.spec.ts` |
| 14 | AchievementsService | `src/modules/achievements/achievements.service.spec.ts` |
| 15 | QuestionBankService | `src/modules/question-bank/question-bank.service.spec.ts` |
| 16 | AiLogsService | `src/modules/ai-logs/ai-logs.service.spec.ts` |

#### Pruebas de Controladores (16)

| # | Controlador | Archivo de prueba |
|---|-------------|-------------------|
| 1 | AppController | `src/app.controller.spec.ts` |
| 2 | AuthController | `src/modules/auth/auth.controller.spec.ts` |
| 3 | UsersController | `src/modules/users/users.controller.spec.ts` |
| 4 | InterviewsController | `src/modules/interviews/interviews.controller.spec.ts` |
| 5 | CompaniesController | `src/modules/catalogs/controllers/companies.controller.spec.ts` |
| 6 | DifficultyLevelsController | `src/modules/catalogs/controllers/difficulty-levels.controller.spec.ts` |
| 7 | InterviewTypesController | `src/modules/catalogs/controllers/interview-types.controller.spec.ts` |
| 8 | JobRolesController | `src/modules/catalogs/controllers/job-roles.controller.spec.ts` |
| 9 | RolesController | `src/modules/catalogs/controllers/roles.controller.spec.ts` |
| 10 | SeniorityLevelsController | `src/modules/catalogs/controllers/seniority-levels.controller.spec.ts` |
| 11 | TechCategoriesController | `src/modules/technologies/controllers/tech-categories.controller.spec.ts` |
| 12 | EvaluationCriteriaController | `src/modules/prompts/controllers/evaluation-criteria.controller.spec.ts` |
| 13 | AchievementsController | `src/modules/achievements/achievements.controller.spec.ts` |
| 14 | QuestionBankController | `src/modules/question-bank/question-bank.controller.spec.ts` |
| 15 | AiLogsController | `src/modules/ai-logs/ai-logs.controller.spec.ts` |

#### Pruebas del Módulo de Autenticación

| Componente | Archivo de prueba | Casos de prueba |
|------------|-------------------|-----------------|
| AuthService | `auth.service.spec.ts` | Login (sin usuario, password incorrecto, éxito, payload correcto), Register (éxito, delegación) |
| AuthController | `auth.controller.spec.ts` | Login retorna token, Register retorna token |
| JwtAuthGuard | `guards/jwt-auth.guard.spec.ts` | Definición, extiende AuthGuard('jwt') |
| RolesGuard | `guards/roles.guard.spec.ts` | Sin roles requeridos, rol correcto, rol incorrecto, usuario undefined |
| JwtStrategy | `jwt.strategy.spec.ts` | Definición, validate() con payload completo/parcial/vacío |
| Roles Decorator | `decorators/roles.decorator.spec.ts` | Metadata con un rol, múltiples roles, sin roles |
