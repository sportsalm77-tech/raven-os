# RAVEN — Safety Gate Correction (2026-11-12)

After the initial decision/audit database changes, direct authenticated
INSERT permission on `public.raven_audit_events` was explicitly REVOKED.
Verified with `has_table_privilege('authenticated',
'public.raven_audit_events','INSERT') = false`.

This is intentional FAIL-CLOSED behavior: decision INSERT/UPDATE
operations which fire the audit trigger may currently fail because
the security-invoker trigger cannot write to the protected audit table.
Do not enable live writes until a reviewed, narrowly scoped, secure
trigger-only audit implementation and authenticated transaction tests
are complete. Do not grant client audit INSERT simply to make writes pass.

No test accounts, schools or seed data have been created.
No deployment or main merge authorized.
