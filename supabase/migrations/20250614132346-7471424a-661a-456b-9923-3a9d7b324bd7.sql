
-- Create table for brokerage configuration
CREATE TABLE public.brokerage_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Correduría de Seguros',
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  primary_color_light TEXT NOT NULL DEFAULT '#1E2836',
  primary_color_dark TEXT NOT NULL DEFAULT '#FFFFFF', 
  accent_color_light TEXT NOT NULL DEFAULT '#FF0000',
  accent_color_dark TEXT NOT NULL DEFAULT '#FF4444',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.brokerage_config ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Only admins can view brokerage config" 
  ON public.brokerage_config 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update brokerage config" 
  ON public.brokerage_config 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert brokerage config" 
  ON public.brokerage_config 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- Create storage bucket for brokerage assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brokerage-assets', 'brokerage-assets', true);

-- Storage policies for brokerage assets
CREATE POLICY "Admins can upload brokerage assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'brokerage-assets' AND
    public.is_admin(auth.uid())
  );

CREATE POLICY "Everyone can view brokerage assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'brokerage-assets');

CREATE POLICY "Admins can update brokerage assets"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'brokerage-assets' AND
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete brokerage assets"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'brokerage-assets' AND
    public.is_admin(auth.uid())
  );
