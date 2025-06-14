
-- Crear tabla para departamentos
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  responsible_email TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para contenido por departamento
CREATE TABLE public.department_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_content ENABLE ROW LEVEL SECURITY;

-- Políticas para departments
CREATE POLICY "Users can view all departments" 
  ON public.departments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create departments" 
  ON public.departments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update departments" 
  ON public.departments 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete departments" 
  ON public.departments 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para department_content
CREATE POLICY "Users can view all department content" 
  ON public.department_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create department content" 
  ON public.department_content 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own content" 
  ON public.department_content 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own content" 
  ON public.department_content 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Crear bucket para imágenes destacadas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('department-content', 'department-content', true);

-- Políticas para el bucket de imágenes
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'department-content');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'department-content' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (bucket_id = 'department-content' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (bucket_id = 'department-content' AND auth.uid() IS NOT NULL);
