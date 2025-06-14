
-- Create product categories table with hierarchical structure
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  process TEXT,
  strengths TEXT,
  observations TEXT,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product documents table
CREATE TABLE public.product_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create category documents table
CREATE TABLE public.category_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories" 
  ON public.product_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage product categories" 
  ON public.product_categories 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add RLS policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage products" 
  ON public.products 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add RLS policies for product_documents
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product documents" 
  ON public.product_documents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage product documents" 
  ON public.product_documents 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Add RLS policies for category_documents
ALTER TABLE public.category_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category documents" 
  ON public.category_documents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage category documents" 
  ON public.category_documents 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-documents', 'product-documents', true);

-- Create storage policies for product documents
CREATE POLICY "Anyone can view product documents" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-documents');

CREATE POLICY "Authenticated users can upload product documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'product-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product documents" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'product-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product documents" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'product-documents' AND auth.role() = 'authenticated');
