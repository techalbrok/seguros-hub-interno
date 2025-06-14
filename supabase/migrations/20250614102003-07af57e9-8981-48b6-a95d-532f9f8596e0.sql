
-- Enable Row Level Security on delegations table (if not already enabled)
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view all delegations
CREATE POLICY "Users can view all delegations" 
  ON public.delegations 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to insert delegations
CREATE POLICY "Authenticated users can create delegations" 
  ON public.delegations 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy that allows users to update their own delegations
CREATE POLICY "Users can update their own delegations" 
  ON public.delegations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own delegations
CREATE POLICY "Users can delete their own delegations" 
  ON public.delegations 
  FOR DELETE 
  USING (auth.uid() = user_id);
