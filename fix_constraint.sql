-- =====================================================
-- FIX: Constraint de fechas demasiado estricto
-- Ejecutar en SQL Editor de Supabase
-- =====================================================

-- Eliminar el constraint antiguo
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS valid_dates;

-- Crear un constraint más flexible
ALTER TABLE reservations ADD CONSTRAINT valid_dates CHECK (
  (reservation_type = 'fullday') OR
  (reservation_type = 'hospedaje' AND (check_out_date IS NULL OR check_out_date > check_in_date))
);

-- Verificar
SELECT 'Constraint actualizado exitosamente' as status;
