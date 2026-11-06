# Raven OS — Unified Security Foundation Implementation & Next-Session Handover
**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Repository:** `sportsalm77-tech/raven-os`  
**Working branch:** `rescue/unified-arena-integration-2026-11-03`  
**Baseline parent:** `c83df76f86bd5388715755408763cfe0da77c526`  
**Status:** Shared policy primitives and automated policy tests added; authentication provider, session persistence, database-backed authorization, and production activation remain blocked pending approved technical choices and integration evidence.

## 1. Purpose and governing decision

This delivery implements the safe, provider-neutral portion of the approved platform-wide identity and access policy. It does not replace the existing architecture, create a fifth portal, select a vendor, or claim that login is operational.

The four portals remain `/platform`, `/principal`, `/teacher`, and `/family`. Student is an identity role; this implementation deliberately does not invent a fifth portal or decide the student's final route.

## 2. Baseline inspected before changes

At the start of this batch, the rescue branch HEAD was verified as:
- `c83df76f86bd5388715755408763cfe0da77c526` — `docs: define platform-wide identity and access policy`

Inspected:
- `docs/RAVEN_OS_UNIFIED_IDENTITY_AUTHENTICATION_AND_ACCESS_POLICY_2026-11-06.md`
- `docs/RAVEN_UNIFIED_FAMILY_IDENTITY_STUDENT_SIGNIN_QUICK_ACCESS_CONTRACT_2026-11-06.md`
- `docs/RAVEN_OS_IDENTITY_AND_DATA_SOURCE_OWNER_DECISION_2026-11-05.md`
- `docs/IDENTITY_AUTHORIZATION_TENANT_ISOLATION_CONTRACT_2026-11-04.md`
- `src/lib/security/access-control.ts`
- `src/lib/security/audit.ts`
- `src/lib/engines/contracts.ts`
- `src/lib/engines/engine-service.ts`
- `src/app/login/page.tsx`
- `package.json`
- `.github/workflows/rescue-verification.yml`

Findings:
- The login page explicitly states that real authentication is not enabled and does not accept/store credentials.
- The authorization module contains role and active-school checks, but its generic family permission did not verify a guardian-to-child relationship.
- The audit module defines a typed envelope and fails closed when no durable sink is configured; no durable sink was found in the inspected architecture.
- No identity provider, session adapter, database/persistence layer, or migrations are configured in the inspected repository.
- The owner-approved domain decision says Raven owns its identity and school data independently; Noor/Madrasati are external systems, not Raven's identity provider.
- Provider, database, ORM, and persistence selections remain unapproved. They were not guessed or introduced.

## 3. Changes in this implementation batch

### 3.1 New shared identity policy module
Added `src/lib/security/identity-policy.ts`:
- Account operational-state rule: only `active` accounts are operational.
- Role-to-portal compatibility for platform administrators, school leaders, teachers, family guardians, and students.
- Student is represented as an identity role with no invented portal value; route mapping remains an explicit unresolved decision.
- Strong-MFA requirement classification for platform and school administrative roles.
- Quick Access eligibility: teacher/student permitted; platform/school administrators prohibited; family only when guardian request, identity verification, school approval, and signed acknowledgement are all recorded.
- Exact active-school scope matching for school-scoped roles. Platform roles do not gain school scope through this helper.

### 3.2 Guardian-to-child authorization hardening
Updated `src/lib/security/access-control.ts`:
- Generic `authorize(... family:children:read ...)` now denies by default.
- Added `authorizeFamilyChildRead`, which requires a trusted server-side relationship resolver for the exact guardian subject, child, and active school.
- Missing resolver, false relationship, malformed scope, or resolver error all deny access.
- Existing platform, principal, teacher, and school permission boundaries remain represented by the existing role map and active-school check.
- This is a guard contract, not a live guardian relationship database or repository adapter.

### 3.3 Automated policy tests and CI
Added `tests/security/identity-policy.test.mjs` covering:
- Active/suspended/disabled/pending account states.
- Portal-role mismatches and platform scope.
- Student identity without a fifth portal.
- Administrative MFA classification.
- QR role eligibility and all family approval conditions.
- Exact school-scope matching.

Updated:
- `package.json` — added `npm run test:security`.
- `.github/workflows/rescue-verification.yml` — runs security policy unit tests on every rescue-branch verification before browser tests.

## 4. Security behavior that remains intentionally inactive

This commit does NOT implement or activate:
- Authentication provider, credential validation, login, logout, or account recovery.
- Trusted session issuance, renewal, expiry, cookie settings, or revocation.
- MFA enrollment/challenge delivery.
- Database schema, migrations, canonical account/membership/guardian relationship repositories, or tenant row-level policies.
- Durable append-only audit storage.
- QR token generation, hashing, atomic single-use redemption, device binding, revocation, or rate limiting.
- Madrasati SSO or password reuse.
- Production APIs or access to real student/family records.

No credential form was added to the login page. No passwords, QR secrets, or test student data were introduced.

## 5. Verification status

- Source and workflow changes are committed together in this batch.
- The rescue workflow now includes the new security unit-test command.
- Do not call tests passed until the GitHub Actions run for the resulting commit reports success.
- No local checkout or local execution was available in this connector-based operation.
- No merge to `main`, pull request merge, deployment, or production activation was performed.

## 6. Required next-session sequence

1. Confirm this branch HEAD and inspect the exact commit diff.
2. Read this handover and the two governing identity contracts.
3. Review the new identity policy tests and the CI result for this exact HEAD.
4. Decide the student route mapping without creating a fifth portal.
5. Inspect and present compatible provider and persistence options already available in the project constraints; do not select them without the owner's approval.
6. After approval, implement the Raven-native identity provider/session adapter and durable persistence.
7. Implement server-side repositories for school memberships and guardian-child relationships; connect `authorizeFamilyChildRead` to that trusted source.
8. Expand permission checks to teacher class/student assignment scope and every API, export, file, server action, engine, and background job.
9. Implement durable audit sink and negative tenant/relationship tests.
10. Only after these gates pass, move to Family portal transfer and real data integration.

## 7. Copy-ready next-conversation handover

استأنف مشروع Raven OS من فرع الإنقاذ، ولا تبدأ من الصفر. أنت كيان، مهندس البناء الأول وفق قرار TWO POINT FOUR.

- المستودع: `sportsalm77-tech/raven-os`
- الفرع: `rescue/unified-arena-integration-2026-11-03`
- اقرأ أولًا: `docs/RAVEN_OS_UNIFIED_SECURITY_FOUNDATION_IMPLEMENTATION_HANDOVER_2026-11-06.md`
- ثم اقرأ: `docs/RAVEN_OS_UNIFIED_IDENTITY_AUTHENTICATION_AND_ACCESS_POLICY_2026-11-06.md` و`docs/RAVEN_OS_IDENTITY_AND_DATA_SOURCE_OWNER_DECISION_2026-11-05.md`.
- افحص HEAD وفرق الملفات ونتيجة CI قبل أي تعديل.
- تم إنشاء `src/lib/security/identity-policy.ts` لقواعد حالة الحساب، وربط الدور بالبوابة، وتصنيف MFA، وأهلية Quick Access، ومطابقة نطاق المدرسة.
- تم تشديد `src/lib/security/access-control.ts`: القراءة الأسرية العامة مرفوضة، والوصول إلى طفل يتطلب `authorizeFamilyChildRead` مع محقق علاقة خادمي موثوق؛ الغياب أو الفشل يعني الرفض.
- أضيفت اختبارات سياسة في `tests/security/identity-policy.test.mjs`، وأضيف أمر `test:security` إلى package.json وخطوة CI.
- هذه الدفعة لا تحتوي مزود مصادقة أو جلسات فعلية أو قاعدة بيانات أو مخزن تدقيق دائم أو QR فعلي أو SSO. لا تدّعِ اكتمال الدخول أو الجاهزية الإنتاجية.
- لا تختر مزودًا أو قاعدة بيانات نيابة عن المالك. بعد فحص الخيارات واعتمادها، نفّذ ربط الهوية والجلسات والتخزين والعلاقات والصلاحيات ثم اختبر العزل.
- لا تلمس main، لا تدمج، ولا تنشر دون إذن صريح. بعد اجتياز أساس الأمن، انتقل إلى نقل بوابة الأسرة.

## 8. Delivery conclusion

The reusable policy layer is now represented in code and automated tests, and family child reads have a fail-closed relationship gate. The platform-wide authentication foundation is **not production-complete** until an approved provider/session adapter, persistence, durable audit, and end-to-end authorization tests are implemented. This distinction is mandatory for the next session.

---

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
