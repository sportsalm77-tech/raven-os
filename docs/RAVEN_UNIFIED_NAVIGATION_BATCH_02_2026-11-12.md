# RAVEN OS — Unified Navigation Reliability Batch 02
Date: 2026-11-12
Branch: `rescue/unified-arena-integration-2026-11-03`

## Verified starting point
- Previous public/family batch verified on `6e877add0e6db5b0045d750b1b7bf91452d3ed1f`.
- GitHub Actions run 43160799124 completed successfully.

## Change scope
- Shared navigation search now automatically expands matching groups, even if the group was previously collapsed or is not the active route.
- Search results remain links to existing portal routes; no new roles, pages, or backend permissions are introduced.
- Accessible group control association and bilingual mobile navigation labels.
- Browser coverage for search in Platform, Principal, Teacher, Family, and Family mobile.

## Boundaries
- The four portals and all existing routes remain unchanged.
- Search is UI navigation only; it never searches private school or child records.
- No production deployment, merge, or changes to main.
- The resulting commit must pass its own CI before this batch is accepted.
