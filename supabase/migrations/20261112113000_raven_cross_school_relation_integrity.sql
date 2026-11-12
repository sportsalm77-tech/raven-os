-- Applied to dedicated RAVEN OS Supabase project imoquechayktepndfmlt
-- Migration: raven_cross_school_relation_integrity_20261112
-- Composite foreign keys prevent cross-school references at database level.
alter table public.raven_school_decisions
  add constraint raven_decisions_school_id_id_unique unique (school_id, id);
alter table public.raven_school_plans
  add constraint raven_plans_school_id_id_unique unique (school_id, id);
alter table public.raven_school_assignments
  add constraint raven_assignments_same_school_decision
  foreign key (school_id, decision_id)
  references public.raven_school_decisions (school_id, id) on delete no action;
alter table public.raven_school_evidence
  add constraint raven_evidence_same_school_plan
  foreign key (school_id, plan_id)
  references public.raven_school_plans (school_id, id) on delete no action;
alter table public.raven_school_impact
  add constraint raven_impact_same_school_plan
  foreign key (school_id, plan_id)
  references public.raven_school_plans (school_id, id) on delete no action;
