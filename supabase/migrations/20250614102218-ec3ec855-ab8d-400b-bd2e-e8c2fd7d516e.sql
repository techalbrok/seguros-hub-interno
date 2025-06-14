
-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  commercial_website TEXT,
  broker_access TEXT NOT NULL,
  commercial_manager TEXT NOT NULL,
  manager_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies table
CREATE POLICY "Users can view all companies" 
  ON public.companies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update companies" 
  ON public.companies 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete companies" 
  ON public.companies 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create company_specifications table for additional specifications
CREATE TABLE public.company_specifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on company_specifications
ALTER TABLE public.company_specifications ENABLE ROW LEVEL SECURITY;

-- Create policies for company_specifications
CREATE POLICY "Users can view all company specifications" 
  ON public.company_specifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage company specifications" 
  ON public.company_specifications 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);
