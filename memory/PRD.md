# Cabañas Aquavalle - Product Requirements Document

## Original Problem Statement
El usuario quiere construir una aplicación web completa para su negocio de alquiler de cabañas, "Cabañas Aquavalle".

## Core Requirements
1. **Landing Page**: Página visualmente atractiva con paleta de colores tierra y verde
2. **Sistema de Reservas**: Manejo dinámico de dos tipos de servicios:
   - "Full Day": Selección de número de personas, fecha y datos personales
   - "Hospedaje": Selección de habitaciones, rango de fechas y datos personales
3. **Wizard de Reserva**: Flujo paso a paso iniciado por botón flotante
4. **Calendario Inteligente**: Muestra y deshabilita fechas no disponibles
5. **Confirmación por WhatsApp**: Después de completar el formulario
6. **Multi-página**: Secciones separadas para Servicios, Habitaciones, Reglas y Contacto
7. **Panel de Administración**: 
   - Gestión de reservas (ver, editar, cancelar)
   - Bloqueo de fechas para mantenimiento
   - Estadísticas de reservas

## User Personas
- **Clientes**: Usuarios que buscan reservar cabañas o servicios Full Day
- **Administrador**: Propietario que gestiona reservas y disponibilidad

## Tech Stack
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT para panel admin

---

# Changelog

## 2026-01-05
### Bug Fix: Checkout en fechas bloqueadas
**Issue**: Al reservar hospedaje, si había una fecha bloqueada, no se podía hacer checkout el día de esa fecha bloqueada. Por ejemplo, si el día 22 estaba bloqueado, no se podía reservar del 21 al 22.

**Root Cause**: La función `disabledDates` en `DateRangeSelector.jsx` bloqueaba todas las fechas no disponibles sin distinguir entre fechas que no pueden ser check-in vs fechas que SÍ pueden ser checkout.

**Solution**: Se modificó `DateRangeSelector.jsx`:
1. Se agregó lógica `maxCheckoutDate` para calcular la primera fecha bloqueada después del check-in
2. Cuando el usuario tiene un check-in seleccionado, las fechas posteriores se habilitan hasta e incluyendo la primera fecha bloqueada
3. Las fechas después de la primera fecha bloqueada siguen deshabilitadas para evitar "saltar" sobre reservas

**Files Modified**:
- `/app/frontend/src/components/wizard/DateRangeSelector.jsx`

**Testing**: Verificado con screenshots y curl que:
- Se puede seleccionar checkout en fecha bloqueada (21→22 funciona)
- No se puede saltar sobre fechas bloqueadas (20→23 no permite)
- El backend acepta correctamente las reservas

### Feature: Eliminar reservaciones canceladas permanentemente
**Descripción**: Se agregó la funcionalidad para que el administrador pueda eliminar permanentemente las reservaciones que han sido canceladas, liberando espacio en la base de datos.

**Nuevos endpoints**:
- `DELETE /api/admin/reservations/{id}/permanent` - Elimina una reservación cancelada específica
- `DELETE /api/admin/reservations/cancelled/all` - Elimina todas las reservaciones canceladas

**Cambios en UI**:
- Botón "Limpiar Canceladas" en el header del panel admin (desktop y móvil)
- Ícono de papelera en cada reservación cancelada para eliminar individualmente
- Diálogos de confirmación antes de cada eliminación

**Files Modified**:
- `/app/backend/routes/admin.py` - Nuevos endpoints
- `/app/frontend/src/services/api.js` - Nuevas funciones API
- `/app/frontend/src/pages/AdminDashboard.jsx` - Botones y funcionalidad UI

**Testing**: Verificado con curl que el endpoint elimina correctamente las reservaciones

---

# Roadmap

## P0 - Completado
- [x] Landing page con diseño atractivo
- [x] Sistema de reservas Full Day y Hospedaje
- [x] Wizard de reserva paso a paso
- [x] Calendario con fechas no disponibles
- [x] Confirmación por WhatsApp
- [x] Panel de administración completo
- [x] Gestión de bloqueos de fechas
- [x] Autenticación JWT para admin

## P1 - Próximo
- [ ] Notificaciones por email para administradores cuando se crea una nueva reserva

## P2 - Futuro
- [ ] Sistema de pagos en línea
- [ ] Galería de fotos mejorada
- [ ] Reviews de clientes
- [ ] Sistema de promociones y descuentos

---

# Key Files Reference
- `backend/routes/admin.py`: Endpoints del panel admin
- `backend/routes/availability.py`: Endpoints de disponibilidad
- `backend/services/reservation_service.py`: Lógica de reservas
- `frontend/src/components/wizard/DateRangeSelector.jsx`: Selector de fechas
- `frontend/src/pages/AdminDashboard.jsx`: Dashboard admin
- `frontend/src/pages/AdminBlocks.jsx`: Gestión de bloqueos

# Credentials
- **Admin Login**: `/admin/login`
- **Email**: `admin@aquavalle.com`
- **Password**: `admin123`
