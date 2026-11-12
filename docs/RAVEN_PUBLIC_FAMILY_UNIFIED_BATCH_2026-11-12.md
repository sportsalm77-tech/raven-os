# RAVEN OS — Public Homepage & Family Portal Unified Development Batch
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`
Status: implementation submitted for CI verification; not a production release.

## Scope
- Replaced the public homepage presentation with an Arabic-first bilingual, responsive institutional page while retaining the four portal destinations.
- Added six service descriptions, seven workflow stages, native Smart Files Library explanation, audiences, four product/solution presentation cards, and truthful contact/request readiness notice.
- Added an interactive mobile menu and Arabic/English toggle using the existing language context.
- Added dedicated family section UI for eleven secondary destinations, preserving the existing twelve navigation entries including the family home.
- Retained family home and the existing portal shell, role boundaries, and principal/teacher/platform components.
- Did not introduce sample children, grades, attendance, invented contact information, or nonfunctional submission forms.

## Safety boundaries
- No authentication provider, database, storage, outbound messaging, API, or migrations.
- Family data stays hidden until trusted server-side guardian-child-school relationship verification.
- No changes to `main`, no merge, no deployment.
- Product labels are descriptive presentation placeholders; confirm exact approved product catalog against Version 2.1 reference before final acceptance.

## Acceptance gates
- Next.js production build and lint.
- Existing Playwright suite and identity-policy tests.
- Manual review of mobile navigation, RTL/LTR, screen-reader labels, and official visual reference.
- CI on the exact resulting HEAD must be successful before marking the batch verified.
