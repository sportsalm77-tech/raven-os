# RAVEN OS — Accelerated authentication and launch gates
Date: 2026-11-12
Branch: rescue/unified-arena-integration-2026-11-03

## Decision
Target a focused three-working-day initial acceptance window, conditional on evidence. This is not authorization for production deployment, not a guaranteed completion date, and not an excuse to waive security.

## Day 1 — Real login and authorization
- Replace the placeholder login page with a verified Supabase Auth flow; never collect credentials without a configured HTTPS identity provider.
- Use server-owned, HttpOnly, Secure, SameSite session cookies; enforce CSRF and origin controls for cookie-authenticated mutations.
- Authenticate on the server and derive memberships from verified database queries, never client-provided roles.
- Guard every protected page, server action, API and document download; deny by default.
- Select tenant explicitly when multiple memberships are valid, and validate tenant on each request.
- Keep platform administration hidden from public navigation; only the verified platform role may enter.

## Day 2 — Security acceptance
- Test real users across two synthetic schools: principal A/B, teacher, guardian, platform admin, revoked member.
- Deny cross-tenant reads/writes, verify revoked memberships and direct URL bypass attempts.
- Keep private documents in private storage, issue short-lived signed URLs only after per-object authorization; never expose storage paths, keys, or service-role credentials.
- Test atomic audit logging, immutable actor/tenant fields, and fail-closed writes.

## Day 3 — Release candidate
- Run build, lint, security unit, E2E and manual browser acceptance for all four portals.
- Manually deploy preview from the rescue branch; verify preview protection and that no real student/school data is present.
- Require explicit owner approval before main merge, production deployment, or use with real data.

## Blocking facts as of decision
- Login UI remains placeholder at src/app/login/page.tsx.
- Real authenticated two-school isolation is not yet demonstrated.
- No production deployment is approved.

## Completion criteria
Real sign-in, logout, protected navigation, per-request role/tenant checks, real authenticated two-school isolation, document privacy, audit checks, green CI and approved preview review. Any failed gate extends the schedule instead of reducing controls.
