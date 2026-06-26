# Laboratorio Semana 14 – Fly Away ✈️

Construye un frontend en React + TypeScript para la API de reserva de vuelos **Fly Away**.

El backend ya está funcionando y completamente documentado — tu trabajo es construir la aplicación web que lo consume.

**Recompensa total:** hasta 1 punto adicional en tu PC2.

---

## La tarea

Construye una SPA con las siguientes funcionalidades. Las marcadas como **must have** son obligatorias; las **nice to have** suman puntos extra.

---

### 1. Pantalla de Registro — `POST /users/register` · +0.1 pts (must have)

- Formulario con: email, nombre, apellido, contraseña
- Validar campos vacíos antes de enviar
- Mostrar errores del backend al usuario (contraseña débil, email en uso)
- Mostrar mensaje de éxito y redirigir al login

---

### 2. Pantalla de Login — `POST /auth/login` · +0.2 pts (must have) · +0.1 pts (nice to have)

**Must have:**
- Formulario con email y contraseña
- Guardar el token JWT en `localStorage` al iniciar sesión
- Mostrar error si las credenciales son incorrectas
- Redirigir al home/búsqueda tras login exitoso

**Nice to have (+0.1):**
- Mostrar el nombre del usuario autenticado en pantalla (`GET /users/current`)

---

### 3. Búsqueda de Vuelos — `GET /flights/search` · +0.1 pts (must have) · +0.1 pts (nice to have)

**Must have:**
- Inputs de búsqueda: número de vuelo y/o nombre de aerolínea
- Mostrar resultados en tabla: número, aerolínea, salida, llegada, asientos disponibles
- Manejar resultado vacío con mensaje amigable

**Nice to have (+0.1):**
- Filtro por rango de fechas de salida

---

### 4. Reservar un Vuelo — `POST /flights/book` · +0.1 pts (must have) · +0.1 pts (nice to have)

**Must have:**
- Botón "Reservar" en cada resultado de búsqueda
- Solo disponible para usuarios autenticados
- Mostrar mensaje de éxito con el ID de reserva
- Mostrar errores del backend (vuelo pasado, horario superpuesto)

**Nice to have (+0.1):**
- Ver detalle de la reserva (`GET /flights/book/{id}`)

---

### 5. Mis Reservas — `GET /flights/book/{id}` · +0.1 pts (nice to have)

- Guardar IDs de reservas del usuario en `localStorage`
- Listar reservas con: número de vuelo, aerolínea, fecha de salida
- Solo visible para usuarios autenticados

---

### 6. Cerrar Sesión & Navegación · +0.1 pts (must have)

- Botón de logout que limpia el token de `localStorage`
- Rutas protegidas: redirigir al login si no hay token
- Navegación clara entre: Registro → Login → Búsqueda → Reserva

---

## Resumen de puntaje

| Funcionalidad | Must Have | Nice to Have |
|---------------|-----------|--------------|
| Registro | +0.1 | — |
| Login | +0.2 | +0.1 |
| Búsqueda de vuelos | +0.1 | +0.1 |
| Reservar vuelo | +0.1 | +0.1 |
| Mis reservas | — | +0.1 |
| Cerrar sesión & navegación | +0.1 | — |
| **Total** | **0.6** | **0.4** |

---

## Stack tecnológico

| Capa | Elección |
|------|----------|
| Framework | React 18 |
| Lenguaje | TypeScript |
| Build tool | Vite |
| Cliente HTTP | Axios (recomendado) o `fetch` |
| Estilos | A tu elección — CSS plano, Tailwind, MUI, etc. |

Inicializa el proyecto con:

```bash
npm create vite@latest fly-away-frontend -- --template react-ts
cd fly-away-frontend
npm install
npm install axios
npm run dev
```

---

## Conectarse al backend

El backend corre localmente en `http://localhost:8080`. Debes iniciarlo antes de correr tu frontend.

```bash
# En la carpeta del backend (este repositorio):
./mvnw spring-boot:run
```

Configura la URL base de Axios:

```ts
// src/api.ts
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

> **CORS:** El backend no restringe CORS en su configuración actual, por lo que las solicitudes desde `localhost:5173` (puerto por defecto de Vite) funcionarán sin problemas.

---

## Referencia de la API del backend

Toda la documentación de endpoints — rutas, cuerpos de solicitud, estructura de respuestas, requisitos de autenticación y reglas de negocio — está en **[README.md](./README.md)**.

---

## Entregables

- Una app React + TypeScript funcional que cubra como mínimo los must have
- Código limpio y legible (componentes separados por responsabilidad)
- Un `README.md` corto dentro de tu carpeta de frontend explicando cómo correrlo

---

## Consejos

- Guarda el JWT en `localStorage` por simplicidad
- Usa inputs `datetime-local` y convierte a ISO-8601 para los filtros de fecha (`2026-12-01T00:00:00Z`)
- El backend retorna `ProblemDetail` en errores — lee `error.response.data.detail` para el mensaje
- Las horas de los vuelos usan ISO-8601 con timezone — `new Date(str).toLocaleString()` las muestra legibles
