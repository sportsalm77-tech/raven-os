# RAVEN OS — Major Development Program (Safety-Gated)
Date: 2026-11-12
Repository: sportsalm77-tech/raven-os
Branch: rescue/unified-arena-integration-2026-11-03
Decision status: proposed execution plan; not a claim of completed delivery.

## Verified baseline
- GitHub CI run 43183471430: success (build, lint, security tests, Playwright).
- RAVEN Supabase has 0 auth users, 0 schools, 0 memberships.
- Six school-operation tables have tenant-scoped principal SELECT RLS.
- Decision INSERT policy exists; UPDATE is column-scoped to title/details/status.
- Direct authenticated audit INSERT is revoked.
- Two decision triggers exist, but audited live writes are not acceptance-tested.
- Authenticated two-school isolation cannot yet be claimed.

## Gate A — Secure test environment
- Create a separate disposable RAVEN test environment, no production
  test data. Approval needed before provisioning identities or resources.
- Two schools (A/B), active principal A/B, teacher, family, revoked member.
- Validate no cross-school reads, writes or membership escalation.
- Test denial without identity, invalid JWT, revoked memberships.
- Test no privilege to modify school_id, created_by, audit entries.

## Gate B — Atomic audited operations
- Design protected, narrow audit writer callable only from trusted triggers.
- Prevent forged audit entries and ensure transaction rollback if audit fails.
- Enforce role-specific state transition and separation of duties.
- Test creation, revision, approval, closure and failure rollback.
- Enable writes one module at a time, starting with decisions.
- Retain RLS and strict school_id filter on every data endpoint.

## Gate C — Unified principal operations
- Decisions, assignments, plans, evidence, impact and school data center.
- Functional CRUD, status flows, attachment policies, auditable changes.
- No fake KPI; derive indicators from authorized data.
- Full RTL/LTR and responsive acceptance.

## Gate D — Four portal integration
- Platform: governance and aggregate health, no family PII exposure.
- Principal: tenant-scoped management and reporting.
- Teacher: assigned work and evidence within verified school scope.
- Family: guardian-child links only, no general school-record visibility.
- Separate portal E2E authorization and role revocation tests.

## Gate E — Acceptance and release
- Unit, API, database RLS, browser, responsive, accessibility and
  integration tests; repeat after each significant change.
- Produce per-gate GitHub handover with exact SHA and run IDs.
- No main merge, no Vercel publish, no paid service without approval.

## Immediate blocker
A real-user isolation test cannot be run against the current RAVEN
project because there are no users or schools. Do not fabricate a
passing result. Use an explicitly approved isolated test environment.
