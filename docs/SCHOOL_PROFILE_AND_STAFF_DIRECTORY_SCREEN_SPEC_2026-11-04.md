# School Profile and Staff Directory Screen Specification
**Date:** 2026-11-04  
**Status:** Interface/validation specification; no production writes enabled  
**Branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Purpose
Define the first two detailed screens inside the existing Unified School Data Center. These are modules, not new top-level centers. The school profile and academic structure establish the tenant's canonical school context; the staff directory references that context and stores people separately from their dated school memberships and duties.

## 2. School profile screen

### Section A — School identity
- Official Arabic name (required)
- Official English name (conditional on English locale/content)
- Official school code (required only against a confirmed issuing authority and uniqueness scope)
- School type and stage scope (controlled reference values)
- Education administration and region (controlled references)
- Source/provenance and verification state (system metadata)

Validation:
- Do not invent or infer the official code.
- Prevent duplicate active school identity within the approved governance scope.
- Do not allow free-text variants where a controlled directory exists.
- School tenant scope is resolved server-side, not accepted from a client-supplied `school_id`.

### Section B — Academic year
- Academic-year label
- Start date and end date
- Current-year state
- Lifecycle state: draft / active / closed / archived (final enum requires owner approval)

Validation:
- Start date precedes end date.
- At most one current academic year per school.
- Closing an academic year preserves historical enrollments, class memberships, assignments, and evidence.
- Closing is a governed transition, not a delete operation.

### Section C — Academic structure
- Stage
- Grade (belongs to stage)
- Class name/code
- Capacity (optional non-negative integer)
- Class status
- Academic-year relationship

Validation:
- Stage/grade values must be valid for the school type and academic year.
- Class code uniqueness is scoped to school + academic year + grade.
- Historical class memberships remain queryable after class deactivation/archive.
- Class leader is a relationship to an eligible active staff membership, not a free-text name; the assignment workflow and approver remain to be confirmed.

## 3. Staff directory screen

### Section A — Canonical person record
- Arabic display name
- English display name (conditional)
- Staff number (only after official source and uniqueness scope are approved)
- Job title
- Specialty/subject (supports multiple relationships)
- Provenance and verification state

Validation:
- One canonical person record should be reused across duties and school memberships.
- A changed job title or specialty must not create a duplicate person.
- Sensitive personal/contact fields are excluded from the initial screen until purpose, role visibility, retention, and legal basis are approved.

### Section B — School membership
- School relationship (server-resolved tenant scope)
- Membership status
- Effective start date
- Effective end date (optional)

Validation:
- Membership is independent from login-account status.
- Membership periods are retained historically.
- A user cannot self-assign membership or switch tenant scope through client payload.
- Cross-school memberships require explicit platform-level authorization and tests.

### Section C — Duties and assignments
- Duty/role relationship
- Linked class, committee, or task
- Effective period
- Authorizing actor and audit event (system metadata)

Validation:
- Duties link to canonical person and same-school records.
- Assignments are effective-dated; history is not overwritten.
- Teacher timetable/substitution relationships must be separately permissioned and auditable.
- The principal portal's operational modules consume these canonical links rather than keeping duplicate staff records.

## 4. Screen behavior and current implementation
- The rescue-branch UI presents these sections and field rules in Arabic and English.
- The screen is a specification view, not an active data-entry form.
- No sample school, staff, academic year, grade, or class records are inserted.
- No create/update/archive operation is exposed until identity, data service, tenant isolation, role permissions, and audit events are implemented and tested.
- No deployment or merge is authorized by this work.

## 5. Owner decisions required before activation
1. Confirm the official school code authority and uniqueness scope.
2. Confirm which role owns edits to school identity and academic-year transitions.
3. Confirm who may create stages/grades/classes and who approves class-leader assignments.
4. Confirm authoritative staff source and staff-number rules.
5. Confirm who may add/deactivate staff memberships and approve duty changes.
6. Confirm whether cross-school staff memberships are allowed and who authorizes them.
7. Approve retention and visibility rules for any sensitive staff contact/identity attributes.

## 6. Acceptance gates
- [ ] School scope always comes from trusted server identity/context.
- [ ] School code and academic-year uniqueness tests pass.
- [ ] Academic-year transition preserves historical records.
- [ ] Grade/class hierarchy validation passes.
- [ ] Staff person deduplication and membership-history tests pass.
- [ ] Staff duties reference same-tenant canonical records.
- [ ] Cross-tenant access tests pass.
- [ ] Role/field-level authorization and audit tests pass.
- [ ] Arabic RTL, English LTR, responsive and keyboard accessibility pass.
- [ ] No live writes until all owner decisions and technical gates are evidenced.
