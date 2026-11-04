# Unified School Data Import & Validation Contract
Date: 2026-11-04  
Status: Design contract only; no live import is enabled.

## Ownership
The Unified School Data Center remains the sole canonical school-data source and primary entry point. This workflow is a module within that center, not a new center. Imports must write through canonical domain services; consumer portals do not maintain competing master records.

## Supported scope
File intake supports XLS/XLSX, DOC/DOCX, PDF, and PPT/PPTX. Excel is preferred for structured tables; Word/PDF/PowerPoint may be partially extracted where supported and must be reviewed with source references. OCR for scanned files is not assumed. CSV requires separate owner approval. Initial domains: school structure, staff, students, class memberships, assignments/tasks. Operational domains are added only after their field rules and approval authority are defined.

## Pipeline
1. Authorize the actor and resolve school scope from trusted server session.
2. Receive file into quarantine; validate actual file signature and size.
3. Scan and safely parse within resource limits.
4. Select one target domain for the batch.
5. Inspect workbook sheets, headers, hidden content, and row counts.
6. Map columns to approved fields; explicitly exclude unmapped columns.
7. Normalize only under documented field rules.
8. Validate required values, dates, references, tenant consistency, and domain constraints.
9. Match using approved stable identifiers; names and fuzzy similarity are candidate signals only.
10. Review row-level errors, duplicates, and conflicts.
11. Preview exact creates, updates, relationship changes, and rejected rows. Preview must not mutate canonical records.
12. Obtain domain-specific approval.
13. Commit through the canonical service using idempotency and concurrency controls.
14. Reconcile authorized consumer deliveries and record retry/failure states.
15. Close the batch with a truthful result and audit trail.

## Row outcomes
Ready to create; ready to update; relationship change; incomplete; invalid; duplicate candidate; conflict; rejected; skipped by reviewer. Every row must have one explicit outcome. No silent partial success.

## Matching and history
- Stable identifiers and their authoritative source require approval per domain.
- Never use row order, display name, or fuzzy matching as identity proof.
- Never auto-merge people or silently overwrite canonical fields.
- Student profile, enrollment, class membership, and guardian relationship remain separate entities.
- Staff profile, school membership, and duties remain separate entities.
- Transfers close old effective relationships and create new ones; history is retained.
- Import updates must respect field ownership and approved source precedence.

## Batch states
Draft -> Uploaded -> Quarantined -> Scanning -> Safe/Rejected -> Parsing -> Mapped -> Validating -> Review required/Ready -> Previewed -> Awaiting approval -> Approved -> Committing -> Committed/Failed (or Partially committed only if explicitly approved) -> Distributing -> Reconciled/Retry required -> Closed/Archived.

## Security and privacy
- Resolve identity, role, and tenant on the server; never trust a client-supplied school identifier.
- Separate permissions for initiate, upload, map, review, sensitive preview, duplicate resolution, approve, commit, retry, export, and archive.
- Validate actual file signatures; apply scanning, safe storage, bounded parsing, access-controlled downloads, backup, and retention.
- Never execute formulas, macros, external links, or embedded active content.
- Protect against formula injection in generated reports.
- Do not store unapproved columns. National identifiers, health, address, guardian contacts, and other sensitive fields require explicit purpose and field-level approval.
- Redact sensitive values in logs, previews, and reports according to role.
- All operations are school-tenant scoped and audited.

## UI requirements
A single bilingual RTL/LTR workspace with a stepper, domain selector, column mapping table, row-level validation filters, duplicate review, exact preview, approval confirmation, batch history, and safe error report. No fake batch records, counts, or success states.

## Distribution
Canonical commit is separate from consumer delivery. Publish versioned events only after commit. Consumer views are derived and refreshable. Delivery failures must be visible and retryable without corrupting canonical records.

## Acceptance tests
1. Unauthorized actors cannot initiate, view, approve, or commit batches.
2. Changing tenant identifiers in a client request cannot cross schools.
3. Invalid signature, oversized, malformed, or unsafe files are rejected/quarantined.
4. Preview produces no canonical writes.
5. Unmapped or unapproved sensitive columns are not stored.
6. Duplicate candidates are not automatically merged.
7. Matching is based on approved identifiers and tenant scope.
8. Protected fields cannot be silently overwritten.
9. Preview enumerates every planned change and rejection.
10. Unauthorized approval/commit is blocked.
11. Idempotent retry does not create duplicate records.
12. Concurrent edits are detected.
13. Partial commits occur only under explicitly approved semantics.
14. Distribution failure does not undo or misreport a canonical commit.
15. Downloads, previews, logs, and reports enforce tenant and field-level access.
16. All privileged operations are auditable.
17. Arabic/English, RTL/LTR, responsive, keyboard, and reduced-motion checks pass.

## Owner decisions before activation
1. Confirm XLS/XLSX as initial structured formats and decide on CSV.
2. Approve authoritative source and precedence for each domain.
3. Approve stable matching identifiers and duplicate-resolution roles.
4. Approve who can initiate, map, review, approve, commit, retry, and archive.
5. Approve batch size and whether partial commit is ever allowed.
6. Approve allowed and prohibited columns.
7. Approve source-file, staging, report, and audit retention.
8. Approve consumers and delivery freshness/retry targets.

## Activation gate
This is a specification only. No real import, file parsing, database writes, or student/staff data processing is enabled. Activation requires approved owner decisions, trusted identity, server-side authorization, tenant isolation, secure file pipeline, canonical services, audit, idempotency, backup/recovery, and passing acceptance tests. No provider choice, migration, merge to main, or deployment is authorized.


## External source imports: Noor and Madrasati
Noor and Madrasati are intended sources for authorized student and teacher imports. This contract does not assert that a connector, API, credential, or permission currently exists.
- Use only official authorized integration mechanisms (documented API, formally approved export/import, or another formally authorized channel).
- Do not scrape authenticated pages, collect passwords, bypass MFA/anti-bot controls, or automate browser sessions without explicit security/legal approval.
- Scope every sync to the authenticated school tenant and minimum approved fields.
- Preserve source system, permitted external reference, source update time, sync run ID, field provenance, and conflict decision.
- Preview and audit synchronization. Never silently overwrite canonical values; source precedence is field-specific and requires approval.
- Store secrets only in approved server-side secret storage, never in client code, repository files, logs, or chat.
- Handle throttling, pagination, partial failures, retries, and reconciliation without duplicates.
- Fields not exposed or authorized by the source remain unavailable.

## Principal-managed entry
Assignments, teams, committees, memberships, responsibilities, and effective dates are school-owned records entered and maintained by authorized school leadership in this center. They reference canonical staff, class, and academic-year records and use the same validation, approval, audit, and commit safeguards.
