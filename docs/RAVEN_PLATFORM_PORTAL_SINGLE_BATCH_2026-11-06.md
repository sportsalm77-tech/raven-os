# Raven OS — Platform Management Single-Batch Delivery
**Date:** 2026-11-06  
**Branch:** `rescue/unified-arena-integration-2026-11-03`  
**Base checkpoint:** `74b3892e8d7641f03f210bea9a5617bfde9af315`  
**Architecture:** KAYAN — TWO POINT FOUR

## Purpose
Consolidate the Platform Management portal structure in one cohesive interface/navigation increment while preserving the existing rescue work. This delivery does not authorize merge, deployment, provider selection, or production activation.

## Architecture enforced
- Raven OS retains exactly four portals: Platform, Principal, Teacher, and Family.
- Schools & Users is one administrative section inside Platform Management, not a separate portal or a tenth center.
- The section contains two internal destinations: school profiles/lifecycle and user accounts/memberships.
- Platform Management is represented by nine governance units: eight centers plus the Schools & Users administrative section.
- The Executive Command Center remains the Platform landing page.

## Files updated
- `src/lib/nav.ts`: reorganized Platform navigation into Command & Control, Schools & Users Administration, Intelligence & Evidence, and Governance & Records. The school and user destinations now sit beneath one shared section heading.
- `src/components/platform-command-center.tsx`: replaced the obsolete standalone “Schools & Users Center” label with the approved administrative-section label; linked the Communications, Support, Subscriptions, and Evidence workspaces; corrected the count label to nine governance units.
- `src/components/portal-module-workspace.tsx`: added dedicated workflow definitions for Communications & Alerts, Technical Support, Subscriptions & Activation, and Evidence & Accreditation. Each explicitly states that the corresponding backend service is not connected.

## Preserved behavior and boundaries
- Existing school, user, roles, security, settings, and intelligent-engine routes remain in place.
- New center routes are served through the existing Platform catch-all and the existing explicit navigation allow-list.
- No database, ORM, identity provider, messaging provider, payment provider, storage provider, or external integration was selected or connected.
- No fabricated records, operational metrics, message delivery, support tickets, subscription activations, or evidence uploads were introduced.
- Principal, Teacher, and Family portal navigation and components were not edited in this batch.
- `main`, Design Arena, merge, and deployment were not changed.

## Verification status
- GitHub accepted the source updates on the rescue branch.
- The edited source files were fetched again from the rescue branch for read-back.
- The current rescue workflow is configured to run Build and Lint on pushes to this branch.
- At report time, no workflow run or passing Build/Lint result for this delivery had been confirmed.
- Browser, mobile, accessibility, end-to-end, and security tests remain pending.

## Acceptance boundary
This delivery closes a navigation and interface-structure increment only. It does not close production operations. Real school/user administration still requires an owner-approved persistence and trusted identity architecture, server-side authorization, tenant-safe repositories, durable audit, and negative security tests. Communications, Support, Subscriptions, and Evidence remain workflow/interface foundations until their services are separately approved, implemented, and tested.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
