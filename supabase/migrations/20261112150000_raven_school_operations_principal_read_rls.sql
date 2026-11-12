-- Applied to RAVEN Supabase project imoquechayktepndfmlt
-- Read-only school data access for verified active school administrators.
-- No INSERT, UPDATE or DELETE grants/policies are introduced.
do $$
declare t text;
begin
 foreach t in array array[
  'raven_school_decisions', 'raven_school_assignments',
  'raven_school_plans', 'raven_school_evidence',
  'raven_school_impact', 'raven_school_data_documents'
 ] loop
  execute format('grant select on table public.%I to authenticated', t);
  execute format(
    'create policy principal_tenant_read on public.%I for select to authenticated using (
      exists (select 1 from public.raven_school_memberships m
      where m.school_id = %I.school_id
      and m.user_id = (select auth.uid())
      and m.status = ''active''
      and m.role in (''school_admin'', ''principal'', ''vice_principal''))
    )', t, t);
 end loop;
end $$;
