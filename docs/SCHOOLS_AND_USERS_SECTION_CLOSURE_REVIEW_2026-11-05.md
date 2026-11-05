# Raven OS — School & User Administration Closure Review
**Date:** 2026-11-05  
**Branch:** `rescue/unified-arena-integration-2026-11-03`  
**Reviewed commit:** `bc961d3be41d5e557062f000a9f2e593e3a88c5c`  
**Status:** Architecture and UI review completed; production-operational closure blocked by unselected persistence and trusted identity infrastructure.

## 1. Scope reviewed
- Platform school administration: `/platform/schools`
- Platform user and identity administration: `/platform/users`
- Shared authorization and audit foundations.
- Approved school/account lifecycle, identity ownership, and portal-separation decisions.
- Recursive repository tree, application routes, package dependencies, and current verification workflow.

## 2. Confirmed implementation state

| Area | Current state | Evidence / interpretation |
|---|---|---|
| School administration screen | Design/workflow description only | `PortalModuleWorkspace` describes school profile, activation, principal assignment, and tenant review; it explicitly states that school records are not connected. |
| User administration screen | Design/workflow description only | Invitation, school membership, role, and account-state workflow is described; no operational identity service is wired. |
| Canonical school identity | Architecture decision recorded | Raven owns its independent school directory and stable Raven school identifiers; no persistence implementation is present. |
| Account lifecycle | Architecture decision recorded | School administrator generates teacher/student accounts within the school's tenant; family relationship model remains deliberately constrained and not fully specified. |
| Authorization policy | Server-only policy foundation exists | `access-control.ts` rejects absent/malformed actors, role mismatch, and cross-school target IDs. It requires a trusted actor supplied by a verified server session. |
| Durable audit | Typed event contract exists | `audit.ts` validates event envelopes and fails closed if no durable audit sink is configured. No durable sink is wired. |
| Trusted sessions | Not implemented | No server-side session provider or validated identity source was found in the reviewed repository tree. |
| Database/repositories/migrations | Not implemented | No database/ORM dependency, schema/migration layer, or school/account repository was found in the reviewed tree. |
| Server API handlers | Not implemented for this workflow | No `src/app/api` route-handler tree or equivalent server mutation endpoints were present in the recursive tree. |
| Automated security tests | Not implemented | No dedicated test script or test framework is configured in `package.json`. |
| Build and lint | Passed | GitHub Actions run `41971452322`, commit `bc961d3`: dependency installation, Next.js build, and ESLint all succeeded. |

## 3. Security findings requiring resolution before live activation

1. **Trusted actor provenance:** the policy foundation is safe only when `TrustedActor` is created from a validated server-side session. No such session adapter currently exists.
2. **Tenant enforcement:** comparing an actor's `schoolId` with a supplied target ID is a useful policy check, but it does not replace server-side data scoping or database-level tenant isolation. Every repository query and mutation must derive tenant scope from the verified actor.
3. **Role separation:** `school_admin` and `principal` currently receive the same permission set, and both are mapped to the Principal portal. This needs an explicit role matrix before enabling delegated school administration. Do not infer that these roles are interchangeable merely because the current policy lists the same permissions.
4. **Platform boundary:** platform roles are not school-user sessions. School creation/activation and principal assignment must use explicit platform permissions and must not create an implicit Principal session.
5. **Account creation:** invitations, activation, membership, role assignment, quota enforcement, suspension, and recovery must be separate server-authorized lifecycle operations. No credential may be exposed in bulk results or logs.
6. **Audit:** school creation, activation/deactivation, principal assignment, invitations, acceptance, membership changes, role changes, account suspension, and recovery require durable, tamper-resistant audit records.
7. **Family relationship:** family access must not be activated as unrestricted access to a student's account. The guardian identity, relationship verification, consent/restriction semantics, and per-child scope remain a separate design gate.

## 4. Approved boundaries preserved
- Raven remains the independent owner of its identity and school data; Noor and Madrasati do not become identity providers or canonical Raven databases.
- No database, ORM, authentication provider, MFA provider, or messaging provider is selected by this review.
- No production records, migrations, invitations, credentials, or live account writes were created.
- No external identity or government-platform integration was activated.
- No changes were made to `main`; no merge or deployment was performed.

## 5. Closure decision

**The design and UI review for the Schools & Users section is closed. The operational implementation is not production-closed.**

It would be unsafe and misleading to mark school/account administration fully complete while the application has no trusted session source, persistent school/account storage, server mutation handlers, or durable audit sink.

The next implementation package should be delivered as one cohesive backend foundation, after the owner approves the technology decision:
1. Raven-native school and identity persistence, including stable IDs, uniqueness, lifecycle states, and membership relationships.
2. Trusted server-side authentication/session adapter consistent with Raven's independent identity ownership.
3. Server-only repositories and mutation handlers that derive `school_id` from the verified actor and enforce subscription entitlements.
4. Durable audit sink and correlation across every sensitive lifecycle operation.
5. Negative automated tests for unauthenticated access, wrong portal, wrong role, cross-school reads/writes, revoked membership, suspended accounts, invitation replay/expiry, quota overflow, and unauthorized platform-to-principal access.
6. End-to-end tests using synthetic tenants and accounts only, followed by an explicit deployment approval.

## 6. Verification record
- GitHub Actions: `41971452322`
- Result: `success`
- Build Next.js: `success`
- ESLint: `success`
- Commit tested: `bc961d3be41d5e557062f000a9f2e593e3a88c5c`

A successful build/lint is a code-quality gate only; it is not evidence of a live identity service, persistent data, tenant isolation at the database layer, or production readiness.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
