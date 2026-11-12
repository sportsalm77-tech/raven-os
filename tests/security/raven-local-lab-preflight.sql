-- RAVEN OS isolated test-lab security preflight
-- Run ONLY against an explicitly isolated local Supabase instance.
-- Read-only metadata checks; no seed data, accounts or production writes.
select current_database() as database_name,
       current_setting('server_version') as postgres_version;
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in (
'raven_schools','raven_school_memberships','raven_school_decisions',
'raven_school_assignments','raven_school_plans','raven_school_evidence',
'raven_school_impact','raven_school_data_documents','raven_audit_events')
order by c.relname;
select tablename,cmd,policyname from pg_policies
where schemaname='public' and tablename like 'raven_%'
order by tablename,cmd,policyname;
select has_table_privilege('authenticated','public.raven_audit_events','INSERT')
  as client_can_forge_audit,
       (select prosecdef from pg_proc where oid=
       'public.raven_audit_school_decision_change()'::regprocedure)
  as audit_trigger_is_security_definer;
-- Acceptance gate: client_can_forge_audit must be false.
-- This script does not prove real JWT tenant isolation.
