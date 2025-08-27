-- Create a security definer function to check if user is analyst or admin
-- This prevents RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_user_analyst_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'analyst')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop the existing overly permissive policy for threat intelligence
DROP POLICY IF EXISTS "Authenticated users can view threat intelligence" ON public.threat_intelligence;

-- Create new restrictive policy for threat intelligence - analysts and admins only
CREATE POLICY "Only analysts and admins can view threat intelligence" 
ON public.threat_intelligence 
FOR SELECT 
USING (public.is_user_analyst_or_admin());

-- Allow analysts and admins to insert/update threat intelligence data (for data feeds)
CREATE POLICY "Analysts and admins can manage threat intelligence" 
ON public.threat_intelligence 
FOR ALL
USING (public.is_user_analyst_or_admin())
WITH CHECK (public.is_user_analyst_or_admin());