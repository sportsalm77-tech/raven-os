# RAVEN OS — Architecture Decision ED-012: Dedicated Authentication and Data Plane
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`
Status: Approved architecture; provisioning pending organization/cost confirmation.

## Decision
Use a dedicated Supabase project for RAVEN OS with Supabase Auth,
PostgreSQL and row-level security. Do NOT reuse the existing NIBRAS
Supabase project, users, database, API keys or storage.

## Constraints
- Preserve existing Next.js/Vercel/GitHub architecture and rescue branch.
- No changes to Raven official production project, no main merge.
- No paid resource or subscription without explicit price approval.
- Four portals only: platform, principal, teacher, family.
- The public homepage exposes principal, teacher and family only.
- Platform admin is reachable by its separate URL and protected server-side.
- Never store real school data until membership, RLS, RBAC and audit tests pass.

## Proposed minimum database model (not yet provisioned)
- schools: id, status, timestamps
- profiles: user_id referencing auth.users, display metadata
- school_memberships: user_id, school_id, role, status, timestamps;
  school scope required for non-platform roles
- platform_memberships: user_id, role, status; never a school membership
- guardian_child_links: guardian_id, child_id, school_id, status
- audit_events: actor_id, event_type, school_id, timestamp, correlation_id

No broad client write policies for membership/roles or audit.
Authorization must resolve from server-trusted DB records, not
user_metadata or browser-provided role/school IDs. Enable RLS on
all exposed tables, with tenant and relationship predicates.
Sensitive admin operations require strong MFA and durable audit.

## Integration gates
1. Confirm organization for a new dedicated project and quote cost.
2. Create only if $0 or explicitly approved nonzero cost.
3. Create reviewed migrations with restrictive RLS and automated policy tests.
4. Wire Next.js verified server sessions and auth callbacks securely.
5. Prove cross-tenant, cross-role, guardian and revocation denial.
6. Enable login only after security acceptance; then manually preview deploy
   with owner approval.

## Verified facts
The connected Supabase account currently lists one project named NIBRAS.
No Raven Supabase project was created or modified by this decision.
