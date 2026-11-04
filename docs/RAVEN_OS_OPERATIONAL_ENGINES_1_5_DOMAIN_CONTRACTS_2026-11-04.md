# Raven OS — Operational Engines 1–5 Domain Contracts
**Version:** 1.0.0  
**Branch:** rescue/unified-arena-integration-2026-11-03  
**Delivery state:** Domain contracts and transition rules saved. No database adapter or production handler is connected.

## Shared invariants
- Every school record is scoped by `schoolId`; cross-school access is rejected.
- Every mutable record carries version and created/updated actor timestamps.
- Source references are preserved; imported files are not silently replaced.
- Domain state transitions are explicit and invalid transitions fail.
- Approval is a human action. A generated draft is never treated as approved.
- Persistence and audit must share an atomic transaction in the eventual adapter.
- No demo data, in-memory persistence, fake counters, or external writes.

## Engine 1 — School Data
- Defines source-preserving import batches with original file reference, media type, SHA-256 digest, source references, parse count, validation errors, review actor/time, and committed canonical record IDs.
- Supported intake types are PDF, DOCX, XLSX, and PPTX. This contract does not claim OCR or complete extraction.
- Import state: received → parsed → validated → approved; rejected is terminal.
- Approved imports require reviewer metadata and zero validation errors. Original source remains referenced.

## Engine 2 — Decisions & Assignments
- One canonical administrative action record covers decisions, assignments, circulars, letters, workshops, professional development, and field visits.
- Records carry owner, participants, dates, linked plan references, evidence references, approval metadata, and closure metadata.
- State: draft → submitted → approved → active → completed → archived; submitted may be rejected and returned to draft.
- Operational plans store references to these records, not duplicate copies.

## Engine 3 — Workflow & Follow-up
- Workflow instances link to a source record and carry template, owner, due date, state, blocker reason, and evidence references.
- State: queued → in_progress → blocked → in_progress → completed; cancellation is available before closure.
- Overdue detection is a pure calculation over verified due date and current time. It does not issue decisions or change owners/deadlines.

## Engine 4 — Evidence, Documentation & Impact
- Evidence records preserve file reference, MIME type, digest, source provenance, linked source record, review metadata, and impact references.
- State: submitted → under_review → accepted/rejected; accepted evidence may be archived.
- Evidence is not accepted without reviewer and timestamp.

## Engine 5 — Operational Plans
- Plan versions are immutable snapshots once approved. A revision creates a new draft version based on the prior version.
- Plan stores objective and indicator references, administrative action references, and evidence references.
- Initiatives/programs are typed plan children linked to a plan version and objective; any related administrative action is referenced, never duplicated.
- Plan state: draft → submitted → approved → active → closed; rejection returns to draft.

## Shared runtime boundary
`src/lib/engines/operational-runtime.ts` provides an authorized command boundary. It requires a trusted server actor, explicit permission and school scope, a configured unit-of-work adapter, and audit appends inside the same transaction as the domain write. Without an adapter, writes fail closed.

## Not yet implemented
- Database tables, migrations, row-level security, unique constraints, idempotency persistence, and concrete repositories.
- File upload, malware scanning, object storage, parser/OCR, and extraction workers.
- Identity provider/session adapter and final owner-approved role matrix.
- HTTP routes/server actions, background jobs, notification delivery, and production audit sink.
- Real operational writes or external Noor/Madrasati connections.

## Next integration gate
Connect only after the owner approves the identity provider and persistence architecture, then implement repositories and route-level handlers with positive and negative tenant tests, duplicate/idempotency tests, lifecycle tests, lint, and production build.
