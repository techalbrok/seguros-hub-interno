
-- Create table for navigation shortcuts
CREATE TABLE IF NOT EXISTS public.navigation_shortcuts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  icon text,
  order_position integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.navigation_shortcuts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read shortcuts
CREATE POLICY "Allow authenticated users to read shortcuts" ON public.navigation_shortcuts
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert shortcuts
CREATE POLICY "Allow authenticated users to insert shortcuts" ON public.navigation_shortcuts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update shortcuts
CREATE POLICY "Allow authenticated users to update shortcuts" ON public.navigation_shortcuts
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete shortcuts
CREATE POLICY "Allow authenticated users to delete shortcuts" ON public.navigation_shortcuts
  FOR DELETE TO authenticated USING (true);
