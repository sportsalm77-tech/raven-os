# Class Operations Center — Functional Contract
Date: 2026-11-04
Branch: rescue/unified-arena-integration-2026-11-03
Status: Design contract; not a backend implementation

## 1. Purpose and scope
The Principal Class Operations Center is the operational record for a class across its lifecycle: class identity, roster membership, class-leader assignment, timetable, attendance and lateness, behavior and conduct, positive behavior evidence, teacher coverage, and class reports.

It must not become a second student information system. Student identity and authoritative school records remain in the approved school data source. The class center manages the class-to-student relationship and class-scoped operational views.

## 2. Class card contract
Each class card may display only fields returned by the authorized school-scoped service:
- Official class name/code and grade/section.
- Academic year and room/location, when maintained.
- Active roster count, calculated from active class memberships.
- Assigned class leader, if one is active.
- Current period and next period, resolved against the school's configured timezone and approved timetable.
- Current teacher and next teacher, resolved from timetable plus effective assignments.
- Teacher absence/cover state only when an authorized, current absence/cover record exists.
- Last data refresh timestamp and data-source state.

Do not infer teacher attendance from a missing timetable row. Distinguish: scheduled teacher, approved absent teacher, assigned substitute, cover requested/pending, and no scheduled class. Display "unknown / not updated" when source freshness or required data is unavailable.

## 3. Functional areas
### Class directory
- Create class, edit class metadata, archive/deactivate class.
- Prevent duplicate class codes within the same school and academic year.
- Do not hard-delete a class with historical attendance, membership, timetable, or reports.
- Search/filter by academic year, grade, section, room, and active state.

### Student membership
- Add an existing student to a class; do not create a duplicate student identity.
- Change membership with effective date and reason.
- End membership (soft removal) rather than erase student history.
- Enforce one active homeroom/class membership per applicable school policy and academic year.
- Validate student and class belong to the same school.
- Record actor, timestamp, reason, before/after values.

### Class leader
- Assign, replace, and end an assignment with effective dates.
- Prevent overlapping active assignments unless the school policy explicitly permits co-leadership.
- Do not assume class leader equals subject teacher.
- Preserve assignment history and reason for change.

### Timetable and teacher state
- Resolve current/next lesson using school timezone, bell schedule, day pattern, exceptions, and timetable effective dates.
- Resolve the teacher from the approved teaching assignment for that class/subject/period.
- Derive absence only from an approved teacher-absence record.
- Derive substitute/cover state only from an authorized cover assignment.
- Return explicit state and source timestamp; do not synthesize a person or status.

### Attendance and lateness
- Separate absent, late, excused, permission/early departure, and pending review.
- Attendance entry is period-aware where the school's policy requires it.
- Separate recorder, reviewer/approver, and correction permissions.
- Preserve correction history; never silently overwrite an approved attendance event.
- Family visibility is limited to linked children and approved fields.

### Behavior and positive conduct
- Keep behavior incidents, interventions, and positive conduct records as distinct record types.
- Apply role-based visibility to sensitive details.
- Evidence attachments must reference the approved evidence/file service.
- Do not expose sensitive notes on general class cards or unrestricted reports.

### Reports
- Roster and membership changes.
- Attendance and lateness by date/period/student.
- Behavior and conduct summary with privacy-aware aggregation.
- Positive conduct and approved evidence.
- Timetable and teacher coverage history.
- Class-leader assignment history.
- Every report identifies academic year, date range, generation time, and data source.
- Exports must enforce the same server-side authorization as on-screen views.

## 4. Proposed service boundaries (provider-neutral)
- ClassDirectoryService: list, create, update, archive.
- ClassMembershipService: list, add, transfer, end membership.
- ClassLeaderAssignmentService: assign, replace, end, history.
- TimetableResolutionService: current/next period and teacher resolution.
- TeacherCoverageService: approved absence and cover assignment state.
- ClassAttendanceService: record, review, correct, query.
- ClassConductService: incident, intervention, positive conduct, evidence references.
- ClassReportService: authorized report queries and exports.

All services must derive school scope from trusted server-side identity/session context. A browser-supplied school_id, class_id, teacher_id, student_id, or role is never sufficient authorization.

## 5. Security and audit requirements
- Verify authenticated identity and active school membership server-side.
- Check role and action permission on every read/write/export.
- Verify class, student, teacher, timetable, and evidence references are within the same tenant.
- For guardian access, verify the active guardian-to-student relationship for every child record.
- Enforce least privilege and field-level privacy for conduct records.
- Audit create/update/archive/transfer/approval/correction/export actions with actor, timestamp, tenant, target, action, reason, and correlation identifier.
- Prevent cross-school enumeration through IDs and search endpoints.
- Do not connect real student data until the identity, authorization, tenant-isolation contract and security tests are implemented.

## 6. UI behavior requirements
- Class cards show real values only; otherwise show a clear unavailable/not-connected state.
- Indicator cards are selectable and open a filtered detail view with period and source.
- Disabled actions must explain the missing dependency; do not show success toasts for unconnected operations.
- Confirm destructive/irreversible actions and prefer archive/end-membership over hard deletion.
- Empty states explain which data source or service is missing.
- Arabic RTL and English LTR must remain supported.
- Keyboard focus, labels, responsive layouts, and accessible status text are required.

## 7. Acceptance test matrix
1. A principal from School A cannot list, read, modify, or export School B classes.
2. A teacher sees only assigned classes and permitted fields.
3. A guardian sees only linked children and permitted records.
4. A student cannot have an invalid duplicate active class membership.
5. Ending membership preserves historical attendance and reports.
6. A class cannot be hard-deleted while referenced by historical records.
7. Class-leader replacement preserves effective-date history.
8. Current/next teacher resolution respects timezone, timetable exceptions, and effective assignments.
9. An absent teacher is shown only when an approved absence exists.
10. A cover teacher is shown only when an authorized cover assignment exists.
11. Missing or stale timetable data displays unknown/stale, not a guessed teacher.
12. Attendance corrections preserve the original event and audit trail.
13. Conduct details are hidden from unauthorized roles and exports.
14. Every report enforces the same tenant and role checks as its source records.
15. UI never presents unconnected actions as completed operations.

## 8. Implementation gates
Gate A — Source-of-truth discovery: confirm the existing school/class/student/staff/timetable sources and ownership.
Gate B — Identity and authorization: implement trusted identity, school membership, role checks, guardian links, tenant isolation, and audit.
Gate C — Data contracts and services: approve schemas and service boundaries against the actual sources.
Gate D — Operational workflows: implement class, membership, class-leader, attendance, timetable/coverage, conduct, and reports.
Gate E — Verification: run automated security tests, build/lint, browser flows, and responsive/mobile checks with synthetic test tenants.
Gate F — Controlled release: explicit approval before merge or deployment.

No auth provider, database, migration, or external integration is selected by this contract.
