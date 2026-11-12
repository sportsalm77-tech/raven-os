# RAVEN — Major Program Gate B / Protected Audit Checkpoint
Date: 2026-11-12
Branch: rescue/unified-arena-integration-2026-11-03
Release status: NOT APPROVED; NO DEPLOY.

## Completed in Supabase
Replaced `raven_audit_school_decision_change()` with a
SECURITY DEFINER trigger function using an empty search_path and
explicitly schema-qualified references. The function rejects missing
authenticated actors and writes an event on decision INSERT/UPDATE.

Revoked all direct authenticated audit INSERT privilege and removed
the old direct audit INSERT policy. Kept the trigger on the decision table.

## Verified via live schema inspection
- `has_table_privilege('authenticated','public.raven_audit_events','INSERT')`: false
- trigger function `prosecdef`: true
- audit INSERT policies: 0
- decision audit triggers: 1
- current test users: 0
- current test schools: 0

## Not yet verified
- A positive authenticated INSERT and its audit event in one transaction
- Cross-school isolation for two distinct real JWT users
- Rollback on forced audit failure and tamper-proof retention
- All six modules' authenticated write flows
- Approver separation of duties

## Next test setup
Owner approved the major plan, but a separate Supabase project
requires selecting the organization. Do not create a potentially
billable project without a zero-cost confirmation. Prefer an
isolated disposable local Postgres/Supabase environment if possible.

## Release gates
No production test identities, no cross-project data mixing,
no Vercel deployment, no main merge, and no paid resource.
