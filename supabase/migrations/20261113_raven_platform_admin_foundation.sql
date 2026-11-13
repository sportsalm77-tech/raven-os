-- RAVEN OS platform administration foundation.
-- Applied to Supabase RAVEN OS via migrations:
-- raven_platform_admin_foundation_20261113
-- raven_platform_admin_audit_triggers_20261113
-- raven_platform_directory_read_20261113
-- Existing schema: raven_schools, raven_school_memberships, raven_profiles,
-- raven_platform_memberships, raven_audit_events.
-- This file is a source-controlled record of the new platform administration schema.
CREATE TABLE IF NOT EXISTS public.raven_platform_plans (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE CHECK (char_length(code) BETWEEN 2 AND 60),
 name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 160),
 price_sar numeric(12,2) NOT NULL DEFAULT 0 CHECK (price_sar >= 0),
 duration_days integer NOT NULL CHECK (duration_days BETWEEN 1 AND 3650),
 active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.raven_school_subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 school_id uuid NOT NULL REFERENCES public.raven_schools(id),
 plan_id uuid NOT NULL REFERENCES public.raven_platform_plans(id),
 starts_at timestamptz NOT NULL,
 ends_at timestamptz NOT NULL,
 status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','cancelled')),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS raven_school_subscriptions_school_idx ON public.raven_school_subscriptions(school_id,ends_at DESC);
CREATE TABLE IF NOT EXISTS public.raven_platform_notices (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 200),
 body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
 school_id uuid REFERENCES public.raven_schools(id),
 author_id uuid NOT NULL REFERENCES auth.users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.raven_support_tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 school_id uuid NOT NULL REFERENCES public.raven_schools(id),
 created_by uuid NOT NULL REFERENCES auth.users(id),
 subject text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 200),
 body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
 status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.raven_support_replies (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 ticket_id uuid NOT NULL REFERENCES public.raven_support_tickets(id),
 author_id uuid NOT NULL REFERENCES auth.users(id),
 body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.raven_platform_settings (
 key text PRIMARY KEY CHECK (char_length(key) BETWEEN 2 AND 100),
 value jsonb NOT NULL,
 updated_by uuid NOT NULL REFERENCES auth.users(id),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION public.raven_is_platform_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path=''
AS $$
 SELECT EXISTS (SELECT 1 FROM public.raven_platform_memberships m
 WHERE m.user_id=(SELECT auth.uid()) AND m.status='active'
 AND m.role IN ('platform_super_admin','platform_system_admin'));
$$;
REVOKE ALL ON FUNCTION public.raven_is_platform_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.raven_is_platform_admin() TO authenticated;
DO $$
DECLARE t text;
BEGIN
 FOREACH t IN ARRAY ARRAY['raven_schools','raven_platform_plans','raven_school_subscriptions','raven_platform_notices','raven_support_tickets','raven_support_replies','raven_platform_settings'] LOOP
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('DROP POLICY IF EXISTS platform_admin_read ON public.%I',t);
  EXECUTE format('CREATE POLICY platform_admin_read ON public.%I FOR SELECT TO authenticated USING (public.raven_is_platform_admin())',t);
  EXECUTE format('DROP POLICY IF EXISTS platform_admin_insert ON public.%I',t);
  EXECUTE format('CREATE POLICY platform_admin_insert ON public.%I FOR INSERT TO authenticated WITH CHECK (public.raven_is_platform_admin())',t);
  EXECUTE format('DROP POLICY IF EXISTS platform_admin_update ON public.%I',t);
  EXECUTE format('CREATE POLICY platform_admin_update ON public.%I FOR UPDATE TO authenticated USING (public.raven_is_platform_admin()) WITH CHECK (public.raven_is_platform_admin())',t);
 END LOOP;
END $$;
-- School policies have distinct stable names in the applied migration; avoid
-- duplicating this file on a database where the migrations already ran.
GRANT SELECT,INSERT,UPDATE ON public.raven_schools,public.raven_platform_plans,public.raven_school_subscriptions,public.raven_platform_notices,public.raven_support_tickets,public.raven_support_replies,public.raven_platform_settings TO authenticated;
