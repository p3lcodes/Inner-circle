-- ==========================================
-- 1. AUTOMATIC DATA SYNC TRIGGERS
-- ==========================================
-- This trigger automatically creates public.users and public.investors 
-- records whenever a new user is created in the auth system.
-- This ensures the database is ALWAYS in sync without manual entry!

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_role public.user_role;
BEGIN
  -- Extract full_name and role from metadata, or provide safe defaults
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User');
  
  -- Determine role (default to investor if not specified)
  IF (NEW.raw_user_meta_data->>'role' = 'super_admin') THEN
    user_role := 'super_admin';
  ELSIF (NEW.raw_user_meta_data->>'role' = 'admin') THEN
    user_role := 'admin';
  ELSE
    user_role := 'investor';
  END IF;

  -- Insert the linked public user account
  INSERT INTO public.users (id, role, full_name, email, status)
  VALUES (NEW.id, user_role, user_full_name, NEW.email, 'active');

  -- If the user is an investor, automatically create their capital profile
  IF user_role = 'investor' THEN
    INSERT INTO public.investors (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to run immediately after a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. CREATE REQUIRED ACCOUNTS PROGRAMMATICALLY
-- ==========================================
-- The following SQL automatically creates the logins, hashes the passwords, 
-- and because of the trigger above, it will also automatically build their public profiles!

DO $$
DECLARE
  trader_uid UUID := gen_random_uuid();
  razak_uid UUID := gen_random_uuid();
BEGIN
  -- User 1: P3L Trader (Admin)
  -- Email: trader@p3l.com
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    trader_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'trader@p3l.com', 
    crypt('Guyesa_10333', gen_salt('bf')), -- Hashes password securely
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "P3L Trader", "role": "admin"}', -- Passes the role down to the trigger
    now(), now()
  );

  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(), trader_uid::text, trader_uid, format('{"sub":"%s","email":"%s"}', trader_uid::text, 'trader@p3l.com')::jsonb, 'email', now(), now(), now()
  );

  -- User 2: Razak Wako (Investor)
  -- Email: razak@innercircle.com
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES (
    razak_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'razak@innercircle.com', 
    crypt('guyesa10333', gen_salt('bf')), -- Hashes password securely
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Razak Wako", "role": "investor"}', -- Passes the role down to the trigger
    now(), now()
  );

  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(), razak_uid::text, razak_uid, format('{"sub":"%s","email":"%s"}', razak_uid::text, 'razak@innercircle.com')::jsonb, 'email', now(), now(), now()
  );

END;
$$;
