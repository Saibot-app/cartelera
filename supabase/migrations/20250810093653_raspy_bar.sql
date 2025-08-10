-- SQL adicional para arreglar problemas de sincronización y conexión

-- 1. Crear función para sincronizar usuarios de auth.users a public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Solo crear el perfil si no existe ya
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new.id, new.email, 'admin', now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Verificar que las políticas estén funcionando correctamente
-- Política para que los usuarios vean su propia información
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Política para actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- 4. Políticas mejoradas para companies
DROP POLICY IF EXISTS "Users can view their company" ON public.companies;
CREATE POLICY "Users can view their company" ON public.companies
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- 5. Función auxiliar para obtener el company_id del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT company_id 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para verificar rol del usuario
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Verificar que exista el bucket de storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'content-files', false)
ON CONFLICT (id) DO NOTHING;

-- 8. Políticas de storage mejoradas
DROP POLICY IF EXISTS "Users can upload files to their company folder" ON storage.objects;
CREATE POLICY "Users can upload files to their company folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'content-files' 
    AND (storage.foldername(name))[1] = public.get_user_company_id()::text
  );

DROP POLICY IF EXISTS "Users can view their company files" ON storage.objects;
CREATE POLICY "Users can view their company files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (storage.foldername(name))[1] = public.get_user_company_id()::text
  );

DROP POLICY IF EXISTS "Users can delete their company files" ON storage.objects;
CREATE POLICY "Users can delete their company files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'content-files'
    AND (storage.foldername(name))[1] = public.get_user_company_id()::text
    AND public.get_user_role() IN ('admin', 'editor')
  );

-- 9. Crear índices para optimizar rendimiento
CREATE INDEX IF NOT EXISTS idx_users_company_id ON public.users(company_id);
CREATE INDEX IF NOT EXISTS idx_screens_company_id ON public.screens(company_id);
CREATE INDEX IF NOT EXISTS idx_content_company_id ON public.content(company_id);
CREATE INDEX IF NOT EXISTS idx_playlists_company_id ON public.playlists(company_id);
CREATE INDEX IF NOT EXISTS idx_schedules_company_id ON public.schedules(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);

-- 10. Datos de prueba para verificar funcionamiento (opcional)
-- Descomentar si quieres crear una empresa y usuario de prueba
/*
INSERT INTO public.companies (name, slug, subscription_status)
VALUES ('Empresa de Prueba', 'empresa-prueba', 'trial')
ON CONFLICT (slug) DO NOTHING;
*/