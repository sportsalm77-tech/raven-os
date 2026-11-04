# Class Operations — Data Source Discovery & Service Boundary
Date: 2026-11-04
Branch: `rescue/unified-arena-integration-2026-11-03`

## Purpose
Record what the rescue branch actually provides for the Principal Class Operations Center, identify authoritative data required for real operations, and define a provider-neutral service boundary. This document does not select or install an authentication provider, database, ORM, hosting integration, or external school-system connector.

## Verified repository evidence
- `README.md` describes this branch as an isolated recovery workspace and explicitly says authentication, server-side RBAC, tenant isolation (`school_id`), database access, audit logging, and real operational actions are not connected.
- `package.json` currently declares Next.js, React, Lucide, TypeScript, Tailwind, and lint/build tooling. It does not declare an authentication SDK, database client, or ORM.
- `src/app/layout.tsx` installs the app providers and localization; it does not establish a server identity or tenant context.
- `src/components/principal-classes-center.tsx` is a client-side workflow/interface. Its class directory is an explicit empty state; create-class is disabled; the warning states that identity, database, and server permissions are not connected.
- `src/lib/nav.ts` defines navigation labels and routes. Navigation is not an authorization boundary.
- Targeted fetches for likely API, auth, database, tenant, permission, Prisma, Drizzle, and Supabase entry points returned not found on this ref. This is corroborating evidence, not proof that no external system or differently named integration exists.
- GitHub code search is indexed against the default branch, so its empty results were not treated as evidence about this rescue branch.

## Current conclusion
No authoritative class/student/teacher/timetable/attendance data source is wired into the rescue branch. Do not seed sample records, create a parallel database, or expose operational mutations until the owner confirms the authoritative source and the server-side identity/tenant model is implemented and tested.

## Required sources of truth
| Domain | Required authoritative source | Minimum ownership / integrity rule |
|---|---|---|
| School tenant | School directory | Every record is scoped to a trusted server-resolved `school_id` |
| Class | School class register | Stable class ID, academic year, grade/section, active lifecycle |
| Student | Student master record | Stable student ID; no duplicate student identity per tenant |
| Class membership | Enrollment / class assignment | Effective dates, transfer history, soft end; no hard deletion |
| Class leader | Staff assignment | Staff ID, class ID, start/end, assigning actor, audit history |
| Teacher roster | Staff directory and school membership | Active school membership and role |
| Teaching assignment | Teacher-to-class/subject/period assignment | Effective dates and approved changes |
| Timetable | Approved timetable and revisions | Academic period, day, period, class, subject, assigned teacher |
| Absence / cover | Approved staff absence and coverage records | Distinguish absent teacher from pending/approved substitute |
| Student attendance | Attendance register | Date, period, status, recorder, reviewer, correction history |
| Behavior | Restricted behavior register | Separate incident, intervention, positive evidence, and approval |
| Audit | Append-only audit events | Actor, tenant, action, entity, timestamp, reason, correlation ID |

## Provider-neutral service boundary
The future server-side application layer should expose operations equivalent to:
- `listClasses(tenantContext, filters)`
- `getClassProfile(tenantContext, classId)`
- `createClass(tenantContext, input, actor)`
- `updateClass(tenantContext, classId, input, actor)`
- `listClassStudents(tenantContext, classId, filters)`
- `addStudentToClass(tenantContext, classId, studentId, effectiveDate, actor)`
- `endClassMembership(tenantContext, classId, studentId, effectiveDate, reason, actor)`
- `assignClassLeader(tenantContext, classId, staffId, effectiveFrom, actor)`
- `endClassLeaderAssignment(tenantContext, classId, assignmentId, effectiveTo, reason, actor)`
- `getClassTimetable(tenantContext, classId, dateRange)`
- `resolveTeacherCoverage(tenantContext, classId, dateTime)`
- `getClassAttendanceSummary(tenantContext, classId, dateRange)`
- `getClassBehaviorSummary(tenantContext, classId, dateRange, actor)`
- `getClassReports(tenantContext, classId, reportType, dateRange, actor)`

These are conceptual service boundaries, not implemented endpoints. Every operation must derive the tenant from a trusted server-side session/identity, verify resource-level authorization, validate input, and write an audit event. Client-supplied `school_id`, role labels, route names, or hidden navigation must never grant access.

## Critical business rules
1. A principal may act only within the school tenant assigned to the authenticated principal identity.
2. Teacher records and class assignments are visible only within the teacher's authorized school and assignment scope.
3. A guardian must be linked to the specific student through a verified guardian-student relationship; family access must not be inferred from a URL or student identifier.
4. Class roster changes preserve membership history. Student master records are not hard-deleted by a class workflow.
5. Class leader assignment is distinct from subject-teacher assignment and substitute coverage.
6. Current/next/absent/cover-pending teacher status must be computed from the approved timetable, effective assignments, absence approvals, and cover records—not manually guessed from a static label.
7. Attendance entry and attendance approval are separate permissions and auditable actions.
8. Behavior and health-related information requires purpose-limited, least-privilege access.
9. Reports must state the selected period, data freshness, and source; no fabricated counts or rates.
10. All writes require server-side validation, tenant-scoped persistence, and immutable audit history.

## Implementation gates
- Gate A — Owner identifies the authoritative source for school, student, staff, class, timetable, and attendance data (one or more existing systems may be involved).
- Gate B — Identity/session provider and trusted tenant resolution are approved.
- Gate C — Role/resource permission matrix is approved, including principal, vice principal, teacher, and any authorized operational roles.
- Gate D — Data ownership, synchronization direction, conflict handling, retention, and correction policy are documented.
- Gate E — Server-side adapters and service layer are implemented against the approved sources.
- Gate F — Automated tenant-isolation, authorization, audit, and workflow tests pass before any real student data is enabled.

## What is safe to do before those gates
- Improve non-sensitive UI structure and accessibility.
- Add typed, provider-neutral contracts and validation schemas without pretending they are connected.
- Build empty/loading/error states and clearly disabled mutation controls.
- Add unit tests for pure timetable/status resolution logic using synthetic fixtures only, once the business rules are approved.

## What is not authorized by this discovery
- Selecting or installing a database/auth provider.
- Creating schema migrations or production tables.
- Connecting real school, student, guardian, attendance, grade, or behavior data.
- Enabling create/update/delete/attendance actions.
- Merging to `main`, changing Design Arena, or deploying.

## Owner decision required to proceed to live service implementation
Confirm the authoritative source(s) currently used by the institution for:
- student and class records;
- staff and teacher assignments;
- timetable and absence/coverage;
- attendance.

If these are maintained in an existing school system (for example, a school SIS or approved internal database), that source must be assessed before introducing any new store. No assumption is made here that any named external system provides an API or that Raven is authorized to access it.
