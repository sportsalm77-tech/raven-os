# Raven OS — Rescue Batch: Navigation Hierarchy Correction
**Date:** 2026-11-05  
**Target:** `sportsalm77-tech/raven-os` · `rescue/unified-arena-integration-2026-11-03`  
**Base commit:** `255428c1faf65031abfa2db2caf3235897fb8a21`

## Scope
A narrow correction aligning Principal navigation with the approved information architecture. No portal, route, component, data model, authorization rule, or project outside the rescue branch was changed.

## Changes
- Moved the Operational Plan center and its six subsections under the Administrative Decisions & Assignments navigation group.
- Kept all existing route paths unchanged.
- Kept the leadership destinations in their existing group; Operational Plan is subordinate to Administrative Decisions, not a peer navigation center.
- Updated the Principal Arena-to-Rescue migration map to reflect dedicated Raven components for Decision Center, Operational Plan, Impact, School Affairs, and Classes.
- Corrected stale migration notes that described those routes as generic workspaces.

## Preservation and safety
- No files were deleted.
- No Arena fixture/demo data was imported.
- No simulated persistence or operational success behavior was added.
- No database, identity provider, RBAC policy, tenant boundary, external integration, `main` branch, Design Arena branch, or deployment was touched.
- Existing route URLs remain unchanged; only their navigation grouping changed.

## Verification boundary
- Repository ref and base commit were re-read immediately before writing.
- Static source checks: navigation replacement was anchored to the exact previous block; documentation status entries were reconciled against current `PortalSectionPage` dispatch.
- Build, lint, browser, mobile, and automated route tests have **not** been run in this GitHub-only operation. No passing test claim is made.


## Superseding correction — 2026-11-05
The earlier change described above placed the Operational Plan center beneath the Decisions & Assignments group. That grouping conflicts with the approved Raven OS architecture, which defines Operational Plan as a distinct Principal center. The earlier grouping is superseded.

- Operational Plan now has its own top-level navigation group, separate from Decisions & Assignments.
- The six existing operational-plan subsections remain grouped beneath that center.
- All route paths and page components are preserved; only navigation hierarchy and the overview label were clarified.
- No data, authorization, backend, external integration, main branch, merge, or deployment changes were made.
- Verification is limited to the exact source-block replacement and subsequent source read-back; build/lint and browser tests remain pending.
