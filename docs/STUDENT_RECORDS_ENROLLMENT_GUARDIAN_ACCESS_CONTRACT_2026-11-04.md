# Student Records, Enrollment, Class Membership & Guardian Link Contract
**Date:** 2026-11-04  
**Status:** Functional and security contract; not production authorization  
**Branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Governing decision and scope
The Unified School Data Center remains the single authoritative school-data source and primary data-entry center. This contract defines its student domain. It does not create a new top-level center.

One canonical student identity is separated from:
- Enrollment in a school and academic year.
- Effective-dated membership in a class.
- Student movement/transfer events.
- Guardian-to-student relationships.
- Attendance, behavior, health, and learning events, which remain governed by their respective domain workflows and must reference the canonical student ID.

The Class Operations Center, Student Affairs, Attendance, School Health, Teacher portal, and Family portal consume permission-filtered records or submit governed commands. They must not create competing student master records.

## 2. Canonical student profile

### Minimum initial fields
- Internal immutable student ID (server-generated).
- Official Arabic display name.
- English display name only when needed by enabled locale/workflow.
- Official student number only after its authoritative source and uniqueness scope are approved.
- Provenance: source system/import batch/manual entry, creator, timestamps, verification state.
- Lifecycle status.

### Explicitly excluded until approved
National ID, medical diagnosis, detailed health information, disability/special-needs details, guardian phone/email, home address, photographs, and other sensitive attributes. Each requires a documented purpose, lawful basis, field-level role access, retention, and security approval before collection.

### Duplicate prevention
- Match against approved stable identifiers where available.
- Name similarity is a duplicate candidate signal only, not an identity key.
- Never merge automatically.
- Human resolution must show safe comparison fields, preserve source records, record the reviewer and decision, and be reversible/auditable where policy permits.
- Never use spreadsheet row order as identity.

## 3. Enrollment lifecycle
Proposed states (final vocabulary requires owner confirmation):
1. Pending review
2. Active
3. Transferred
4. Withdrawn
5. Completed
6. Archived

Transitions must be explicit, permission-checked, and audited. A status label is not a substitute for the underlying enrollment event. Re-enrollment creates a new enrollment period linked to the same canonical student identity; it does not overwrite the old period.

Required relationships: student, school (server-resolved tenant), academic year, stage, grade, effective start date, status, provenance. End date is required when the period closes.

## 4. Class membership lifecycle
A class membership is a separate record:
- Student ID
- Class ID
- Academic year
- Effective start date
- Optional effective end date
- Status and provenance

Rules:
- Class, grade, academic year, and school must be mutually consistent.
- Prevent overlapping active memberships where the approved school policy disallows them.
- Transfer closes the previous membership and creates a new membership; historical membership remains queryable.
- The roster shown in Class Operations is a derived view of canonical active memberships.
- Removing a student from a current roster must not delete the canonical student or historic membership.

## 5. Student movement / transfer workflow
Proposed sequence:
1. Authorized user starts a movement request.
2. Select movement type (internal class transfer, school transfer, withdrawal, return/re-enrollment) from approved values.
3. Resolve current enrollment and membership from canonical records.
4. Capture effective date and minimum necessary reason/document reference.
5. Validate target school/class/year and any policy prerequisites.
6. Route for approval only where an owner-approved approval matrix requires it.
7. On authorized commit, close prior effective relationship and create the new relationship atomically.
8. Emit immutable audit event and refresh authorized read models.
9. If downstream distribution fails, canonical transaction remains valid; retry is idempotent and visible.

No approver role is assumed in this contract. The user must approve the role matrix before live movement operations.

## 6. Guardian relationship and Family portal access
Guardian relationship is a separate, revocable, effective-dated record:
- Guardian person reference.
- Student reference.
- Relationship type.
- Verification state and verification provenance.
- Effective start/end dates.
- Created/updated/audit metadata.

Rules:
- A guardian's access is never inferred from matching names, shared phone numbers, or possession of a link.
- Family portal access requires a verified active relationship and a fresh server-side authorization check for every student resource request.
- Revocation must block subsequent requests and invalidate relevant cached access promptly.
- One guardian may have multiple students; one student may have multiple verified guardians where policy permits.
- Family users see only approved fields and permitted actions; no broad student search or school roster.
- Guardian identity/contact collection and verification methods require privacy/legal and owner approval.

## 7. Import and reconciliation
Supported source types are governed by the existing upload contract; the student import pipeline is:
1. Upload existing approved spreadsheet/document through secure attachment service.
2. Verify actual file signature, scan, and store in quarantine.
3. Parse into a staged import batch.
4. Preview detected sheets, rows, and columns.
5. Map columns to approved fields; explicitly mark ignored columns.
6. Validate required values, reference integrity, date consistency, and duplicates.
7. Produce per-row result: ready, incomplete, invalid, duplicate candidate, conflict.
8. Resolve conflicts and duplicate candidates through authorized human review.
9. Preview exact creates/updates and preserve original values.
10. Authorized commit as an atomic or explicitly partitioned batch with idempotency key.
11. Record batch outcome, rejected rows, source checksum, mapping version, actor, timestamps, and audit.
12. Reconcile downstream consumers; never silently overwrite or partially commit without reporting.

Import must not accept sensitive columns not approved for the target data purpose. A rejected or failed batch remains available for authorized review under retention policy.

## 8. Cross-center data contracts

| Consumer | Permitted purpose | Boundary |
|---|---|---|
| Class Operations | Current roster, class membership, class movement requests | No independent student master or roster writes |
| Student Affairs | Authorized enrollment and movement workflows | Sensitive fields restricted; governed commands |
| Attendance | Resolve active student/class membership for attendance events | Attendance event lifecycle remains in its own contract |
| School Health | Resolve student reference for authorized health workflow | Health data remains separately protected; no broad student-health feed |
| Teacher portal | Assigned classes and permitted student list | Assignment-scoped access only |
| Family portal | Verified linked students and approved summary/actions | Relationship-scoped access on every request |
| Raven Library | Authorized student-related document generation from approved fields | Library generates documents; data center does not create documents |

All projections must be minimum-necessary, versioned, tenant-scoped, and permission-filtered. Consumer caches are derived and refreshable, never authoritative.

## 9. Authorization requirements
- Resolve actor identity and school tenant on the server.
- Verify school membership and active role.
- Enforce resource-level permission for student, enrollment, membership, movement, and guardian relationship separately.
- Enforce field-level restrictions for sensitive attributes.
- Teacher access is constrained by current valid teaching assignment and relevant class/time scope.
- Family access is constrained by verified guardian link and approved resource fields.
- Platform support access, if ever allowed, must be explicitly scoped, time-bound, justified, and audited.
- Never rely on hidden navigation, client props, route names, or user-supplied IDs as authorization.

## 10. Audit, retention, and privacy
Audit at minimum: create/update/archive, enrollment transition, class membership transition, transfer request/approval/commit/rejection, guardian-link verify/revoke, import preview/commit/reject, access denial, and privileged read of sensitive fields where policy requires.

Audit records include actor/service, tenant, entity reference, action, timestamp, correlation/request ID, before/after safe diff, source, and outcome. Never log credentials or unnecessary sensitive values.

Retention and permanent deletion must follow owner-approved and legally reviewed policy. Legal hold and linked-record dependencies must be checked before deletion. Default UI action should be archive/withdraw/close rather than hard delete.

## 11. Acceptance test matrix
1. A client cannot read or change another school's student by changing an ID.
2. A teacher cannot access a student outside their current authorized teaching assignment.
3. A guardian cannot access a student without a verified active guardian link.
4. Revoking a guardian link blocks the next request and invalidates relevant cache access.
5. A principal cannot bypass a required approval transition.
6. Enrollment dates and status transitions reject invalid chronology.
7. A class membership cannot reference a class from another school/year/grade.
8. Disallowed overlapping active memberships are rejected.
9. Transfer preserves previous membership and creates the next one atomically.
10. Re-enrollment reuses canonical student identity and creates a new enrollment period.
11. Duplicate candidates are flagged; no automatic merge occurs.
12. Import mapping preview does not mutate canonical records.
13. A partially invalid import reports exact row outcomes and commits only under explicit approved batch semantics.
14. Replaying an import commit with the same idempotency key does not duplicate records.
15. Unapproved sensitive spreadsheet columns are rejected/ignored according to policy and never silently stored.
16. Family responses omit fields outside the approved projection.
17. Student master changes are visible in authorized consumers after controlled refresh; stale state is disclosed.
18. Archive/withdraw does not erase historic attendance, behavior, evidence, or audit references.
19. Every privileged transition emits an auditable event.
20. Arabic RTL, English LTR, keyboard accessibility, and responsive layouts pass.

## 12. Owner decisions required
1. Confirm authoritative student identifier/source and its uniqueness scope.
2. Confirm permitted student import sources and precedence when sources conflict.
3. Confirm roles allowed to create/update/archive student profiles and enrollments.
4. Confirm who approves internal transfers, external transfers, withdrawal, and re-enrollment.
5. Confirm who may change class membership and whether overlap exceptions are allowed.
6. Confirm guardian verification method, permitted relationship types, and revocation authority.
7. Confirm the exact fields visible to principal, teacher, student-affairs roles, and guardian.
8. Approve retention, correction, and permanent-deletion rules.
9. Confirm whether the system may support multi-school student movement and what platform authorization applies.

## 13. Activation gate
This contract does not enable live student records, import, transfers, guardian access, or database writes. Activation requires approved identity/data sources, backend services, tenant isolation, role/field authorization, audit, privacy/retention rules, backup/recovery, and passing the acceptance tests above.
