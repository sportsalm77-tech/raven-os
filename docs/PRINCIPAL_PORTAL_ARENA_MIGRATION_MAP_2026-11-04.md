# Principal Portal — Route-by-Route Arena to Rescue Mapping
**Date:** 2026-11-04  
**Scope:** Read-only source comparison and migration planning. No application code, database, authentication, or deployment changes.

## Source and target snapshots
- **Design Arena:** `sportsalm77-tech/raven-design-arena-`, branch `v0/raven-os-portal-update-2-1fd54ab9`, commit `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`.
- **Raven rescue:** `sportsalm77-tech/raven-os`, branch `rescue/unified-arena-integration-2026-11-03`.
- Arena is Vite/React/HashRouter; Raven is Next.js App Router. Port components selectively; do not copy the Arena application shell/router wholesale.

## Current Raven routing behavior
`src/app/principal/[...slug]/page.tsx` resolves through `PortalSectionPage`. That component checks whether the exact path exists in principal navigation, then dispatches:
- `/principal/info-center` → dedicated `PrincipalInfoCenter`.
- `/principal/assignments` → dedicated `PrincipalAssignmentsCenter`.
- `/principal/decision-center` → dedicated `PrincipalDecisionCenter`.
- `/principal/operational-plan` → dedicated `PrincipalOperationalPlan`.
- `/principal/impact` → dedicated `PrincipalImpactCenter`.
- `/principal/school-affairs` → dedicated `PrincipalSchoolAffairsCenter`.
- `/principal/classes` → dedicated `PrincipalClassesCenter`.
- Other recognized paths → `PortalModuleWorkspace` with route-specific copy/workflow boundaries.

The navigation hierarchy was corrected on 2026-11-05: Operational Plan is a separate top-level center, not a child of Administrative Decisions & Assignments. Its six routes remain intact. This change does not itself port the Arena page-level implementations.
The current dispatch also includes dedicated Raven components for decision center, operational plan, impact, school affairs, and classes. These are Raven-native adaptations, not proof of full Arena visual parity or connected operational services. Navigation lookup is not authorization.

## Route-by-route mapping

| Raven route | Arena source component | Current Raven implementation | Migration / verification note |
|---|---|---|---|
| `/principal` | `PrincipalDashboard` | Dedicated dashboard route | Compare dashboard composition; remove all sample KPIs, names, alerts and trends unless backed by approved live sources. |
| `/principal/info-center` | `InfoCenter` | `PrincipalInfoCenter` | Dedicated component exists. Compare detailed sections and interactions; keep records empty until connected. |
| `/principal/assignments` | `AssignmentsCenter` | `PrincipalAssignmentsCenter` | Dedicated component exists. Preserve task lifecycle and approval boundaries; no fake submit/success. |
| `/principal/impact` | `ImpactCenter` | Dedicated `PrincipalImpactCenter` | Raven-native dedicated shell exists; keep indicators unpopulated until trusted sources are connected. |
| `/principal/school-affairs` | `SchoolAffairs` | Dedicated `PrincipalSchoolAffairsCenter` | Dedicated Raven component exists; retain empty/unconnected records and verify Arena parity separately. |
| `/principal/classes` | `ClassesCenter` | Dedicated `PrincipalClassesCenter` | Dedicated interface exists with explicit unconnected-state guard; class/student operations remain unavailable until verified data and server-side scope are implemented. |
| `/principal/decision-center` | No exact standalone route/component in Arena nav; related planning/impact elements exist | Dedicated `PrincipalDecisionCenter` | Raven-specific approved center and parent navigation group for assignments and the operational-plan sub-center. |
| `/principal/operational-plan` | `OperationalPlan` | Dedicated `PrincipalOperationalPlan` | Dedicated Raven component exists. Keep it nested under Administrative Decision Center, not as a peer top-level center. |
| `/principal/teachers` | `TeachersAffairs` | Generic module workspace | Requires staff directory and school-scoped records. |
| `/principal/students` | `StudentsAffairs` | Generic module workspace | Student data must remain unavailable until identity, school scope and permissions are enforced server-side. |
| `/principal/exams/grades` | `ExamsGrades` | Generic module workspace | Grades require approved assessment source, audit trail and role-based access. |
| `/principal/exams/control` | `ExamsControl` | Generic module workspace | Preserve exam-control workflow concept; no real approval or publication claim before backend integration. |
| `/principal/behavior/absence` | `BehaviorAbsence` | Generic module workspace | Attendance/absence must use verified class rosters and an auditable approval process. |
| `/principal/behavior/violations` | `BehaviorViolations` | Generic module workspace | Requires approved behavior taxonomy, authorized actors and audit history. |
| `/principal/behavior/positive` | `BehaviorPositive` | Generic module workspace | Positive records need provenance and authorized recording/review. |
| `/principal/library` | `LibraryPage` | Generic module workspace | Align with Raven Smart Files Library; do not copy Arena sample documents. |
| `/principal/timetable` | `TimetablePage` | Generic module workspace | Requires official timetable source and current-term context. |
| `/principal/health` | `HealthPage` | Generic module workspace | Sensitive student health information; require strict scope and minimum necessary access before implementation. |
| `/principal/activities` | `ActivitiesPage` | Generic module workspace | Migrate workflow and presentation only; activity records need an authoritative source. |
| `/principal/talented` | `TalentedPage` | Generic module workspace | Student-level data needs restricted access and verified records. |
| `/principal/special-ed` | `SpecialEdPage` | Generic module workspace | Sensitive educational-support information; do not populate with demo or real records before controls are proven. |
| `/principal/resources` | `ResourcesPage` | Generic module workspace | Define resource inventory source and change ownership before adding actions. |
| `/principal/labs` | `LabsPage` | Generic module workspace | Requires real inventory/booking/maintenance source; no simulated availability. |
| `/principal/integrations/noor` | `IntegrationPage` | Generic module workspace | Arena's integration UI is not proof of a live Noor connection. Require approved credentials, documented API and server-side secret handling. |
| `/principal/integrations/madrasati` | `IntegrationPage` | Generic module workspace | Same shared Arena component; no live Madrasati connection inferred. |
| `/principal/integrations/hudori` | `IntegrationPage` | Generic module workspace | Same shared Arena component; verify actual provider/API and authorization before integration. |
| `/principal/assistant` | `AssistantPage` | Generic module workspace | Migrate only approved assistant UX; no generated answers/actions presented as completed work without service evidence. |
| `/principal/permissions` | `PermissionsPage` | Generic module workspace | Must align with server-side RBAC contract; a visual role matrix is not enforcement. |
| `/principal/settings` | `PrincipalSettings` | Generic module workspace | Settings must not imply persistence until a controlled server-side settings service exists. |
| `/principal/reports` | `ReportsPage` | Generic module workspace | Reports must be generated from traceable records; no sample totals, charts or downloadable claims. |

## Arena source component inventory
The five Arena principal page files export 27 page-level components plus `VoiceEntryModal`:
- `PrincipalPages.tsx`: `PrincipalDashboard`, `InfoCenter`, `VoiceEntryModal`.
- `PrincipalPages2.tsx`: `AssignmentsCenter`, `OperationalPlan`, `ImpactCenter`, `SchoolAffairs`, `ClassesCenter`, `TeachersAffairs`, `StudentsAffairs`, `ExamsGrades`, `ExamsControl`.
- `PrincipalPages3.tsx`: `BehaviorAbsence`, `BehaviorViolations`, `BehaviorPositive`, `LibraryPage`, `TimetablePage`.
- `PrincipalPages4.tsx`: `HealthPage`, `ActivitiesPage`, `TalentedPage`, `SpecialEdPage`, `ResourcesPage`, `LabsPage`, `IntegrationPage`, `AssistantPage`.
- `PrincipalPages5.tsx`: `PermissionsPage`, `PrincipalSettings`, `ReportsPage`.

## Demo-state and interaction risks found in Arena
- Principal page files import shared `src/lib/data.ts` fixtures, including classes, students, teachers, tasks, initiatives, library documents, attendance, committees, behavior records, school identity, roles and permissions, and chart series.
- The shared data file explicitly labels some chart series as demo data. It also contains realistic-looking names, school identifiers, event logs, attendance values, health/system metrics and notifications. Treat all such content as fixtures; do not transplant into Raven production-facing pages.
- Principal page files use React local state. The dashboard also contains timer-based behavior (`setInterval` / `setTimeout`); another page file uses `setTimeout`. Local state and timers do not establish persistence, server authorization, or completed business actions.
- Arena source uses Vite/React Router conventions and relative imports. Adapt UI and interaction patterns to Raven's Next.js App Router, existing i18n, and Raven UI components rather than copying the app structure.

## Approved hierarchy and security gates
1. Preserve the seven approved school-leadership centers and their agreed responsibilities.
2. Administrative Decision Center remains a primary center. Operational Plan is subordinate to it and must not appear as a peer top-level navigation center.
3. Keep Principal-only surfaces separate from Super Admin/System Admin capabilities; privileged prompt engines and click analytics/reduction tools must not appear for principal, vice-principal or lower school roles.
4. Do not connect student, guardian, staff, attendance, grades, health or behavior records until trusted identity, school membership, server-side authorization, tenant isolation and audit requirements are implemented and tested.
5. Do not treat navigation visibility, client props, toasts, modal confirmations or local component state as authorization or persistence.

## Recommended migration sequence
**P0 — Establish page parity inventory:** capture the current dedicated Raven principal components (information, assignments, decision, operational plan, impact, school affairs, and classes) and compare their structure against Arena; identify shared visual primitives that can be reused without fixture data.

**P1 — Decision and operations spine:** implement the approved Administrative Decision Center and its Operational Plan subsection, then map assignments, information/evidence and impact workflows around the approved chain: work → procedure → assignment → follow-up → execution → evidence → archiving → indicators → improvement.

**P2 — Low-risk operational shells:** timetable, resources, activities, labs, and reports; keep records empty or clearly marked as disconnected until their sources are approved. School Affairs already has a dedicated Raven component and belongs in the P0 parity review.

**P3 — Restricted student/staff records:** classes, teachers, students, exams, attendance, behavior, health, talented and special education only after server-side authorization and tenant-isolation gates pass.

**P4 — External integrations and privileged settings:** Noor, Madrasati, Hudori, settings, permissions and assistant actions only after source/API ownership, secrets management, audit and rollback are defined.

## Acceptance criteria for each migrated route
- Route and bilingual labels work in Arabic RTL and English LTR.
- Layout is responsive and uses Raven's existing design system.
- No Arena fixture names, school names, IDs, metrics, notifications or records leak into Raven.
- Every displayed record identifies its source and freshness once connected; otherwise the page clearly states that the source is not connected.
- Every action has a defined server endpoint, permission, validation, audit event, success/failure handling and test; until then it is visibly non-operational or omitted.
- Principal role cannot access platform-only engines or cross-school data.
- Build/lint and route tests pass; browser and mobile verification are recorded separately rather than assumed.

## Evidence boundary
This document is a repository-source comparison, not a browser QA report and not a production readiness certificate. The 2026-11-05 navigation correction and status reconciliation are documented in `docs/RESCUE_BATCH_2026-11-05_NAV_HIERARCHY.md`. No database schema, authentication configuration, external integration, main branch, Design Arena branch, or deployment was changed.
