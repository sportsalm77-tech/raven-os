# Raven OS — Identity & Data Source Discovery / Technical Design Gate

Date: 2026-11-04
Status: **Discovery result and design gate — no provider selected**
Branch: `rescue/unified-arena-integration-2026-11-03`

## 1. Executive finding

A repository-level inspection of the current Raven rescue branch confirms that this codebase is a Next.js application scaffold, not an already integrated identity or operational-data application.

Evidence reviewed:
- `package.json`: runtime dependencies are Next.js, React, and Lucide. No authentication SDK, database client, ORM, or data-access SDK is declared.
- `src/app/login/page.tsx`: explicitly states that the unified login page is awaiting connection to an approved authentication service and does not accept or store credentials.
- `README.md`: explicitly states that authentication, server-side RBAC, tenant isolation, database access, audit logging, and operational actions are not connected.
- Teacher and Family route entry files render their dashboard components directly; no trusted session or role check is called there.
- Repository tree review found no migration, schema, ORM, database configuration, or server auth module in the current scaffold.

**Bounded conclusion:** the current rescue repository does not contain an implemented identity provider integration or operational database integration. This finding does not prove that the organization has no separate account system, school information system, spreadsheets, or data stores outside this repository. Those external sources must be identified with the owner before technical design is finalized.

## 2. Current-state inventory

| Capability | Evidence in rescue repository | Status |
|---|---|---|
| Login UI | Transitional placeholder page | Present, non-operational |
| Identity provider integration | No auth SDK or server session implementation found | Not evidenced |
| Server-side role authorization | No route/data guard found in reviewed paths | Not implemented in scaffold |
| Database connection | No database client/ORM/configuration found | Not evidenced |
| School membership source | No schema or repository found | Not evidenced |
| Teacher assignment source | No schema or repository found | Not evidenced |
| Guardian-child relationship source | No schema or repository found | Not evidenced |
| Tenant isolation | Requirement documented only | Not implemented |
| Audit event persistence | No audit data service found | Not evidenced |
| Operational student data | Explicitly excluded from rescue scaffold | Not connected |

## 3. External source discovery required

Before selecting an implementation, record the authoritative source for each domain. Do not assume that one system is authoritative for every domain.

| Domain | Required source-of-truth question | Minimum evidence to collect |
|---|---|---|
| User identity | Where are staff and family accounts created and disabled today? | System owner, stable user identifier, account lifecycle, supported integration method |
| School directory | Where is the official school identity and tenant mapping maintained? | Stable school ID, status, ownership, duplicate-resolution policy |
| Staff membership | Which system confirms that a staff member belongs to a school? | Effective dates, role, transfer and termination behavior |
| Teacher assignments | Where are current classes, subjects, and student assignments mastered? | Assignment IDs, effective dates, school ownership, responsible approver |
| Guardian links | Where is the verified guardian-to-student relationship mastered? | Verification process, relationship status, revocation, restricted-access handling |
| Student records | Which source owns the authoritative student identifier and enrollment? | Stable student ID, school enrollment history, data classification |
| Audit/retention | Which policy governs access logs and student records? | Retention periods, authorized viewers, incident process |

For every proposed source, record the responsible owner, data controller/processor role as applicable, API/export capabilities, update frequency, availability expectations, data quality, and permission to integrate. Do not collect passwords or secrets in this document.

## 4. Technical design principles

The future implementation must fit the existing Next.js App Router + TypeScript application and the already approved Raven hosting/build path. This document does not authorize a new vendor or hosting platform.

Required logical layers:
1. **Identity adapter** — validates the trusted session and exposes a minimal server-side subject context.
2. **Authorization policy** — checks role, school membership, resource assignment/relationship, and operation.
3. **Tenant-aware data access** — exposes only constrained queries and mutations; never accepts an unchecked tenant ID as authority.
4. **Audit service** — records relevant allow/deny and mutation events without unnecessary personal data.
5. **Portal UI** — consumes authorized server results and displays truthful loading, empty, error, and permission states. It never decides access.

All server endpoints, Server Actions, exports, downloads, reports, and background operations must enforce authorization independently. A route middleware layer may be useful for early navigation handling but is not a replacement for data-layer enforcement.

## 5. Design alternatives to evaluate only after source discovery

The architecture review should compare, not preselect:
- Existing organizational identity service integration, if one is authoritative and supports secure server-side validation.
- A dedicated identity service compatible with the current application and approved hosting, if no suitable identity source exists.
- Existing approved operational data store integration, if one already owns the required school and relationship records.
- A purpose-designed tenant-aware data store, only if no suitable authoritative store exists and the owner approves the data ownership, migration, backup, and operations model.

Comparison criteria:
- Server-side session verification and revocation.
- Role and tenant claims that can be independently checked against authoritative records.
- Guardian relationship verification and revocation support.
- Row/record-level tenant enforcement or equivalent constrained server queries.
- Auditability, data residency, backup/restore, availability, and incident response.
- Compatibility with Next.js App Router, Vercel deployment, existing code, and operating costs.
- Export/migration path and vendor lock-in risk.

No candidate should be selected based solely on ease of setup or a client-side SDK.

## 6. Required design deliverables before implementation

- Context and trust-boundary diagram.
- Identity lifecycle and session sequence.
- Role/action matrix for Platform, Principal, Teacher, and Family.
- School membership, teacher assignment, and guardian relationship source mapping.
- Data ownership and tenant-key strategy.
- Server-side API / Server Action inventory.
- Data classification, audit, retention, and file-access policy.
- Migration/backfill and rollback plan if existing records must be imported.
- Automated positive and negative authorization tests based on the contract in `IDENTITY_AUTHORIZATION_TENANT_ISOLATION_CONTRACT_2026-11-04.md`.

## 7. Immediate safe next steps

1. Obtain the owner's inventory of any current external account and school-data systems.
2. Map each source to the domains in section 3 and identify the authoritative owner.
3. Review integration capability and compatibility without connecting production data.
4. Present a short architecture decision record with options, trade-offs, costs, risks, and a recommended approach.
5. Obtain explicit owner approval before adding dependencies, secrets, migrations, integrations, or auth code.

Until then:
- Keep `/login` transitional and non-credential-accepting.
- Keep Teacher and Family preview-only.
- Do not expose real student, guardian, grade, attendance, behavior, or teacher-assignment records.
- Do not add mock users, demo sessions, fake guardian links, or client-side role switches.
- Do not alter Design Arena, `main`, or production deployment.

## 8. Verification and CI

At the time this document was prepared, GitHub Actions workflow `Raven rescue verification` completed successfully:
- Run 41779406201 — commit `5570bea89ac1e36e03de988acb24c7a946db442e`: success.
- Run 41779414012 — commit `587cb0bfbe94646cdb09d35e523c80f8f75281a1`: success.

The workflow runs `npm install`, `next build`, and ESLint. These results verify the configured build/lint pipeline for those commits only; they do not verify runtime behavior, browser/mobile experience, identity, authorization, database connectivity, tenant isolation, or production readiness.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
