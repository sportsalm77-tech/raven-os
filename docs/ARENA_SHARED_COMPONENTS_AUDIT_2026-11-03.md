# Shared Arena Components Audit — 2026-11-03

## Scope
Reviewed the shared UI sources in Arena commit `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`:
- `src/components/shell.tsx`
- `src/components/raven.tsx`
- `src/lib/nav.ts`
- `src/lib/i18n.tsx`
- `src/App.tsx`
- `src/pages/Landing.tsx`
- `package.json`

This is a source-level review of the listed files, not a full automated repository scan and not a runtime test.

## Confirmed blockers before production transfer

### 1. Shared portal shell (`shell.tsx`)
- Imports `NOTIFICATIONS` from `src/lib/data`; notification content and counts are therefore seeded/demo data, not server-backed notifications.
- Portal switcher is explicitly labelled as a visual demo and navigates directly between portal routes. It is not authentication, role verification, or authorization.
- Profile identity and role labels come from static `portalMeta` metadata. Profile/settings links are navigation only; sign-out only navigates to `/`.
- `readIds` is component-local state. Mark-as-read is not persisted to a server and will reset on remount.
- The header renders a “verified access” label, but this shell does not perform any verification. That label must not be used in production until backed by server-side authorization.
- Search filters static navigation labels only; it is not a search over school records.
- The UI can be retained as a design reference, but its demo identity, portal switcher, notification feed, verified-access badge and logout behavior must be replaced or explicitly disabled until real auth/RBAC/notification services exist.

### 2. Shared visual primitives (`raven.tsx`)
- Contains reusable presentation components (RavenMark, PageHead, KpiCard, CardTitle, ProgressBar, Donut, TrendChart, Bars, and related helpers).
- KPI/chart components accept arbitrary caller-supplied values; they do not establish that those values are real. Never pass Arena seeded datasets into them.
- `TrendChart` creates an SVG gradient identifier using `Math.random()` inside `useMemo`. This can create non-deterministic markup across server/client rendering if transferred unchanged into Next.js. Replace with React `useId()` (sanitized for SVG IDs) or another deterministic identifier before SSR use.
- Validate chart input lengths and empty-data behavior before production use; the reviewed implementation assumes non-empty, aligned arrays in several calculations.
- RavenMark is a stylized mark, not confirmation that it matches the user's approved official logo. Use the approved Raven logo asset when available.

### 3. Navigation and language
- `nav.ts` defines four portal navigation models and is useful as a design/navigation reference, but labels and routes are not permissions.
- `i18n.tsx` uses browser storage for language preference and a static dictionary. This is a UI preference, not sensitive account persistence. It must be adapted to the Next.js provider and complete bilingual coverage.
- The current Next.js rescue branch already has its own navigation and language provider. Do not overwrite them blindly; reconcile route IDs, approved Principal structure, translations, and shared design tokens first.

### 4. Application routing and landing page
- Arena uses `HashRouter` and React Router. Raven rescue uses Next.js App Router. Routes must be mapped deliberately; do not copy `App.tsx` into Next.js.
- Arena Landing labels itself version 4.2 and contains preview-oriented wording. It is not the approved public homepage foundation 2.1 and must not replace it.
- Arena package uses Vite, React Router, Framer Motion and Tailwind Vite plugin. These dependencies are not automatically compatible with the current Next.js rescue setup.
- The source shell and pages rely on `src/lib/data.ts`; copying them without a data-adapter boundary would reintroduce fabricated school/student/teacher/family records.

## Transfer decision
- Keep Arena unchanged as the preserved design source.
- Do not copy the shared shell wholesale.
- Port only visual primitives after removing seeded-data dependencies and correcting SSR-sensitive code.
- Build a new Next-compatible shell around the existing Raven rescue navigation and language provider; until server-side authentication and RBAC are implemented, keep a prominent unconnected-preview state and do not show “verified access”.
- Keep the approved Homepage 2.1 as the public-page requirement; Arena v4.2 is a visual reference only.

## Verification status
- Source review completed for the seven files listed above.
- No local install, Next.js build, lint, unit test, browser test, accessibility test, or deployment verification was run in this audit.
- No Arena files, Raven `main`, or live deployment were modified.
