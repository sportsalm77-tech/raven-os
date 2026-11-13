-- Applied to RAVEN OS Supabase project on 2026-11-13.
-- Correct cross-tenant RLS predicate: membership must match the decision's school.
-- Do not broaden access to vice_principal or service roles.
DROP POLICY IF EXISTS principal_decision_insert ON public.raven_school_decisions;
CREATE POLICY principal_decision_insert ON public.raven_school_decisions FOR INSERT TO authenticated
WITH CHECK (
  created_by = (SELECT auth.uid()) AND status = 'draft'
  AND EXISTS (
    SELECT 1 FROM public.raven_school_memberships AS m
    WHERE m.user_id = (SELECT auth.uid())
      AND m.school_id = raven_school_decisions.school_id
      AND m.status = 'active'
      AND m.role IN ('school_admin','principal')
  )
);

DROP POLICY IF EXISTS principal_decision_update ON public.raven_school_decisions;
CREATE POLICY principal_decision_update ON public.raven_school_decisions FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.raven_school_memberships AS m
    WHERE m.user_id = (SELECT auth.uid())
      AND m.school_id = raven_school_decisions.school_id
      AND m.status = 'active'
      AND m.role IN ('school_admin','principal')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.raven_school_memberships AS m
    WHERE m.user_id = (SELECT auth.uid())
      AND m.school_id = raven_school_decisions.school_id
      AND m.status = 'active'
      AND m.role IN ('school_admin','principal')
  )
);
