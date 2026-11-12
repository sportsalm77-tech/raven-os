# RAVEN OS — Batch 09 Acceptance Recovery
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`

## Root cause
The principal route resolver used `if (!item || item.end) notFound()`. In the navigation schema `end: true` means exact-match navigation, not a disabled page. This incorrectly returned 404 for `/principal/decision-center` and `/principal/operational-plan`, causing two browser acceptance failures.

## Resolution
Commit `8ab5fa5ce376e25640d0402a85d29948950842dc` changed the guard to `if (!item) notFound()`, preserving unknown-route rejection. Temporary browser diagnostics were removed in commit `35fc97e08f196300d8d8e4cb96983658454679eb`.

## Verified evidence
GitHub Actions run 43167447330 for `8ab5fa5ce376e25640d0402a85d29948950842dc` completed SUCCESS. Next.js build, lint, security policy tests and Playwright browser/responsive checks all passed.

## Acceptance qualification
The final diagnostic-cleanup commit and this documentation commit require their own CI results; successful earlier run is not automatically evidence for later commits.

## Operational boundary
No live auth, tenant-scoped database, persistence, audit trail or production deployment was enabled. The four portals remain preview-only.
