-- RAVEN OS · Smart Life — source-controlled migration, NOT applied to production.
-- Reuses verified raven_school_memberships and raven_guardian_child_links.
-- No invented school/student data; use the Raven school data center as the authority.
begin;

create table public.raven_smart_life_standards (
  code text primary key check (code ~ '^[a-z][a-z0-9_-]{2,39}$'),
  name_ar text not null check (length(name_ar) between 3 and 120),
  name_en text not null check (length(name_en) between 3 and 120),
  default_minutes int not null default 45 check(default_minutes between 5 and 240),
  notify_before_minutes int not null default 5 check(notify_before_minutes between 0 and 60),
  updated_at timestamptz not null default now()
);

create table public.raven_smart_life_sessions (
 id uuid primary key default gen_random_uuid(),
 school_id uuid not null references public.raven_schools(id),
 class_code text not null check (length(class_code) between 2 and 80),
 teacher_id uuid references auth.users(id),
 standard_code text references public.raven_smart_life_standards(code),
 title text not null check (length(title) between 3 and 180),
 details text not null default '' check(length(details)<=1400),
 kind text not null default 'lesson' check(kind in ('lesson','activity','duty')),
 mode text not null default 'in_person' check(mode in ('in_person','remote')),
 provider text not null default 'none' check(provider in ('none','teams','meet')),
 meeting_url text,
 on_date date,
 weekday smallint check(weekday between 0 and 6),
 starts_at time not null,
 ends_at time not null,
 status text not null default 'draft' check(status in ('draft','pending','published','cancelled')),
 origin text not null check(origin in ('principal','teacher_extra')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(school_id,id),
 constraint sl_date_or_weekday check((on_date is null) <> (weekday is null)),
 constraint sl_valid_duration check(ends_at > starts_at),
 constraint sl_remote_url check(
   (mode='in_person' and provider='none' and meeting_url is null)
   or (mode='remote' and provider in ('teams','meet') and meeting_url like 'https://%')
 ),
 constraint sl_teacher_extra_pending check(origin<>'teacher_extra' or status in ('pending','published','cancelled'))
);
create index raven_sl_sessions_school_day on public.raven_smart_life_sessions(school_id,weekday,on_date,starts_at,status);
create index raven_sl_sessions_teacher on public.raven_smart_life_sessions(school_id,teacher_id,status);

create table public.raven_smart_life_tasks (
 id uuid primary key default gen_random_uuid(),
 school_id uuid not null references public.raven_schools(id),
 teacher_id uuid not null references auth.users(id),
 title text not null check(length(title) between 3 and 180),
 due_on date,
 completed_at timestamptz,
 origin text not null check(origin in ('personal','assigned')),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(school_id,id)
);
create index raven_sl_tasks_teacher on public.raven_smart_life_tasks(school_id,teacher_id,due_on);

-- The roster contains a scoped class reference, not a duplicate student profile.
-- child_ref must already be documented by the school's guardian relation.
create table public.raven_smart_life_class_roster (
 id uuid primary key default gen_random_uuid(),
 school_id uuid not null references public.raven_schools(id),
 child_ref uuid not null,
 class_code text not null check(length(class_code) between 2 and 80),
 updated_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 unique(school_id,child_ref)
);
create index raven_sl_roster_school_class on public.raven_smart_life_class_roster(school_id,class_code);

create function public.raven_smart_life_is_director(target_school uuid)
returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.raven_school_memberships m
 where m.user_id=(select auth.uid()) and m.school_id=target_school and m.status='active'
 and m.role in ('school_admin','principal','vice_principal'))
$$;
create function public.raven_smart_life_is_teacher(target_school uuid)
returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.raven_school_memberships m
 where m.user_id=(select auth.uid()) and m.school_id=target_school and m.status='active' and m.role='teacher')
$$;
revoke all on function public.raven_smart_life_is_director(uuid),public.raven_smart_life_is_teacher(uuid) from public,anon;
grant execute on function public.raven_smart_life_is_director(uuid),public.raven_smart_life_is_teacher(uuid) to authenticated;

create function public.raven_smart_life_validate_session()
returns trigger language plpgsql security definer set search_path='' as $$
declare conflict_count int;
begin
 if new.teacher_id is not null and not exists(
  select 1 from public.raven_school_memberships m
  where m.school_id=new.school_id and m.user_id=new.teacher_id and m.role='teacher' and m.status='active'
 ) then raise exception 'Teacher requires active school membership'; end if;

 if new.mode='remote' and not (
    (new.provider='meet' and new.meeting_url ~ '^https://meet[.]google[.]com/')
    or (new.provider='teams' and (
       new.meeting_url ~ '^https://teams[.]microsoft[.]com/'
       or new.meeting_url ~ '^https://teams[.]live[.]com/'))
 ) then raise exception 'Unsupported remote classroom URL'; end if;

 if new.origin='teacher_extra' then
  if new.teacher_id is distinct from (select auth.uid()) then raise exception 'Extra lesson must belong to requesting teacher'; end if;
  if tg_op='INSERT' and not exists(
   select 1 from public.raven_smart_life_sessions existing
   where existing.school_id=new.school_id and existing.class_code=new.class_code
     and existing.teacher_id=new.teacher_id and existing.status='published'
  ) then raise exception 'A verified published teacher-class assignment is required'; end if;
 end if;

 if tg_op='UPDATE' then
  if (new.school_id,new.class_code,new.teacher_id,new.origin,new.created_by)
     is distinct from (old.school_id,old.class_code,old.teacher_id,old.origin,old.created_by)
   then raise exception 'Immutable Smart Life session ownership'; end if;
 end if;

 if new.status='published' and (tg_op='INSERT' or old.status is distinct from new.status) then
  -- Serialize approvals for one school/class/time scope before checking collisions.
  perform pg_advisory_xact_lock(hashtextextended(new.school_id::text||':'||new.class_code,0));
  select count(*) into conflict_count from public.raven_smart_life_sessions e
   where e.school_id=new.school_id and e.id<>new.id and e.status='published'
     and (e.class_code=new.class_code or (new.teacher_id is not null and e.teacher_id=new.teacher_id))
     and (e.on_date=new.on_date or (e.weekday=new.weekday and new.weekday is not null)
       or (new.on_date is not null and e.weekday=extract(dow from new.on_date))
       or (e.on_date is not null and new.weekday=extract(dow from e.on_date)))
     and e.starts_at<new.ends_at and e.ends_at>new.starts_at;
  if conflict_count>0 then raise exception 'Published timetable conflict'; end if;
 end if;
 new.updated_at:=now();
 return new;
end $$;
revoke all on function public.raven_smart_life_validate_session() from public,anon,authenticated;
create trigger raven_sl_validate before insert or update on public.raven_smart_life_sessions
for each row execute function public.raven_smart_life_validate_session();

create function public.raven_smart_life_validate_task()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if tg_op='UPDATE' and not public.raven_smart_life_is_director(old.school_id) then
  if (new.school_id,new.teacher_id,new.title,new.due_on,new.origin,new.created_by)
    is distinct from (old.school_id,old.teacher_id,old.title,old.due_on,old.origin,old.created_by)
  then raise exception 'Teacher may update task completion only';end if;
 end if;
 new.updated_at:=now();
 return new;
end $$;
revoke all on function public.raven_smart_life_validate_task() from public,anon,authenticated;
create trigger raven_sl_task_guard before update on public.raven_smart_life_tasks
for each row execute function public.raven_smart_life_validate_task();

create function public.raven_smart_life_validate_roster()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.raven_guardian_child_links g
   where g.school_id=new.school_id and g.child_ref=new.child_ref and g.status='active'
 ) then raise exception 'Student must have a verified school guardian link'; end if;
 return new;
end $$;
revoke all on function public.raven_smart_life_validate_roster() from public,anon,authenticated;
create trigger raven_sl_roster_guard before insert or update on public.raven_smart_life_class_roster
for each row execute function public.raven_smart_life_validate_roster();

create function public.raven_smart_life_audit_change()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 if (select auth.uid()) is null then raise exception 'Audit actor required';end if;
 insert into public.raven_audit_events(actor_id,school_id,event_type,outcome,correlation_id)
 values((select auth.uid()),new.school_id,'smart_life.'||tg_table_name||'.'||lower(tg_op),'completed',new.id::text);
 return new;
end $$;
revoke all on function public.raven_smart_life_audit_change() from public,anon,authenticated;
create trigger raven_sl_sessions_audit after insert or update on public.raven_smart_life_sessions
for each row execute function public.raven_smart_life_audit_change();
create trigger raven_sl_tasks_audit after insert or update on public.raven_smart_life_tasks
for each row execute function public.raven_smart_life_audit_change();
create trigger raven_sl_roster_audit after insert or update on public.raven_smart_life_class_roster
for each row execute function public.raven_smart_life_audit_change();

alter table public.raven_smart_life_standards enable row level security;
alter table public.raven_smart_life_sessions enable row level security;
alter table public.raven_smart_life_tasks enable row level security;
alter table public.raven_smart_life_class_roster enable row level security;
revoke all on public.raven_smart_life_standards,public.raven_smart_life_sessions,
 public.raven_smart_life_tasks,public.raven_smart_life_class_roster from public,anon,authenticated;
grant select,insert,update on public.raven_smart_life_standards,public.raven_smart_life_sessions,
 public.raven_smart_life_tasks,public.raven_smart_life_class_roster to authenticated;

create policy raven_sl_standards_read on public.raven_smart_life_standards
 for select to authenticated using (auth.uid() is not null);
create policy raven_sl_standards_insert on public.raven_smart_life_standards
 for insert to authenticated with check (public.raven_is_platform_admin());
create policy raven_sl_standards_update on public.raven_smart_life_standards
 for update to authenticated using(public.raven_is_platform_admin()) with check(public.raven_is_platform_admin());

create policy raven_sl_session_read on public.raven_smart_life_sessions for select to authenticated using (
 public.raven_smart_life_is_director(school_id)
 or (public.raven_smart_life_is_teacher(school_id) and teacher_id=(select auth.uid())
     and status in ('published','pending'))
 or (status='published' and kind<>'duty'
   and exists(select 1 from public.raven_smart_life_class_roster roster
    join public.raven_guardian_child_links g on g.school_id=roster.school_id
     and g.child_ref=roster.child_ref
    where roster.school_id=raven_smart_life_sessions.school_id
     and roster.class_code=raven_smart_life_sessions.class_code
     and g.guardian_id=(select auth.uid()) and g.status='active'))
);
create policy raven_sl_session_create on public.raven_smart_life_sessions for insert to authenticated with check(
 (origin='principal' and created_by=(select auth.uid()) and status in ('draft','published')
   and public.raven_smart_life_is_director(school_id))
 or
 (origin='teacher_extra' and created_by=(select auth.uid()) and teacher_id=(select auth.uid())
   and status='pending' and public.raven_smart_life_is_teacher(school_id))
);
create policy raven_sl_session_update on public.raven_smart_life_sessions for update to authenticated
 using(public.raven_smart_life_is_director(school_id))
 with check(public.raven_smart_life_is_director(school_id));

create policy raven_sl_task_read on public.raven_smart_life_tasks for select to authenticated using(
 public.raven_smart_life_is_director(school_id)
 or (teacher_id=(select auth.uid()) and public.raven_smart_life_is_teacher(school_id))
);
create policy raven_sl_task_create on public.raven_smart_life_tasks for insert to authenticated with check(
 (origin='personal' and created_by=(select auth.uid()) and teacher_id=(select auth.uid())
   and completed_at is null and public.raven_smart_life_is_teacher(school_id))
 or (origin='assigned' and created_by=(select auth.uid()) and public.raven_smart_life_is_director(school_id)
   and exists(select 1 from public.raven_school_memberships m
     where m.school_id=raven_smart_life_tasks.school_id and m.user_id=teacher_id
       and m.status='active' and m.role='teacher'))
);
create policy raven_sl_task_update on public.raven_smart_life_tasks for update to authenticated
 using(public.raven_smart_life_is_director(school_id)
   or (teacher_id=(select auth.uid()) and public.raven_smart_life_is_teacher(school_id)))
 with check(public.raven_smart_life_is_director(school_id)
   or (teacher_id=(select auth.uid()) and public.raven_smart_life_is_teacher(school_id)));

create policy raven_sl_roster_read on public.raven_smart_life_class_roster for select to authenticated using(
 public.raven_smart_life_is_director(school_id)
 or exists(select 1 from public.raven_guardian_child_links g
   where g.school_id=raven_smart_life_class_roster.school_id and g.child_ref=raven_smart_life_class_roster.child_ref
   and g.guardian_id=(select auth.uid()) and g.status='active')
);
create policy raven_sl_roster_insert on public.raven_smart_life_class_roster
 for insert to authenticated with check(updated_by=(select auth.uid()) and public.raven_smart_life_is_director(school_id));
create policy raven_sl_roster_update on public.raven_smart_life_class_roster for update to authenticated
 using(public.raven_smart_life_is_director(school_id))
 with check(updated_by=(select auth.uid()) and public.raven_smart_life_is_director(school_id));
commit;
