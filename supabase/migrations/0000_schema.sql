-- Create role enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'investor');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'investor',
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles for investors
CREATE TABLE public.investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) UNIQUE,
  join_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'profit');

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id),
  type transaction_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allocations
CREATE TABLE public.asset_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id),
  asset_type TEXT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Withdrawals
CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id),
  amount DECIMAL(15, 2) NOT NULL,
  status withdrawal_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.users(id)
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Add Policies (Admin sees all, Investors see their own)
CREATE POLICY "Admins can do everything on users" ON public.users
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Users can see their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- investors table
CREATE POLICY "Admins can read/write investors" ON public.investors
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Investors see their own profile" ON public.investors
  FOR SELECT USING (user_id = auth.uid());

-- Transactions table
CREATE POLICY "Admins can read/write transactions" ON public.transactions
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Investors see their own txs" ON public.transactions
  FOR SELECT USING (investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid()));

-- Withdrawals
CREATE POLICY "Admins read/write withdrawals" ON public.withdrawal_requests
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Investors read/write own withdrawals" ON public.withdrawal_requests
  USING (investor_id IN (SELECT id FROM public.investors WHERE user_id = auth.uid()));
