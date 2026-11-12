# RAVEN OS — Batches 17, 18 and 19 combined handover
Date: 2026-11-12
Branch: rescue/unified-arena-integration-2026-11-03
Release: NOT AUTHORIZED; no deployment or main merge.

## Batch 17 — Verified identity to operation authorization
- Added `src/lib/operations/authorize-operation.ts`.
- Read authorization uses the server-verified identity snapshot, active
  school membership, action-level permissions, validated school UUID
  and a strict six-module registry.
- No database CRUD is enabled. No claims of operational availability.

## Batch 18 — Four-portal capability boundaries
- Added `src/lib/operations/portal-capabilities.ts`.
- Principal receives only allowed school module names.
- Teacher receives a restricted subset.
- Family and platform do not gain school-record access via this API.
- Added `GET /api/operations/capabilities`, authenticated, no-store,
  read-only metadata response with dataAccess=false.
- This does not replace guardian-child scope enforcement or platform
  governance features; both remain to be built separately.

## Batch 19 — Acceptance tests
- Added `tests/e2e/operations-capabilities.spec.ts`.
- Covers invalid tenant, invalid portal, unauthenticated calls for all
  four portal types, and no-store response headers.
- Await CI success before accepting the batch.
- Authenticated live-user and database RLS tests remain outstanding.

## Next required engineering work
1. Verify CI and repair any failures.
2. Add explicit database RLS policies using verified active school
   memberships; never use service_role in browser or bypass RLS.
3. Implement audited CRUD, tenant-safe storage, and integration tests
   with real test accounts in a controlled environment.
4. Complete real UI integrations and family child-level authorization.

## Constraints
No Vercel deployment, no main merge, no paid services, no production
data seeding without owner authorization.
