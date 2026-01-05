-- Script para habilitar eliminación permanente de reservaciones en Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- =====================================================
-- POLÍTICAS RLS PARA ELIMINAR RESERVACIONES
-- =====================================================

-- 1. Política para eliminar registros de reservation_rooms
CREATE POLICY "Allow delete reservation_rooms"
ON reservation_rooms
FOR DELETE
USING (true);

-- 2. Política para eliminar reservaciones canceladas
CREATE POLICY "Allow delete cancelled reservations"
ON reservations
FOR DELETE
USING (status = 'cancelled');

-- =====================================================
-- VERIFICAR QUE LAS POLÍTICAS SE CREARON CORRECTAMENTE
-- =====================================================
-- Puedes verificar las políticas ejecutando:
-- SELECT * FROM pg_policies WHERE tablename IN ('reservations', 'reservation_rooms');
