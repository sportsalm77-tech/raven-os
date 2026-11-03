# Raven OS Rescue — Unified Integration

Status: isolated implementation branch; no production changes.

## Protected references
- Production/default branch: main (must remain untouched).
- Existing Next.js source recovery: unresolved; historical evidence references baseline b5e147b.
- UI source: sportsalm77-tech/raven-design-arena- at v0/raven-os-portal-update-2-1fd54ab9 (commit 13823c0cdd7dd663c18c9beed435aeddab0fc5bf).
- Rescue base: work/raven-os-recovery-audit-2026-11-02.

## Target application
A single Raven OS application with one public homepage and four role portals:
- /platform
- /principal
- /teacher
- /family

No fifth independent users portal.

## Integration rules
1. Preserve current production deployment and main branch.
2. Keep Arena as an intact UI reference; do not modify its source branch.
3. Port UI in bounded batches and preserve source attribution in this document.
4. Do not treat demo account switching, mock records, or client-side route hiding as authentication or authorization.
5. Implement server-verified identity, role permissions, and school_id tenant isolation before any real operational data is exposed.
6. Do not introduce database migrations or external integrations until their design and compatibility are reviewed.
7. Do not merge or deploy until build, route, responsive, accessibility, and security checks pass and the owner reviews the result.

## First source inventory
- Arena router: src/App.tsx
- Arena entry: src/main.tsx
- Public landing: src/pages/Landing.tsx
- Platform portal: src/pages/platform/PlatformPortal.tsx
- Principal portal: src/pages/principal/PrincipalPages*.tsx
- Teacher portal: src/pages/teacher/TeacherPortal.tsx
- Family portal: src/pages/family/FamilyPortal.tsx
- Shared shell and navigation: src/components/shell.tsx, src/components/nav.ts
- Localization: src/lib/i18n/*
- Styles: src/index.css
- Existing Arena is Vite + React + TypeScript + React Router, not the recovered Next.js application.

## Known limitations
- Arena contains demo UI and placeholder data.
- Arena landing identifies itself as v4.2; it is not automatically the approved public homepage foundation v2.1.
- The production Next.js source is not yet recovered. No claim is made that the deployed output listing is equivalent to source code.
