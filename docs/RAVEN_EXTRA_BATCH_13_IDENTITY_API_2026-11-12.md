# RAVEN OS — EXTRA Development Batch 13: Verified Identity API
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`
Supabase project: `imoquechayktepndfmlt`

## Code delivered
- `src/lib/security/identity-lookup.ts`: server-only bearer validation,
  remote Supabase Auth user verification, read-only RLS-backed school and
  platform membership lookups, bounded timeouts and no-store responses.
- `src/app/api/auth/me/route.ts`: private no-store authenticated identity API.
- `tests/e2e/identity-lookup.spec.ts`: unauthenticated and malformed-token
  denial tests.

## Database verification
The dedicated RAVEN OS database has six tables, all RLS enabled, zero
application records. Membership self-read policies are installed. Client
write operations remain revoked.

## Security and operational limitations
- No browser login or credential collection enabled.
- No secrets committed. Integration requires deployment-only
  `RAVEN_SUPABASE_URL` and `RAVEN_SUPABASE_PUBLISHABLE_KEY` settings,
  with the dedicated Raven project URL/key (never NIBRAS keys).
- The /api/auth/me route is read-only identity metadata. It does NOT grant
  permissions for school records or issue/revoke sessions.
- Do not enable real user access until invitation/provisioning, verified
  server sessions, school tenant isolation, MFA and durable audit pass
  security acceptance tests.
- No deployment to Raven official production, no main merge.
- Supabase project was quoted at $0/month at creation. Monitor free-plan
  limits and do not enable paid upgrades without approval.
