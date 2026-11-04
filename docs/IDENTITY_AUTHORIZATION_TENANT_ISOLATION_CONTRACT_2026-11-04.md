# Raven OS — Identity, Authorization & Tenant Isolation Contract

Status: **Design baseline for owner/engineering review — not implemented**
Date: 2026-11-04
Scope: Teacher and Family portals, with shared identity and tenant boundaries across the four-portal Raven OS application.
Repository: `sportsalm77-tech/raven-os`
Branch: `rescue/unified-arena-integration-2026-11-03`

## 1. Purpose and non-negotiable constraints

This document defines the security behavior that must exist before Teacher or Family portals receive real student, staff, attendance, grade, behavior, timetable, message, or document data.

It is a technology-neutral contract. It does not select an authentication vendor, database, ORM, schema migration, hosting change, or external integration. Those choices require a separate compatibility review and owner approval.

The approved application remains one Raven OS application with four role portals:
- `/platform`
- `/principal`
- `/teacher`
- `/family`

There is no fifth independent Users portal.

Security invariants:
1. Deny by default. A missing, invalid, expired, disabled, or ambiguous identity or permission must not grant access.
2. The browser is untrusted. URL parameters, form fields, local storage, client state, hidden navigation, and submitted `school_id`, `teacher_id`, `guardian_id`, or `student_id` are not proof of entitlement.
3. Every server-side read and write must authorize the authenticated actor and resolve its data scope on the server.
4. Every school-owned record must be constrained to the authorized `school_id` on the server and, where supported, at the persistence-policy layer.
5. Teacher and Family are separate authorization scopes. Shared components do not imply shared entitlements.
6. No demo identity, seeded record, fabricated notification, decorative verification badge, local-only save, or success toast may be represented as a real operation.
7. A successful page build is not a security test. No production activation until the required negative tests pass.

## 2. Trusted identity context

A trusted server-side identity context must be established from a validated session or equivalent trusted identity assertion. The application must not construct this context from browser-supplied role or tenant fields.

Minimum logical identity attributes:
- `subject_id`: immutable internal identity identifier.
- `account_status`: active, suspended, disabled, or pending.
- `role_assignments`: server-managed role grants, each with its scope.
- `session_id`: server-verifiable session reference and lifecycle state.
- `authentication_time` and applicable expiry/re-authentication metadata.
- `school_memberships`: active school membership records where the role requires a school.
- `authorization_version` or equivalent revocation/version signal so stale grants can be rejected.

Do not place student personal data, guardian relationship details, or broad tenant lists in browser-readable session claims unless a reviewed design proves they are necessary and safe. Resolve sensitive entitlements server-side.

Account status other than active must deny operational access. Revoked memberships, role grants, and guardian links must take effect on the server, not only after a client refresh.

## 3. Role and scope contract

### 3.1 Teacher

A Teacher request is allowed only when all conditions hold:
- The session is valid and the account is active.
- The authenticated subject has an active Teacher role assignment.
- The teacher is actively associated with the target school.
- The requested record belongs to that same school.
- The requested class, student, timetable, task, assessment, or other restricted resource is assigned to or explicitly accessible by that teacher under the school's approved assignment rules.
- The requested action is permitted for that resource and operation.

The teacher's scope is the intersection of:
`active teacher identity ∩ active school membership ∩ assigned classes/resources ∩ permitted action`.

A teacher must not gain access to another teacher's class or student by changing a URL, query, payload, record ID, or export filter. A teacher must not read or write records from another school, even if the guessed record identifier exists.

### 3.2 Family / Guardian

A Family request is allowed only when all conditions hold:
- The session is valid and the account is active.
- The authenticated subject has an active Family/Guardian role assignment.
- A current, server-verified guardian-to-student relationship exists for the specific child.
- The relationship is valid for the requested school and has not expired, been revoked, or been suspended.
- The requested record belongs to that child and school.
- The requested action is permitted for that record and operation.

The family scope is the intersection of:
`active guardian identity ∩ verified active relationship ∩ linked child ∩ permitted child-data action`.

A submitted child ID is only a resource selector, never proof of relationship. Resolve the relationship server-side for every child-specific request. Do not return all school students and filter them in the browser.

The contract does not infer legal custody, consent, or special restrictions from a generic guardian link. If the school needs restricted-access, court-order, consent, or contact limitations, those must be represented as explicit verified authorization attributes and enforced before data access.

### 3.3 Platform and Principal boundaries

This contract does not redesign the Platform or Principal portals. It establishes that:
- Platform-level administration is not an implicit grant to browse student records.
- Any exceptional support access must be explicitly granted, purpose-limited, time-limited where appropriate, and audited.
- A Principal's authority is limited to the principal's authorized school and approved school-management scope.
- No role may bypass tenant isolation merely because it has a higher display label or appears in navigation.

## 4. Tenant isolation contract

The server must derive the effective school scope from trusted role/membership records. A browser-provided `school_id` may be used only as a requested context selector and must be checked against the actor's authorized memberships before use.

For every read, update, delete, export, upload, search, aggregate, and background operation:
1. Resolve the authenticated actor.
2. Resolve active role and school scope.
3. Resolve resource ownership and relationship/assignment scope.
4. Check operation-level permission.
5. Execute a tenant-constrained query or mutation.
6. Record the security-relevant event without logging unnecessary personal data.

Do not fetch an unrestricted collection and filter it in application memory after retrieval. Avoid cross-tenant cache keys and shared cached responses. Sensitive authenticated responses should use an explicitly reviewed private/no-store caching policy.

For file storage, authorization must cover both metadata and the underlying object. Unpredictable URLs are not authorization. Download links, previews, exports, and generated files must be scoped and expire according to a reviewed policy.

## 5. Authorization enforcement points

Authorization must be enforced at every server boundary, not just page entry:
- Server-rendered protected route entry.
- Route handlers / API endpoints.
- Server actions and mutations.
- Data access/repository functions.
- Search, reports, aggregates, exports, uploads, and downloads.
- Background jobs and scheduled tasks acting on behalf of a user.
- Notification and messaging retrieval.
- Any future integration endpoint.

Client navigation may improve usability but is never a security boundary. Unknown routes may return not-found; known routes still require authorization. Do not rely on middleware alone if a data endpoint or server action can be invoked directly.

Each data-access operation should receive a trusted authorization context or resolve one internally. Avoid generic functions that accept arbitrary `school_id` and return data without checking actor membership and resource scope.

## 6. Operation-level permissions

Define permissions as explicit actions on resource classes rather than broad UI page visibility. At minimum, review separate permissions for:
- read/list/detail
- create
- update
- delete/archive
- approve/reject
- publish/notify
- export/download
- upload/attach
- manage links or relationships

A read permission does not imply update, approval, export, or deletion. Family access should normally be read-oriented; any acknowledgement, message, consent, or request action must be separately specified and auditable. Teacher write access must be limited to the teacher's assigned operational responsibilities.

## 7. Sensitive data handling and audit

Treat student identity, guardian contacts, grades, attendance, behavior, health-related school records, safeguarding notes, and uploaded documents as sensitive.

Audit events should capture, as appropriate:
- actor identity and active role;
- authorized school scope;
- action and resource type/identifier;
- allow/deny outcome and reason category;
- timestamp and correlation/request identifier;
- source channel or operation type.

Do not place passwords, session tokens, full sensitive payloads, or unnecessary student/guardian details in logs. Denied cross-tenant and relationship-scope attempts should be recorded in a privacy-conscious way and monitored for abuse.

Access to audit records itself requires authorization. Audit events must not be editable by ordinary portal users.

## 8. Session and account lifecycle requirements

Before activation, define and test:
- Secure session issuance, rotation, expiry, and revocation.
- Sign-out that invalidates the server session, not merely navigation to the homepage.
- Account suspension and role/membership revocation behavior.
- Re-authentication for sensitive actions where justified.
- Recovery and invitation flows that cannot silently attach an identity to the wrong school or child.
- Protection against session fixation, CSRF where cookie-based state-changing requests are used, and brute-force/credential-stuffing abuse.
- Safe behavior when the identity service is unavailable: deny protected access, do not fall back to demo mode.

Do not display a “verified”, “secure”, or authenticated identity label until the server has actually verified the current session and role.

## 9. Required security test matrix

All tests below must be executed against server endpoints/actions and data-access boundaries, not only by clicking the UI.

| ID | Scenario | Expected result |
|---|---|---|
| AUTH-01 | Anonymous user opens Teacher dashboard or child route | Deny / redirect to configured sign-in; no protected data returned |
| AUTH-02 | Anonymous user opens Family dashboard or child route | Deny / redirect to configured sign-in; no protected data returned |
| AUTH-03 | Authenticated Family user requests Teacher endpoint | Deny; no data leakage |
| AUTH-04 | Authenticated Teacher user requests Family endpoint | Deny; no data leakage |
| AUTH-05 | Suspended/disabled account uses an existing session | Deny after status/revocation check |
| TENANT-01 | Teacher from School A requests a School B record | Deny; no record existence disclosure |
| TENANT-02 | Teacher changes submitted `school_id` to another school | Deny |
| TEACH-01 | Teacher requests a student outside assigned classes | Deny |
| TEACH-02 | Teacher changes a class/student/resource ID in URL or payload | Deny unless independently assigned |
| TEACH-03 | Teacher invokes update/approval/export without that action permission | Deny |
| FAM-01 | Guardian requests a child with no verified relationship | Deny |
| FAM-02 | Guardian changes child ID to an unrelated student | Deny |
| FAM-03 | Revoked/expired guardian relationship is used | Deny |
| FAM-04 | Guardian has multiple linked children and requests one child | Return only that child's authorized records |
| API-01 | Caller invokes route handler/server action directly, bypassing page UI | Same authorization checks apply |
| API-02 | Caller supplies forged role, teacher ID, guardian ID, or school ID | Ignore as authority; derive trusted scope server-side |
| DATA-01 | Search, report, count, export, or download spans unauthorized tenant data | Deny or return only authorized scope |
| DATA-02 | Cached response is requested by a different user/tenant | No cross-user or cross-tenant data reuse |
| FILE-01 | User guesses or reuses another user's file URL | Deny without valid resource authorization |
| AUDIT-01 | Denied cross-tenant or child-relationship access attempt | Privacy-conscious security event recorded |
| FAIL-01 | Identity/authorization service is unavailable | Fail closed; no demo or anonymous fallback |

For each test, retain the request setup, actor role and school fixture, expected outcome, actual status/result, and evidence. Use synthetic fixtures only in isolated test environments; never seed fabricated records into production.

## 10. Implementation sequence and gates

### Gate A — contract approval
- Review this document and settle unresolved policy questions.
- Confirm authoritative source for identity, teacher-school membership, teacher assignments, guardian relationships, and school ownership.
- Confirm role/action matrix and exceptional support-access policy.
- No code or schema changes required for this gate.

### Gate B — technical design
- Compare candidate identity/session and persistence approaches against the existing Next.js + TypeScript + React application and approved hosting path.
- Produce data-flow and trust-boundary diagrams.
- Define schema changes, migration/backfill, rollback, secrets handling, session lifecycle, and operational ownership.
- Define API/server-action boundaries and database tenant enforcement.
- Obtain owner approval before implementation.

### Gate C — isolated implementation
- Implement only on the rescue branch.
- Add server-side guards and data-access enforcement before wiring real data.
- Add negative security tests first, then positive role-scope tests.
- Keep demo/reference sources disconnected.
- Do not change `main`, Arena, or production deployment.

### Gate D — verification and release review
- CI build/type/lint plus automated authorization tests.
- Verify tenant and guardian relationship isolation with negative tests.
- Browser and mobile route checks, accessibility checks, session expiry/revocation tests.
- Independent review of sensitive-data flows and audit coverage.
- Owner reviews evidence and explicitly authorizes any merge or deployment.

## 11. Open decisions — do not guess

The following must be confirmed before Gate B can be finalized:
1. What is the authoritative identity/account source for Raven users today, if one already exists?
2. Where are school memberships and teacher-to-class/student assignments currently mastered?
3. Where is the guardian-to-student relationship mastered, and what verification status/source makes a link trusted?
4. Which school roles may approve grades, attendance corrections, behavior records, and family-facing publication?
5. What narrowly defined, audited support access (if any) may Platform administrators receive?
6. What retention and access rules apply to sensitive student documents and audit events?

If no authoritative source currently exists, record that as a gap. Do not invent identities or relationship records to make the UI appear operational.

## 12. Current disposition

**Design only — not implemented or security-certified.** The current Teacher and Family routes remain preview-only. No real student or guardian data may be connected until the approved identity, authorization, and tenant-enforcement design is implemented and the negative tests pass.

No authentication provider, database, migration, external integration, or new platform has been selected by this document. No Arena source, `main`, or live deployment was modified. No merge or deployment was performed.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
