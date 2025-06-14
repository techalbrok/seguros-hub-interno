
-- Drop existing policies for the 'news' bucket to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update news images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete news images" ON storage.objects;

-- Create storage policies for news images
CREATE POLICY "Anyone can view news images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'news');

CREATE POLICY "Authenticated users can upload news images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'news' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update news images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'news' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete news images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'news' AND
    auth.role() = 'authenticated'
  );
