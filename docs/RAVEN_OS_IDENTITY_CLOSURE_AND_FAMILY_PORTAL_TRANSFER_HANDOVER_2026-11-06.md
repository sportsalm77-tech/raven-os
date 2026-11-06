# RAVEN OS — Identity Section Closure & Family Portal Transfer Handover
**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Status:** Identity policy/documentation closed; authentication implementation remains gated by owner decisions and completed verification  
**Repository:** `sportsalm77-tech/raven-os`  
**Working branch:** `rescue/unified-arena-integration-2026-11-03`  
**Reviewed commit:** `9d6e22a8ca7331855d16e454b455d92ea55b9f0e`

---

## 1. Purpose

This handover closes the identity and access-policy documentation stage and authorizes the next engineering workstream to begin with a controlled audit and transfer plan for the existing Family portal. It does not claim production authentication is complete and does not authorize database/provider changes, migrations, merge, or deployment.

## 2. Identity decisions preserved

The following owner-directed decisions remain binding:

1. Raven OS uses one centrally governed identity and authentication policy across the four portals: `/platform`, `/principal`, `/teacher`, and `/family`.
2. Student is an identity/authorization role, not a fifth portal.
3. Family and linked students use one unified Raven account identity and one Raven-managed password. Student records, enrollments, guardian relationships, school memberships, and permissions remain distinct.
4. A verified Madrasati student email/username may be used as a Raven sign-in identifier after source, ownership, uniqueness, and conflict checks. Raven must not collect or store a Madrasati password; password federation is conditional on an official supported integration.
5. Teacher and student QR Quick Access is permitted under short-lived, single-use, revocable, replay-resistant controls. Family QR requires guardian request, identity verification, school approval, and recorded acknowledgement. QR is prohibited for platform and school administrators.
6. Every protected operation must enforce authorization server-side and resolve the relevant school/child context for that request.
7. v0 and Vercel remain the approved build and hosting path.
8. Work remains on the rescue branch. No `main` change, merge, publish, or deployment without separate explicit owner approval.

## 3. Identity section — closure boundary

### Closed
- Platform-wide identity/authentication/access policy documented.
- Unified family/student identity and QR contract documented.
- Technical decision package documented, including current code gaps and candidate architecture assessment.
- Candidate Better Auth + PostgreSQL + Drizzle direction recorded as a proposal only.
- Neon not selected; database hosting remains unselected pending residency and contractual review.

### Not implemented / not certified
- Real authentication provider, password verification, sessions, secure cookie lifecycle, MFA, SSO, QR issuance/validation, database persistence, guardian relationship resolver, durable audit sink, and full tenant isolation.
- Final permission matrix, including student permissions.
- Family cross-school context switching and per-child authorization backed by authoritative persisted relationships.
- Full end-to-end and browser verification.

### Critical code findings
- `src/app/family/page.tsx` currently renders the shared `PortalDashboard` with `portal="family"`.
- `src/components/portal-dashboard.tsx` gives the family portal a general dashboard/navigation view and explicitly states that child records remain hidden until guardian linking and relationship verification are active.
- `src/lib/nav.ts` declares 12 Family portal navigation entries, but the corresponding route implementations were not found at the expected `src/app/family/<section>/page.tsx` paths during this review. The links must be treated as navigation declarations, not proof that twelve working sections exist.
- `src/components/portal-shell.tsx` displays a rescue-preview notice that server authentication, authorization, and school data services are not connected.
- `src/lib/security/identity-policy.ts` defines the `student` role.
- `src/lib/security/access-control.ts` still omits `student` from `RavenRole`, trusted actor validation, and the permission matrix. This is a known blocker and must be resolved before student authorization is wired.
- Current guardian access requires a trusted relationship resolver and one active school context. Multi-school family access requires server-resolved child/school context and revalidation for each protected request.

## 4. CI verification snapshot

Workflow run `42187795143` is associated in the recorded handover with commit `9d6e22a8ca7331855d16e454b455d92ea55b9f0e`.

At the latest inspection:
- `next-build` job remained `in_progress`.
- Dependency installation, Next.js build, lint, and security policy unit tests had completed successfully.
- Chromium installation was still in progress.
- Platform browser/responsive checks were pending.
- The combined commit status endpoint returned no status entries.
- Therefore this run is **not certified as complete or successful**. Recheck the workflow run and all jobs against the final branch HEAD before closing verification. Do not infer a green result from the earlier successful steps.

## 5. Owner decisions still required before authentication implementation

1. Confirm whether all Raven production identity, student, family, school, and audit data must remain physically in Saudi Arabia. If not, identify acceptable jurisdictions and required legal/contractual review.
2. Approve or reject Better Auth after final compatibility/security validation.
3. Approve or reject PostgreSQL as the Raven relational database engine.
4. Approve or reject Drizzle ORM and Drizzle Kit.
5. Select a database host and region only after the residency decision and contract review. Neon remains unselected.
6. Set audit retention, backup cadence, RPO/RTO, deletion, and recovery requirements.
7. Confirm account creation, verification, recovery, suspension/deactivation, additional adult guardian access, and secure temporary-password handover rules.

Until these are answered, do not add authentication/database dependencies, create hosted database resources, add secrets, or create migrations. This is a release gate, not a reason to invent defaults.

## 6. Family portal transfer workstream

### Objective

Take custody of the existing Family portal design and code, preserve its approved concepts and current structure, then transfer, clean, and develop it into the approved four-portal Raven architecture. Do not rebuild it from scratch and do not treat navigation links or visual mockups as operational services.

### Stage A — inventory and safe baseline
1. Confirm the latest rescue branch HEAD and record its SHA.
2. Inventory every existing Family route, component, shared component, asset, translation, configuration, and dependency.
3. Map all twelve declared navigation entries to actual route files. Record each as: implemented, partial, missing, duplicate, or placeholder.
4. Trace each page to its data source, actions, API/server action, permission check, and loading/empty/error states.
5. Identify mock/demo/default data, dead links, duplicate components, hard-coded copy, and unsupported claims.
6. Capture baseline build, lint, tests, and browser behavior before changing files.

### Stage B — controlled transfer and cleanup
1. Preserve the existing Family portal's approved visual identity, navigation intent, information architecture, and useful components.
2. Move/reuse components only where the target structure requires it; avoid wholesale replacement.
3. Remove fabricated child names, grades, attendance, messages, invoices, transport status, metrics, and other demo records. Use honest empty states until trusted services exist.
4. Fix broken routes and duplicate navigation only after route inventory confirms the intended destination.
5. Keep Arabic RTL and English LTR content complete and consistent.
6. Maintain responsive behavior and accessibility, including keyboard focus, labels, and readable mobile layouts.
7. Keep the family portal distinct from principal/teacher workspaces while reusing common shell and approved shared services.

### Stage C — Family portal information architecture (12 declared entries)
Audit and map these existing navigation items without assuming each is already a working page:

1. الرئيسية — `/family`
2. أبنائي — `/family/children`
3. الحضور والغياب — `/family/attendance`
4. المستوى والتقدم الدراسي — `/family/progress`
5. الدرجات والتقييمات — `/family/grades`
6. الواجبات والمهام — `/family/homework`
7. السلوك والمواظبة — `/family/behavior`
8. الجدول المدرسي — `/family/timetable`
9. الإشعارات والتنبيهات — `/family/notifications`
10. التواصل مع المدرسة — `/family/contact`
11. التقارير والملفات — `/family/reports`
12. الملف الشخصي والإعدادات — `/family/profile`

The twelve entries are the current navigation contract to audit. Any proposed addition, removal, or renaming must be recorded as a proposal and approved before changing the information architecture.

### Stage D — family authorization and service integration
1. Require an authenticated trusted family actor; never trust a child ID, school ID, or relationship supplied by the browser.
2. Resolve guardian-to-child relationships from the authoritative Raven data source on the server.
3. Resolve the active child and school context server-side for each operation; revalidate the relationship and school membership on every request.
4. Enforce per-child and per-school scope for attendance, grades, progress, homework, behavior, timetable, messages, reports, and files.
5. Do not expose siblings' records merely because they share a unified Raven account.
6. Do not allow school A to search or enumerate school B's student roster.
7. Keep sensitive student fields purpose-limited and minimize data displayed to guardians.
8. Do not activate QR family access until the documented request, verification, approval, acknowledgement, expiry, single-use, and revocation controls exist.
9. Do not fabricate integrations with Noor, Madrasati, payment, transport, or messaging providers.

### Stage E — testing and acceptance
- Route coverage for all twelve declared entries.
- Unit/integration tests for guardian relationship checks and role permissions.
- Negative tests: unrelated child, sibling without valid relationship, wrong school, altered child ID, revoked guardian link, suspended account, stale session, and unauthorized file/report access.
- Verify school context switching cannot retain stale permissions from the previous child/school.
- Browser tests in Arabic RTL and English LTR, desktop/tablet/mobile.
- Check navigation, empty/loading/error states, keyboard accessibility, no horizontal overflow, and no console/runtime errors.
- Verify no fabricated records or secrets remain.
- Run CI against the exact final commit SHA and record workflow/job conclusions.
- Do not claim live data or production readiness until the actual services are connected and tested.

## 7. Work sequencing and boundaries

The next work is **Family portal inventory, transfer, and cleanup first**. Identity-provider integration remains a separately gated prerequisite for live protected data. The Family portal can be audited, its UI and route structure cleaned, and honest empty/loading/error states prepared without installing a provider or inventing backend services.

Do not:
- Replace the four approved portals or create a fifth portal.
- Rebuild the Family portal from scratch.
- invent child/family records or live operational status.
- bypass server-side authorization with UI hiding.
- add dependencies, migrations, production secrets, or hosted services before owner approval.
- change `main`, merge, publish, or deploy.

## 8. Next-session execution order

1. Verify current rescue branch HEAD and the latest CI run/job status.
2. Read this handover and the two governing identity documents.
3. Audit the full Family portal route/component inventory and produce a concise evidence-based route matrix.
4. Begin controlled transfer and cleanup of existing Family UI/components, preserving approved structure.
5. In parallel only where safe, prepare the family authorization integration points without activating them.
6. Return to the owner for the data-residency and provider decisions before implementing live authentication/persistence.
7. Produce a final Family portal transfer report with changed paths, commit SHA, test evidence, unresolved items, and the next handover.

---

**Current disposition:** Identity policy/documentation stage closed. Authentication and persistence implementation remain gated. Family portal transfer is the next active workstream, beginning with a repository-backed inventory and cleanup plan.

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
