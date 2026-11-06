# RAVEN OS — Principal & Platform Arena Transfer Reconciliation
Date: 2026-11-06
Working branch: `rescue/unified-arena-integration-2026-11-03`
Arena source commit reviewed: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`
Rescue branch head at reconciliation: `2f623fea811d4daf81554800e1fc93918d533eb8`

## 1. Scope and safety
This document supersedes the earlier 2026-11-05 reconciliation. It updates the implementation map against the current rescue branch after the Principal Operations, Support Services, and Governance route dispatches were added.

Arena remains a read-only design/source reference. Raven's Next.js App Router, approved route structure, and Raven-native data governance remain authoritative. No changes to `main`, no merge, and no deployment are part of this work.

## 2. Principal source inventory
The reviewed Arena source has five split Principal page files:
- `PrincipalPages.tsx`: dashboard, information center, and shared voice-entry modal.
- `PrincipalPages2.tsx`: assignments, operational plan, impact, school affairs, classes, teacher affairs, student affairs, grades, and exam control.
- `PrincipalPages3.tsx`: absence, behavior violations, positive behavior, library, and timetable.
- `PrincipalPages4.tsx`: health, activities, gifted students, special education, resources, laboratories, integrations, and assistant.
- `PrincipalPages5.tsx`: permissions, settings, and reports.

Arena demo records, identities, fixed KPIs, dates, sample names, chart series, local success toasts, and simulated actions are excluded from migration.

## 3. Current Raven Principal implementation map
The current route dispatcher is `src/components/portal-section-page.tsx`.

Dedicated Raven screen families now cover:
- Core centers: `PrincipalInfoCenter`, `PrincipalAssignmentsCenter`, the Raven Decision Center, Operational Plan center, Impact Center, School Affairs Center, and Classes Center.
- Operations: `PrincipalOperationsScreen` with explicit typed areas for teachers, students, grades, exam control, absence, behavior violations, and positive behavior.
- Support: `PrincipalSupportServicesScreen` with explicit typed areas for library, timetable, health, activities, gifted students, special education, learning resources, laboratories, Noor, Madrasati, Hudori, and assistant.
- Governance: `PrincipalGovernanceScreen` with explicit areas for permissions, school settings, and reports.

These are Raven-native screen implementations with defined workflows, governance rules, and empty/unconnected states. They are not connected business operations and do not establish full pixel-level parity with Arena.

Six operational-plan child routes (management, follow-up, development, alternatives, initiatives, and programs) remain handled by the route-specific workflow definitions in `PortalModuleWorkspace`. They are not to be mistaken for missing routes, nor for fully connected plan operations.

The Operational Plan is a distinct top-level Principal center, separate from the Administrative Decisions & Assignments Center. Its six subsections remain under the Operational Plan navigation group. This reflects the approved Raven architecture and supersedes the earlier incorrect wording that placed the plan beneath the Decisions Center.

## 4. Platform implementation map
Arena `src/pages/platform/PlatformPortal.tsx` includes fixture-backed schools, platform users, audit logs, health statistics, seeded KPIs, and simulated local actions. None of those records or behaviors may be imported as real platform data.

Raven currently has five Platform administration destinations in `src/lib/nav.ts` and route-specific governance definitions in `src/components/portal-module-workspace.tsx`:
1. `/platform/schools`
2. `/platform/users`
3. `/platform/roles`
4. `/platform/security`
5. `/platform/settings`

These are detailed Raven-native workflow workspaces, not full Arena screen parity and not live administration services. User management remains inside Platform Management; no fifth standalone Users portal is permitted. The Intelligent Engines destination is a separate approved Raven capability.

## 5. Teacher and Family reconciliation
Teacher and Family routes exist in Raven navigation and have route-specific workflow definitions in `PortalModuleWorkspace`. The current state is structured workflow workspaces, not detailed page-level Arena component parity.

Arena Teacher and Family source components depend on fixture identities and records, including teacher/class/grade/timetable/homework/notification fixtures and family-child/attendance/grade/behavior fixtures. These must not be copied.

- Teacher records must be scoped server-side to the authenticated teacher, school, and assigned classes.
- Family records must remain unavailable until the server verifies the authenticated guardian and the exact guardian-child relationship.
- Decorative verification badges, client-side identity selection, and simulated save/send/approval/export actions are not authorization or persistence.

## 6. Shared route and data rules
- Preserve the four portal identities only: Platform, Principal, Teacher, and Family.
- Preserve Raven's Next.js App Router; do not transplant Arena's React Router or HashRouter.
- Keep school data isolated by server-verified `school_id`.
- Do not import Arena fixture files, seeded people, student records, grades, attendance, schedules, notifications, audit logs, metrics, dates, chart data, or derived counts.
- Do not carry over simulated success messages or local-only operations as if they were durable.
- Keep unconnected areas explicitly empty/unconnected until trusted identity, authorization, data sources, persistence, and audit services exist and are tested.

## 7. Verification boundary and remaining work
The two GitHub Actions runs supplied for the Governance component creation and route wiring both report successful jobs, including Next.js build and lint:
- https://github.com/sportsalm77-tech/raven-os/actions/runs/42156267233
- https://github.com/sportsalm77-tech/raven-os/actions/runs/42156275810

This verifies those CI jobs only. It does not establish browser/mobile rendering, accessibility, end-to-end behavior, backend persistence, RBAC, or tenant isolation.

Remaining migration work:
1. Continue detailed Teacher and Family screen adaptation from Arena structure into Raven-native components, without fixtures or simulated actions.
2. Review and adapt Platform overview and its administration screens beyond the current route-specific workflow workspaces.
3. Audit Principal plan child routes and all route-to-screen mappings for completeness.
4. Run current build/lint and add route/unit coverage after each implementation batch.
5. Perform responsive, accessibility, authorization, and tenant-isolation tests when the required services are available.

## 8. Acceptance statement
This reconciliation distinguishes Raven-native dedicated screens, route-specific workflow workspaces, Arena source structures not yet adapted, and backend-connected functionality. It does not certify Raven OS as production-ready.

---
**مؤسسة رافيين للخدمات التعليمية**
**نحن نصنع الفرق**
