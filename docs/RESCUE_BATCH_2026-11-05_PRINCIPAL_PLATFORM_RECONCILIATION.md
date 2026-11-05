# RAVEN OS — Principal & Platform Arena Transfer Reconciliation
Date: 2026-11-05
Working branch: `rescue/unified-arena-integration-2026-11-03`
Arena source commit: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`
Rescue branch head reviewed before this report: `9d3492e3cec92f15e9c5d20ed3b9f350c879d24e`

## 1. Scope and safety
This is a source-to-rescue reconciliation of the Principal and Platform portal UI. It is not a claim of full visual parity, functional completion, browser verification, or backend integration. Arena remains unchanged. No changes were made to `main`, no merge was performed, and no deployment was initiated.

The rescue branch remains the authoritative current source where the two implementations differ. Approved Raven hierarchy and data-governance rules take precedence over Arena demo behavior.

## 2. Principal portal source inventory
The five Arena files expose 27 page-level components plus the shared `VoiceEntryModal`:
- `PrincipalPages.tsx`: `PrincipalDashboard`, `InfoCenter`, `VoiceEntryModal`.
- `PrincipalPages2.tsx`: `AssignmentsCenter`, `OperationalPlan`, `ImpactCenter`, `SchoolAffairs`, `ClassesCenter`, `TeachersAffairs`, `StudentsAffairs`, `ExamsGrades`, `ExamsControl`.
- `PrincipalPages3.tsx`: `BehaviorAbsence`, `BehaviorViolations`, `BehaviorPositive`, `LibraryPage`, `TimetablePage`.
- `PrincipalPages4.tsx`: `HealthPage`, `ActivitiesPage`, `TalentedPage`, `SpecialEdPage`, `ResourcesPage`, `LabsPage`, `IntegrationPage`, `AssistantPage`.
- `PrincipalPages5.tsx`: `PermissionsPage`, `PrincipalSettings`, `ReportsPage`.

## 3. Verified rescue implementation mapping
| Rescue route / component | Current implementation | Classification |
|---|---|---|
| `/principal` | Shared Raven `PortalDashboard` | Raven-native dashboard; not proof of Arena dashboard parity |
| `/principal/info-center` | `PrincipalInfoCenter` | Dedicated Raven component |
| `/principal/assignments` | `PrincipalAssignmentsCenter` | Dedicated Raven workflow component |
| `/principal/decision-center` | `PrincipalDecisionCenter` | Dedicated Raven component; approved Raven-specific center |
| `/principal/operational-plan` | `PrincipalOperationalPlan` | Dedicated Raven component; correctly subordinate to Decision Center |
| `/principal/impact` | `PrincipalImpactCenter` | Dedicated Raven component |
| `/principal/school-affairs` | `PrincipalSchoolAffairsCenter` | Dedicated Raven component |
| `/principal/classes` | `PrincipalClassesCenter` | Dedicated Raven component with unconnected-state guard |
| Remaining 21 Arena page-level components | Routes resolve through `PortalModuleWorkspace` | Route/workflow descriptions only; detailed Arena screens have not been transferred |

The 21 remaining Arena components are: `TeachersAffairs`, `StudentsAffairs`, `ExamsGrades`, `ExamsControl`, `BehaviorAbsence`, `BehaviorViolations`, `BehaviorPositive`, `LibraryPage`, `TimetablePage`, `HealthPage`, `ActivitiesPage`, `TalentedPage`, `SpecialEdPage`, `ResourcesPage`, `LabsPage`, `IntegrationPage`, `AssistantPage`, `PermissionsPage`, `PrincipalSettings`, `ReportsPage`, and the Arena-specific dashboard parity work. The dedicated Raven dashboard is retained and is not to be replaced by the seeded Arena dashboard.

## 4. Platform portal reconciliation
Arena `src/pages/platform/PlatformPortal.tsx` is a single React Router portal file containing the overview and platform administration screens. It imports `SCHOOLS`, `PLATFORM_USERS`, `AUDIT_LOGS`, and `HEALTH_STATS` fixtures and includes seeded KPIs, school records, alert examples, and simulated local actions.

Raven already exposes the five approved platform destinations in `src/lib/nav.ts`, each resolved through the Platform catch-all route and the explicit `MODULES` map in `src/components/portal-module-workspace.tsx`:
1. `/platform/schools`
2. `/platform/users`
3. `/platform/roles`
4. `/platform/security`
5. `/platform/settings`

The five destinations have section-specific workflow descriptions, backend-not-connected messaging, and governance/activation requirements. This is the safe Raven-native destination baseline, not a transfer of the full Arena screens. Do not add a sixth independent Users portal; user management remains within Platform Management. The Intelligent Engines route is a separately approved Raven navigation item and is not an Arena sixth administration screen.

## 5. Data and interaction exclusions
Do not transfer Arena fixtures or derived content, including school/user identities, student or staff records, attendance, grades, class lists, task/initiative records, notifications, audit logs, health/uptime figures, event histories, chart series, or realistic-looking counts and dates.

Do not carry over client-only success toasts, timer-driven completion, simulated approvals, notifications, exports, or save/send actions as if they were durable operations. Keep records empty or explicitly unconnected until trusted server sources, identity, tenant isolation, authorization, persistence, and audit are implemented and tested.

Family data must remain inaccessible until the server verifies the guardian identity and each guardian-child relationship. Teacher data must be scoped server-side to the authenticated teacher, school, and assigned classes.

## 6. Shared UI and route reconciliation
- The current Next.js App Router route files correctly delegate to Raven portal dashboard and section routing; do not copy Arena's React Router or HashRouter structure.
- The current navigation has four portal identities only: Platform, Principal, Teacher, and Family.
- The shared Arena shell remains excluded because it carries demo identity, demo notifications, decorative verified-access language, and client-only read state. Continue using the Raven shell and navigation as authoritative.
- The existing Arena visual primitives adaptation is reusable presentation infrastructure; it does not mean the individual Arena portal pages are transferred.
- Operational Plan remains a child of the Administrative Decisions & Assignments Center hierarchy. Do not flatten it into a peer center.

## 7. Current status and next transfer batch
- Platform: five approved destinations exist as Raven-native governance workspaces; full Arena screen parity remains outstanding.
- Principal: seven dedicated Raven components exist for the approved central areas; the remaining Arena page-level screens are currently generic workspaces, not transferred screens.
- Routes: the four portal route families and explicit navigation entries exist. Route existence alone is not acceptance evidence.
- Data: no Arena demo records should be migrated.
- Verification: this pass was a source/code review only. It did not run browser, device, accessibility, end-to-end, or security tests.

Recommended next batch: port the highest-value safe presentation structure from the remaining Principal Arena screens into Raven-native components in grouped batches, starting with staff/student administration, exams, and behavior/attendance. Rebuild the UI against Raven empty/unconnected states and existing navigation; do not transplant Arena data or client-only business actions. Then handle library/timetable/health/activities/resources/integrations/assistant/reporting surfaces. Review Platform overview separately only after removing all fixture-dependent metrics and identity claims.

## 8. Acceptance statement
This report records the actual distinction between dedicated Raven components, generic route workspaces, and backend-connected functionality. It does not certify the portals as complete or production-ready.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
