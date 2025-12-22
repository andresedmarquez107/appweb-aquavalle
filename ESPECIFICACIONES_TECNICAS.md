# ESPECIFICACIONES TÉCNICAS - CABAÑAS AQUAVALLE
## Sistema de Reservas Web

---

## 1. DESCRIPCIÓN GENERAL

**Nombre del Sistema:** Sistema de Reservas Cabañas AquaValle  
**Tipo:** Aplicación Web Full-Stack  
**Propósito:** Plataforma digital para la gestión de reservas de cabañas y servicios de día completo (Full Day) para un negocio de turismo rural.

### 1.1 Objetivos del Sistema
- Permitir a los clientes realizar reservas en línea de manera autónoma
- Gestionar la disponibilidad de habitaciones en tiempo real
- Proporcionar un panel de administración para el propietario
- Automatizar el proceso de confirmación vía WhatsApp
- Controlar la capacidad máxima de visitantes por día

---

## 2. STACK TECNOLÓGICO

### 2.1 Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Biblioteca principal para construcción de interfaces |
| React Router DOM | 6.x | Enrutamiento y navegación SPA |
| Tailwind CSS | 3.x | Framework de estilos utilitarios |
| shadcn/ui | - | Componentes de UI pre-construidos (basados en Radix UI) |
| Axios | 1.x | Cliente HTTP para comunicación con API |
| date-fns | 2.x | Manipulación y formateo de fechas |
| Lucide React | - | Iconografía SVG |
| Sonner | - | Sistema de notificaciones toast |

### 2.2 Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Python | 3.11 | Lenguaje de programación principal |
| FastAPI | 0.100+ | Framework web asíncrono de alto rendimiento |
| Pydantic | 2.x | Validación de datos y serialización |
| Uvicorn | - | Servidor ASGI para producción |
| python-jose | 3.x | Manejo de tokens JWT |
| passlib + bcrypt | - | Hashing seguro de contraseñas |

### 2.3 Base de Datos
| Tecnología | Propósito |
|------------|-----------|
| PostgreSQL | Base de datos relacional principal |
| Supabase | Backend-as-a-Service (hosting de PostgreSQL + APIs) |
| Row Level Security (RLS) | Políticas de seguridad a nivel de fila |

### 2.4 Infraestructura
| Componente | Tecnología |
|------------|------------|
| Contenedorización | Docker / Kubernetes |
| Servidor Web | Nginx (proxy inverso) |
| Gestión de procesos | Supervisor |
| SSL/TLS | Certificados automáticos |

---

## 3. ARQUITECTURA DEL SISTEMA

### 3.1 Arquitectura General
```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Móvil     │  │   Tablet    │  │   Desktop   │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
          ┌────────────────▼────────────────┐
          │         NGINX (Proxy)           │
          │    - SSL Termination            │
          │    - Load Balancing             │
          │    - Static Files Cache         │
          └────────────────┬────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
     ▼                     ▼                     │
┌─────────┐         ┌─────────────┐              │
│Frontend │         │   Backend   │              │
│ :3000   │         │   :8001     │              │
│ React   │────────▶│  FastAPI    │              │
│   SPA   │  /api/* │  REST API   │              │
└─────────┘         └──────┬──────┘              │
                           │                     │
                           ▼                     │
                    ┌─────────────┐              │
                    │  Supabase   │              │
                    │ PostgreSQL  │◀─────────────┘
                    │  Database   │   Conexión directa
                    └─────────────┘   para queries
```

### 3.2 Patrón de Arquitectura
- **Frontend:** Single Page Application (SPA) con React
- **Backend:** API RESTful con FastAPI
- **Comunicación:** JSON sobre HTTPS
- **Autenticación:** JWT (JSON Web Tokens)
- **Base de Datos:** PostgreSQL con ORM via Supabase Client

### 3.3 Flujo de Datos
```
Usuario → React Components → API Service → Axios → FastAPI → Supabase → PostgreSQL
                                                      ↓
Usuario ← React State ← Response ← JSON ← Pydantic Models ← Query Results
```

---

## 4. ESTRUCTURA DEL PROYECTO

```
/app
├── backend/
│   ├── routes/
│   │   ├── admin.py           # Endpoints del panel administrativo
│   │   ├── availability.py    # Endpoints de disponibilidad
│   │   ├── reservations.py    # Endpoints de reservas
│   │   └── rooms.py           # Endpoints de habitaciones
│   ├── services/
│   │   ├── reservation_service.py  # Lógica de negocio de reservas
│   │   └── room_service.py         # Lógica de negocio de habitaciones
│   ├── auth.py                # Autenticación JWT
│   ├── config.py              # Configuración de la aplicación
│   ├── database.py            # Conexión a Supabase
│   ├── models.py              # Modelos Pydantic
│   ├── server.py              # Punto de entrada FastAPI
│   └── .env                   # Variables de entorno
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Componentes shadcn/ui
│   │   │   ├── wizard/        # Componentes del asistente de reserva
│   │   │   │   ├── ServiceSelector.jsx
│   │   │   │   ├── RoomSelector.jsx
│   │   │   │   ├── GuestCounter.jsx
│   │   │   │   ├── DateRangeSelector.jsx
│   │   │   │   ├── PersonalDataForm.jsx
│   │   │   │   └── ReservationConfirmation.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FloatingReserveButton.jsx
│   │   │   └── ReservationWizard.jsx
│   │   ├── context/
│   │   │   └── ReservationContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── RoomsPage.jsx
│   │   │   ├── RulesPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminBlocks.jsx
│   │   ├── services/
│   │   │   └── api.js         # Cliente API centralizado
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── diccionario_datos.md       # Documentación de la BD
├── database_design.md         # Diseño de la base de datos
└── supabase_setup.sql         # Script de creación de BD
```

---

## 5. MODELO DE DATOS

### 5.1 Diagrama Entidad-Relación
```
                    ┌─────────────────┐
                    │   admin_users   │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ email           │
                    │ password_hash   │
                    │ full_name       │
                    │ is_active       │
                    └────────┬────────┘
                             │
                             │ created_by
                             ▼
┌─────────────┐     ┌─────────────────────┐
│    rooms    │     │ availability_blocks │
├─────────────┤     ├─────────────────────┤
│ id (PK)     │◄────┤ room_id (FK)        │
│ name        │     │ start_date          │
│ capacity    │     │ end_date            │
│ price       │     │ block_type          │
│ description │     │ reason              │
│ images      │     └─────────────────────┘
└──────┬──────┘
       │
       │ room_id
       ▼
┌──────────────────┐         ┌─────────────┐
│ reservation_rooms│         │   clients   │
├──────────────────┤         ├─────────────┤
│ id (PK)          │         │ id (PK)     │
│ reservation_id   │────┐    │ full_name   │
│ room_id (FK)     │    │    │ id_document │
└──────────────────┘    │    │ email       │
                        │    │ phone       │
                        │    └──────┬──────┘
                        │           │
                        ▼           │ client_id
                 ┌──────────────────┴───┐
                 │     reservations     │
                 ├──────────────────────┤
                 │ id (PK)              │
                 │ client_id (FK)       │
                 │ reservation_type     │
                 │ check_in_date        │
                 │ check_out_date       │
                 │ num_guests           │
                 │ total_price          │
                 │ status               │
                 │ notes                │
                 └──────────────────────┘
```

### 5.2 Tablas Principales

#### rooms (Habitaciones)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | VARCHAR(50) | Nombre de la habitación |
| capacity | INTEGER | Capacidad máxima |
| price_per_night | DECIMAL(10,2) | Precio por noche (€) |
| description | TEXT | Descripción detallada |
| features | JSONB | Características (WiFi, TV, etc.) |
| images | JSONB | URLs de imágenes |
| is_active | BOOLEAN | Estado activo/inactivo |

#### clients (Clientes)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| full_name | VARCHAR(100) | Nombre completo |
| id_document | VARCHAR(50) | Documento de identidad |
| email | VARCHAR(100) | Correo electrónico |
| phone | VARCHAR(20) | Número de teléfono |

#### reservations (Reservas)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| client_id | UUID | Referencia al cliente |
| reservation_type | ENUM | 'fullday' o 'hospedaje' |
| check_in_date | DATE | Fecha de entrada |
| check_out_date | DATE | Fecha de salida |
| num_guests | INTEGER | Número de huéspedes |
| total_price | DECIMAL(10,2) | Precio total |
| status | ENUM | pending/confirmed/cancelled/completed |

#### availability_blocks (Bloqueos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| room_id | UUID | Habitación (NULL = todas) |
| start_date | DATE | Fecha inicio del bloqueo |
| end_date | DATE | Fecha fin del bloqueo |
| block_type | ENUM | maintenance/private_event/other |
| reason | TEXT | Motivo del bloqueo |

---

## 6. API REST - ENDPOINTS

### 6.1 Endpoints Públicos

#### Habitaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/rooms/` | Listar todas las habitaciones |
| GET | `/api/rooms/{id}` | Obtener habitación por ID |

#### Reservaciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/reservations/` | Crear nueva reserva |
| GET | `/api/reservations/` | Listar reservaciones |

#### Disponibilidad
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/availability/rooms/{id}` | Disponibilidad de habitación |
| GET | `/api/availability/fullday` | Disponibilidad Full Day |

### 6.2 Endpoints Administrativos (Requieren JWT)

#### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/admin/login` | Iniciar sesión |
| GET | `/api/admin/me` | Obtener info del admin actual |

#### Gestión de Reservas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Estadísticas del dashboard |
| GET | `/api/admin/reservations` | Listar todas las reservas |
| PUT | `/api/admin/reservations/{id}` | Actualizar reserva |
| DELETE | `/api/admin/reservations/{id}` | Cancelar reserva |

#### Bloqueos de Disponibilidad
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/blocks` | Listar bloqueos |
| POST | `/api/admin/blocks` | Crear bloqueo |
| DELETE | `/api/admin/blocks/{id}` | Eliminar bloqueo |

---

## 7. FLUJOS DE LA APLICACIÓN

### 7.1 Flujo de Reserva de Hospedaje
```
┌─────────────────┐
│  Inicio Wizard  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Seleccionar     │
│ Servicio        │──────────────────┐
│ (Hospedaje)     │                  │
└────────┬────────┘                  │
         ▼                           │
┌─────────────────┐                  │
│ Seleccionar     │                  │
│ Habitación(es)  │                  │
└────────┬────────┘                  │
         │                           │
         │ Precarga disponibilidad   │
         ▼                           │
┌─────────────────┐                  │
│ Seleccionar     │                  │
│ Fechas          │                  │
│ (Check-in/out)  │                  │
└────────┬────────┘                  │
         ▼                           │
┌─────────────────┐                  │
│ Datos           │                  │
│ Personales      │                  │
└────────┬────────┘                  │
         ▼                           │
┌─────────────────┐                  │
│ Confirmación    │──────────────────┘
│ + WhatsApp      │     Si elige Full Day
└─────────────────┘
```

### 7.2 Flujo de Reserva Full Day
```
┌─────────────────┐
│  Inicio Wizard  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Seleccionar     │
│ Servicio        │
│ (Full Day)      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Número de       │
│ Personas        │
│ (1-20)          │
└────────┬────────┘
         │
         │ Precarga disponibilidad
         │ según capacidad restante
         ▼
┌─────────────────┐
│ Seleccionar     │
│ Fecha           │
│ (Un solo día)   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Datos           │
│ Personales      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Confirmación    │
│ + WhatsApp      │
└─────────────────┘
```

### 7.3 Lógica de Disponibilidad

#### Para Hospedaje:
```
disponible = NO hay solapamiento con:
  - Otras reservas (pending/confirmed)
  - Bloqueos de disponibilidad
```

#### Para Full Day:
```
capacidad_restante = 20 - suma(personas_reservadas_ese_día)
disponible = capacidad_restante >= personas_solicitadas
```

---

## 8. SEGURIDAD

### 8.1 Autenticación
- **Método:** JWT (JSON Web Tokens)
- **Algoritmo:** HS256
- **Expiración:** 24 horas
- **Almacenamiento:** LocalStorage (cliente)

### 8.2 Autorización
- Endpoints `/api/admin/*` requieren token válido
- Validación de token en cada request mediante middleware

### 8.3 Contraseñas
- **Hashing:** bcrypt con salt automático
- **Rounds:** 12 (configurable)

### 8.4 Base de Datos
- **Row Level Security (RLS):** Políticas por tabla
- **Conexión:** SSL/TLS obligatorio
- **Credenciales:** Variables de entorno (no hardcoded)

### 8.5 CORS
```python
origins = ["*"]  # En producción, restringir a dominios específicos
```

---

## 9. CARACTERÍSTICAS IMPLEMENTADAS

### 9.1 Portal Público
- [x] Landing page responsive
- [x] Información de servicios
- [x] Galería de habitaciones
- [x] Reglas del establecimiento
- [x] Información de contacto
- [x] Wizard de reservas multi-paso
- [x] Calendario con fechas no disponibles
- [x] Integración WhatsApp para confirmación

### 9.2 Panel Administrativo
- [x] Login seguro con JWT
- [x] Dashboard con estadísticas
- [x] Filtro por mes/año
- [x] Lista de reservaciones
- [x] Editar reservaciones (estado, datos cliente, notas)
- [x] Cancelar reservaciones
- [x] Gestión de bloqueos de fechas
- [x] Diseño responsive (móvil/desktop)

### 9.3 Lógica de Negocio
- [x] Verificación de disponibilidad en tiempo real
- [x] Cálculo automático de precios
- [x] Capacidad máxima de Full Day (20 personas)
- [x] Bloqueos por mantenimiento/eventos
- [x] Múltiples habitaciones por reserva

---

## 10. RENDIMIENTO Y ESCALABILIDAD

### 10.1 Optimizaciones Frontend
- Lazy loading de componentes
- Precarga de datos de disponibilidad
- Estado local con React Context
- Caché de imágenes vía CDN

### 10.2 Optimizaciones Backend
- Async/await para I/O no bloqueante
- Connection pooling con Supabase
- Índices en campos de búsqueda frecuente
- Paginación en endpoints de listado

### 10.3 Base de Datos
- Índices optimizados:
  - `reservations(check_in_date, check_out_date)`
  - `reservations(status)`
  - `availability_blocks(start_date, end_date)`
  - `clients(id_document)`

---

## 11. VARIABLES DE ENTORNO

### Backend (.env)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
JWT_SECRET_KEY=your-secret-key
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-domain.com
```

---

## 12. INSTRUCCIONES DE DESPLIEGUE

### 12.1 Requisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+ (via Supabase)

### 12.2 Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### 12.3 Frontend
```bash
cd frontend
yarn install
yarn build  # Para producción
yarn start  # Para desarrollo
```

---

## 13. CONCLUSIONES TÉCNICAS

El sistema implementa una arquitectura moderna y escalable utilizando tecnologías ampliamente adoptadas en la industria. La separación entre frontend y backend permite:

1. **Mantenibilidad:** Cada capa puede evolucionar independientemente
2. **Escalabilidad:** El backend puede escalar horizontalmente
3. **Seguridad:** Autenticación JWT y RLS en base de datos
4. **Experiencia de Usuario:** SPA con navegación fluida y responsive

La elección de Supabase como BaaS reduce la complejidad operacional mientras proporciona las características de una base de datos PostgreSQL empresarial.

---

*Documento generado para propósitos académicos*
*Versión: 1.0*
*Fecha: Diciembre 2025*
