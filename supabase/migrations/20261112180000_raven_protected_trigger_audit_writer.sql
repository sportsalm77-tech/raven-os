-- RAVEN audit writer: database-only trigger with no direct client INSERT.
-- Applied to dedicated RAVEN Supabase project imoquechayktepndfmlt.
create or replace function public.raven_audit_school_decision_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid;
begin
  v_actor := (select auth.uid());
  if v_actor is null or new.created_by is null then
    raise exception 'authenticated audit actor required';
  end if;
  insert into public.raven_audit_events(actor_id,school_id,event_type,outcome,correlation_id)
  values (v_actor,new.school_id,'school_decision.' || lower(tg_op),'completed',new.id::text);
  return new;
end $$;
revoke all on function public.raven_audit_school_decision_change() from public,anon,authenticated;
revoke insert on public.raven_audit_events from authenticated;
drop policy if exists decision_audit_insert on public.raven_audit_events;
