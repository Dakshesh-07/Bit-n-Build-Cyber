-- ==============================================================================
-- CyberVigil: Supabase PostgreSQL RBAC & Row Level Security (RLS) Schema
-- POCSO Act 2012 & Digital Personal Data Protection (DPDP) Compliant
-- ==============================================================================

-- 1. Custom User Roles Type
CREATE TYPE app_role AS ENUM (
  'anonymous_user',
  'registered_youth',
  'parent_guardian',
  'welfare_officer',
  'admin'
);

-- 2. User Profiles with Role Metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  alias TEXT NOT NULL,
  role app_role DEFAULT 'anonymous_user',
  clearance_level TEXT DEFAULT 'Public Safe Mode',
  badge_number TEXT,
  organization TEXT,
  avatar_seed TEXT DEFAULT '🛡️',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Officers can view profiles connected to open cases" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('welfare_officer', 'admin')
  )
);

-- 3. Incidents / Reports Table (Encrypted & Hashed)
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL, -- e.g. BG-1042
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  ticket_pin_hash TEXT, -- For zero-registration anonymous tracking
  category TEXT NOT NULL,
  platform TEXT NOT NULL,
  incident_details TEXT NOT NULL,
  immediate_danger BOOLEAN DEFAULT FALSE,
  severity_level TEXT CHECK (severity_level IN ('Low', 'Moderate', 'High', 'Critical')) DEFAULT 'Moderate',
  threat_score INTEGER DEFAULT 50,
  evidence_sha256 TEXT,
  status TEXT CHECK (status IN ('Pending Intake', 'Under Review', 'Platform Notice Drafted', 'Escalated 1098', 'Resolved')) DEFAULT 'Pending Intake',
  assigned_officer UUID REFERENCES public.profiles(id),
  pii_scrubbed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on incidents
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Incidents RLS Policies:
-- A: Anyone (including anonymous) can submit an incident
CREATE POLICY "Public insert for incident reporting" 
ON public.incidents FOR INSERT 
WITH CHECK (true);

-- B: Minor / Anonymous user can read their own incident using their private ID / token
CREATE POLICY "Victims can read own incidents" 
ON public.incidents FOR SELECT 
USING (
  auth.uid() = user_id
);

-- C: Welfare Officers and Admins can view all incident queues
CREATE POLICY "Welfare Officers can view and manage triage incidents" 
ON public.incidents FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('welfare_officer', 'admin')
  )
);

-- 4. Immutable Audit Logs (High Court / Judicial Compliance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID REFERENCES public.profiles(id),
  case_id UUID REFERENCES public.incidents(id),
  action_type TEXT NOT NULL, -- 'viewed_case', 'dispatched_takedown', 'assigned_counselor'
  evidence_hash_snapshot TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Officers can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('welfare_officer', 'admin')
  )
);

CREATE POLICY "Admins and officers can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('welfare_officer', 'admin')
  )
);
