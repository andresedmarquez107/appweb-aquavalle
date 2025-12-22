-- =====================================================
-- AGREGAR CAMPO blocks_fullday A availability_blocks
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Agregar columna blocks_fullday
ALTER TABLE availability_blocks 
ADD COLUMN IF NOT EXISTS blocks_fullday BOOLEAN DEFAULT FALSE;

-- Verificar que se agregó
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'availability_blocks';
