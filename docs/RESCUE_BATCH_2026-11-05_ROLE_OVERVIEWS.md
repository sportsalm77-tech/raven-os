# Raven OS — Rescue Batch: Role Overview Workspaces
**Date:** 2026-11-05  
**Branch:** `rescue/unified-arena-integration-2026-11-03`  
**Arena source refs:** `PlatformPortal.tsx`, `TeacherPortal.tsx`, `FamilyPortal.tsx` at `v0/raven-os-portal-update-2-1fd54ab9`

## Scope
Adapt the information architecture of the Arena role landing pages into the Raven Next.js portal dashboard without copying fixture-driven records or simulated operations.

## Files
- Added `src/components/portal-overview-panels.tsx`.
- Updated `src/components/portal-dashboard.tsx` to render the role-aware panels.
- Existing portal navigation, route roots, shell, language provider, and page dispatch remain unchanged.

## Adapted areas
- Principal: school operations, decisions and assignments, operational plan, evidence and impact.
- Teacher: timetable and classes, tasks and assignments, grades and assessment, evidence and achievements.
- Family: child profiles, attendance, progress and homework, school communication.
- Platform retains its existing dedicated governance dashboard and is not duplicated by this component.

## Sanitization and safety
- No Arena `src/lib/data.ts` imports or sample records.
- No sample identities, names, student/guardian details, counts, grades, attendance, notifications, or fabricated KPIs.
- No fake save, approval, messaging, export, or asynchronous success actions.
- Family child records remain explicitly hidden until server-side guardian relationship verification exists.
- Teacher and principal records remain empty until their approved data sources and role scopes are connected.
- Panels link to existing Raven routes; navigation is not represented as authorization or proof of a live backend.

## Verification boundary
- Source-level review only in this operation.
- No local Next.js build, lint, browser, mobile, accessibility, tenant-isolation, or authorization test was executed here.
- No merge, deployment, database, identity provider, or external integration was changed.

## Preservation
This is additive. It does not replace the existing portal shell, navigation, dashboard content, custom Principal centers, or route-specific workspaces. All four portal roots remain intact.
