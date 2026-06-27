# Documento de Especificación: Simulador de Entrevistas Técnicas con IA

## 1. Visión General del Proyecto
Desarrollo de un simulador de entrevistas interactivo potenciado por Inteligencia Artificial (IA), diseñado específicamente para que programadores puedan practicar y prepararse bajo presión antes de enfrentarse a un proceso de selección real.

---

## 2. Alcance del Sistema (MVP)
El sistema está estrictamente delimitado para usuarios desarrolladores de software que tienen una entrevista técnica programada a corto plazo y requieren un entrenamiento rápido.

*   **Incluido en el MVP:**
    *   **Módulo de Autenticación:** Registro e inicio de sesión seguro de usuarios.
    *   **Módulo de Contextualización:** Interfaz con un formulario y encuesta inicial para recolectar el perfil del usuario antes de la simulación.
    *   **Simulador Orientado a Texto:** Canal de comunicación interactivo (tipo chat) donde la IA actúa como entrevistador técnico.
    *   **Editor de Código Integrado:** Área de texto plano dentro de la interfaz para resolver desafíos algorítmicos planteados por la IA.
    *   **Módulo de Métricas:** Sistema de análisis de respuestas para generar un reporte detallado con feedback y puntaje final.
    *   **Dashboard del Usuario:** Perfil personal con historial de simulaciones pasadas y métricas globales.
    *   **Despliegue Técnico:** Publicación de la aplicación en producción utilizando un Servidor Virtual Privado (VPS).

*   **Fuera del alcance:**
    *   Interacción o simulación por voz (Speech-to-Text / Text-to-Speech).
    *   Análisis de lenguaje corporal mediante reconocimiento facial por cámara web.
    *   Carga y procesamiento automático de archivos PDF (lectura de hojas de vida/CV).
    *   Compilación y ejecución del código ingresado en tiempo real (consola de ejecución activa).
    *   Traducción automática de respuestas y avisos en diferentes idioma.

---

## 3. Perfiles de Usuario (Roles)
*   **Usuario (Postulante):** Desarrollador que gestiona su cuenta, define el contexto de su práctica en la encuesta, realiza la entrevista interactiva por texto, redacta código en el editor y visualiza sus reportes de rendimiento.
*   **Administrador (Gestor del Sistema):** Rol técnico encargado de auditar cuentas de usuario, restringir o bloquear accesos, refinar y modificar los prompts base de la IA, optimizar las consultas para evitar la saturación del servidor y gestionar la base de datos de manera directa.

---

## 4. Requisitos Funcionales (Historias de Usuario)
*Formato estándar: "Como [Rol], quiero [Acción] para [Beneficio]."*

### Módulo: Configuración inicial
*   **RF-01:** Como **Usuario**, quiero responder una encuesta inicial (indicar si soy estudiante, egresado, etc.) para que la IA adapte el tono y nivel de la entrevista.
*   **RF-02:** Como **Usuario**, quiero seleccionar de forma explícita si mi entrevista será técnica o teórica para enfocar el simulador a la fase específica de mi proceso de selección.

### Módulo: El Simulador y Código
*   **RF-03:** Como **Usuario**, quiero que la IA me envíe preguntas de manera secuencial (una a una) para poder enfocarme y responder ordenadamente en el chat.
*   **RF-04:** Como **Usuario**, quiero disponer de un editor de texto dedicado en la pantalla para poder estructurar y enviar soluciones de código cuando la IA lo requiera.

### Módulo: Feedback e Historial
*   **RF-05:** Como **Usuario**, quiero que la IA genere un reporte detallado y consejos específicos de mejora al finalizar el ejercicio para saber cómo optimizar mi rendimiento.
*   **RF-06:** Como **Usuario**, quiero tener acceso a un dashboard histórico para revisar las calificaciones obtenidos en mis simulaciones anteriores.

---

## 5. Requisitos No Funcionales (Atributos de Calidad)

### Rendimiento
*   Las respuestas generadas por la IA deben procesarse y mostrarse en pantalla en un tiempo menor a **5 segundos**.
*   El tiempo de carga de las páginas internas de la plataforma (Dashboard, Historial) debe ser inferior a **1.5 segundos**.
*   El sistema debe garantizar una disponibilidad continua (uptime) del **99%**.

### Usabilidad y Accesibilidad
*   La interfaz del sistema debe ser minimalista, intuitiva y adaptable a dispositivos portátiles y de escritorio (Responsive).
*   **Accesibilidad (WCAG):** Toda la aplicación debe ser compatible de forma nativa con lectores de pantalla. Se implementará una estructura semántica rigurosa, soporte total para navegación por teclado y etiquetas de texto alternativo (`alt`) en componentes dinámicos (como fotos de perfil).

### Seguridad
*   Todas las credenciales de los usuarios deben encriptarse mediante métodos de hashing seguro en la base de datos (nunca texto plano).
*   Las API keys utilizadas para conectar con los modelos de IA deben resguardarse en el servidor bajo variables de entorno (`.env`) sin exposición alguna en el Frontend.
*   La autenticación y el manejo de sesiones activas se implementarán mediante **JWT (JSON Web Tokens)** de forma segura.

---

## 6. Arquitectura y Stack Tecnológico
*   **Frontend:** React + Vite (Asegura velocidad de desarrollo, modularidad y compatibilidad con interfaces accesibles).
*   **Backend:** NestJS (Framework de Node.js estructurado en TypeScript, óptimo para la inyección de dependencias).
*   **Base de Datos (Híbrida):** 
    *   **PostgreSQL:** Para el esquema relacional de usuarios, roles y manejo de sesiones seguras.
    *   **MongoDB:** Para colecciones flexibles no relacionales (banco de preguntas, respuestas del chat, logs e historial de la IA).
*   **Herramientas Clave:** Postman, dbdiagram.io, FigJam, GitHub, Linear, Jest y Playwright.

---

## 7. Estrategia de Calidad de Software (QA)

### A. Pruebas de Accesibilidad
*   **Manuales:** Uso regular de los lectores de pantalla **NVDA** u **Orca** para verificar de manera auditiva que todos los flujos sean legibles y operables exclusivamente con el teclado.
*   **Automatizadas:** Ejecución de auditorías con *Lighthouse* y *Axe DevTools* en el Frontend para monitorear el contraste cromático, el uso correcto de atributos ARIA y la estructura semántica de las etiquetas.

### B. Análisis Estático de Código
*   Implementación de **ESLint** en ambos repositorios (Front y Back) para mitigar malas prácticas de programación y detectar variables inactivas antes de realizar los deploys.
*   Uso de **Prettier** para estandarizar el estilo y formateo del código fuente de todo el grupo.

### C. Pruebas de Integración y Unitarias
*   **Integración:** Documentación y testeo de endpoints del servidor (rutas HTTP, controladores y códigos de estado como 200, 400, 500) a través de colecciones en *Postman*.
*   **Unitarias (Jest):** Programación de pruebas aisladas en NestJS para asegurar el correcto procesamiento numérico del cálculo de métricas (puntajes finales) y verificar la consistencia en el formateo de strings destinados a los prompts de la IA.

### D. Pruebas Funcionales (E2E)
*   Automatización de pruebas de flujo de usuario completo (*Happy Path*) con **Playwright** (Login $\rightarrow$ Encuesta $\rightarrow$ Chat $\rightarrow$ Reporte). 
*   Validación automatizada de escenarios de fallo o casos de borde (*Edge Cases*), tales como el envío de código vacío, datos corruptos en el formulario o desconexión inesperada de la red.
