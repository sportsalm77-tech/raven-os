# Unified School Data Center — Data Entry Field Dictionary
**Date:** 2026-11-04  
**Status:** Engineering proposal for review; not a production schema or authorization grant  
**Branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Purpose and binding boundaries

This dictionary turns the approved Unified School Data Center concept into a field-level implementation plan. It is subordinate to:
- `UNIFIED_SCHOOL_DATA_CENTER_CONTRACT_2026-11-04.md`
- `UNIFIED_SCHOOL_DATA_CENTER_DATA_MODEL_2026-11-04.md`
- `IDENTITY_AUTHORIZATION_TENANT_ISOLATION_CONTRACT_2026-11-04.md`

**Owner-approved:** the Unified School Data Center is the single authoritative school-data source and primary data-entry center.  
**Owner-approved:** the center uploads existing Word, PDF, Excel, and PowerPoint files; document creation/export belongs to Raven Library.  
**Existing-center boundary:** Assignments & Tasks is an operational view/command entry point, not a competing master-record store.

This document does not select an identity provider, database, file-storage vendor, integration provider, or approval authority. Field lists below are proposed functional requirements, not permission to collect every field or expose it to every role.

## 2. Global rules applied to every module

1. Every persisted school-owned record is scoped to a trusted server-resolved `school_id`; never accept tenant scope from an untrusted client field.
2. Use stable internal identifiers. Human-readable codes are unique within the relevant school and academic-year scope where applicable.
3. Preserve provenance: source, creator, created/updated timestamps, and change/audit events. Do not overwrite history where a version or event record is required.
4. Distinguish missing, not applicable, pending verification, invalid, archived, and unavailable. Never represent unavailable data as zero or as a valid empty result.
5. Do not collect national IDs, health details, guardian contact details, or other sensitive data unless a documented purpose, lawful basis, minimum access scope, retention rule, and security control are approved.
6. Soft archive/deactivation is the default proposed lifecycle for linked operational records. Permanent deletion requires an explicit retention/legal policy and dependency check.
7. All validation and authorization must be repeated server-side. Client validation is usability only.
8. Bulk import is a staged workflow: upload → signature/type verification → malware scan → parse → preview → field mapping → validation report → authorized commit → audit. No partial silent writes.
9. Cross-center consumers receive permission-filtered read models or governed commands; they do not maintain independent master copies.
10. No real student or staff records are to be inserted in the rescue branch.

## 3. Module A — School profile and academic structure

### A1. School identity
| Field | Requirement | Validation / notes |
|---|---|---|
| School display name (Arabic) | Required | Trimmed; no duplicate active school identity within platform governance scope |
| School display name (English) | Conditional | Required only when English locale/content is enabled |
| Official school code | Required | Unique; format and issuing authority to be confirmed |
| School type / stage scope | Required | Controlled reference values; owner/admin governance |
| Education administration / region | Conditional | Controlled reference data; avoid free-text duplicates |
| Address / contact channels | Conditional | Collect only fields needed for school operations |
| Official logo | Optional | Secure image upload policy separate from office-document upload allowlist |
| Record status | System-managed | Active, suspended, archived; transitions audited |

### A2. Academic year
| Field | Requirement | Validation / notes |
|---|---|---|
| Academic-year label | Required | Unique within school |
| Start / end dates | Required | Start precedes end; calendar policy configurable |
| Current-year flag | System-governed | At most one current academic year per school |
| Lifecycle status | System-managed | Draft, active, closed, archived; close operation must preserve history |

### A3. Stages, grades, classes
| Field | Requirement | Validation / notes |
|---|---|---|
| Stage | Required | Controlled list appropriate to school |
| Grade | Required | Must belong to a valid stage |
| Class name/code | Required | Unique within school + academic year + grade scope |
| Capacity | Optional | Non-negative integer; policy-controlled |
| Class status | Required | Active / inactive / archived |
| Class leader | Conditional relationship | Must reference an active staff membership with eligible role; no free-text person |
| Academic year | Required | Must be valid for school |

## 4. Module B — Teachers and staff

### B1. Person identity (minimum necessary)
| Field | Requirement | Validation / notes |
|---|---|---|
| Internal person ID | System-generated | Immutable |
| Display name | Required | Arabic; English optional |
| Staff number | Conditional | Unique within school if supplied; source authority to be confirmed |
| Work email / phone | Conditional | Verify format; visibility restricted |
| Employment / affiliation status | Required | Controlled lifecycle; do not infer from login status |
| Job title / role | Required | Controlled catalog where possible |
| Specialty / subject | Conditional | Controlled catalog; multiple assignments supported |
| Membership start/end | Required for membership | End after start; preserve historical membership |
| Source / verification state | System-managed | Imported, manually entered, verified, needs review |

### B2. Staff-school and staff-duty relationships
- A person may have multiple historical school memberships, but access to each school must be separately authorized.
- A class leader, teacher assignment, committee membership, and task assignee are relationships with effective dates, not duplicated person records.
- Timetable teaching assignments must reference the canonical staff member, class, subject, period, and effective academic-year scope.
- Substitute/cover teacher assignment must retain the absent teacher link, substitute link, date/period, authorizing actor, and audit event.
- Do not expose personal contact fields to all staff by default.

## 5. Module C — Students and class memberships

### C1. Student master record
| Field | Requirement | Validation / notes |
|---|---|---|
| Internal student ID | System-generated | Immutable; tenant-scoped |
| Student display name | Required | Source and spelling verification recorded |
| Official student number | Conditional | Unique within defined authority/school scope; sensitive identifier policy required |
| Academic year | Required for active enrollment | Must be valid for school |
| Stage / grade | Required for active enrollment | Consistent with class |
| Enrollment status | Required | Pending, active, transferred, withdrawn, completed; controlled transitions |
| Source / verification state | System-managed | Import/manual/source verified |

### C2. Class membership
- Required relationship: student + class + academic year + effective start date.
- Optional end date; when present it must follow the start date.
- Prevent overlapping active memberships where school policy disallows them.
- Transfers create a new membership event and close the prior membership; do not rewrite the historical class.
- Class roster is a derived view from canonical student and membership records.

### C3. Guardian relationship
- Store relationship as a separately permissioned link, not a text field on the student.
- Minimum fields: guardian person/contact reference, student reference, relationship type, verification status, effective dates, source.
- Guardian portal access requires a verified relationship plus server-side authorization on every request.
- Exact guardian identity fields, verification workflow, and contact visibility remain subject to privacy/legal review.

## 6. Module D — Assignments and tasks

### D1. Canonical task record
| Field | Requirement | Validation / notes |
|---|---|---|
| Task ID | System-generated | Immutable |
| Title | Required | Length and safe-text validation |
| Description | Optional | Plain text/rich text policy to be defined |
| Category | Required | Controlled taxonomy |
| Academic year | Required where school-scoped | Must belong to same school |
| Owner / responsible person | Required | Active staff membership in same tenant |
| Assigned participants | Optional | Explicit relationship records; no broad implicit access |
| Start date / due date | Conditional | Due date cannot precede start date |
| Priority | Optional | Controlled values |
| Status | System-managed | Draft, assigned, in progress, submitted, reviewed, closed, cancelled |
| Evidence links | Optional | Reference uploaded files; no duplicate file blobs |
| Source module | System-managed | Identifies initiating center/command |
| Review / approval state | Policy-dependent | Approver and transitions not assumed |

### D2. Interaction with Assignments & Tasks Center
- The existing center may display authorized tasks, filter them, and initiate a governed create/update/complete command.
- The central data service validates actor, school scope, task ownership, permitted transition, and referenced entities.
- Only the central service persists the canonical task record and audit event.
- The operational center must not create its own independent task database or report conflicting totals.

## 7. Module E — Operational data

Proposed record families:
- Plans and plan items
- Programs and initiatives
- Committees and memberships
- Procedures and action items
- School calendar / operational events

Common fields: internal ID, school, academic year, title/name, category, description, owner, participants, effective dates, status, linked tasks, linked source files, provenance, audit metadata.

Specific rules:
- Plans, initiatives, and committees must link to canonical staff memberships.
- Action items may reference a canonical task; avoid duplicating task status.
- Operational indicators must derive from dated, persisted records and documented calculation rules.
- Approval roles and approval sequences remain undecided until the owner confirms the governance matrix.

## 8. Module F — Existing-file uploads and attachments

### F1. Allowed office-document formats
- Word: `.doc`, `.docx`
- PDF: `.pdf`
- Excel: `.xls`, `.xlsx`
- PowerPoint: `.ppt`, `.pptx`

Extension and browser MIME type are not trusted. The server must inspect file signatures and reject mismatches, malformed files, macro-enabled formats not explicitly approved, executable content, and files that fail the approved malware-scanning boundary.

### F2. Attachment metadata
| Field | Requirement | Validation / notes |
|---|---|---|
| File ID | System-generated | Immutable |
| Original filename | Required | Normalize display; preserve safe original metadata |
| Detected media type / extension | System-generated | Based on server inspection |
| Size in bytes | System-generated | Enforce approved limit |
| Storage object reference | System-only | Never expose raw storage credentials/path |
| Uploaded by | System-generated | Trusted actor ID |
| Uploaded at | System-generated | Server timestamp |
| Academic year | Conditional | Must match school scope |
| Related entity type + ID | Conditional | Must reference an authorized record in same tenant |
| Document category | Required | Controlled list |
| Scan / validation status | System-managed | Pending, clean, rejected, error |
| Version / supersedes link | Conditional | Immutable version chain |
| Retention / archive state | System-managed | Policy-governed |

### F3. Upload security and user experience
- Upload is disabled until identity, server authorization, secure storage, malware scanning, metadata/audit, and safe-download controls exist.
- Enforce per-file and per-school quotas only after an owner-approved limit is set.
- Downloads require fresh authorization and tenant checks; obscure URLs are not authorization.
- The center uploads existing documents only. Raven Library owns document generation, templates, exports, and final issued documents.
- Bulk imports and ordinary attachments should be distinguishable in metadata and lifecycle.

## 9. Module G — Data quality and review

Each quality finding should carry:
- Finding ID, school, entity type/ID, rule ID/version, severity, detected timestamp, status.
- Field path and a safe explanation; avoid leaking sensitive values in broad dashboards.
- Proposed resolution, assigned reviewer if configured, resolution timestamp, and audit link.

Quality states: valid, incomplete, invalid, conflicting, duplicate-suspected, stale, pending-verification, not-applicable. A rule must define its scope, severity, and remediation before it contributes to an indicator. A suspected duplicate should not be auto-merged without an approved matching and review policy.

## 10. Module H — Distribution and integration

Track each governed delivery with:
- Delivery ID, school, source record/version, consumer, permitted data contract/version.
- Requested and authorized scopes, actor/service identity, requested/delivered timestamps.
- Outcome: queued, delivered, partially delivered, failed, rejected, stale.
- Retry count and safe error category; no secrets in logs.
- Consumer acknowledgement/version where supported.

Distribution is not a blanket data copy. Each consumer receives the minimum authorized projection. Integrations with external school systems require separately approved connector credentials, mapping, consent/legal basis where applicable, retry behavior, reconciliation, and audit.

## 11. Proposed screen sequence (implementation order)

1. **School profile** — school identity, academic year, stages, grades, classes.
2. **Staff directory** — staff master records and school memberships.
3. **Students & enrollment** — student master records, class memberships, transfers, guardian relationships under restricted access.
4. **Assignments & tasks** — canonical records and operational-center command integration.
5. **Operational data** — plans, initiatives, committees, procedures.
6. **Attachments** — secure upload, classification, linking, versions, safe download.
7. **Quality review** — rule findings and correction workflow.
8. **Distribution** — consumer access and delivery monitoring.

Each screen should ship with read, create, update, archive, and audit behavior only where its server permission and service contract are implemented and tested. Until then, show a truthful disconnected/disabled state rather than a pretend form submission.

## 12. Owner decisions still required before production writes

1. Which role(s) may create/update/archive school profile, staff, student, and enrollment records?
2. Who approves student transfers, guardian-link changes, class-leader changes, and staff duty assignments?
3. Which official source(s) are authoritative for school, staff, and student identifiers, and which imports are permitted?
4. What retention periods and permanent-deletion rules apply to student/staff records and uploaded files?
5. What are the maximum file size, per-school quota, and malware-scanning service/boundary?
6. Which operational record categories require principal approval, and which can be entered by delegated staff?
7. Which external systems, if any, are approved for integration, and what exact data may be exchanged?

## 13. Acceptance gates

- [ ] No user-supplied `school_id` controls tenant access.
- [ ] Cross-tenant read/write tests pass for every entity and attachment.
- [ ] Staff, teacher, and guardian scope tests pass.
- [ ] Field-level sensitive-data access tests pass.
- [ ] Import preview, validation, duplicate handling, and atomic commit tests pass.
- [ ] Upload signature mismatch, malware, quota, tenant, and download-authorization tests pass.
- [ ] Audit events exist for create/update/archive/import/distribution and permission denials as appropriate.
- [ ] Derived indicators reconcile to canonical records and disclose their calculation window.
- [ ] Accessibility, Arabic RTL, English LTR, responsive layouts, and keyboard flows pass.
- [ ] No production activation until all identity, data, authorization, privacy, and operational approvals are evidenced.
