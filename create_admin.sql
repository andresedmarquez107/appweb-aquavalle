-- Crear usuario administrador inicial para Cabañas AquaValle
-- Ejecutar este SQL directamente en Supabase SQL Editor

INSERT INTO admin_users (email, password_hash, full_name, is_active)
VALUES (
  'admin@aquavalle.com',
  '$2b$12$V8abUnSAQSkzkcu/RnzkiOFT.6pX1WEdXqyH5UwFnokUQKc7ildUa',
  'Administrador',
  true
);

-- Credenciales de acceso:
-- Email: admin@aquavalle.com
-- Password: admin123
