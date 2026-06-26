# CS2031 Semana 07 – API del Sistema de Reserva de Vuelos

API REST para un sistema de reserva de vuelos construido con Spring Boot, autenticación JWT y una capa de notificaciones basada en eventos. Desarrollado como parte del curso CS2031 en UTEC.

## Tecnologías

- Java 21 / Spring Boot 3.5
- Spring Security 6 + JWT (Auth0 java-jwt)
- Spring Data JPA / Base de datos H2 en memoria
- Lombok, ModelMapper, Jakarta Validation
- Maven

## Requisitos

- **Java 21** — verificar con `java -version`
- **No se necesita base de datos externa** — el proyecto usa H2, una base de datos en memoria que corre dentro de la aplicación

## Iniciar el servidor

```bash
./mvnw spring-boot:run
```

El servidor inicia en `http://localhost:8080`. Deberías ver una línea como:

```
Started Week07SolutionApplication in 3.2 seconds
```

> **Nota:** La base de datos H2 vive completamente en memoria. Cada vez que detengas y reinicies el servidor, todos los datos (usuarios, vuelos, reservas) se borran. Esto es esperado — usa `POST /users/register` y `POST /flights/create` nuevamente después de cada reinicio.

## Inspeccionar la base de datos (Consola H2)

Mientras el servidor esté corriendo, puedes explorar la base de datos en:

```
http://localhost:8080/h2-console
```

Usa estos datos de conexión:

| Campo | Valor |
|-------|-------|
| JDBC URL | `jdbc:h2:mem:testdb` |
| User Name | `sa` |
| Password | *(dejar en blanco)* |

Haz clic en **Connect** — podrás ejecutar consultas SQL directamente sobre los datos en vivo.

---

## Autenticación

Los endpoints protegidos requieren un token JWT en el encabezado `Authorization`:

```
Authorization: Bearer <token>
```

Obtén un token registrando un usuario y luego iniciando sesión (ver abajo). Existen dos roles:

| Rol | Quién lo tiene |
|-----|---------------|
| `USER` | Todo usuario registrado |
| `ADMIN` | Debe asignarse manualmente en la base de datos (no hay endpoint de registro para admins) |

---

## Endpoints

### Auth

#### `POST /auth/login`

No requiere autenticación.

**Cuerpo de la solicitud:**
```json
{
  "email": "alice@example.com",
  "password": "Password1"
}
```

**Respuesta `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400` — campos faltantes o usuario no encontrado

---

### Usuarios

#### `POST /users/register`

No requiere autenticación. Crea un nuevo usuario con rol `USER`.

**Cuerpo de la solicitud:**
```json
{
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Smith",
  "password": "Password1"
}
```

> **Reglas de contraseña:** mínimo 8 caracteres, al menos una letra mayúscula y un dígito.
> **Reglas de nombre:** `firstName` y `lastName` deben comenzar con mayúscula.

**Respuesta `201 Created`:**
```json
{ "id": 1 }
```

**Errores:**
- `400` — fallo de validación (contraseña débil, formato de nombre incorrecto, email ya registrado)

---

#### `GET /users/current`

Requiere: cualquier usuario autenticado (`USER` o `ADMIN`).

Retorna el perfil del usuario actualmente autenticado.

**Respuesta `200 OK`:**
```json
{
  "id": 1,
  "username": "alice@example.com",
  "email": "alice@example.com",
  "firstName": "Alice",
  "lastName": "Smith",
  "role": "USER"
}
```

---

#### `GET /users/{id}`

Requiere: `ADMIN`.

Retorna el perfil de cualquier usuario por su ID.

**Respuesta `200 OK`:** misma estructura que `/users/current`.

**Errores:**
- `403` — el usuario no es admin
- `500` — ID de usuario no encontrado

---

#### `GET /users`

Requiere: `ADMIN`.

Retorna la lista de todos los usuarios registrados.

**Respuesta `200 OK`:**
```json
[
  {
    "id": 1,
    "username": "alice@example.com",
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Smith",
    "role": "USER"
  }
]
```

---

### Vuelos

#### `POST /flights/create`

No requiere autenticación.

**Cuerpo de la solicitud:**
```json
{
  "airlineName": "LATAM",
  "flightNumber": "LA123",
  "estDepartureTime": "2026-12-01T10:00:00Z",
  "estArrivalTime": "2026-12-01T14:00:00Z",
  "availableSeats": 100
}
```

> **Formato del número de vuelo:** 2–3 letras mayúsculas seguidas de exactamente 3 dígitos (ej. `LA123`, `AMX456`).

**Respuesta `201 Created`:**
```json
{ "id": 1 }
```

**Errores:**
- `400` — el número de vuelo ya existe o fallo de validación

---

#### `POST /flights/create-many`

No requiere autenticación. Crea múltiples vuelos de forma asíncrona — el servidor responde de inmediato mientras los vuelos se guardan en segundo plano.

**Cuerpo de la solicitud:**
```json
{
  "inputs": [
    {
      "airlineName": "LATAM",
      "flightNumber": "LA124",
      "estDepartureTime": "2026-12-02T08:00:00Z",
      "estArrivalTime": "2026-12-02T12:00:00Z",
      "availableSeats": 80
    },
    {
      "airlineName": "Avianca",
      "flightNumber": "AV200",
      "estDepartureTime": "2026-12-03T15:00:00Z",
      "estArrivalTime": "2026-12-03T19:00:00Z",
      "availableSeats": 60
    }
  ]
}
```

**Respuesta `201 Created`:** cuerpo vacío — los vuelos se están creando en segundo plano.

---

#### `GET /flights`

No requiere autenticación.

Retorna la lista de todos los vuelos.

**Respuesta `200 OK`:**
```json
[
  {
    "id": 1,
    "airlineName": "LATAM",
    "flightNumber": "LA123",
    "estDepartureTime": "2026-12-01T10:00:00.000+00:00",
    "estArrivalTime": "2026-12-01T14:00:00.000+00:00",
    "availableSeats": 100
  }
]
```

---

#### `GET /flights/{id}`

No requiere autenticación.

Retorna un vuelo por su ID.

**Respuesta `200 OK`:** misma estructura que un elemento de `GET /flights`.

**Errores:**
- `500` — ID de vuelo no encontrado

---

#### `GET /flights/search`

No requiere autenticación.

Todos los parámetros son opcionales y se pueden combinar.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `flightNumber` | string | Búsqueda parcial en el número de vuelo |
| `airlineName` | string | Búsqueda parcial en el nombre de la aerolínea |
| `estDepartureTimeFrom` | ISO-8601 | Límite inferior de la hora de salida (ej. `2026-12-01T00:00:00Z`) |
| `estDepartureTimeTo` | ISO-8601 | Límite superior de la hora de salida |

**Ejemplo:**
```
GET /flights/search?airlineName=LATAM&estDepartureTimeFrom=2026-12-01T00:00:00Z
```

**Respuesta `200 OK`:**
```json
{
  "items": [
    {
      "id": 1,
      "airlineName": "LATAM",
      "flightNumber": "LA123",
      "estDepartureTime": "2026-12-01T10:00:00.000+00:00",
      "estArrivalTime": "2026-12-01T14:00:00.000+00:00",
      "availableSeats": 100
    }
  ]
}
```

---

#### `POST /flights/book`

Requiere: cualquier usuario autenticado.

Reserva un vuelo para el usuario actualmente autenticado.

**Cuerpo de la solicitud:**
```json
{ "flightId": 1 }
```

**Respuesta `200 OK`:**
```json
{ "id": 1 }
```

**Errores:**
- `400` — el vuelo ya despegó, se superpone con otra reserva del usuario, o no hay asientos disponibles
- `401` — no autenticado

---

#### `GET /flights/book/{id}`

Requiere: cualquier usuario autenticado.

Retorna los detalles de una reserva por su ID.

**Respuesta `200 OK`:**
```json
{
  "id": 1,
  "bookingDate": "2026-06-22T14:30:00.000+00:00",
  "flightId": 1,
  "flightNumber": "LA123",
  "estDepartureTime": "2026-12-01T10:00:00.000+00:00",
  "estArrivalTime": "2026-12-01T14:00:00.000+00:00",
  "customerId": 1,
  "customerFirstName": "Alice",
  "customerLastName": "Smith"
}
```

---

### Utilidades

#### `DELETE /cleanup`

No requiere autenticación. **Elimina todas las reservas, vuelos y usuarios.** Solo para pruebas.

**Respuesta `200 OK`:** cuerpo vacío.

---

## Reglas de negocio para reservas

1. **Vuelos pasados** — no se puede reservar un vuelo cuya hora de salida o llegada ya pasó.
2. **Vuelos superpuestos** — no se puede reservar un vuelo si ya tienes una reserva cuya ventana de tiempo se superpone con él.
3. **Asientos disponibles** — la reserva reduce `availableSeats` en 1 de forma atómica.
4. **Notificaciones** — cada reserva exitosa escribe un archivo `.txt` en el directorio de trabajo (simula una notificación por email mediante eventos de Spring).

---

## Inicio rápido

```bash
# 1. Iniciar el servidor
./mvnw spring-boot:run

# 2. Registrar un usuario
curl -s -X POST http://localhost:8080/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","firstName":"Alice","lastName":"Smith","password":"Password1"}'

# 3. Iniciar sesión y obtener el token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password1"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 4. Crear un vuelo (abierto — no requiere auth)
curl -s -X POST http://localhost:8080/flights/create \
  -H "Content-Type: application/json" \
  -d '{"airlineName":"LATAM","flightNumber":"LA123","estDepartureTime":"2026-12-01T10:00:00Z","estArrivalTime":"2026-12-01T14:00:00Z","availableSeats":100}'

# 5. Reservar el vuelo
curl -s -X POST http://localhost:8080/flights/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"flightId":1}'
```

---

## Estructura del proyecto

```
src/main/java/utec/week07/solution/
├── Configuration.java              # Seguridad, ModelMapper, executor async
├── RestControllerAdviceHandler.java # Excepciones globales → respuestas HTTP
├── auth/                           # JwtAuthFilter, controlador de login
├── users/                          # Entidad User, registro, rol
├── flights/                        # Lógica de vuelos y reservas, eventos, búsqueda
├── cleanup/                        # Helper DELETE /cleanup para pruebas
└── common/                         # ValidationException, NewIdDTO
```
