# Rescue integration checkpoint — 2026-11-03

## Changes committed on the rescue branch
- Added a Next.js App Router scaffold and Raven theme tokens.
- Added the public landing-page foundation and four portal entry routes.
- Added a sanitized portal navigation model derived from the Arena navigation structure. Demo identities and sample school names were intentionally excluded.
- Added a shared responsive portal shell with sidebar navigation, mobile drawer, and a local language toggle.
- Added catch-all nested routes for all listed navigation destinations in each portal.
- Added Tailwind CSS v4 and its PostCSS plugin so the imported utility-class styling can compile.

## Scope and limitations
- The language toggle currently changes shell/navigation labels only; full page-level bilingual content still needs implementation.
- Nested routes are structural placeholders, not working operational modules.
- The principal portal's original Arena page modules are large and depend on Arena-only data/components and React Router. They have not yet been ported.
- Demo metrics, sample student/teacher identities, simulated save/approval flows, and Design Arena instrumentation must not be treated as real functionality or copied into production.
- Authentication, server-side RBAC, school_id tenant isolation, database access, audit trail, and real file storage are not implemented.
- No production branch or deployment was changed.
- No local build, lint, or browser test has been run from this GitHub-only workflow.

## Next steps
1. Port safe shared primitives and style dependencies.
2. Port principal modules in small dependency-aware slices, preserving the five approved centers and 17 sections while excluding demo data and simulated writes.
3. Port platform, teacher, and family UI.
4. Implement and test server-side authentication, RBAC, and tenant isolation only after confirming the recoverable source and approved data model.
5. Run build/type/lint and route checks in a real checkout before review or merge.
