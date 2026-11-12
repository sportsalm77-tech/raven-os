# RAVEN OS — Batch 15: Six-Center School Operations Foundation
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`
Dedicated Supabase project: `imoquechayktepndfmlt`
Database migration: `raven_school_operations_batch_15`

## Implemented
Six operational school-scoped database tables:
`raven_school_decisions`, `raven_school_assignments`,
`raven_school_plans`, `raven_school_evidence`,
`raven_school_impact`, `raven_school_data_documents`.
They contain status/type checks, creator references, tenant IDs,
relevant foreign keys and school/date indexes. All six have RLS
enabled and no anon/authenticated table grants. No data was inserted.
Total Raven application tables: twelve, all RLS enabled.

Application changes:
- `src/lib/operations/school-module-registry.ts`: canonical mapping
  of six school operation domains and their allowed field contracts.
- `src/app/api/operations/modules/route.ts`: read-only module
  readiness endpoint requiring verified principal membership for the
  requested school, without returning school records.
- `tests/e2e/operations-modules.spec.ts`: denial tests across all
  six modules.

## Critical distinction
This batch establishes database structures and server authorization
contracts, NOT complete CRUD workflows, user-facing editing screens,
uploads, or real operational data. `available: false` is intentional
until secure operations and acceptance tests exist. No school pages
have been declared production-ready.

## Remaining development
Secure sessions, MFA, invitation provisioning, operational CRUD
with tenant-scoped database policies and audit logging, same-school
cross-table integrity, document storage controls, role-specific UI,
and cross-tenant/guardian denial tests.

## Release/cost
No merge to main, no official deployment. Free-first, no paid
services approved or enabled.
