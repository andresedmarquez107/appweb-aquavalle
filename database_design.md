# 🏡 Diseño de Base de Datos - Cabañas AquaValle
## Para Supabase (PostgreSQL)

---

## 📋 Tablas y Estructura

### 1. **rooms** (Habitaciones)
Almacena información de las habitaciones disponibles.

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB, -- ["Cocina equipada", "Agua caliente", "TV", "WiFi"]
  images JSONB, -- Array de URLs de imágenes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_rooms_active ON rooms(is_active);
```

**Datos iniciales:**
```sql
INSERT INTO rooms (name, capacity, price_per_night, description, features, images) VALUES
('Pacho', 7, 70.00, 'Habitación acogedora con capacidad para 7 personas', 
  '["Cocina equipada", "Agua caliente", "TV", "WiFi", "Parrillera"]'::jsonb,
  '["url_imagen_1", "url_imagen_2"]'::jsonb),
('D''Jesus', 8, 80.00, 'Habitación espaciosa con capacidad para 8 personas',
  '["Cocina equipada", "Agua caliente", "TV", "WiFi", "Parrillera"]'::jsonb,
  '["url_imagen_1", "url_imagen_2"]'::jsonb);
```

---

### 2. **clients** (Clientes)
Información de los clientes que hacen reservas.

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(100) NOT NULL,
  id_document VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clients_document ON clients(id_document);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);
```

---

### 3. **reservations** (Reservas)
Reservas de Full Day y Hospedaje.

```sql
CREATE TYPE reservation_type AS ENUM ('fullday', 'hospedaje');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  reservation_type reservation_type NOT NULL,
  
  -- Fechas
  check_in_date DATE NOT NULL,
  check_out_date DATE, -- NULL para fullday
  
  -- Información del servicio
  num_guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Estado
  status reservation_status DEFAULT 'pending',
  
  -- Notas y detalles
  notes TEXT,
  whatsapp_confirmation_sent BOOLEAN DEFAULT false,
  email_confirmation_sent BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (
    (reservation_type = 'fullday' AND check_out_date IS NULL) OR
    (reservation_type = 'hospedaje' AND check_out_date > check_in_date)
  ),
  CONSTRAINT valid_guests CHECK (
    (reservation_type = 'fullday' AND num_guests > 0 AND num_guests <= 20) OR
    (reservation_type = 'hospedaje' AND num_guests > 0)
  )
);

-- Índices
CREATE INDEX idx_reservations_client ON reservations(client_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_type ON reservations(reservation_type);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created ON reservations(created_at DESC);
```

---

### 4. **reservation_rooms** (Relación Reservas-Habitaciones)
Tabla intermedia para reservas de hospedaje (muchos a muchos).

```sql
CREATE TABLE reservation_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(reservation_id, room_id)
);

-- Índices
CREATE INDEX idx_reservation_rooms_reservation ON reservation_rooms(reservation_id);
CREATE INDEX idx_reservation_rooms_room ON reservation_rooms(room_id);
```

---

### 5. **admin_users** (Usuarios Administradores)
Para el panel de administración.

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
```

---

### 6. **availability_blocks** (Bloqueos de Disponibilidad)
Para bloquear fechas manualmente (mantenimiento, eventos privados, etc.)

```sql
CREATE TYPE block_type AS ENUM ('maintenance', 'private_event', 'other');

CREATE TABLE availability_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE, -- NULL = afecta todo
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  block_type block_type NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_block_dates CHECK (end_date >= start_date)
);

-- Índices
CREATE INDEX idx_availability_blocks_dates ON availability_blocks(start_date, end_date);
CREATE INDEX idx_availability_blocks_room ON availability_blocks(room_id);
```

---

## 🔗 Relaciones

```
clients
  ↓ (1:N)
reservations
  ↓ (N:M via reservation_rooms)
rooms

admin_users
  ↓ (1:N)
availability_blocks → rooms
```

---

## 📊 Vistas Útiles

### Vista: Disponibilidad de Full Day por Fecha
```sql
CREATE OR REPLACE VIEW fullday_availability AS
SELECT 
  check_in_date as date,
  SUM(num_guests) as total_guests,
  20 - SUM(num_guests) as remaining_capacity
FROM reservations
WHERE 
  reservation_type = 'fullday' 
  AND status IN ('confirmed', 'pending')
GROUP BY check_in_date
HAVING SUM(num_guests) < 20;
```

### Vista: Disponibilidad de Habitaciones
```sql
CREATE OR REPLACE VIEW room_availability AS
SELECT 
  r.id as room_id,
  r.name as room_name,
  d.date,
  CASE 
    WHEN COUNT(rr.id) > 0 THEN false
    WHEN EXISTS (
      SELECT 1 FROM availability_blocks ab
      WHERE (ab.room_id = r.id OR ab.room_id IS NULL)
      AND d.date BETWEEN ab.start_date AND ab.end_date
    ) THEN false
    ELSE true
  END as is_available
FROM rooms r
CROSS JOIN generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '365 days',
  INTERVAL '1 day'
) d(date)
LEFT JOIN reservation_rooms rr ON rr.room_id = r.id
LEFT JOIN reservations res ON res.id = rr.reservation_id 
  AND res.status IN ('confirmed', 'pending')
  AND d.date BETWEEN res.check_in_date AND COALESCE(res.check_out_date, res.check_in_date)
WHERE r.is_active = true
GROUP BY r.id, r.name, d.date;
```

---

## 🔒 Row Level Security (RLS) - Supabase

### Políticas para `reservations`
```sql
-- Habilitar RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Los clientes pueden ver sus propias reservas
CREATE POLICY "Clients can view own reservations"
ON reservations FOR SELECT
USING (auth.uid() = client_id);

-- Los administradores pueden ver todas las reservas
CREATE POLICY "Admins can view all reservations"
ON reservations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);

-- Los administradores pueden actualizar reservas
CREATE POLICY "Admins can update reservations"
ON reservations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);
```

### Políticas para `rooms`
```sql
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver habitaciones activas
CREATE POLICY "Anyone can view active rooms"
ON rooms FOR SELECT
USING (is_active = true);

-- Solo administradores pueden modificar
CREATE POLICY "Admins can manage rooms"
ON rooms FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  )
);
```

---

## 📝 Funciones Útiles

### Función: Verificar Disponibilidad de Full Day
```sql
CREATE OR REPLACE FUNCTION check_fullday_availability(
  p_date DATE,
  p_num_guests INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_capacity INTEGER;
BEGIN
  SELECT COALESCE(SUM(num_guests), 0) INTO current_capacity
  FROM reservations
  WHERE reservation_type = 'fullday'
    AND check_in_date = p_date
    AND status IN ('confirmed', 'pending');
  
  RETURN (current_capacity + p_num_guests) <= 20;
END;
$$ LANGUAGE plpgsql;
```

### Función: Verificar Disponibilidad de Habitación
```sql
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS BOOLEAN AS $$
DECLARE
  is_blocked BOOLEAN;
  has_reservation BOOLEAN;
BEGIN
  -- Verificar bloqueos
  SELECT EXISTS (
    SELECT 1 FROM availability_blocks
    WHERE (room_id = p_room_id OR room_id IS NULL)
      AND daterange(start_date, end_date, '[]') && daterange(p_check_in, p_check_out, '[]')
  ) INTO is_blocked;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar reservas existentes
  SELECT EXISTS (
    SELECT 1 FROM reservation_rooms rr
    JOIN reservations r ON r.id = rr.reservation_id
    WHERE rr.room_id = p_room_id
      AND r.status IN ('confirmed', 'pending')
      AND daterange(r.check_in_date, r.check_out_date, '[]') && daterange(p_check_in, p_check_out, '[]')
  ) INTO has_reservation;
  
  RETURN NOT has_reservation;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔔 Triggers

### Trigger: Actualizar `updated_at` automáticamente
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas relevantes
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Validar Capacidad de Full Day
```sql
CREATE OR REPLACE FUNCTION validate_fullday_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_capacity INTEGER;
BEGIN
  IF NEW.reservation_type = 'fullday' AND NEW.status IN ('confirmed', 'pending') THEN
    SELECT COALESCE(SUM(num_guests), 0) INTO current_capacity
    FROM reservations
    WHERE reservation_type = 'fullday'
      AND check_in_date = NEW.check_in_date
      AND status IN ('confirmed', 'pending')
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    IF (current_capacity + NEW.num_guests) > 20 THEN
      RAISE EXCEPTION 'Capacidad máxima de Full Day excedida para la fecha %', NEW.check_in_date;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_fullday_capacity BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION validate_fullday_capacity();
```

---

## 📈 Consultas Comunes

### 1. Obtener todas las reservas activas
```sql
SELECT 
  r.id,
  r.reservation_type,
  r.check_in_date,
  r.check_out_date,
  r.num_guests,
  r.status,
  c.full_name,
  c.phone,
  c.email,
  ARRAY_AGG(rm.name) FILTER (WHERE rm.name IS NOT NULL) as rooms
FROM reservations r
JOIN clients c ON c.id = r.client_id
LEFT JOIN reservation_rooms rr ON rr.reservation_id = r.id
LEFT JOIN rooms rm ON rm.id = rr.room_id
WHERE r.status IN ('confirmed', 'pending')
  AND r.check_in_date >= CURRENT_DATE
GROUP BY r.id, c.full_name, c.phone, c.email
ORDER BY r.check_in_date;
```

### 2. Calendario de disponibilidad (próximos 30 días)
```sql
SELECT 
  d.date,
  -- Full Day
  20 - COALESCE(SUM(r.num_guests) FILTER (WHERE r.reservation_type = 'fullday'), 0) as fullday_capacity,
  -- Habitaciones
  COUNT(DISTINCT rm.id) FILTER (WHERE rm.is_active = true AND NOT EXISTS (
    SELECT 1 FROM reservation_rooms rr
    JOIN reservations res ON res.id = rr.reservation_id
    WHERE rr.room_id = rm.id
      AND res.status IN ('confirmed', 'pending')
      AND d.date BETWEEN res.check_in_date AND COALESCE(res.check_out_date, res.check_in_date)
  )) as available_rooms
FROM generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  INTERVAL '1 day'
) d(date)
LEFT JOIN reservations r ON r.check_in_date = d.date 
  AND r.status IN ('confirmed', 'pending')
LEFT JOIN rooms rm ON true
GROUP BY d.date
ORDER BY d.date;
```

### 3. Historial de cliente
```sql
SELECT 
  r.id,
  r.reservation_type,
  r.check_in_date,
  r.check_out_date,
  r.num_guests,
  r.total_price,
  r.status,
  ARRAY_AGG(rm.name) FILTER (WHERE rm.name IS NOT NULL) as rooms
FROM reservations r
LEFT JOIN reservation_rooms rr ON rr.reservation_id = r.id
LEFT JOIN rooms rm ON rm.id = rr.room_id
WHERE r.client_id = 'CLIENT_UUID_HERE'
GROUP BY r.id
ORDER BY r.created_at DESC;
```

---

## 🚀 Configuración en Supabase

### Paso 1: Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales (URL y anon key)

### Paso 2: Ejecutar Scripts SQL
1. Ve a SQL Editor en Supabase Dashboard
2. Copia y ejecuta los scripts en orden:
   - Crear tipos ENUM
   - Crear tablas
   - Crear índices
   - Crear vistas
   - Crear funciones
   - Crear triggers
   - Habilitar RLS y políticas

### Paso 3: Configurar Variables de Entorno
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_KEY=tu-service-key
```

---

## 📊 Diagrama ER

```
┌─────────────┐
│   clients   │
│─────────────│
│ id (PK)     │
│ full_name   │
│ id_document │
│ email       │
│ phone       │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────────┐
│  reservations   │
│─────────────────│
│ id (PK)         │
│ client_id (FK)  │
│ type            │
│ check_in_date   │
│ check_out_date  │
│ num_guests      │
│ total_price     │
│ status          │
└────────┬────────┘
         │
         │ N
         │
┌────────▼─────────────┐         ┌────────────┐
│  reservation_rooms   │────N────│   rooms    │
│──────────────────────│         │────────────│
│ id (PK)              │         │ id (PK)    │
│ reservation_id (FK)  │         │ name       │
│ room_id (FK)         │         │ capacity   │
└──────────────────────┘         │ price      │
                                 │ features   │
                                 └──────┬─────┘
                                        │
                                        │ N
                                        │
                                 ┌──────▼──────────────┐
                                 │ availability_blocks │
                                 │─────────────────────│
                                 │ id (PK)             │
                                 │ room_id (FK)        │
                                 │ start_date          │
                                 │ end_date            │
                                 │ block_type          │
                                 └─────────────────────┘

┌────────────────┐
│  admin_users   │
│────────────────│
│ id (PK)        │
│ email          │
│ password_hash  │
│ full_name      │
│ is_active      │
└────────────────┘
```

---

## ✅ Ventajas de este Diseño

✅ **Escalable:** Soporta múltiples tipos de reservas
✅ **Flexible:** Fácil agregar nuevas habitaciones o servicios
✅ **Seguro:** RLS de Supabase para control de acceso
✅ **Eficiente:** Índices optimizados para consultas comunes
✅ **Validado:** Constraints y triggers previenen datos inválidos
✅ **Auditable:** Timestamps y estados para historial completo
