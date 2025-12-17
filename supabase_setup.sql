-- =====================================================
-- SCRIPT DE CONFIGURACIÓN SUPABASE - CABAÑAS AQUAVALLE
-- Ejecutar en: SQL Editor de Supabase Dashboard
-- =====================================================

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREAR TIPOS ENUM
-- =====================================================

CREATE TYPE reservation_type AS ENUM ('fullday', 'hospedaje');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE block_type AS ENUM ('maintenance', 'private_event', 'other');

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Tabla: rooms (Habitaciones)
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: clients (Clientes)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(100) NOT NULL,
  id_document VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: reservations (Reservas)
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  reservation_type reservation_type NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  num_guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status reservation_status DEFAULT 'pending',
  notes TEXT,
  whatsapp_confirmation_sent BOOLEAN DEFAULT false,
  email_confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_dates CHECK (
    (reservation_type = 'fullday' AND check_out_date IS NULL) OR
    (reservation_type = 'hospedaje' AND check_out_date > check_in_date)
  ),
  CONSTRAINT valid_guests CHECK (
    (reservation_type = 'fullday' AND num_guests > 0 AND num_guests <= 20) OR
    (reservation_type = 'hospedaje' AND num_guests > 0)
  )
);

-- Tabla: reservation_rooms (Relación Reservas-Habitaciones)
CREATE TABLE reservation_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(reservation_id, room_id)
);

-- Tabla: admin_users (Usuarios Administradores)
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

-- Tabla: availability_blocks (Bloqueos de Disponibilidad)
CREATE TABLE availability_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  block_type block_type NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_block_dates CHECK (end_date >= start_date)
);

-- =====================================================
-- CREAR ÍNDICES
-- =====================================================

-- Índices para rooms
CREATE INDEX idx_rooms_active ON rooms(is_active);

-- Índices para clients
CREATE INDEX idx_clients_document ON clients(id_document);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);

-- Índices para reservations
CREATE INDEX idx_reservations_client ON reservations(client_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_type ON reservations(reservation_type);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created ON reservations(created_at DESC);

-- Índices para reservation_rooms
CREATE INDEX idx_reservation_rooms_reservation ON reservation_rooms(reservation_id);
CREATE INDEX idx_reservation_rooms_room ON reservation_rooms(room_id);

-- Índices para admin_users
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Índices para availability_blocks
CREATE INDEX idx_availability_blocks_dates ON availability_blocks(start_date, end_date);
CREATE INDEX idx_availability_blocks_room ON availability_blocks(room_id);

-- =====================================================
-- FUNCIONES
-- =====================================================

-- Función: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función: Verificar Disponibilidad de Full Day
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

-- Función: Verificar Disponibilidad de Habitación
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

-- Función: Validar Capacidad de Full Day (para trigger)
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

-- =====================================================
-- CREAR TRIGGERS
-- =====================================================

-- Triggers para actualizar updated_at
CREATE TRIGGER update_rooms_updated_at 
  BEFORE UPDATE ON rooms
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at 
  BEFORE UPDATE ON reservations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para validar capacidad de Full Day
CREATE TRIGGER check_fullday_capacity 
  BEFORE INSERT OR UPDATE ON reservations
  FOR EACH ROW 
  EXECUTE FUNCTION validate_fullday_capacity();

-- =====================================================
-- VISTAS
-- =====================================================

-- Vista: Disponibilidad de Full Day por Fecha
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

-- =====================================================
-- INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar habitaciones iniciales
INSERT INTO rooms (name, capacity, price_per_night, description, features, images) VALUES
(
  'Pacho', 
  7, 
  70.00, 
  'Habitación acogedora con capacidad para 7 personas',
  '["Cocina equipada", "Agua caliente", "TV", "WiFi", "Parrillera"]'::jsonb,
  '["https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg"]'::jsonb
),
(
  'D''Jesus', 
  8, 
  80.00, 
  'Habitación espaciosa con capacidad para 8 personas',
  '["Cocina equipada", "Agua caliente", "TV", "WiFi", "Parrillera"]'::jsonb,
  '["https://customer-assets.emergentagent.com/job_valley-cabins/artifacts/x2asbc54_WhatsApp%20Image%202025-12-09%20at%208.00.00%20PM%20%283%29.jpeg"]'::jsonb
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en tablas
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS POLICIES)
-- =====================================================

-- Políticas para rooms (Todos pueden ver habitaciones activas)
CREATE POLICY "Anyone can view active rooms"
ON rooms FOR SELECT
USING (is_active = true);

-- Políticas para reservations (Público puede crear reservas)
CREATE POLICY "Anyone can create reservations"
ON reservations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their own reservations"
ON reservations FOR SELECT
USING (true);

-- Políticas para clients (Público puede crear clientes)
CREATE POLICY "Anyone can create clients"
ON clients FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view clients"
ON clients FOR SELECT
USING (true);

-- Políticas para reservation_rooms
CREATE POLICY "Anyone can create reservation_rooms"
ON reservation_rooms FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view reservation_rooms"
ON reservation_rooms FOR SELECT
USING (true);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Verificar que todo se creó correctamente
SELECT 'Tablas creadas:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT 'Funciones creadas:' as status;
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

SELECT 'Setup completado exitosamente!' as status;
