# Raven OS — Portal Migration Batch Review: Teacher & Family
Date: 2026-11-05
Target branch: `rescue/unified-arena-integration-2026-11-03`
Design Arena source repository: `sportsalm77-tech/raven-design-arena-`
Design Arena ref: `v0/raven-os-portal-update-2-1fd54ab9`
Design Arena source commit: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`

## Scope
Source-level comparison of the Arena Teacher and Family portal entry files against the existing Raven rescue portal routes and shared workspace. This batch does not copy the Arena application shell, router, fixture data, or simulated workflows.

## Teacher source findings
Source: `src/pages/teacher/TeacherPortal.tsx`
- Arena describes a daily teacher workspace with timetable, classes, assignments, lesson plans, attendance, grades, exams, homework/activities, behavior, evidence/achievements, library, notices/messages, and profile/settings.
- The reviewed source imports `TEACHER_CLASSES`, `TEACHER_GRADEBOOK`, `TIMETABLE_TODAY`, `HOMEWORK_ITEMS`, `NOTIFICATIONS`, and `TEACHERS` from `src/lib/data`.
- It binds the interface to a fixed demo teacher (`TEACHERS[0]`) and renders seeded class/time/grade/task counts, dates, and notification state.
- It imports presentation helpers that include sample badges, toast helpers, busy buttons, and async-action helpers. Their local UI behavior is not evidence of persisted server operations.
- Raven rescue already has the corresponding Teacher route family and 13 child destinations in its own Next.js navigation, but route existence is not proof that the Arena detailed page implementation was ported.

## Family source findings
Source: `src/pages/family/FamilyPortal.tsx`
- Arena describes child-scoped views for overview, children, attendance, progress, grades, homework, behavior, timetable, notifications, school contact, reports/files, and profile/settings.
- The reviewed source imports `FAMILY_CHILDREN`, `FAMILY_GRADES`, `BEHAVIOR_RECORDS`, `ATTENDANCE_MONTH`, `TIMETABLE_TODAY`, and `NOTIFICATIONS` from `src/lib/data`.
- The child selector is populated from fixture records and the source displays a “verified relationship” UI badge. That is not proof of a trusted guardian identity or server-verified guardian-to-child relationship.
- Raven rescue already has the corresponding Family route family and 12 destinations in its own navigation. These are route/workspace definitions, not proof of full Arena page parity or connected family data.

## Safe migration disposition
1. Preserve Raven's Next.js App Router, existing route paths, shared shell, and approved navigation as the target authority.
2. Do not import Arena `src/lib/data.ts`, seeded teacher/family identities, student records, grades, attendance, schedules, notifications, counts, dates, or trend data.
3. Do not transfer client-only approval, send, save, export, or success-toast behavior as if it were operational.
4. Adapt the screen structures in bounded page groups, using explicit empty/unconnected/permission-required states until trusted services exist.
5. Family child records must remain unavailable until the server verifies the signed-in guardian and the exact guardian-child relationship for each request.
6. Teacher records must be scoped to the verified teacher's school and assigned classes on the server; a selected UI identity is not authorization.
7. Keep route definitions distinct from page-component parity and from backend operational completion in all progress reports.

## Work completed in this batch
- Reviewed the two Arena portal entry files and confirmed their direct fixture-data dependencies.
- Reconciled three existing Arena-to-rescue mapping documents with the approved separate Operational Plan navigation center.
- No Arena source files, Raven application page components, database, authentication, `main`, or deployment were changed in this batch.

## Remaining migration work
- Extract route-specific screen structures from Teacher and Family source components, then selectively adapt them into the Raven workspace without fixtures.
- Continue the same source-to-target review for remaining Principal split files and Platform sections.
- Record each actual page-level adaptation by source file, target file, removed demo dependencies, route, and verification evidence.
- Browser/mobile/accessibility checks remain separate from CI build and lint.

## Verification boundary
This is a source review and documentation reconciliation. It does not claim that Teacher or Family page-level Arena components have been ported, that backend workflows operate, or that guardian/teacher authorization is implemented.

---
**مؤسسة رافيين للخدمات التعليمية**
**نحن نصنع الفرق**
