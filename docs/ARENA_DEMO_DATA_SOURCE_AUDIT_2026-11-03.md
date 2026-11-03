# Raven Design Arena — Demo Data Source Audit
Date: 2026-11-03

## Purpose
Continue the default/demo-data cleanup for the Raven OS rescue branch without modifying the original Design Arena source or the current production site.

## Scope and evidence
Reviewed the following files on `sportsalm77-tech/raven-design-arena-`, ref `v0/raven-os-portal-update-2-1fd54ab9`:
- `src/lib/data.ts`
- `src/pages/platform/PlatformPortal.tsx`
- `src/pages/principal/PrincipalPages.tsx`
- `src/pages/teacher/TeacherPortal.tsx`
- `src/pages/family/FamilyPortal.tsx`
- `src/pages/Landing.tsx`

This is a focused source review, not a repository-wide automated scan.

## Confirmed demo-data sources
`src/lib/data.ts` explicitly identifies itself as a sample data layer and exports seeded records/metrics, including:
- Schools and tenant profiles (`SCHOOLS`), with invented school names, cities, tenant IDs, student/teacher counts, attendance, plans, health scores, sync times and software versions.
- Platform identities and accounts (`PLATFORM_USERS`), including names, email-like addresses, roles, scopes and account states.
- Audit events (`AUDIT_LOGS`) and infrastructure/uptime metrics (`HEALTH_STATS`).
- Classes, student records, teacher profiles, tasks, initiatives and library documents.
- Notifications and other role-specific datasets.
- The same module also contains teacher timetable/gradebook/homework data, family/child records, attendance arrays, behavior and trend series, committee records and other operational examples.

These values are illustrative sample content. They are not verified Raven customer records and must never be presented as actual school, student, teacher, family, security, audit or infrastructure data.

## Confirmed UI dependencies / risks
- Platform portal imports sample tenant, user, audit and health datasets and derives displayed counts from them. It also contains hard-coded alert examples and buttons that show success/info toasts rather than proving that an operational command reached a backend.
- Principal portal imports sample classes, students, teachers, tasks, initiatives, library documents, attendance/trend arrays and committees. Its overview also contains hard-coded KPIs, decisions and task summaries. Its voice-entry modal simulates a transcript using a timer and generated text; it is not speech recognition and its confirm button does not persist a record.
- Teacher portal imports sample teacher, timetable, gradebook, homework and notification data; the reviewed entry screen includes a fixed demo teacher identity and prefilled day/task/grade figures.
- Family portal imports sample child profiles, grades, behavior, attendance, timetable and notifications. The child selector and “verified relationship” badge are UI demonstrations, not proof of authenticated guardian-to-student relationship authorization. Some action controls are visual/demo interactions.
- Public Landing identifies itself as version 4.2 and states that displayed data is demonstrative sample data in its footer. It routes directly to portal paths for exploration. This page is not the approved public homepage baseline 2.1 and must not silently replace it.

## Cleanup decisions for the rescue branch
1. Do not copy `src/lib/data.ts` into Raven as an active application data source.
2. Do not copy sample identities, school/student/teacher/family records, numerical KPIs, audit events, notifications, trend arrays, or fake operational status into production-facing Raven screens.
3. For data-dependent screens, show a clear empty, not-connected, or permission-required state until a real tenant-scoped backend source exists.
4. Keep navigation labels and neutral explanatory copy; these are not records.
5. Treat every toast, simulated timer, local-only form, and mock approval as non-operational unless replaced with a verified server action and persisted result.
6. Do not present guardian relationship verification, role switching, school isolation, or audit logging as implemented based on these UI components.
7. Preserve the Arena repository and its demo content unchanged as a design/reference source. Cleanup applies to the Raven rescue implementation only.
8. Keep the approved public homepage 2.1 separate from Arena Landing v4.2.

## Coverage status
- Reviewed: the six files listed above.
- Not yet reviewed: the remaining principal split files (`PrincipalPages*.tsx`), remaining platform/teacher/family subpages and components, `src/lib/*` beyond `data.ts`, shared UI components, and any less obvious local/session storage or mock API helpers.
- Not performed: automated repository-wide scan, dependency/build/lint/test, browser interaction test, backend verification, or security test.

## Current Raven rescue status
The rescue branch has not imported the Arena page implementations or `data.ts`. The existing Raven rescue portal pages remain structural placeholders with an explicit unconnected/demo warning. This audit records source risks; it does not claim that the Arena repository itself has been cleaned or that Raven is production-ready.

## Safety boundary
No changes were made to the Arena repository, Raven `main`, or the live deployment. This report is committed only to `rescue/unified-arena-integration-2026-11-03`.
