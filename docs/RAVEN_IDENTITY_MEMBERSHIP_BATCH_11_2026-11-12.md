# RAVEN OS — Batch 11: Identity and Membership Policy
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`

## Scope
Extend Batch 10 with a pure, provider-neutral, fail-closed policy for verified
sessions and school membership. This is an authorization prerequisite, not a
working login, database or session verification implementation.

## Implemented
- Typed membership roles for the four existing portals only.
- Explicit active/invited/suspended/revoked membership states.
- Session expiry and verified-at checks.
- Strict matching of subject, school and portal.
- Strong MFA prerequisite for platform and school administrators.
- Cross-school and platform-school isolation tests.

## Security activation prerequisites
The caller MUST first verify the session using a trusted server-side provider,
then load membership from a trusted persistent school membership store. Browser
inputs MUST NOT construct either trusted object. All real data reads/writes still
require resource-level RBAC, guardian-child relationship checks and durable audit.
These pure tests do not prove any of those services are deployed.

## Release
Do not deploy to the official Raven project or merge to main. Preview only by
explicit approval. Do not provision new vendors or paid services without approval.
