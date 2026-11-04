# Raven OS — Design Arena Source-to-Rescue Mapping Audit

Date: 2026-11-04

## Scope and safety

This is a read-only source comparison recorded on the rescue branch. No source code, routes, authentication, database, deployment, `main`, or Design Arena project was changed by this audit.

- Raven OS repository: `sportsalm77-tech/raven-os`
- Raven OS branch: `rescue/unified-arena-integration-2026-11-03`
- Design Arena repository: `sportsalm77-tech/raven-design-arena-`
- Design Arena source commit: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`
- Design Arena source branch: `v0/raven-os-portal-update-2-1fd54ab9`

## 1. Source inventory verified

The Design Arena source contains these relevant files:

- `src/App.tsx`: HashRouter route composition and portal mounting.
- `src/components/shell.tsx`: shared portal shell, navigation, search, language and notification UI.
- `src/components/raven.tsx`: reusable visual components, including cards, KPI cards, tables, dialogs, status and sample-data markers.
- `src/lib/nav.ts`: four portal definitions and navigation.
- `src/lib/i18n.tsx`: Arabic/English language provider and direction handling.
- `src/lib/data.ts`: demonstration data.
- `src/index.css`: design tokens and shared styling.
- `src/pages/platform/PlatformPortal.tsx`
- `src/pages/principal/PrincipalPages.tsx` through `PrincipalPages5.tsx`
- `src/pages/teacher/TeacherPortal.tsx`
- `src/pages/family/FamilyPortal.tsx`

The principal source exports 27 page-level components across its five page files, plus the shared `VoiceEntryModal`. The page-level exports include the principal dashboard and information center, assignment and operational-plan centers, impact/school-affairs/classes, teacher/student affairs, exams, behavior, library, timetable, health, activities, gifted, special education, resources, labs, integration, assistant, permissions, settings and reports components.

The source `src/App.tsx` declares 29 principal route entries including the dashboard and a settings wildcard. These are not equivalent to 29 independent business centers: several are sub-sections or integrations. The source itself labels the principal portal as 18 operational sections.

## 2. Current Raven OS implementation verified

The rescue branch contains:

- Next.js App Router, not the source project's Vite/React Router HashRouter composition.
- Shared `src/components/portal-shell.tsx`, `portal-dashboard.tsx`, `portal-section-page.tsx`, and `portal-module-workspace.tsx`.
- Central route/navigation definitions in `src/lib/nav.ts`.
- Arabic/English localization via the application providers.
- Dedicated principal implementations in `src/components/principal-info-center.tsx` and `src/components/principal-assignments-center.tsx`.
- The principal operational-plan route is retained as a subsection under the Administrative Decision Center; it must not be promoted into an additional independent center.

The shared `PortalSectionPage` currently renders dedicated components for the Principal Information Center and Assignments Center. Other registered child routes are rendered through `PortalModuleWorkspace`, which provides route-specific purpose, workflow guidance, boundaries, and audit requirements. This is more than an empty route fallback, but it is not the same as porting the detailed Arena page components and their local interactions.

## 3. Source-to-target migration matrix

| Arena source | Raven target | Current assessment | Safe migration direction |
|---|---|---|---|
| `components/shell.tsx` | `portal-shell.tsx` | Shared shell already exists; implementations differ | Compare individual UX features and selectively adapt; retain Next.js routing |
| `lib/nav.ts` | `lib/nav.ts` | Both define four portals; Raven has its approved decision-center grouping | Preserve Raven route and role decisions; map labels and destinations, do not wholesale replace |
| `lib/i18n.tsx` | app language provider | Both support Arabic/English and direction | Compare translation coverage and RTL/LTR edge cases |
| `components/raven.tsx` | `raven-ui` | Different component libraries | Port only missing reusable visual primitives after API/accessibility review |
| `pages/platform/PlatformPortal.tsx` | platform dashboard and module workspace | Raven has five governed areas; Arena page is a detailed visual source | Extract visual patterns; strip all demo identities, records and operational claims |
| `pages/principal/PrincipalPages*.tsx` | principal centers and module workspace | Two dedicated Raven centers; most other routes use the descriptive workspace | Map each source page to the approved Raven route and center hierarchy before porting |
| `pages/teacher/TeacherPortal.tsx` | teacher dashboard and module workspace | 13 child routes exist; no claim that all detailed Arena page components have been ported | Extract each route's screen structure and interaction requirements |
| `pages/family/FamilyPortal.tsx` | family dashboard and module workspace | 11 child routes exist; relationship-scoped data is not connected | Extract each screen; never reuse teacher data or bypass guardian-child authorization |
| `lib/data.ts` | no direct production target | Contains explicit demonstration schools, users, students, metrics and records | Do not import as operational data; use only as a design reference |
| `index.css` and assets | `globals.css` and existing assets | Similar Raven palette and Cairo typography already exist | Reconcile tokens and responsive rules; avoid duplicate global resets or unverified logo replacement |

## 4. Demo behavior and data risks

The Arena shell and page components use local React state for UI interactions. The source data layer is explicitly marked as sample/demo data. Examples include named demo users, schools, students, class information, attendance percentages, tasks, notifications and historical events.

Some UI actions display success messages or simulate a short busy state. Those behaviors do not establish a durable server write, real notification delivery, real approval, or audit record. Therefore:

- Preserve useful visual interaction patterns, not simulated operational outcomes.
- Do not carry demo names, student details, school records, KPI values or notification history into Raven.
- Any future action must be connected to a documented server operation with authorization, tenant scope, validation and audit logging.
- Do not use real student or family data in the rescue branch.

## 5. Required migration order

1. Shared shell, navigation, language direction, typography, design tokens and responsive behavior.
2. Platform portal visual modules, preserving the five approved governance areas.
3. Principal portal, mapping each Arena component to the existing Raven route and preserving the Administrative Decision Center hierarchy.
4. Teacher portal, route by route.
5. Family portal, route by route, with guardian-to-student relationship authorization as a hard dependency for real data.
6. Build, lint, route review, keyboard/accessibility review, and explicit mobile/tablet testing.

## 6. Non-negotiable implementation boundaries

- Keep work on `rescue/unified-arena-integration-2026-11-03`.
- Do not modify `main`, merge, deploy, or change Design Arena.
- Do not introduce a fifth portal.
- Do not replace Next.js App Router with the Arena router.
- Do not promote the operational plan into a sixth independent principal center.
- Do not select or introduce an authentication provider or database without an explicit decision.
- Do not treat client-side portal switching or hidden navigation as authorization.
- Enforce identity, role, school scope, teacher assignment scope, and guardian-child relationship on the server before connecting sensitive data.
- Report build, lint, browser, mobile, security and production verification separately; never imply one proves the others.

## 7. Audit conclusion

Design Arena is a concrete, accessible source repository at the commit recorded above. It contains detailed page components and reusable UI patterns that can inform the Raven rescue build. The current Raven branch already has the four-portal Next.js structure, route-specific workspaces and two dedicated principal centers, but the detailed Arena page components have not been demonstrated as fully ported. The next engineering task is a route-by-route component migration plan, followed by selective implementation on the rescue branch only.
