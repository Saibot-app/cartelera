/*
  # Corregir políticas RLS para tabla companies

  1. Políticas actualizadas
    - Permitir que usuarios autenticados creen nuevas empresas
    - Mantener restricciones de lectura y actualización por empresa
  2. Cambios
    - Política INSERT más permisiva para registro inicial
    - Políticas SELECT y UPDATE mantienen aislamiento por empresa
*/

-- Eliminar políticas existentes para companies
DROP POLICY IF EXISTS "Users can create companies" ON companies;
DROP POLICY IF EXISTS "Users can read their company" ON companies;
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Admins can update their company" ON companies;

-- Política para permitir insertar nuevas empresas durante el registro
CREATE POLICY "Authenticated users can create companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para leer información de la empresa del usuario
CREATE POLICY "Users can read their company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

-- Política para que administradores puedan actualizar su empresa
CREATE POLICY "Admins can update their company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );