-- ================================
-- SQL para corregir errores restantes en Supabase
-- Ejecuta este script en el SQL Editor
-- ================================

-- 1. Crear función para obtener company_id del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT company_id 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$;

-- 2. Crear función para obtener rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$;

-- 3. Función para sincronizar usuarios automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar usuario en public.users cuando se crea en auth.users
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$;

-- 4. Crear trigger para sincronización automática
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Actualizar políticas RLS con funciones auxiliares
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 6. Políticas para companies
DROP POLICY IF EXISTS "Users can read their company" ON public.companies;
CREATE POLICY "Users can read their company"
  ON public.companies
  FOR SELECT
  TO authenticated
  USING (id = public.get_user_company_id());

DROP POLICY IF EXISTS "Admins can update their company" ON public.companies;
CREATE POLICY "Admins can update their company"
  ON public.companies
  FOR UPDATE
  TO authenticated
  USING (
    id = public.get_user_company_id() AND
    public.get_user_role() = 'admin'
  );

-- 7. Asegurar que existen los índices necesarios
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_screens_company_id ON public.screens(company_id);
CREATE INDEX IF NOT EXISTS idx_content_company_id ON public.content(company_id);
CREATE INDEX IF NOT EXISTS idx_playlists_company_id ON public.playlists(company_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_company_id ON public.playlist_items(company_id);
CREATE INDEX IF NOT EXISTS idx_schedules_company_id ON public.schedules(company_id);

-- 8. Política para permitir inserción de companies (para registro)
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
CREATE POLICY "Users can create companies"
  ON public.companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 9. Política para permitir actualización de users (para asignar company_id)
DROP POLICY IF EXISTS "Users can be assigned to company" ON public.users;
CREATE POLICY "Users can be assigned to company"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.get_user_role() = 'admin');

-- 10. Verificar que RLS está habilitado en todas las tablas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;