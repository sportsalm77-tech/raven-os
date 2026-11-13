# RAVEN OS Platform Admin — Security and acceptance status (2026-11-13)

## Scope
Only /platform and its administrative database/API; other portals are not being redesigned.

## Implemented
- School CRUD: create/list/update, no delete.
- School memberships: create/list/update role and status. User must already exist in Supabase Auth; no arbitrary Auth user creation.
- Plans and dated subscriptions: create/list/update, non-overlapping active periods. Entitlement is computed from active school + active plan + active subscription + start/end times, without relying on a scheduled cron. An expired subscription denies school membership discovery and principal tenant operations via RLS.
- Notices: create and fan out to active schools using raven_notice_deliveries, with durable per-school receipts and school-scoped read access.
- Tickets and replies: create/list/update tickets and create/list replies. Updates are audited.
- Settings: create/list/update, audited.
- Audit log: RLS-admin read and trigger-backed mutation events.
- Live metrics: DB-backed counts where available; unavailable counts show no invented values.

## Applied Supabase migrations
- raven_platform_admin_foundation_20261113
- raven_platform_admin_audit_triggers_20261113
- raven_platform_directory_read_20261113
- raven_platform_membership_rls_recursion_guard_20261113
- raven_platform_entitlements_memberships_notices_20261113
- raven_platform_notice_inbox_and_subscription_guard_20261113
- raven_entitlement_private_schema_security_hardening_20261113

## Security evidence
- RLS enabled on every public raven_* table.
- RLS policies gate administration on a verified active platform membership.
- School operations use active school membership and date-bounded entitlement checks.
- Entitlement SECURITY DEFINER function was moved to raven_private, outside the exposed public API schema.
- Supabase security advisor: one informational finding for raven_guardian_child_links (RLS enabled with no policy, intentionally deny-by-default).
- Anonymous/no-membership role: raven_is_platform_admin() false; unknown-school entitlement false; attempted school INSERT rejected.
- API: server-side Supabase Auth token verification, platform role check, origin check on writes, input allowlist, UUID validation, payload size limit, RLS enforcement, no service-role credentials.
- Production Vercel environment variables: RAVEN_SUPABASE_URL, RAVEN_SUPABASE_PUBLISHABLE_KEY, RAVEN_AUTH_ENABLED configured as encrypted values.

## Acceptance not yet met
- No Supabase Auth user or active platform membership exists, so end-to-end acceptance with a real platform admin has not been completed.
- Supabase leaked-password protection has not been verified or enabled through the available connector; do not claim closure.
- GitHub Actions latest build, lint, unit and Playwright checks must complete and pass for the final SHA.
- No production release until end-to-end tests pass and a real administrator login is verified.
- Notices are delivered into database inboxes; external email/push transport is not implemented.
- No general user-account disable in Supabase Auth; membership suspension blocks school access but is not equivalent to disabling an Auth user.
- Not every navigation section has been replaced with a fully functional engine.

## Release gate
No 100% completion or Production deployment claim until all acceptance items above are verified.