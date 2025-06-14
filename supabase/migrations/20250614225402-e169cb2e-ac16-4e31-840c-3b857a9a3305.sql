
-- Crear un nuevo bucket de almacenamiento público para los avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Añadir políticas de seguridad a nivel de fila (RLS) para el bucket de avatares
-- Permitir acceso público de lectura a las imágenes del bucket
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Permitir a los usuarios autenticados subir avatares
CREATE POLICY "Authenticated users can upload an avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' );

-- Permitir a los usuarios actualizar su propio avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' );

-- Permitir a los usuarios eliminar su propio avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  TO authenticated
  USING ( auth.uid() = owner );

-- Añadir la columna avatar_url a la tabla de perfiles
ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT;

