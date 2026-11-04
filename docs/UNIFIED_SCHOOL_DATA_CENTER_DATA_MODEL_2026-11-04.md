# Unified School Data Center — Canonical Data Model & Relationships
Date: 2026-11-04
Branch: rescue/unified-arena-integration-2026-11-03
Status: Provider-neutral data-model contract for review. No database schema or live persistence is implemented by this document.

## 1. Modeling principles
1. The Unified School Data Center is the only canonical school-data entry and lifecycle authority.
2. Each entity has one stable identifier independent of display name, row number, class label, or academic year.
3. Every school-owned entity carries a tenant boundary resolved by trusted server identity; client-supplied tenant identifiers never establish access.
4. Do not duplicate master records in consuming centers. Consumers store references and derived read models only.
5. Preserve history for changes affecting school organization, membership, assignment, attendance, and accountability.
6. Distinguish master data, events, assignments, and uploaded source artifacts.
7. This model does not select a database, authentication provider, file-storage vendor, or external connector.

## 2. Canonical entity catalogue
### A. School and academic structure
| Entity | Purpose | Key relationships |
|---|---|---|
| School | Stable school identity and tenant root | Academic years, stages, classes, staff memberships, students |
| AcademicYear | School year and effective dates/status | School; class offerings, memberships, schedules |
| SchoolStage | Approved school stage/level | School; grade levels |
| GradeLevel | Grade definition within stage/year policy | School and stage |
| ClassGroup | Class/section offering in an academic year | School, AcademicYear; memberships, leader assignments, timetable slots |
| OrganizationalUnit | Department, committee, team, or school unit | School; may own tasks and operational records |

### B. People and school membership
| Entity | Purpose | Key relationships |
|---|---|---|
| Person | Minimal canonical person identity record | Staff or student profile; authentication remains separate |
| StaffProfile | Employment and professional attributes | Person and SchoolMembership |
| SchoolMembership | Active or historical membership in one school | Person, School, role/scope, effective dates |
| StudentProfile | Student master record and school attributes | Person and enrollment history |
| StudentEnrollment | Student membership in a school and academic year | Student, School, AcademicYear |
| ClassMembership | Time-bounded membership in a class | StudentEnrollment and ClassGroup; preserves transfers |
| GuardianRelationship | Verified guardian-to-student relationship | Guardian identity subject, StudentProfile, School |
| StaffAssignment | Time-bounded duty, class leadership, or organizational assignment | StaffProfile, OrganizationalUnit/ClassGroup, assignment type |

### C. Work and operational source records
| Entity | Purpose | Key relationships |
|---|---|---|
| Assignment | Formal school assignment/commission | Creator, owner/assignee, dates, status, source, tasks |
| Task | Specific actionable work item | Assignment (optional), assignee, due date, status, updates |
| TaskUpdate | Progress, response, or review event | Task, actor, timestamp; append-only history |
| OperationalPlan | Plan metadata and approved version reference | School, AcademicYear; objectives and initiatives |
| PlanObjective | Measurable objective | OperationalPlan; indicators and initiatives |
| Initiative | Program/activity/project supporting an objective | Plan or school operational domain |
| Committee | Committee identity and term | School; members and assignments |
| CommitteeMembership | Time-bounded committee role | Committee and StaffProfile |
| OperationalEvent | Domain event such as an approved activity or service record | Domain owner, actor, date, status, audit reference |

### D. Uploaded files and data processing
| Entity | Purpose | Key relationships |
|---|---|---|
| UploadedFile | Metadata for an existing uploaded source file | School, uploader, storage object, validation result |
| FileVersion | Immutable uploaded-file version | UploadedFile; checksum, size, type, upload time |
| FileLink | Typed association between uploaded file and canonical entity | UploadedFile and school/class/person/task/plan/etc. |
| ImportBatch | One controlled data-import attempt | Uploader, source file, mapping, validation summary, status |
| ImportRowResult | Per-row import validation/result | ImportBatch; affected canonical entity when committed |
| ValidationIssue | Structured error/warning and remediation | Entity or import row; severity and resolution |
| DistributionEvent | Publishing a canonical change to an approved consumer | Entity reference, consumer, version, status, attempts |
| AuditEvent | Append-only security and change history | Actor, tenant, action, entity, timestamp, reason, correlation ID |

## 3. Relationship rules
- School is the tenant root. Every school-owned record belongs to exactly one School.
- AcademicYear belongs to one School; class offerings and student enrollments are year-scoped.
- ClassGroup references StudentEnrollment/ClassMembership and StaffAssignment; it does not copy student or teacher master records.
- StaffProfile is not a login account. Authentication and authorization are separate.
- StudentProfile is not a Family login. GuardianRelationship is the only approved bridge to a specific student's permitted data.
- Class leader, subject teacher, substitute teacher, and general staff membership are distinct assignment types with effective dates.
- Assignment and Task are distinct: an assignment may contain multiple tasks; a task may be standalone under an approved rule.
- UploadedFile represents an existing source file, not a generated Raven Library document.
- A file may link to multiple records only through explicit permission-checked FileLink records.
- DistributionEvent references canonical IDs and versions; it is not a second copy of canonical data.
- AuditEvent is append-only; corrections are new events, not silent edits to audit history.

## 4. Identifiers and common metadata
Every canonical entity should have: immutable opaque id; server-validated school_id where school-owned; created_at/created_by; updated_at/updated_by where mutable; domain-appropriate record_status; effective_from/effective_to for time-bounded relationships; version/concurrency token; source_kind/source_reference for imports; and audit/correlation reference.
Do not use national identifiers, names, or UI row numbers as primary keys. Minimize sensitive identity attributes and protect them with field-level permissions.

## 5. Domain-specific lifecycle
### School profile
Draft -> validation -> review/approval under the approved authority matrix -> active -> amended/versioned -> archived when appropriate.
### Staff and student records
Draft/imported -> validation -> review -> active membership/enrollment -> time-bounded changes/transfers -> inactive/archived. Ending class membership does not delete the student master record. Staff departure ends membership/assignments without erasing historical references.
### Classes and assignments
Proposed -> validated -> approved/active -> amended with history -> closed/archived. Leader and teacher assignments require effective dates.
### Tasks and commissions
Draft -> assigned -> acknowledged if required -> in progress -> submitted for review -> accepted or returned -> closed/cancelled. Overdue is derived from due date and terminal status.
### Uploaded files
Upload initiated -> security/type validation -> scan -> metadata/classification -> linked/unlinked -> available/rejected/quarantined -> superseded/archived under retention policy. Do not expose content before validation and access checks.
### Import batches
Prepared -> mapped -> validated -> previewed -> approved -> committed -> distributed, or rejected/partially rejected. No silent partial commit.
### Distribution
Pending -> delivered/acknowledged, or retrying -> failed/quarantined. Consumer failure must not corrupt canonical records; retries must be idempotent.

## 6. Data quality definitions
- Complete: required fields and relationships for that entity type are present and valid.
- Incomplete: at least one required field/relationship is missing.
- Invalid: values fail format, range, domain, or policy validation.
- Duplicate candidate: identity/business-key similarity requiring review; never automatically merge people.
- Conflict: submitted changes cannot both be accepted under ownership/effective-date rules.
- Stale: derived consumer view has not acknowledged the latest canonical version within the defined service target.
- Archived: intentionally retained but not operationally active.
- Soft-deleted: removed from normal views but retained for authorized recovery/audit subject to retention policy.
Completeness and freshness thresholds must be configured per domain. Do not calculate an opaque quality score until its formula and weighting are documented.

## 7. Data import requirements
- Excel/CSV import requires explicit column-mapping preview and per-row validation.
- Never infer identity from row order.
- Detect duplicates before commit; present candidates for human resolution.
- Require explicit confirmation of exact records to create/update.
- Preserve import batch, source checksum, uploader, mapping version, validation and commit result.
- Do not overwrite canonical records on fuzzy match.
- Import is tenant-scoped and server-permission-checked.

## 8. Owner decisions still required (do not assume)
1. Which domains require principal approval, and which may be approved by delegated roles?
2. Which fields are editable by principal, vice principal, specialists, or data-entry operators?
3. Is student/staff import allowed from official exports, and what source precedence applies when records conflict?
4. Which domains are maintained directly in Raven versus synchronized from an approved external source?
5. Retention and hard-delete rules for student, staff, health, attendance, behavior, and uploaded files.
6. Should the existing School Information Center route remain the single UI entry (recommended to preserve navigation) while its display name changes to Unified School Data Center?

## 9. Non-goals and safety gates
This document does not create a database/migration; choose auth/database/storage providers; connect Noor, Madrasati, Hudori, or external systems; enable real upload/import/edit/delete/distribution; authorize real student/staff data; create a new top-level Principal center; change approved portal counts; merge to main; or deploy.
Before live operations, implement trusted identity, tenant isolation, resource-level permissions, append-only audit, secure file storage/scanning, backup/recovery, and automated negative security tests.