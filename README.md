# Raven OS — Unified Rescue Application

This branch is an isolated recovery workspace. It does not replace or deploy the current production site.

## Current foundation
- Next.js App Router with React and TypeScript.
- Arabic-first root document and responsive Raven design tokens.
- Public homepage foundation.
- Four portal route foundations: `/platform`, `/principal`, `/teacher`, and `/family`.
- One transitional `/login` route; no credentials are collected or stored.

## Important status
This is an integration scaffold, not a production-ready application. Portal cards are structural placeholders. Authentication, server-side RBAC, tenant isolation (`school_id`), database access, audit logging, and real operational actions are not connected.

Do not use this branch with real school or student data. Do not deploy it to production until source integration, security design, automated checks, and owner review are complete.

## Source references
Arena UI source:
- Repository: `sportsalm77-tech/raven-design-arena-`
- Branch: `v0/raven-os-portal-update-2-1fd54ab9`
- Commit: `13823c0cdd7dd663c18c9beed435aeddab0fc5bf`

Arena uses Vite/React and HashRouter. Its UI components have not yet been fully ported into this Next.js scaffold. Design Arena instrumentation scripts are intentionally excluded.

## Local verification
Install dependencies with the selected package manager, then run:

```bash
npm install
npm run build
npm run lint
```

Build and lint have not yet been executed in this GitHub-only step.
