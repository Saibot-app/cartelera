-- ===================================
-- CONFIGURACIÓN COMPLETA DE POLÍTICAS RLS
-- ===================================

-- 1. Eliminar políticas existentes que pueden estar mal configuradas
DROP POLICY IF EXISTS "Authenticated users can create companies" ON companies;
DROP POLICY IF EXISTS "Users can read their company" ON companies;
DROP POLICY IF EXISTS "Admins can update their company" ON companies;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can be assigned to company" ON users;
DROP POLICY IF EXISTS "Admins can manage users in their company" ON users;
DROP POLICY IF EXISTS "Users can view users in their company" ON users;

-- 2. Crear funciones auxiliares necesarias
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_company_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION can_edit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role IN ('admin', 'editor')
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$;

-- 3. Políticas para COMPANIES (más permisivas para creación)
CREATE POLICY "Anyone authenticated can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company admins can update their company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 4. Políticas para USERS (más permisivas para creación inicial)
CREATE POLICY "Anyone authenticated can create user profiles"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view company members"
  ON users FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage company users"
  ON users FOR ALL
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 5. Verificar que el trigger function existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Asegurar que los triggers existen
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;  
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Verificar configuración
SELECT 
  'Políticas configuradas correctamente' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'users');

SELECT 
  'Funciones auxiliares creadas' as status,
  COUNT(*) as total_functions
FROM pg_proc 
WHERE proname IN ('get_user_role', 'is_company_admin', 'can_edit');