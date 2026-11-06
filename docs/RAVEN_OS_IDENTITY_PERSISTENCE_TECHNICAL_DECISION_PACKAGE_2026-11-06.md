# RAVEN OS — Identity & Persistence Technical Decision Package
**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Status:** Engineering assessment and proposed direction — NOT owner-approved vendor selection  
**Repository:** `sportsalm77-tech/raven-os`  
**Working branch:** `rescue/unified-arena-integration-2026-11-03`  
**Baseline HEAD reviewed:** `0dcdb20eea94761649d73bf6bc8b42845561154d`

---

## 1. Purpose

This package advances the identity policy from a documented product/security contract to a technical decision gate. It records repository findings, evaluates the previously discussed candidate stack, identifies blocking questions, and defines the implementation boundary.

It does not select a vendor on behalf of the owner, authorize dependencies, create database infrastructure, run migrations, configure production secrets, import real records, merge, or deploy.

## 2. Confirmed project decisions preserved

1. Raven OS owns its independent platform identity, school directory, membership, roles, permissions, and canonical operational data.
2. Noor and Madrasati are external government systems. They are not Raven's identity provider or canonical Raven database.
3. Student and family use one unified Raven account identity and one Raven-managed password; student records, school enrollments, guardian relationships, and permissions remain separate.
4. A validated Madrasati student email/username may be a Raven sign-in identifier. Madrasati password reuse is allowed only through an official supported federation; Raven must never collect or store that password.
5. QR Quick Access is permitted for teachers and students; family QR requires request, verification/approval, and signed acknowledgement; QR is prohibited for platform and school administrators.
6. Four portals only: `/platform`, `/principal`, `/teacher`, `/family`. Student is an identity/authorization role, not a fifth portal.
7. v0 and Vercel remain the approved build and hosting path.
8. Continue on the rescue branch only. No changes to `main`, merge, or deployment without explicit owner approval.

## 3. Repository state inspected

The following were fetched from the exact rescue branch baseline:

- `package.json`: Next.js 16.4.3, React 19, TypeScript 5.7, Playwright and security test scripts. No authentication SDK, PostgreSQL driver/client, ORM, or database migration dependency is currently declared.
- `src/app/login/page.tsx`: explicitly states that real authentication is not enabled; it is an informational placeholder.
- `src/lib/security/identity-policy.ts`: pure role/portal/MFA/QR eligibility rules. It does not authenticate, create sessions, or mint QR tokens.
- `src/lib/security/access-control.ts`: fail-closed authorization primitives. It requires a trusted server-side actor and a real relationship resolver; it is not an identity provider or persistence layer.
- `src/lib/security/audit.ts`: typed audit event envelope and sink interface. It has no durable audit sink.
- Policy documents: unified identity policy and family/student quick-access contract.

### 3.1 Important implementation gaps found

These are code/policy alignment issues to resolve before wiring a provider:

1. **Student actor gap:** `identity-policy.ts` defines the `student` role, but `access-control.ts` currently omits student from `RavenRole`, `TrustedActor` role mapping, and the permission matrix. Student authorization cannot be considered implemented.
2. **Cross-school family context:** the current trusted actor has one active `schoolId`, and child-read authorization requires the target school to equal that active context. This can be a valid selected-school boundary, but the session/context-switch workflow must explicitly resolve and revalidate each linked child and school server-side. It must not turn one active school into blanket cross-school access.
3. **Permission matrix is provisional:** current code grants broad principal/school-admin permissions and does not yet demonstrate the full owner-approved per-role, per-resource, per-field matrix across all portals and engines.
4. **Guardian resolver is an interface only:** no authoritative persisted relationship resolver has been connected.
5. **No durable audit storage:** audit writes intentionally fail when no sink is configured.
6. **No actual session trust boundary:** the login route is a placeholder and there is no installed identity/session provider.
7. **No demonstrated tenant enforcement in a real database:** fail-closed TypeScript guards are not proof that every query, API, export, file, engine, and background job is tenant-scoped.

These are blockers for claiming production authentication or authorization. They do not invalidate the approved policy documents.

## 4. Candidate architecture assessment

### 4.1 Better Auth — candidate identity/authentication library

**Assessment:** technically compatible candidate, not approved.

Official documentation describes a Next.js App Router handler integration, PostgreSQL support, database-backed user/session data, and a Drizzle adapter. It also documents a two-factor plugin. This aligns with the current Next.js/TypeScript application and the policy's central identity/session boundary.

Potential fit:
- Raven-managed password authentication and session lifecycle.
- Central server-side identity/session verification.
- MFA capability for privileged roles, subject to implementation and testing.
- Custom Raven identity mapping and authorization remain application responsibilities.

Risks / required validation:
- Confirm current stable release, supported Node/Vercel runtime behavior, cookie/domain configuration, session revocation/rotation semantics, rate limiting, and MFA recovery behavior.
- Verify the exact plugin/schema requirements and migration output before adoption.
- Do not assume the library supplies Raven's multi-tenant authorization, guardian-child relationships, role governance, audit retention, or QR policy automatically.
- Do not treat the framework's optional organization plugin as the authoritative Raven school directory or school membership model.

Official references:
- https://better-auth.com/docs/installation
- https://better-auth.com/docs/adapters/postgresql
- https://better-auth.com/docs/integrations/next
- https://better-auth.com/docs/basic-usage

### 4.2 PostgreSQL — candidate relational persistence engine

**Assessment:** strong architectural fit for review, not approved as a hosted service.

Raven's domain includes schools, memberships, academic years, students, enrollments, guardian relationships, classes, assignments, evidence, audit events, and cross-entity workflows. Referential integrity, unique constraints, transactions, and carefully designed tenant scoping are important. PostgreSQL is a suitable relational candidate.

Required design controls:
- Separate identity-provider-owned tables from Raven-owned canonical domain tables.
- Stable Raven-generated IDs; external identifiers remain mapped references, not primary Raven identity or tenant keys.
- Explicit tenant-aware service/repository boundaries and database constraints.
- Evaluate PostgreSQL row-level security as defense in depth, not as a substitute for server authorization.
- Use transactions for identity linking, guardian relationship changes, membership changes, and audit-critical workflows.
- Define backup, restore, retention, deletion, and disaster recovery before production data.

### 4.3 Drizzle ORM / Drizzle Kit — candidate data-access and migration tooling

**Assessment:** compatible candidate, not approved.

Official documentation supports PostgreSQL, TypeScript schema definitions, generated SQL migration files, and applying version-controlled migrations. Drizzle's SQL-oriented approach may fit the existing TypeScript codebase without hiding the underlying relational model.

Proposed migration discipline if approved:
1. Define schema in source control.
2. Generate reviewable SQL migrations.
3. Inspect migration SQL and data-impact implications.
4. Apply only to an isolated development database first.
5. Run migration and rollback/recovery tests.
6. Apply to production only after a separate explicit release approval.

Do not use schema push as a shortcut for production migrations.

Official references:
- https://orm.drizzle.team/docs/overview
- https://orm.drizzle.team/docs/migrations
- https://orm.drizzle.team/docs/transactions

### 4.4 Neon — candidate PostgreSQL hosting service; residency gate is unresolved

**Assessment:** do not approve Neon yet.

Neon offers managed PostgreSQL, branching, point-in-time restore features, and published usage-based plan details. Its current public region material lists regions such as Frankfurt, London, Singapore, Sydney, São Paulo, and US regions; no Saudi Arabia, Bahrain, or UAE region appears in the reviewed region list. Neon states that a project's region is fixed at creation; moving regions requires creating another project and migrating data.

This creates a material data-location question for a Saudi education platform. A Vercel function region setting controls where application compute runs; it does not relocate the database or by itself establish data residency. Vercel documents that functions default to `iad1` for new projects unless configured, and recommends locating functions near their data source.

Therefore:
- Do not create a Neon project or place student/family/school records there until the owner confirms the required data-residency policy and legal/privacy review is complete.
- Verify current Neon regions in the console and contract at decision time; public listings can change.
- Confirm data-processing terms, subprocessors, support access, backup locations, deletion, incident notification, recovery objectives, and contractual commitments.
- Compare total expected cost using actual compute, storage, history/PITR, snapshots, network transfer, and production workload—not a free-tier headline.
- If Saudi or another specified jurisdictional residency is mandatory, Neon must be treated as unsuitable unless Neon can contractually and technically meet that requirement.

Official references:
- https://neon.com/demos/regional-latency
- https://github.com/neondatabase/website/blob/main/content/faqs/change-project-region.md
- https://neon.com/security
- https://github.com/neondatabase/website/blob/main/content/docs/introduction/plans.md
- https://vercel.com/docs/functions/configuring-functions/region

## 5. Proposed direction — for owner decision only

The engineering candidate stack remains:

- Identity/authentication library: **Better Auth**
- Relational database engine: **PostgreSQL**
- TypeScript data-access/migration tooling: **Drizzle ORM + Drizzle Kit**
- Database hosting: **UNSELECTED**; Neon remains only a candidate pending the data-residency and contractual gate.
- Application hosting: **Vercel**, already approved.
- Build workflow: **v0**, already approved.

This is a proposal, not an owner-approved technology decision. No dependencies or infrastructure have been added as part of this assessment.

## 6. Required owner decisions before implementation

The following must be resolved explicitly:

1. **Data residency:** Must Raven's production school, student, family, identity, and audit data remain inside Saudi Arabia? If not, which jurisdictions are acceptable, and what contractual/legal approval is required?
2. **Identity library:** Approve or reject Better Auth after the final compatibility/security review.
3. **Database engine:** Approve PostgreSQL as Raven's relational database engine.
4. **ORM/migrations:** Approve or reject Drizzle ORM/Drizzle Kit.
5. **Database hosting:** Approve a specific provider and region only after the residency decision and contract review.
6. **Retention/recovery:** Confirm required audit retention, backup cadence, recovery point objective (RPO), recovery time objective (RTO), and account/data deletion rules.
7. **Account operations:** Confirm who may create, verify, suspend, recover, and deactivate Raven accounts, including additional adult guardian access and the secure initial-password handover workflow.

No silent default is permitted for unresolved answers.

## 7. Implementation sequence after approval

### Gate 1 — Identity and account model
- Canonical `raven_account_id`.
- Distinct canonical student records and school enrollments.
- Verified identifier aliases, including multiple Madrasati identifiers only after ownership/uniqueness/conflict review.
- Guardian-to-student relationship lifecycle and adult guardian access.
- Account recovery, temporary credential expiry, lockout, suspension, deactivation, and dispute handling.
- No automatic account or family merge.

### Gate 2 — Authentication and session service
- Secure Raven password hashing and verification.
- Session creation, renewal, expiry, rotation, revocation, logout, secure cookies.
- Privileged MFA for platform and school administration.
- Trusted server-side actor construction.
- Rate limiting, safe errors, CSRF controls where applicable, and abuse monitoring.

### Gate 3 — Authorization and tenant isolation
- Final role/permission matrix, including student.
- Server-resolved active school context.
- Per-child guardian relationship verification for every request.
- Tenant scoping for queries, APIs, exports, files, engines, and background jobs.
- Negative tests for cross-school access, sibling access, role escalation, changed IDs, revoked links, and disabled accounts.

### Gate 4 — QR Quick Access
- Short-lived, cryptographically random challenges.
- Single-use/replay protection, expiry, revocation, device/session binding, rate limits.
- Teacher/student flows.
- Family request + verification/approval + acknowledgement.
- Server-enforced exclusion for platform/principal administrators.
- No passwords or persistent bearer secrets inside QR payloads.

### Gate 5 — Audit and recovery
- Durable, access-controlled audit sink.
- No credentials or raw QR tokens in logs.
- Lost-device and compromised-account response.
- Tested backup/restore and retention controls.

### Gate 6 — Verification and release evidence
- Unit, integration, security, auth/session, tenant, guardian, QR, and audit tests.
- Browser checks for all four portals, Arabic RTL, English LTR, and responsive behavior.
- CI tied to the exact final commit SHA.
- No merge/deploy without separate owner authorization.

## 8. Current verification snapshot

At the time of this package:
- Rescue branch HEAD: `0dcdb20eea94761649d73bf6bc8b42845561154d`.
- GitHub Actions runs `42186399727`, `42186436428`, and `42186474347` completed successfully.
- The third run is tied to the exact HEAD SHA above and its `next-build` job succeeded.
- This verifies the recorded workflow/build job only. It does not establish that authentication, persistence, tenant isolation, MFA, QR, or durable audit are implemented.

## 9. Explicit exclusions

This package does not authorize:
- Installing Better Auth, Drizzle, PostgreSQL drivers, or other dependencies.
- Creating a Neon or other hosted database project.
- Creating schemas or migrations.
- Adding production secrets or environment variables.
- Importing real student, family, or school data.
- Activating authentication, federation, QR, or external writes.
- Changing `main`, merging, publishing, or deploying.
- Replacing v0 or Vercel.

## 10. Next-session handover

The next conversation must:
1. Verify the rescue branch HEAD before any new work.
2. Read this package and the two identity policy documents.
3. Resolve the data-residency question first; it is a prerequisite to selecting a database host.
4. Present the owner with the remaining explicit decisions in Section 6.
5. After explicit approval, implement Gate 1 in a focused, testable sequence. Until then, do not add dependencies or migrations.
6. Preserve the four portals and all previously approved Raven OS architecture.

**Current status:** policy closed at documentation level; technical assessment recorded; provider selection and actual authentication/persistence implementation remain open.

---

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
