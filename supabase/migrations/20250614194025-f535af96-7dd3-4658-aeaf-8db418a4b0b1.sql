
-- 1. Create the new table for specification categories
CREATE TABLE public.specification_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable RLS for the new table
ALTER TABLE public.specification_categories ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for the new table
CREATE POLICY "Users can view all specification categories"
  ON public.specification_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage specification categories"
  ON public.specification_categories
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- 4. Alter the existing company_specifications table
-- Rename 'category' column to 'title'
ALTER TABLE public.company_specifications RENAME COLUMN category TO title;

-- Add the new category_id foreign key column (nullable for now to support existing data)
ALTER TABLE public.company_specifications ADD COLUMN category_id UUID REFERENCES public.specification_categories(id) ON DELETE SET NULL;

-- Add 'updated_at' column
ALTER TABLE public.company_specifications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
