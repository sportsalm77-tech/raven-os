# RAVEN OS — Platform Portal Closure & Acceptance Plan
**Date:** 2026-11-06  
**Branch:** rescue/unified-arena-integration-2026-11-03  
**Scope:** Platform Management portal only  
**Disposition:** Expanded closure plan; final acceptance is pending evidence

## 1. Governing decisions
- Preserve the four approved portals: Platform, Principal, Teacher, and Family.
- Schools & Users is one administrative section inside Platform Management, not a fifth portal and not a standalone center.
- Keep the eight centers plus one administrative section (nine administrative units).
- Raven OS owns its independent identity and canonical school-data domains. Noor and Madrasati remain external government systems, not Raven identity or database providers.
- No identity provider, database, ORM, storage vendor, migration framework, or external integration is selected by this plan.
- Inspect existing project and organization assets first. Do not replace existing Authentication or Database, and do not create duplicate stores or tables.
- Work only on the rescue branch. No merge to main, production deployment, or changes to Design Arena.

## 2. Workstreams and acceptance gates

### Gate 0 — Baseline and scope protection
- Confirm the exact rescue branch head before every write batch.
- Compare the branch against the recorded prior checkpoint.
- Confirm that changes are limited to Platform portal files, test infrastructure, and Platform documentation.
- Reject changes that alter Principal, Teacher, Family, shared identity ownership, or unrelated product projects without an explicit dependency review.

### Gate 1 — Full repository and service inventory
- Inventory every source file, route, server action, API handler, configuration file, workflow, security primitive, engine contract, data model, migration, and environment-variable reference.
- Record evidence for identity ownership, account lifecycle, session verification, school directory, memberships, role assignments, database clients, repositories, persistence, and audit sinks.
- Distinguish code contracts and policy primitives from actual runtime integrations.
- Record any external organizational identity/data source separately; never infer its existence from a design document.
- Deliver an evidence matrix: found, absent in repository, external source unknown, implemented, connected, tested.

### Gate 2 — Browser and route acceptance
- Run Chromium end-to-end tests in CI against a production build.
- Check the Platform home and all Platform destinations for successful responses and runtime errors.
- Verify the Executive Command Center and the approved Schools & Users administrative section wording.
- Verify Arabic default, English switch, and document lang / dir changes.
- Verify the mobile navigation opens and closes.
- Capture screenshots and traces on failures.
- Extend to Firefox/WebKit only after Chromium suite stabilizes and runtime budget is assessed.

### Gate 3 — Responsive and accessibility acceptance
- Test viewport widths 320, 360, 390, 768, 1024, and 1440 CSS pixels.
- Test Arabic RTL and English LTR at narrow and wide widths.
- Check document-level horizontal overflow, navigation reachability, text clipping, card/grid behavior, and touch target usability.
- Check keyboard focus, semantic headings/landmarks, accessible names, visible focus, and reduced-motion behavior.
- Browser viewport emulation is not a substitute for testing physical Android/iOS devices. Record physical-device tests separately when available.

### Gate 4 — Security and authorization
- Treat the browser as untrusted; never authorize from client state, local storage, URL role, or submitted school ID.
- Verify that trusted actor/session creation is connected to an authoritative Raven identity lifecycle before protected operations are enabled.
- Review every route handler, Server Action, repository, export, upload/download, search, report, and background task.
- Verify deny-by-default behavior, account status, session expiry/revocation, role/action permission, school membership, and resource ownership.
- Test direct URL access, privilege escalation, cross-school reads/writes, altered IDs, stale memberships, unauthorized exports, and missing identity.
- Keep Platform administrative access separate from school-user and student-data access.
- Record audit events through a durable trusted sink; do not claim audit persistence from a TypeScript event envelope alone.
- No production activation until negative authorization and tenant-isolation tests pass.

### Gate 5 — Data and backend readiness
- Raven is the owner of Raven accounts, school directory, memberships, roles, permissions, and canonical Raven operational records.
- Noor/Madrasati are external integration destinations/sources only for individually approved workflows.
- Inspect for existing connected services before considering any implementation.
- If an existing approved provider/store is found, validate its ownership, compatibility, access controls, tenant model, data quality, and lifecycle; reuse it rather than replacing it.
- If no runtime provider/store exists in the codebase, report the gap and prepare a provider-neutral architecture decision for owner approval. Do not install a new provider or create schema/migrations before approval.
- No fake data, mock sessions, pretend saves, fabricated delivery receipts, or simulated subscription activation.

### Gate 6 — Platform service workflows
For each center, verify route, role boundary, source-of-truth, server operation, audit event, failure state, and end-to-end behavior:
1. Executive Command Center.
2. Operations Monitoring.
3. Schools & Users Administration (single administrative section).
4. Communications & Alerts.
5. Technical Support.
6. Subscriptions & Activation.
7. Intelligence & Analytics.
8. Evidence & Accreditation.
9. Governance & Records.
A descriptive workspace is not a working service. A service is only marked connected after a real authorized server operation and persistence/receipt are demonstrated.

### Gate 7 — Final regression and release decision
- Run dependency installation, Next.js production build, ESLint, Chromium E2E, and applicable static/security checks on the final branch head.
- Review changed-file list and ensure no protected portal or production branch was modified.
- Publish a closure report with commit SHA, CI run IDs, route/test counts, screenshots/traces, unresolved findings, and a per-center state matrix.
- Final status must be one of: accepted for interface handover, accepted for controlled operational pilot, or not accepted for production.
- No merge or deployment is implied by a successful report.

## 3. Current evidence snapshot
- Platform implementation baseline previously passed Next.js build and ESLint in GitHub Actions run 42165889746 on commit 6a3b086736a9bf4b052144d004c77beba1c0fae0.
- The repository includes provider-neutral security policy primitives at src/lib/security/access-control.ts and an audit event envelope at src/lib/security/audit.ts. These are not an identity provider, session implementation, database, or durable audit sink.
- The repository includes a documented identity ownership decision: Raven owns its own identity and school-data domains; technical provider and storage choices remain open.
- The current package did not previously include browser E2E tooling. This closure plan adds a Playwright Chromium suite and CI execution.
- Physical device tests, production identity/session integration, persistence, tenant-isolation enforcement, durable audit, and real service workflows remain pending until evidence and authorized dependencies are available.

## 4. Evidence vocabulary
- **Present:** file, route, component, or contract exists.
- **Transferred:** source implementation is present in the rescue branch and mapped to the target structure.
- **Connected:** runtime integration with a real authoritative service has been demonstrated.
- **Tested:** a named test ran on a specific commit and passed.
- **Approved:** the owner explicitly accepted the relevant design or operational activation.
- **Pending / blocked:** evidence or authorized dependency is missing.

Never upgrade a state based on appearance, documentation alone, or build success.

---
**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**