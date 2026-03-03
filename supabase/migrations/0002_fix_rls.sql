-- 1. Create a secure function to check the current user's role without triggering infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role::text IN ('admin', 'super_admin')
  );
$$;

-- 2. Drop the recursive policies from public.users
DROP POLICY IF EXISTS "Admins can do everything on users" ON public.users;
DROP POLICY IF EXISTS "Users can see their own profile" ON public.users;

-- 3. Recreate the policies using the new is_admin() function
CREATE POLICY "Admins can do everything on users" ON public.users
  USING (public.is_admin());

CREATE POLICY "Users can see their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 4. Apply the safe admin check to other tables
DROP POLICY IF EXISTS "Admins can read/write investors" ON public.investors;
CREATE POLICY "Admins can read/write investors" ON public.investors
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read/write transactions" ON public.transactions;
CREATE POLICY "Admins can read/write transactions" ON public.transactions
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins read/write withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Admins read/write withdrawals" ON public.withdrawal_requests
  USING (public.is_admin());
