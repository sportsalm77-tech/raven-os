# RAVEN — Tenant Isolation, Decision Writes and Audit: Safety Gate
Date: 2026-11-12
Branch: rescue/unified-arena-integration-2026-11-03
Supabase project: imoquechayktepndfmlt

## Verified facts
- auth.users: 0
- raven_schools: 0
- raven_school_memberships: 0
Therefore real-user two-school isolation is NOT verified. No test accounts
were fabricated or inserted into the live project.
- Six principal read policies were previously installed and inspected.
- Added decision INSERT and UPDATE RLS policies for active school_admin
  and principal memberships. Created_by must match auth.uid() on insert.
- Added column-scoped UPDATE grants (title, details, status), no DELETE grant.
- Added database trigger guarding immutable decision identity and allowed
  status transitions; closed decisions cannot change.
- Added an AFTER INSERT/UPDATE decision audit trigger writing to
  raven_audit_events, with an authenticated audit INSERT policy.
- Verified two decision write policies, two decision triggers and one
  audit insert policy exist.

## Important security limitations: DO NOT RELEASE
- No actual authenticated positive/negative write test has run.
- The audit table currently permits direct authenticated INSERT matching
  policy conditions; a client could forge an allowed audit event.
  This must be replaced with a protected database-only append mechanism
  before operational release.
- Audit insertion and trigger behavior have not been proven by a
  successful authenticated transaction.
- The decision status transition guard currently checks state sequence,
  not distinct approver authority or separation of duties.
- All other five operation centers remain read-only.
- No authenticated CRUD UI or deployed API write endpoint exists.

## Mandatory acceptance before activation
1. Create isolated test identities and two test schools with explicit
   owner approval; use disposable synthetic records only.
2. Test user A cannot read/write school B, user B cannot read/write A,
   and unauthenticated users cannot access either.
3. Test revoked memberships, teacher and family denial, immutable
   school_id, illegal state transitions and closed records.
4. Remove direct client audit insertion, enforce trigger-only append,
   verify audit entries are immutable and tied to real actor.
5. Run CI and a controlled authenticated end-to-end test suite.
6. No Vercel deployment or main merge without explicit approval.
