-- =====================================================
-- POLÍTICAS RLS PARA PANEL DE ADMINISTRACIÓN
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Políticas para reservations (permitir UPDATE)
CREATE POLICY "Allow update reservations" ON reservations 
FOR UPDATE USING (true) WITH CHECK (true);

-- Políticas para clients (permitir UPDATE)
CREATE POLICY "Allow update clients" ON clients 
FOR UPDATE USING (true) WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA AVAILABILITY_BLOCKS
-- =====================================================

-- Permitir leer bloqueos
CREATE POLICY "Allow read availability_blocks" ON availability_blocks 
FOR SELECT USING (true);

-- Permitir insertar bloqueos
CREATE POLICY "Allow insert availability_blocks" ON availability_blocks 
FOR INSERT WITH CHECK (true);

-- Permitir eliminar bloqueos
CREATE POLICY "Allow delete availability_blocks" ON availability_blocks 
FOR DELETE USING (true);

-- Verificar que las políticas se crearon
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('reservations', 'clients', 'admin_users', 'availability_blocks');
