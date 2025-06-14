
-- Crear tabla para noticias
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tablas de relación para vincular noticias con compañías, categorías y productos
CREATE TABLE public.news_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, company_id)
);

CREATE TABLE public.news_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, category_id)
);

CREATE TABLE public.news_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, product_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_products ENABLE ROW LEVEL SECURITY;

-- Políticas para news
CREATE POLICY "Users can view all news" 
  ON public.news 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create news" 
  ON public.news 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own news" 
  ON public.news 
  FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own news" 
  ON public.news 
  FOR DELETE 
  USING (auth.uid() = author_id);

-- Políticas para news_companies
CREATE POLICY "Users can view all news-company relations" 
  ON public.news_companies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create news-company relations" 
  ON public.news_companies 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update news-company relations" 
  ON public.news_companies 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete news-company relations" 
  ON public.news_companies 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para news_categories
CREATE POLICY "Users can view all news-category relations" 
  ON public.news_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create news-category relations" 
  ON public.news_categories 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update news-category relations" 
  ON public.news_categories 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete news-category relations" 
  ON public.news_categories 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para news_products
CREATE POLICY "Users can view all news-product relations" 
  ON public.news_products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create news-product relations" 
  ON public.news_products 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update news-product relations" 
  ON public.news_products 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete news-product relations" 
  ON public.news_products 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Crear bucket para imágenes de noticias (solo si no existe)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'news', 'news', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news');
