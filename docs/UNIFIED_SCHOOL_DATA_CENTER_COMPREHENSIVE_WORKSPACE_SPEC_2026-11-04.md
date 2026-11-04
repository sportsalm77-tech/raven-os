# Unified School Data Center — Comprehensive Workspace Specification
Date: 2026-11-04  
Status: Rescue-branch UI and functional specification; production services are not connected.

## 1. Product role
The Unified School Data Center is the sole canonical school-data source and primary data-entry center. It is a single workspace with eight functional domains, not eight independent centers or databases:
1. School profile and academic structure.
2. Staff and teacher records.
3. Student profiles, enrollment, and class membership.
4. Assignments and tasks.
5. Operational source data (plans, programs, initiatives, committees).
6. Existing-file uploads and attachments.
7. Data quality review and remediation.
8. Controlled distribution and integration.

Raven Library owns creation and issuance of generated documents. The Data Center may upload existing Word, PDF, Excel, and PowerPoint files, maintain their metadata, and link them to canonical records; it must not generate those documents.

## 2. Workspace information architecture
### Header and context
- Center title and purpose.
- Trusted school context supplied by the authenticated server session; no editable school selector in a school-scoped user workflow.
- Active academic year context; switching year changes the data scope but does not mutate records.
- Arabic RTL default and complete English LTR translation.
- Clear unavailable/offline states; no fabricated statistics, sample batches, or placeholder school records.

### Overview
- Data-health indicators computed only from canonical records and versioned processing events.
- Indicators include completeness, validation failures, unresolved duplicates/conflicts, stale records, import status, and distribution health.
- Each indicator links to its filtered work queue when backend services are available.
- Missing data source is “Unavailable”, never represented as zero.

### Domain navigation
- Eight modules are accessible through a single tab/card navigation.
- Selecting a module changes the detail workspace without creating a new route or duplicate center.
- Each module exposes purpose, canonical fields, validation rules, lifecycle, and authorized operations.
- School, staff, and student screens retain their detailed field specifications.
- Task and operational records reference canonical people/classes and cannot duplicate master identities.

## 3. Common record workspace
Every domain should converge on a consistent table/detail pattern:
- Search within authorized tenant and domain only.
- Filters for academic year, stage/grade/class, status, source, and verification state where relevant.
- Sort and pagination are server-side for production datasets.
- Columns are role-aware and minimum-necessary.
- Record detail shows canonical identity, relationships, source/provenance, lifecycle, and permitted actions.
- Create/edit/archive operations use explicit forms with field-level validation, dirty-state protection, and confirmation for consequential changes.
- No hard deletion by default; archive/close/withdraw preserves history.
- Every write goes through a canonical service and emits an audit event.
- Empty, loading, unavailable, permission-denied, stale, and error states are distinct.

## 4. Domain responsibilities
### School profile
Official identity, approved authority references, academic years, stages, grades, and classes. Academic structure changes are versioned/effective-dated; class archive preserves memberships and historical records.

### Staff
One person master profile; school membership, role/duty, teaching assignment, committee membership, and effective dates are separate relationships. A staff member may have more than one duty without duplicate person records.

### Students
One canonical student profile; enrollment, class membership, movement/transfer, and guardian relationship are separate effective-dated records. Transfers close previous membership and open a new one without erasing history. Family access requires a verified active guardian relationship and server authorization on every request.

### Assignments and tasks
The Data Center owns canonical task/assignment records. The existing Assignments & Tasks Center is an operational view and command surface; it must not create independent master records. Assignee and related class/committee references must be valid for the same tenant and effective period.

### Operational data
Plans, programs, initiatives, committees, and procedures link to canonical staff, tasks, classes, and evidence. Their detailed fields and approval workflows must be specified before writes are activated.

### Files and attachments
Allowed existing-file types: DOC/DOCX, PDF, XLS/XLSX, PPT/PPTX. Capture filename, actual detected MIME/type, size, uploader, timestamps, academic year, category, linked module/entity, scan state, version, and archive state. Validate actual file signature; quarantine and scan; store securely; enforce tenant-scoped short-lived downloads. This is upload-only; document generation belongs to Raven Library.

## 5. Import, validation, and batch history
- File intake supports XLS/XLSX, DOC/DOCX, PDF, and PPT/PPTX. Excel is preferred for tables; Word/PDF/PowerPoint may be partially extracted where supported and must be reviewed with source references. OCR for scanned files requires separate approval.
- Noor and Madrasati are intended external sources for authorized student and teacher imports; connector status remains Not connected until an official access route is verified and implemented.
- The principal manages assignments, teams, committees, memberships, and responsibilities centrally.
- One domain per batch in initial release.
- Pipeline: authorization -> quarantine -> scan -> parse -> inspect -> map -> normalize -> validate -> match -> review -> preview -> approve -> commit -> distribute -> reconcile -> close.
- Preview is side-effect-free.
- Stable approved identifiers only; names/fuzzy matches are candidate signals, never automatic identity proof.
- No auto-merge or silent overwrite.
- Every row has an explicit outcome and exact planned changes.
- Commit uses idempotency and concurrency checks; partial commit is forbidden unless separately approved.
- Canonical commit and downstream distribution are distinct outcomes.
- Batch ledger preserves file checksum, parser/mapping/rule versions, actor/reviewer, stage times, row outcomes, approval, commit, and distribution.

## 6. Data quality and issue management
Finding categories:
- Missing required fields/reference values.
- Invalid formats or domain values.
- Broken or cross-tenant relationships.
- Duplicate candidates.
- Conflicting source values.
- Stale records and expired memberships.
- Failed consumer delivery or stale projections.

Finding lifecycle:
Detected -> classified by severity -> assigned to authorized reviewer -> correction proposed -> corrected through canonical service -> revalidated -> closed with audit or escalated.

A quality issue is not itself permission to edit the affected record. The reviewer must hold the required domain permission. Duplicate resolution requires explicit human decision and audit.

## 7. Distribution and integration
- Canonical records emit versioned events only after successful commit.
- Consumers receive minimum necessary data based on their purpose and role.
- Initial consumers: Class Operations, Student Affairs, Attendance, School Health, Teacher portal, Family portal, and Raven Library.
- Teacher projections are constrained by valid teaching assignments.
- Family projections are constrained by verified guardian relationships.
- Consumer views are derived, refreshable, and never authoritative.
- Track delivery acknowledgement, version, retry, failure, and staleness.
- Distribution failure must not misrepresent a successful canonical commit.

## 8. Security and governance
- Identity, role, and school tenant are resolved server-side.
- Enforce resource-level and field-level authorization for every read and write.
- Separate view, create, edit, archive, import-initiate, map, review, sensitive-preview, duplicate-resolution, approve, commit, retry, export, and configuration permissions.
- No trust in client props, hidden navigation, route names, or user-supplied tenant IDs.
- Audit every privileged read/write/approval/export, with actor, tenant, entity, operation, timestamp, request/correlation ID, safe before/after diff, reason, and outcome.
- Sensitive student, guardian, and health fields require explicit purpose, approval, minimum-necessary access, retention, and redaction.
- Retention, correction, legal hold, and deletion policies require owner/legal approval.
- Backup, restore, recovery, and incident response must be tested before production.

## 9. Responsive and accessibility requirements
- Arabic RTL and English LTR across all controls, tables, dialogs, empty states, and validation messages.
- Mobile-first layout with no horizontal page overflow; wide data tables use contained horizontal scroll or responsive record cards.
- Keyboard-operable tabs, filters, tables, dialogs, and actions; visible focus states and accessible names.
- Reduced-motion support, sufficient contrast, and semantic headings/landmarks.
- Loading and error feedback must be truthful and not imply a save or upload succeeded before the server confirms it.

## 10. Delivery sequence
### UI foundation (safe in rescue branch)
1. Unified overview and eight-module navigation.
2. Detailed school, staff, student field specifications.
3. Import workflow and batch lifecycle.
4. Quality review and remediation workspace.
5. Attachment metadata and upload boundary.
6. Consumer distribution and audit/governance panels.
7. Responsive/accessibility review and automated tests.

### Backend activation (requires explicit owner approvals)
1. Confirm authoritative sources and field dictionaries.
2. Approve identity, tenant, and role/field permission matrix.
3. Approve import authority, batch semantics, and retention.
4. Select provider architecture only after source and requirements discovery; no provider is selected here.
5. Implement canonical services, secure file storage/scanning, audit, event delivery, and backups.
6. Run security, tenant-isolation, import, lifecycle, and accessibility tests.
7. Pilot with synthetic/non-sensitive data; production data only after sign-off.

## 11. Acceptance checklist
- One authoritative source; no duplicate master data stores.
- All eight modules navigate within the same center.
- School, staff, student field specifications are visible and bilingual.
- Import is preview-first, domain-scoped, idempotent, and audited.
- Quality findings have a defined lifecycle and do not auto-edit data.
- Attachment uploads are quarantined, scanned, tenant-scoped, and metadata-linked.
- Consumer projections are role-filtered and derived.
- All indicators derive from real persisted events.
- No fake records, counts, successful uploads, or completed integrations.
- Server-side identity, tenant, resource, and field authorization pass tests.
- Arabic/English, RTL/LTR, mobile/tablet, keyboard, and reduced-motion tests pass.

## 12. Explicit non-goals in this phase
No auth provider, database provider, migrations, real file upload, real import, live integrations, student/staff production data, production deployment, main-branch merge, or enabling writes is authorized by this specification.


## 13. Source-path interaction model
**A. Files:** Accept Excel, Word, PDF, and PowerPoint. Explain Excel is preferred for structured tables. Show extracted fields with source references for correction and review. Do not promise perfect extraction; OCR remains unavailable until separately approved. Do not enable a file picker until secure upload, scanning, storage, and tenant authorization exist.

**B. Noor / Madrasati:** Show separate connector states as “Not connected” until official access and a real server connector are verified. Intended scope is permitted student and teacher data only. No fake connect/sync actions, credential fields, or timestamps. Discovery must record official mechanism, permission model, available fields, source terms, limits, pagination, retries, and conflict policy.

**C. Principal entry:** Provide governed entry for assignments, teams, committees, memberships, responsibilities, and effective dates after identity, authorization, and canonical services exist. Link existing staff/classes; do not duplicate them.

All three paths use the same tenant-scoped validation, review, approval, canonical commit, audit, and distribution services.
