-- Create a security definer function to check if user is admin
-- This prevents RLS recursion issues
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.audit_logs;

-- Create new restrictive policy for audit logs - admin only
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.is_user_admin());

-- Allow admins to insert audit logs (for system logging)
CREATE POLICY "Admins can create audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (public.is_user_admin());