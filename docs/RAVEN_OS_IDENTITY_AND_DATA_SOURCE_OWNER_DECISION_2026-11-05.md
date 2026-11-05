# Raven OS — Identity & Data Source Ownership Decision
**Date:** 2026-11-05  
**Branch:** `rescue/unified-arena-integration-2026-11-03`  
**Status:** Owner-confirmed domain boundary; technical provider and storage decisions remain open  
**Related records:**  
- `docs/IDENTITY_DATA_SOURCE_DISCOVERY_2026-11-04.md`
- `docs/IDENTITY_AUTHORIZATION_TENANT_ISOLATION_CONTRACT_2026-11-04.md`
- `docs/UNIFIED_SCHOOL_DATA_CENTER_DATA_MODEL_2026-11-04.md`
- `docs/RAVEN_OS_15_ENGINE_EXECUTION_REGISTER_2026-11-05.md`

## 1. Owner-confirmed decision

The platform owner clarified on 2026-11-05:

**Raven OS has its own independent, centralized identity and school-data system.** It is institution-owned and separate from the Saudi government education platforms Noor and Madrasati.

Raven OS is responsible for its own:
- User account registration and lifecycle.
- School directory and Raven school identifiers.
- User profiles and school memberships.
- Raven roles, permissions, and tenant access.
- Raven operational records and canonical data governed by the Unified School Data Center.

Noor and Madrasati are external government platforms. They are not Raven OS's identity provider, user-registration system, school master database, or canonical operational database.

This decision establishes domain ownership and system boundaries. It does **not** select a technical identity vendor, authentication SDK, database, ORM, file-storage provider, or integration technology.

## 2. External government-platform boundary

Noor and Madrasati remain independent external systems. Raven OS may provide specific, separately authorized operational tools that interact with them where an official and permitted integration method exists.

Examples stated by the owner include:
- Recording and exporting absence.
- Recording lateness.
- Distinguished behavior / positive behavior records.
- Other approved school-service workflows.

These are **Raven operational tools and integration workflows**, not a transfer of Raven account ownership or school-data authority to Noor or Madrasati.

For each individual workflow, Raven must establish:
1. The responsible business owner and authorized user roles.
2. The exact source and destination of each data field.
3. Whether the government platform exposes an official API or another explicitly permitted mechanism.
4. Required scopes, consent/authorization, terms, and security review.
5. Preview, validation, explicit confirmation, idempotency, reconciliation, and audit behavior.
6. Failure, retry, conflict, and manual fallback behavior.

No scraping, credential collection, session impersonation, control bypass, or unapproved automated writes are allowed.

## 3. Canonical ownership model

| Data domain | Raven OS responsibility | External-system relationship |
|---|---|---|
| Raven user accounts | Raven is the independent account owner and lifecycle authority | No dependency on Noor/Madrasati account registration |
| Raven schools | Raven maintains its own canonical school records and stable Raven school IDs | External school identifiers may be mapped only as references where authorized |
| Raven memberships and roles | Raven owns membership, role, permission, and tenant-scope decisions | External platform roles do not automatically grant Raven access |
| Raven staff/student operational profiles | Raven owns its own governed records and provenance | External records may be imported or referenced only through approved workflows |
| Raven operational records | Raven owns the canonical record for workflows created and managed in Raven | Explicit export or reconciliation may send approved fields to an external destination |
| Noor/Madrasati records | The respective government platform remains authoritative for its own records | Raven stores only permitted references, exchange receipts, and provenance as required |

## 4. Architecture implications

1. Implement a Raven-native identity and account lifecycle boundary, backed by a trusted server-side session.
2. Maintain Raven's own school directory and tenant identifiers.
3. Maintain Raven's own membership and authorization model, including effective dates and revocation.
4. Keep external government identifiers in a dedicated mapping/integration boundary; never use them as the primary Raven identity or tenant key.
5. Keep operational tools (absence, lateness, distinguished behavior, and other approved services) separate from the account and school master-data domains.
6. Route all external exchange through the integration layer and auditable workflow; external availability must not disable core Raven account and school-data functions.
7. Keep the Unified School Data Center as the governed Raven intake and canonical-data boundary, without allowing each engine to create duplicate master records.

## 5. Remaining technical and governance decisions

The owner decision resolves the system ownership question, but these implementation facts still need discovery or approval:
- Who administers Raven accounts, and how are accounts invited, verified, suspended, recovered, and deactivated?
- Which account classes are in scope initially: platform administrators, school leaders, teachers, staff, families, and students?
- What is the approved identifier strategy for Raven users and schools?
- Who is permitted to create a school, approve its activation, and transfer or close it?
- What are the authoritative Raven sources and import procedures for staff, student, class, guardian, and assignment data?
- What is the owner-approved role/permission matrix for each portal and operational action?
- Which official integration mechanisms are available for each Noor/Madrasati workflow, and who owns each integration?
- What are the privacy, retention, deletion, backup, and recovery requirements?

No credentials, passwords, API keys, or secrets should be placed in architecture documents.

## 6. Implementation gates

### Gate A — Raven-native identity design
Produce an ADR for account lifecycle, trusted sessions, recovery, MFA requirements where applicable, user identifiers, and server-side session validation. Confirm the account-administration process and initial user classes.

### Gate B — Raven canonical school and membership data
Finalize school, academic year, user, staff profile, student profile, membership, enrollment, class, guardian relationship, and assignment ownership, including stable IDs, uniqueness, lifecycle, provenance, and conflict handling.

### Gate C — Persistence and tenant isolation
Only after technical choices are reviewed and approved, implement schema/migrations, repositories, transaction boundary, row/tenant isolation, durable audit, backup/recovery, and negative cross-school tests.

### Gate D — Operational integrations
Design and activate each external workflow separately after official integration mechanism, permissions, destination/source semantics, owner approval, and end-to-end tests are established.

## 7. Explicit non-decisions

This record does not authorize or select:
- Any identity/authentication vendor or provider.
- Any database, ORM, or migration framework.
- Any file/object-storage provider.
- Any Noor or Madrasati API, connector, automation, or write operation.
- Any production data migration or import.
- Any change to `main`, merge, or deployment.

## 8. Acceptance interpretation

The owner-confirmed outcome is: **Raven OS is an independent institutional platform with its own centralized identity and school-data authority; Noor and Madrasati are external government systems used only through separately authorized operational integrations.**

The platform is not yet technically connected or production-ready merely because this ownership decision is documented.

---

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
