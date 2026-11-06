# RAVEN OS — Identity & Authentication Policy Closure / Next Conversation Handover

**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Repository:** `sportsalm77-tech/raven-os`  
**Working branch:** `rescue/unified-arena-integration-2026-11-03`  
**Status:** Policy closed and documented; implementation is not yet production-ready.

---

## 1. Owner approval and governing policy

The owner approved the platform-wide governing document:

`docs/RAVEN_OS_UNIFIED_IDENTITY_AUTHENTICATION_AND_ACCESS_POLICY_2026-11-06.md`

This is the single primary policy for identity, authentication, sessions, QR eligibility, role boundaries, tenant isolation, and server-side authorization across Raven OS.

The detailed family/student contract is subordinate and must remain consistent with the primary policy:

`docs/RAVEN_UNIFIED_FAMILY_IDENTITY_STUDENT_SIGNIN_QUICK_ACCESS_CONTRACT_2026-11-06.md`

The TWO POINT FOUR architecture remains the governing project context. Do not confuse it with the public homepage specification Version 2.1.

## 2. Closed owner-directed decisions

1. Raven uses one centrally governed identity and authentication architecture across all four portals: `/platform`, `/principal`, `/teacher`, and `/family`. Do not create a fifth portal.
2. Student and family sign-in use one unified Raven account identity and one Raven-managed password, regardless of number of children, school, or education stage.
3. Each child remains a separate canonical student record, enrollment, school tenant context, and permission set. Unified sign-in never merges student records or automatically grants cross-child access.
4. A verified Madrasati student email/username may be used as a Raven sign-in identifier after source, ownership, and uniqueness validation.
5. A single account may need to accept multiple verified student identifiers for siblings. The exact identifier/alias mapping is a technical design gate; do not implement silent matching or account merging.
6. The Raven-managed password is not the Madrasati password. Madrasati password reuse is permitted only through an official, supported federation integration. Raven must never collect, scrape, import, log, or store the Madrasati password.
7. One-time/temporary Raven password handover must be secure; the user changes it after first sign-in. Schools cannot view or retrieve current passwords.
8. Quick Access QR is permitted for teachers and students. Family QR is permitted only after guardian request, school verification/approval, and documented acknowledgement. Platform Super Admin and school principal/admin QR access is prohibited.
9. QR must use short-lived, cryptographically random, scoped, revocable, replay-resistant challenges; never a static permanent login barcode or embedded password.
10. Every protected operation must enforce server-side authentication, role, active tenant, child relationship, resource, and field-level authorization. UI hiding and browser-side checks are not security.
11. Cross-school family linking must use approved identifiers and verification. No school may browse another school's student roster. Uncertain matches require authorized human review.
12. No production integration or working authentication/QR capability is claimed until implemented and tested.

## 3. Documentation changes completed in this handover

The primary policy was updated to remove the previous wording that kept student and family identities as separate login accounts. It now states the unified Raven account/password decision while preserving independent canonical student records, guardian relationships, role contexts, school tenants, and permissions.

The subordinate family/student contract was updated to match:
- one unified Raven account and Raven-managed password;
- verified Madrasati identifier use as a possible sign-in identifier;
- conditional Madrasati password federation only;
- cross-school child linking without duplicate accounts/passwords;
- separate child records and per-child authorization;
- existing QR role controls and guardian approval conditions.

No application source code, package dependencies, database migrations, environment secrets, production data, or deployment configuration were changed as part of closing this policy.

## 4. Repository state and evidence

Baseline rescue branch HEAD before the documentation updates was:
`087e4470fc8df0fc352004b9703016c88731155e`.

The two documentation commits made during this closure are:
- Primary policy alignment: `428b4a75a8f9da03d42b56ebe9fbcdca33a2605d`
- Family/student contract alignment: `48de0ed97aaaea7f74a29326c9e825b381a1843f`

The final handover commit is the commit that adds this file; verify the live branch HEAD before continuing.

The previously cited CI run `42178442772` belongs to the pre-documentation baseline commit `087e4470fc8df0fc352004b9703016c88731155e`. It is not evidence that the subsequent documentation commits or any future code changes have passed CI. Re-check the latest branch workflow run and its exact SHA before treating the current branch as verified.

Relevant current implementation inspection showed:
- `src/app/login/page.tsx` is an informational placeholder and explicitly says no real authentication is enabled.
- `package.json` contains Next.js/React/TypeScript, Playwright, and security test scripts, but no installed authentication provider SDK, database client, or ORM.
- `src/lib/security/identity-policy.ts` contains pure role/portal/MFA/QR policy rules; it does not authenticate or issue QR credentials.
- `src/lib/security/access-control.ts` contains fail-closed authorization primitives and a relationship-resolver contract; it requires a trusted server-side session and a real authoritative relationship resolver.
- `src/lib/security/audit.ts` defines a typed audit event and sink interface; it does not persist audit events without a durable sink.
- These are useful security foundations, not a production identity, database, session, tenant-isolation, or audit-persistence implementation.

## 5. Implementation gates still open

Do not call the identity/security implementation complete. The following work remains:

### Gate A — Choose the identity and persistence architecture
The owner expressed trust in the engineering recommendation to continue evaluating Better Auth + PostgreSQL + Drizzle, with Neon as an initial database candidate. This was a recommendation, not an explicit vendor approval. Before adding dependencies or migrations:
- compare the current supported versions and Vercel deployment compatibility;
- assess database region/data residency, privacy, backup/recovery, operational cost, and service terms;
- decide whether identity/session/audit data share one database or require separated access boundaries;
- present the final provider/database/ORM proposal for explicit owner approval.

Do not introduce an alternative hosting/deployment platform. Vercel remains the approved hosting platform.

### Gate B — Finalize account and identifier mapping
Design and test:
- stable unified Raven account ID;
- one Raven-managed password per unified account;
- multiple verified Madrasati student identifiers as possible sign-in aliases, with uniqueness and ownership checks;
- sibling and cross-school relationship workflow;
- additional adult guardian access model;
- account recovery, temporary credential delivery, lockout, suspension, and deactivation;
- no silent merge or account takeover during matching.

### Gate C — Build trusted authentication and sessions
Implement only after Gate A approval:
- secure password hashing and verification;
- session creation, renewal, expiry, rotation, secure cookie handling, revocation, logout;
- privileged MFA for platform and school administrators;
- trusted server-side actor construction;
- no identity/role/tenant trust from browser input;
- rate limits, CSRF protections where applicable, and safe generic errors.

### Gate D — Enforce server-side authorization and tenant isolation
- Resolve active school context on the server.
- Support a family account switching only among independently verified child/school contexts.
- Verify guardian-child relationship and school enrollment for every child-specific request.
- Ensure every query, API, export, file, background job, and engine call is scoped and authorized.
- Add negative cross-tenant, sibling-isolation, role-escalation, and revoked-relationship tests.

### Gate E — QR Quick Access
- Teacher and student short-lived challenge flows.
- Family flow only after request, verification/approval, and acknowledgement.
- No QR for platform or principal/admin roles.
- Single-use/replay resistance, device/session binding, revocation, expiry, abuse controls, and audit.
- Do not embed passwords or persistent bearer secrets in QR images.

### Gate F — Durable audit and operational recovery
- Connect the typed audit event interface to durable, access-controlled persistence.
- Never log passwords, QR tokens, or bearer credentials.
- Implement recovery, lost-device revocation, account compromise response, and retention controls.

### Gate G — Verification
Run and record:
- lint and production build;
- security unit tests;
- authentication/session integration tests;
- API authorization and tenant isolation tests;
- QR replay/expiry/revocation tests;
- browser tests for all four portals and Arabic RTL/English LTR;
- CI run tied to the exact final commit SHA.
Do not claim success from a UI notification or baseline CI run alone.

## 6. Scope and change-control

- Continue only on `rescue/unified-arena-integration-2026-11-03`.
- Do not modify `main`, merge, or deploy without explicit owner approval.
- Preserve the existing portals, navigation, centers, contracts, data relationships, and current work.
- Do not rebuild Raven OS from scratch.
- Do not create a fifth portal or a duplicate student/family database.
- Do not add a provider, database, ORM, migration, secrets, or production integration until its approval gate is complete.
- After the security foundation is implemented and verified, resume the existing Family portal at `/family` and its twelve approved sections: Home, Children, Attendance, Progress, Grades, Homework, Behavior, Timetable, Notifications, Contact School, Reports/Files, Profile/Settings. Review, clean demo data, and develop the existing portal; do not replace it with a new portal.

## 7. First actions for the next conversation

1. Verify the current rescue branch HEAD and confirm this handover commit is present.
2. Inspect the two updated policy documents in full and confirm there are no remaining contradictory statements.
3. Check the latest GitHub Actions run/jobs and record the exact tested SHA; do not reuse the baseline run as proof for later commits.
4. Present the final Better Auth/PostgreSQL/Drizzle/Neon decision package with current compatibility, residency, security, cost, and recovery considerations for owner approval.
5. Once approved, implement the central identity foundation in a controlled sequence, with tests and evidence at each gate.
6. Keep the Family portal transfer/cleanup as the next product workstream after the identity foundation is secured.

---

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
