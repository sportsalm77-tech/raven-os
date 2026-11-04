# Raven OS — Arena to Rescue Source Mapping
Date: 2026-11-04
Repository: `sportsalm77-tech/raven-os`
Target branch: `rescue/unified-arena-integration-2026-11-03`
Arena source: `sportsalm77-tech/raven-design-arena-`
Arena ref: `v0/raven-os-portal-update-2-1fd54ab9`
Arena commit recorded by prior audit: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`

## 1. Purpose and scope
This is a read-only source inventory and integration gate. It records what exists in the Arena source and what exists in the rescue Next.js application. It does not port application code, alter the public homepage, select infrastructure, connect authentication or databases, merge branches, or deploy.

## 2. Confirmed source architectures
### Raven OS base repository snapshot
The integration audit records the inspected Raven OS base commit as `3d2ae28d2bc0c34d9336381dd03813b4ebfcb447`, with `README.md` and a substantial standalone `index.html`. The inspected snapshot is not itself the Next.js source tree described in the historical Vercel log. The exact source commit for the separate Next.js Vercel deployment remains unidentified.

### Design Arena
Arena is a Vite + React 19 + TypeScript application using React Router 7 and HashRouter. Its source branch contains the landing page, shared shell/components, data/demo layer, and distinct Platform, Principal, Teacher, and Family portal implementations. The branch includes a generated `dist/` build according to the prior integration audit.

### Rescue application
The rescue branch is a separate Next.js App Router + React 19 + TypeScript scaffold. It has four portal route roots and catch-all routes, shared navigation, a shell, dashboard/workspace components, and a transitional login page. The rescue README explicitly states that Arena UI components have not yet been fully ported into this Next.js scaffold.

## 3. Source-to-target inventory
| Area | Arena source | Rescue target | Finding |
|---|---|---|---|
| Public homepage | `src/pages/Landing.tsx`, `landing-nav.tsx`, `landing-sections.tsx`, `ecosystem-products.tsx`, `ecosystem.ts`, `raven.tsx`, `index.css`, public assets | `src/app/page.tsx`, `globals.css` | Not a verified port. Rescue homepage is a smaller separately authored page. Must be reconciled against the approved Public Homepage Version 2.1 and the actual protected Raven OS source before replacement. |
| Platform portal | `src/pages/platform/PlatformPortal.tsx` and shared Arena shell/data/components | `src/app/platform/*`, `portal-dashboard.tsx`, `portal-module-workspace.tsx` | Not a full source port. Rescue contains route/workflow descriptions and governance copy, not the full Arena implementation. |
| Principal portal | `PrincipalPages.tsx` through `PrincipalPages5.tsx` | `principal-info-center.tsx`, `principal-assignments-center.tsx`, shared dashboard/workspace and route map | Two dedicated rescue centers exist as new, non-operational placeholders. Most Arena page implementations have not been ported as their original interactive components. |
| Teacher portal | `src/pages/teacher/TeacherPortal.tsx` | `src/app/teacher/*`, shared dashboard/workspace and route map | Route definitions and route-specific workflow descriptions exist; original Teacher implementation is not ported. |
| Family portal | `src/pages/family/FamilyPortal.tsx` | `src/app/family/*`, shared dashboard/workspace and route map | Route definitions and route-specific workflow descriptions exist; original Family implementation is not ported. |
| Shared navigation | `src/lib/nav.ts` | `src/lib/nav.ts` | Re-authored centrally for Next.js. Similar concepts, not a direct copy. |
| Shared shell | `src/components/shell.tsx` | `src/components/portal-shell.tsx` | Re-authored for Next.js. Requires behavioral and accessibility comparison. |
| Shared UI kit | `src/components/raven.tsx` | `src/components/raven-ui.tsx` | Rescue has a smaller UI foundation; no complete component parity established. |
| Localization | Arena `src/lib/i18n.tsx` | Rescue `src/lib/i18n.tsx` | Both have Arabic/English foundations; complete translation parity and route behavior are not established. |
| Data | Arena `src/lib/data.ts` | No equivalent live data layer | Arena data file explicitly labels itself sample/demo content. Do not copy its records into rescue or production. |

## 4. Demo-data and interaction risk
Arena `src/lib/data.ts` explicitly identifies itself as a sample-data layer. Its portal navigation includes named demo identities and scopes. Reviewed page sources import sample school, user, student, teacher, attendance, grade, task, timetable, notification, and performance collections. Some pages also contain client-side state, toast helpers, delayed actions, and simulated workflows.

Therefore:
- Port visual structure, information architecture, labels, and safe interaction patterns only after review.
- Do not port Arena sample identities, school/student records, counts, KPIs, notifications, attendance/grade history, or simulated approvals/saves as live data.
- A button or toast must not imply server persistence.
- The rescue empty/unconnected states and explicit security warnings must remain until real services are implemented and verified.
- Do not use real student or family data in this recovery branch.

## 5. Route and information-architecture observations
- Both codebases describe four portals: Platform, Principal, Teacher, and Family.
- Arena `src/App.tsx` declares the four portal route families and dedicated Principal routes; Teacher and Family use nested routed components.
- Arena source comments describe the Principal portal as 18 sections. The rescue navigation currently has 29 Principal destinations including the landing destination and subsections. The user-approved formal Principal section list must remain the authority; this count is not a substitute for that approval.
- Rescue Teacher navigation defines 13 child destinations; Family defines 11 child destinations. These are route/workspace definitions, not proof that the original Arena modules were transferred or that operational services exist.
- Operational Plan remains a subsection under the Administrative Decision Center, not a separate top-level center.

## 6. Critical preservation and integration gates
1. Identify and verify the exact source repository/ref for the Next.js deployment mentioned in historical Vercel evidence. Do not infer it from the deployment framework alone.
2. Protect the approved Raven public homepage baseline (Version 2.1) and compare it with the exact current Raven OS foundation before any homepage replacement.
3. Obtain an explicit source-file mapping for every Arena portal module and shared dependency before batch porting.
4. Convert HashRouter paths and React Router navigation into Next.js App Router route/page conventions; do not copy router wrappers blindly.
5. Review every imported dependency, browser API, asset path, CSS token, and component for Next.js compatibility.
6. Remove or replace all demo data and simulated persistence with honest empty/unconnected states until approved server services exist.
7. Keep the four-portal architecture and server-side role/tenant boundaries. Client-selected portal IDs and navigation visibility are not authorization.
8. Run build, lint, route coverage, accessibility, responsive, browser, and negative authorization tests. CI build/lint alone is not production certification.

## 7. Current disposition
**Source discovery is complete for the files listed in this inventory; application integration is not complete.**

No application source files were changed by this inventory. No Arena source, `main`, production site, hosting configuration, authentication provider, database, or deployment was modified. No merge or deployment was performed.

## 8. Recommended next engineering batch
Prepare a controlled porting matrix by module, beginning with the shared design system and portal shell, then Platform and Principal modules, followed by Teacher and Family. For each module record: source files, required shared dependencies, demo-data dependencies, route mapping, target files, removed/sanitized behavior, and verification evidence. Do not begin bulk code transfer until the exact protected Raven homepage/deployment source has been identified and the owner-approved Principal information architecture has been reconciled.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
