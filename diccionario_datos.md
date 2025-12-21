# DICCIONARIO DE DATOS - CABAÑAS AQUAVALLE

## Tipos ENUM

### reservation_type
| Valor | Descripción |
|-------|-------------|
| fullday | Servicio de día completo |
| hospedaje | Servicio de alojamiento con pernocta |

### reservation_status
| Valor | Descripción |
|-------|-------------|
| pending | Reserva pendiente de confirmación |
| confirmed | Reserva confirmada |
| cancelled | Reserva cancelada |
| completed | Reserva completada/finalizada |

### block_type
| Valor | Descripción |
|-------|-------------|
| maintenance | Bloqueo por mantenimiento |
| private_event | Bloqueo por evento privado |
| other | Otro tipo de bloqueo |

---

## Tabla: rooms (Habitaciones)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único de la habitación (generado automáticamente) |
| name | VARCHAR | 50 caracteres | Nombre único de la habitación (ej: "Pacho", "D'Jesus") |
| capacity | INTEGER | - | Capacidad máxima de personas |
| price_per_night | DECIMAL | 10 dígitos, 2 decimales | Precio por noche en euros |
| description | TEXT | Sin límite | Descripción detallada de la habitación |
| features | JSONB | Sin límite | Array JSON con características (ej: ["WiFi", "TV", "Cocina"]) |
| images | JSONB | Sin límite | Array JSON con URLs de imágenes |
| is_active | BOOLEAN | true/false | Indica si la habitación está activa para reservas |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación del registro |
| updated_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de última actualización |

---

## Tabla: clients (Clientes)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único del cliente (generado automáticamente) |
| full_name | VARCHAR | 100 caracteres | Nombre completo del cliente |
| id_document | VARCHAR | 50 caracteres | Documento de identidad (único, ej: "V-12345678") |
| email | VARCHAR | 100 caracteres | Correo electrónico (opcional) |
| phone | VARCHAR | 20 caracteres | Número de teléfono (requerido) |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación del registro |
| updated_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de última actualización |

---

## Tabla: reservations (Reservas)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único de la reserva (generado automáticamente) |
| client_id | UUID | 36 caracteres | Referencia al cliente que realizó la reserva (FK → clients.id) |
| reservation_type | ENUM | fullday, hospedaje | Tipo de reserva |
| check_in_date | DATE | - | Fecha de entrada/inicio del servicio |
| check_out_date | DATE | - | Fecha de salida (NULL para fullday, requerido para hospedaje) |
| num_guests | INTEGER | 1-20 (fullday), >0 (hospedaje) | Número de huéspedes |
| total_price | DECIMAL | 10 dígitos, 2 decimales | Precio total de la reserva en euros |
| status | ENUM | pending, confirmed, cancelled, completed | Estado actual de la reserva |
| notes | TEXT | Sin límite | Notas adicionales sobre la reserva |
| whatsapp_confirmation_sent | BOOLEAN | true/false | Indica si se envió confirmación por WhatsApp |
| email_confirmation_sent | BOOLEAN | true/false | Indica si se envió confirmación por email |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación de la reserva |
| updated_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de última actualización |
| cancelled_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de cancelación (si aplica) |

**Restricciones:**
- Para `fullday`: check_out_date debe ser NULL y num_guests entre 1 y 20
- Para `hospedaje`: check_out_date debe ser mayor que check_in_date y num_guests > 0

---

## Tabla: reservation_rooms (Relación Reservas-Habitaciones)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único del registro (generado automáticamente) |
| reservation_id | UUID | 36 caracteres | Referencia a la reserva (FK → reservations.id) |
| room_id | UUID | 36 caracteres | Referencia a la habitación (FK → rooms.id) |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación del registro |

**Restricciones:**
- Combinación única de reservation_id + room_id (no se puede asignar la misma habitación dos veces a una reserva)

---

## Tabla: admin_users (Usuarios Administradores)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único del administrador (generado automáticamente) |
| email | VARCHAR | 100 caracteres | Correo electrónico único para login |
| password_hash | VARCHAR | 255 caracteres | Contraseña encriptada con bcrypt |
| full_name | VARCHAR | 100 caracteres | Nombre completo del administrador |
| is_active | BOOLEAN | true/false | Indica si la cuenta está activa |
| last_login | TIMESTAMP WITH TIME ZONE | - | Fecha y hora del último inicio de sesión |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación de la cuenta |
| updated_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de última actualización |

---

## Tabla: availability_blocks (Bloqueos de Disponibilidad)

| Atributo | Tipo de Dato | Límite | Descripción |
|----------|--------------|--------|-------------|
| id | UUID | 36 caracteres | Identificador único del bloqueo (generado automáticamente) |
| room_id | UUID | 36 caracteres | Referencia a la habitación bloqueada (FK → rooms.id, NULL = todas) |
| start_date | DATE | - | Fecha de inicio del bloqueo |
| end_date | DATE | - | Fecha de fin del bloqueo |
| block_type | ENUM | maintenance, private_event, other | Tipo de bloqueo |
| reason | TEXT | Sin límite | Motivo del bloqueo |
| created_by | UUID | 36 caracteres | Referencia al admin que creó el bloqueo (FK → admin_users.id) |
| created_at | TIMESTAMP WITH TIME ZONE | - | Fecha y hora de creación del bloqueo |

**Restricciones:**
- end_date debe ser mayor o igual a start_date

---

## Índices

| Tabla | Índice | Columnas | Propósito |
|-------|--------|----------|-----------|
| rooms | idx_rooms_active | is_active | Búsqueda rápida de habitaciones activas |
| clients | idx_clients_document | id_document | Búsqueda por documento de identidad |
| clients | idx_clients_phone | phone | Búsqueda por teléfono |
| clients | idx_clients_email | email | Búsqueda por email |
| reservations | idx_reservations_client | client_id | Búsqueda de reservas por cliente |
| reservations | idx_reservations_dates | check_in_date, check_out_date | Búsqueda por rango de fechas |
| reservations | idx_reservations_type | reservation_type | Filtrado por tipo de reserva |
| reservations | idx_reservations_status | status | Filtrado por estado |
| reservations | idx_reservations_created | created_at DESC | Ordenamiento por fecha de creación |
| reservation_rooms | idx_reservation_rooms_reservation | reservation_id | Búsqueda de habitaciones por reserva |
| reservation_rooms | idx_reservation_rooms_room | room_id | Búsqueda de reservas por habitación |
| admin_users | idx_admin_users_email | email | Búsqueda rápida para login |
| admin_users | idx_admin_users_active | is_active | Filtrado de usuarios activos |
| availability_blocks | idx_availability_blocks_dates | start_date, end_date | Búsqueda por rango de fechas |
| availability_blocks | idx_availability_blocks_room | room_id | Búsqueda de bloqueos por habitación |

---

## Diagrama de Relaciones

```
rooms ─────────────────┐
                       │
                       ▼
            reservation_rooms ◄────── reservations ◄────── clients
                       │                    │
                       │                    │
admin_users ──────────▼                    │
       │      availability_blocks          │
       │                                   │
       └───────────────────────────────────┘
```

**Relaciones:**
- `clients` 1:N `reservations` (Un cliente puede tener múltiples reservas)
- `reservations` N:M `rooms` (A través de `reservation_rooms`)
- `rooms` 1:N `availability_blocks` (Una habitación puede tener múltiples bloqueos)
- `admin_users` 1:N `availability_blocks` (Un admin puede crear múltiples bloqueos)
