# Raven OS — Unified User Portals Audit

Date: 2026-11-04  
Repository: `sportsalm77-tech/raven-os`  
Branch: `rescue/unified-arena-integration-2026-11-03`

## 1. Architectural interpretation

The approved rescue architecture defines one Raven OS application with four role portals: Platform, Principal, Teacher, and Family. It explicitly does **not** define a fifth independent generic Users portal. Accordingly, this audit treats "unified user experience" as a shared application shell and consistent navigation/localization, while keeping Teacher and Family workspaces distinct by role and data entitlement.

## 2. Navigation inventory

The current navigation source `src/lib/nav.ts` defines:
- Teacher portal: 13 child routes, plus its dashboard root.
- Family portal: 11 child routes, plus its dashboard root.
- Combined role-specific user destinations: 24 child routes.

Teacher destinations cover timetable, tasks, lesson plans, classes, attendance, grades, exams, homework, behavior, achievements, library, notices, and profile.

Family destinations cover children, attendance, progress, grades, homework, behavior, timetable, notifications, school contact, reports, and profile.

## 3. Explicit workspace coverage

The shared workspace component `src/components/portal-module-workspace.tsx` contains explicit module definitions for all 24 Teacher/Family child routes after the scoped implementation commit `069ee32583c9e6ae74ffc5f94fe66f87448a312a`.

### Explicitly defined (24)
Teacher:
- `/teacher/attendance`
- `/teacher/tasks`
- `/teacher/lesson-plans`
- `/teacher/classes`
- `/teacher/grades`
- `/teacher/homework`
- `/teacher/achievements`

Family:
- `/family/children`
- `/family/attendance`
- `/family/progress`
- `/family/grades`
- `/family/homework`
- `/family/notifications`
- `/family/contact`

### Generic fallback (0)
All 10 routes previously using generic fallback now have route-specific purpose and workflow guidance. They remain unconnected previews and do not contain operational forms, fake records, or simulated persistence.

## 4. Shared shell and localization

Both portals reuse `PortalShell`, `PortalDashboard`, `PortalSectionPage`, and the shared language provider. The shell provides responsive navigation markup, Arabic RTL / English LTR direction, and a language toggle. These are source-level observations only; no browser/device interaction test was performed in this audit.

Important limitations:
- The shell explicitly warns that server authentication, authorization, and school data services are not connected.
- The role route is selected by the URL and navigation model; this is not identity verification or authorization.
- No verified profile identity, persistent notifications, or authenticated logout flow is evidenced in the reviewed shell.
- Navigation membership is not an access-control boundary.
- No real teacher, class, student, guardian, grade, attendance, or notification records should be exposed before server-side authorization and tenant scoping.

## 5. Data protection and role boundaries

Required before operational activation:
- Teacher data access must be limited to classes, students, timetables, and tasks assigned to that authenticated teacher.
- Family access must require verified guardian identity and a server-validated guardian-to-student relationship; only linked children may be returned.
- Teacher and Family must remain separate authorization scopes even though they share application components.
- All school-scoped reads and writes must enforce `school_id` server-side.
- Sensitive student and family information must follow least-privilege access and auditable access rules.
- No demo identity, sample student, decorative verification badge, fake notification, or local-only save should be presented as real.

## 6. Recommended next implementation batch

1. Complete the ten generic fallback destinations with route-specific purpose, workflow, data boundary, and empty/unconnected state. Do not add fake forms or pretend actions.
2. Review dashboard content for Teacher and Family against their role-specific responsibilities.
3. Add explicit accessibility labels and interaction behavior to the mobile navigation after browser verification.
4. Define server-side identity and role contract before connecting any operational data.
5. Define teacher assignment and guardian relationship authorization tests before backend activation.
6. Run route, responsive, accessibility, and browser interaction checks; record evidence separately from CI Build/Lint.

## 7. Verification and disposition

This audit is a source-level review. It does not certify browser behavior, backend authorization, tenant isolation, or production readiness.

No Arena source, `main`, or live deployment was modified. No merge or deployment was performed.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**


## 8. Authorization and route-entry verification (follow-up)

Follow-up source review at commit `29d311edb3f64b36d92fc36f93fd465158809249` inspected:
- `src/app/teacher/page.tsx` and `src/app/family/page.tsx`
- `src/app/teacher/[...slug]/page.tsx` and `src/app/family/[...slug]/page.tsx`
- `src/app/layout.tsx`
- `src/components/portal-shell.tsx`
- `src/components/portal-section-page.tsx`
- `src/components/portal-dashboard.tsx`
- `src/components/app-providers.tsx`
- `package.json`

### Verified findings

1. The Teacher and Family dashboard route files render `PortalDashboard` directly. Their catch-all child routes render `PortalSectionPage` directly. No authentication or role guard is invoked in these route entry points.
2. `PortalSectionPage` checks whether a requested path exists in the navigation list and calls `notFound()` for unknown paths. This is route existence validation, not authorization.
3. The reviewed repository tree contains no root or `src/middleware.ts`; the inspected paths also contain no server auth module or server-side session check.
4. The root layout only wraps the app in the client-side language provider. `AppProviders` provides localization, not identity or access control.
5. `PortalShell` is a client component. Its role label and navigation are selected from the URL-supplied portal prop; this does not establish the authenticated user's role.
6. Teacher and Family dashboards explicitly state that teacher classes/assignments are not connected and family child records remain hidden until guardian linking and relationship verification are active. The shared shell also warns that authentication, authorization, and school data services are not connected.
7. The current `package.json` lists Next.js, React, and UI dependencies but no authentication or database client dependency. This is supporting evidence only; it does not rule out every possible external integration, but none was found in the inspected route path.

### Security disposition

**Critical activation blocker — do not connect real student, family, attendance, grade, or teacher-assignment data to these routes yet.** The current route structure is a navigable preview, not a protected user portal. Client-side navigation filtering, URL prefixes, and hidden UI elements must never be treated as authorization.

Before operational data is introduced, the implementation design must define and test:
- A trusted server-side session/identity source and deny-by-default route entry for both roles.
- Server-side role checks for Teacher versus Family on every read and write.
- Teacher-to-school and teacher-to-assignment scope enforcement, including `school_id`.
- Verified guardian-to-student relationship checks on every child-specific read and write; do not trust a child ID supplied by the browser.
- Tenant-scoped database policies or equivalent server-side query enforcement, plus auditable access to sensitive student records.
- Negative tests: unauthenticated access, wrong role, cross-school teacher access, unrelated guardian access, guessed child IDs, and direct API/server-action invocation.

No authentication framework, database schema, RBAC implementation, or tenant policy is selected or introduced by this follow-up. That requires a separately reviewed design and must preserve the approved stack and existing architecture.

## 9. CI verification update

GitHub Actions workflow `Raven rescue verification` completed successfully for:
- Run 41 — `41778721465`, audit commit `8279d49bb589854d45aeb89676613bb7a69b3338`
- Run 42 — `41778749027`, implementation commit `069ee32583c9e6ae74ffc5f94fe66f87448a312a`
- Run 43 — `41778761988`, audit update commit `29d311edb3f64b36d92fc36f93fd465158809249`

Each run's `next-build` job concluded `success`. This verifies the configured CI build job only; it is not evidence of browser, mobile, accessibility, authentication, authorization, database, or tenant-isolation tests.

## 11. Authorization contract prepared

A technology-neutral design contract and threat-oriented negative-test matrix is now recorded at:
`docs/IDENTITY_AUTHORIZATION_TENANT_ISOLATION_CONTRACT_2026-11-04.md`.

The contract is a design artifact only. It does not select an identity provider, database, migration, external integration, or implementation approach. Owner review and confirmation of authoritative identity, teacher assignment, and guardian relationship sources are required before technical design or code changes.

## 10. Updated disposition

The 24 Teacher/Family child routes have explicit route-specific workflow guidance and the configured CI build succeeds. However, source review confirms that route entry is not protected by server-side authentication or role authorization in the inspected implementation. The Teacher and Family portals therefore remain **preview-only and not safe for real personal or student data**.

Next safe work item: prepare a role/tenant authorization contract and a threat-oriented test matrix for review before selecting or implementing any backend/authentication changes. Do not add mock guards, fake sessions, sample records, or UI-only permission checks as substitutes.

No Arena source, `main`, or live deployment was modified. No merge or deployment was performed.
