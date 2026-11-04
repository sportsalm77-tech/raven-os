# Unified School Data Center — Functional & UI Contract
Date: 2026-11-04
Branch: `rescue/unified-arena-integration-2026-11-03`
Status: Owner-approved functional direction; implementation contract, not a claim of live backend readiness.

## 1. Mission and single source of truth
The Unified School Data Center (مركز البيانات المدرسية الموحد) is the central school-data entry, management, validation, processing, and distribution hub inside the Principal portal. A school enters each canonical record once. The center maintains its lifecycle and makes authorized, validated data available to the platform's consuming centers.

This is the operational backbone of the school workspace, not merely a document repository or a dashboard.

## 2. Explicit responsibility boundary (owner clarification, 2026-11-04)
### The center DOES
- Enter, view, validate, update, archive, and (where policy permits) delete school data.
- Manage school identity and organizational data; staff/teacher data; student and class data; assignments and tasks; operational source data; and structured school records.
- Accept uploads of existing files in Word, PDF, Excel, and PowerPoint formats.
- Validate uploaded files, record metadata, associate files with relevant records, and manage their lifecycle.
- Process data: normalize, validate required fields, detect duplicates/conflicts, resolve relationships, and prepare approved data for authorized consumers.
- Distribute authorized records/updates to the operational centers and track delivery outcomes.
- Expose truthful indicators derived from persisted records and processing/distribution events.

### The center DOES NOT
- Create, author, generate, compose, or export Word documents, PDFs, Excel workbooks, or PowerPoint presentations.
- Generate templates, letters, reports, evidence packages, or final printable outputs.
- Replace Raven Library.

### Raven Library owns file creation
مكتبة رافين is the later-stage document-generation and evidence-production workspace. It will consume authorized data from this center to create and issue files, reports, templates, and evidence. Uploaded source files may be catalogued here by reference, but the data center itself is upload-and-process only.

## 3. Functional modules
1. School profile and organization: school identity, academic year, stages, grades, classes, organizational structure.
2. Staff and teachers: personnel records, specialties, school membership, approved role/assignment relationships.
3. Students and class membership: student master records, class enrollment, effective dates, transfer/history references.
4. Assignments and tasks: assignment definitions, assignee, scope, due dates, status, completion metadata, related evidence references.
5. Operational source data: plans, programs, initiatives, committees, schedules, and structured inputs required by school centers. Domain workflows retain their approved permissions and lifecycle.
6. Uploaded files and attachments: Word, PDF, Excel, PowerPoint; metadata, validation, classification, relationships, versions, retention.
7. Data quality and review: completeness, validity, duplicates, conflicts, stale records, review queues.
8. Distribution and integration: authorized consumers, delivery status, retry/error queues, data freshness and reconciliation.

These are modules within the existing Principal portal center, not additional top-level centers.

## 4. Consumer centers
The data center is the canonical source for authorized data consumed by:
- Operational Plan / Decision Center
- Teacher Affairs
- Student Affairs
- School Health
- Class Operations and its existing sub-areas
- Attendance and behavior workflows where their canonical records and approval lifecycle are defined
- Other existing Principal portal centers and their approved subsections
- Raven Library, for data retrieval and future document/evidence generation

The final consumer registry must be reconciled against the actual approved navigation; do not invent or create an eighteenth/nineteenth center based on an unverified count. Consumers must not maintain competing master records. A consumer-initiated change must be submitted as a governed command to the central service.

## 5. Data lifecycle
- Capture: authorized entry or controlled import/upload.
- Validate: required fields, format, stable identity, duplicate detection, cross-record references, tenant ownership.
- Review/approval: follow the owner-approved role and domain-specific approval matrix; do not assume the principal approves every record type.
- Commit: persist the canonical record through the central service with an audit event.
- Distribute: publish only authorized fields/records to registered consumers.
- Reconcile: track consumer acknowledgements, failed deliveries, retries, and stale derived views.
- Correct/archive: preserve history, effective dates, and linked-record integrity. Soft-delete/archive by default; hard deletion requires an explicit retention/legal policy and dependency checks.

## 6. Truthful indicators
All values must be computed from real persisted records and processing events. No demo values or fabricated totals.
- Total canonical records by domain.
- Complete vs incomplete records, with completeness rules defined per domain.
- Invalid, duplicate, conflicting, or stale records.
- Active, archived, and soft-deleted records shown as separate states.
- Uploaded files by accepted type, validation state, and linked/unlinked status.
- Distribution succeeded, pending, failed, and retrying, per consumer.
- Last successful synchronization/processing time and data freshness.
- Tasks/assignments missing an owner or overdue, only where their authoritative records exist.

An unavailable data source must render an explicit unavailable/not-connected state, not zero. A zero is valid only after a successful query confirms zero records. A record is not complete merely because it was saved.

## 7. File intake and structured extraction policy
Accepted source types: DOC/DOCX, PDF, XLS/XLSX, PPT/PPTX. Uploading does not imply file generation. Excel is preferred for tables. Other formats may be partially parsed where supported; scanned-file OCR requires separate approval. Every extracted value must retain available source location and pass human review and authorized approval. No extraction result is auto-committed.
Before enabling upload, implement server-side authentication, tenant scoping, permission checks, file size/type validation, malware scanning or an approved scanning boundary, safe storage, access-controlled download, metadata/audit logging, retention, and upload tests. Validate actual file signatures, not only filename extensions or client MIME values. Spreadsheet processing must defend against formula injection and malformed workbooks. Do not expose public object URLs for school files.

## 8. Authorization and tenant boundaries
- Resolve actor identity and school tenant from a trusted server-side session; never trust client-supplied school_id, role labels, or route names.
- Enforce school_id scoping in every read, write, upload, download, search, import, and distribution operation.
- Define separate permissions for view, create, edit, import, approve, archive, delete, upload, download, and manage distribution.
- Apply least privilege and field-level restrictions for student, health, and other sensitive records.
- Record actor, tenant, operation, entity, timestamp, before/after or change reference, reason, and correlation ID in append-only audit history.
- Approval authority is domain-specific and remains subject to an explicit owner-approved matrix.

## 9. Service boundary (conceptual, not implemented endpoints)
- schoolProfileService
- staffDirectoryService
- studentRegistryService
- classMembershipService
- assignmentTaskService
- operationalDataService
- fileUploadAndMetadataService
- dataQualityService
- distributionOutboxService
- auditHistoryService

Every service must enforce server-side authorization, tenant scope, validation, and audit. Distribution should use an outbox/retry pattern or equivalent reliable delivery mechanism. Consumer read models are derived and refreshable, never authoritative.

## 10. UI requirements
- Arabic-first RTL with complete English localization.
- Overview dashboard with truthful indicators and explicit unavailable states.
- Searchable/filterable tables and record detail views; optional card presentation where useful.
- Create/edit/archive/delete actions appear only when real authorized services exist.
- Upload area lists accepted formats and validation/processing status; no document-creation controls.
- Record completeness and errors are actionable: identify missing/invalid fields and link to the record.
- Distribution monitor shows each consumer, last update, delivery state, failure reason, and retry status when implemented.
- No demo records, fake counts, simulated upload success, or decorative actions that claim persistence.

## 11. Delivery phases and acceptance gates
A. Safe UI and contract: module structure, empty/unavailable states, bilingual labels, truthful indicators.
B. Identity and tenant foundation: trusted sessions, role/resource permissions, tenant isolation.
C. Canonical data services: approved source domains, stable identifiers, validation, audit, lifecycle.
D. Secure upload pipeline: file validation, scanning, storage, metadata, download authorization.
E. Distribution: consumer registry, field-level contracts, reliable delivery, reconciliation.
F. Real indicators and acceptance: derive metrics from persisted data and prove them with automated tests.

No production student/staff data, real mutations, upload enablement, database migration, provider selection, merge, or deployment is authorized merely by this contract. Complete security and source approval gates first.

## 12. Owner-approved decisions captured
- One central School Data Center is the canonical school data source and primary data-entry hub.
- The center uploads existing Word/PDF/Excel/PowerPoint files only; it does not create documents.
- Raven Library owns later document creation, generation, reporting, and evidence production.
- Other centers consume data from the central source and do not create competing master data stores.


## 13. Boundary with the existing Assignments & Tasks Center
The Unified School Data Center is the canonical record owner and primary entry/maintenance authority for school assignments and tasks. The existing Principal Assignments & Tasks Center remains an operational workspace for authorized review, follow-up, progress monitoring, and task execution views. It must not create an independent assignment/task master store. If a permitted user initiates a change from that workspace, it submits a command to the central data service; the central service validates, authorizes, audits, and persists the change. The two screens therefore serve different purposes and do not duplicate data ownership.


## 14. Owner clarification — source paths (2026-11-04)
The center supports three governed source paths converging on one canonical workflow:

1. **File intake:** The principal may provide Excel, Word, PDF, and PowerPoint. Excel is preferred for tabular data. Word/PDF/PowerPoint content may be partially extracted where technically supported; retain source locations (sheet/cell, page, paragraph, or slide) where available. Scanned-document OCR is not assumed and requires explicit approval and supported tooling. Every extracted value must be reviewed, corrected, validated, and approved before commit.
2. **Noor and Madrasati:** These are intended external sources for student and teacher data, subject to official access discovery and authorization. This is a target capability, not evidence of live connectors or available APIs. Use only official authorized mechanisms. No scraping, password collection, control bypass, or unapproved browser automation. Preserve source identity, permitted external references, field provenance, sync history, and conflict decisions. Field availability and source precedence must be approved; never silently overwrite canonical values.
3. **Principal-managed records:** The principal enters and maintains school-owned records centrally, especially assignments, teams, committees, memberships, responsibilities, and effective dates. These link to canonical staff, classes, and academic years without duplicating master records.

All paths share tenant-scoped validation, review, approval, canonical commit, audit, and controlled distribution. The center does not generate documents; Raven Library owns document creation.
