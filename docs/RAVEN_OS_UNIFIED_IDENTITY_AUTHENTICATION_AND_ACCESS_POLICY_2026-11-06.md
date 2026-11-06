# RAVEN OS — Unified Identity, Authentication & Access Policy
**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Status:** Owner-directed platform-wide architecture policy; implementation and external integrations remain subject to verification  
**Repository:** `sportsalm77-tech/raven-os`  
**Target branch:** `rescue/unified-arena-integration-2026-11-03`

**Related governing contract:**  
`docs/RAVEN_UNIFIED_FAMILY_IDENTITY_STUDENT_SIGNIN_QUICK_ACCESS_CONTRACT_2026-11-06.md`

---

## 1. Purpose and scope

This document expands the identity and sign-in decision from the Family portal to the whole Raven OS platform. It is the platform-wide policy for identity, authentication methods, role boundaries, school tenancy, sessions, and access to all portal sections.

It applies to:
- Platform Super Admin / platform management.
- School principal / school management.
- Teachers.
- Students.
- Family / guardians.

It applies across all sections, pages, APIs, actions, files, reports, exports, notifications, and connected services—not only at the portal entry screen.

The four portal boundaries remain:
- `/platform` — Platform Management.
- `/principal` — Principal.
- `/teacher` — Teacher.
- `/family` — Family.

Student access must use the approved student route and role mapping in the existing application architecture; this policy does not invent a fifth portal or authorize a new route.

This is an architecture and policy contract. It does not claim that authentication, SSO, QR, databases, or production authorization are currently implemented.

## 2. Platform-wide principles

1. Raven OS uses one centrally governed identity and authentication architecture, not independent login systems created by each portal or section.
2. Each person or account has a canonical identity and explicitly assigned role(s), tenant scope, and permissions.
3. Authentication proves who is signing in; authorization decides what that identity may see or do. These are separate checks.
4. All protected sections and backend operations enforce authorization on the server for every request.
5. UI visibility, route guards in the browser, QR possession, imported data, or a successful-looking notification are never sufficient proof of authorization.
6. School data is tenant-isolated. A school user is scoped to the school(s) explicitly assigned to that identity.
7. Platform-level administrators have platform scope only according to their role; school administrators and school staff do not gain platform-wide visibility.
8. Student and family identities remain distinct. A family identity does not become a student account, and a student's school account does not become the family account.
9. Existing Madrasati credentials should be reused for student sign-in when an official supported authentication federation allows it. Raven must not collect or store the external password.
10. Quick Access QR is an optional authentication method with role-specific eligibility, not a separate identity system.
11. The same identity and authorization policy applies consistently across all portal sections, APIs, files, reports, and integrations.
12. No external integration or security capability may be described as operational until it has been implemented and tested with evidence.

## 3. Central identity architecture

The platform shall use one central identity provider/service as the source of authentication sessions and credential lifecycle for Raven-managed accounts and approved federated identities.

Logical responsibilities:
- Canonical identity mapping and unique subject identifiers.
- Authentication and external identity federation.
- Credential lifecycle and secure recovery for Raven-managed credentials.
- Session creation, renewal, expiry, and revocation.
- Role and tenant context resolution.
- Quick Access QR challenge issuance and validation for eligible roles.
- Security event publication to the audit service.

This is a logical architecture boundary, not approval to choose a new vendor or create a parallel database. The current repository's identity/authentication options must be inspected and the owner must approve the provider and persistence design before implementation.

A user may have multiple approved roles, but role elevation must never occur merely because a person uses another portal URL or has a second identifier. Role assignment and changes require an authorized, audited workflow.

## 4. Role-based sign-in policy

| Role | Primary sign-in | Quick Access QR | Security posture |
|---|---|---|---|
| Platform Super Admin / platform manager | Central administrative identity with strong authentication | **Prohibited** | Strong MFA; privileged session controls; audited privileged actions |
| School principal / school manager | Central administrative identity with strong authentication | **Prohibited** | Strong MFA; school-tenant scope; audited privileged actions |
| Teacher | Central identity; approved teacher credential or supported federation | **Permitted** | Optional short-lived QR flow; role and school assignment checked |
| Student | Madrasati username/email may be the Raven username; reuse Madrasati password only through official supported federation | **Permitted** | Student-safe QR flow; age-appropriate controls and school scope |
| Family / guardian | One unified family identity and family credential | **Permitted only on request, verification/approval, and signed acknowledgement** | Family-to-student relationship authorization and revocable QR/device control |

### 4.1 Platform Super Admin

- Uses the centrally governed administrative identity.
- Must use the stronger administrative authentication policy, including MFA or an equivalent approved second factor.
- Cannot use Quick Access QR.
- Cannot obtain a QR credential by switching roles or routes.
- Privileged actions require explicit server-side permission and audit records.
- Platform scope does not imply unrestricted access to student or family content; sensitive data access must be purpose-bound and permissioned.

### 4.2 School principal / school manager

- Uses a centrally governed administrative identity.
- Must use the stronger administrative authentication policy.
- Cannot use Quick Access QR.
- Is restricted to the school tenant(s) assigned to the principal identity.
- Cannot view another school's records or family relationships merely because a guardian has children enrolled there.
- Cannot view or retrieve student, teacher, or family passwords.
- Cannot sign in as another user or impersonate a student, teacher, or guardian.

### 4.3 Teacher

- Uses a central Raven identity with a verified teacher profile and explicit school assignment.
- May use an approved teacher credential or supported external federation if a real, documented integration is available.
- May use Quick Access QR as an optional method.
- QR must resolve to the teacher's existing identity and permissions; it must not create a second teacher account or bypass the normal authorization policy.
- Teacher permissions are scoped to assigned school, classes, students, subjects, duties, and approved operations.
- A teacher cannot gain principal or platform permissions through QR, account matching, or imported school data.
- Teacher role assignment, school assignment, and revocation must be auditable.

### 4.4 Student

- Uses the canonical student identity and active school enrollment.
- The Madrasati username/email imported through the Unified School Data Center may be reused as the Raven username after validation.
- The same Madrasati password may be used only through an official supported federation/SSO flow.
- Raven must not import, scrape, log, or store the Madrasati password.
- If official federation is unavailable, use an owner-approved Raven credential or other approved sign-in method; do not pretend that Madrasati password compatibility exists.
- Student QR Quick Access is permitted under a student-safe, revocable, replay-resistant flow. A static QR alone must not grant permanent unrestricted access.
- Student permissions are scoped to the student's own identity, enrollment, and approved learning resources.
- A student cannot access another student's record by changing an ID, URL, request body, browser state, or QR payload.

### 4.5 Family / guardian

The Family portal uses one centrally managed family identity across Raven-participating schools:
- One family account context and one family password, not a separate family password per school or child.
- The initial temporary password may be issued once through the approved school handover process and changed by the guardian after first sign-in.
- When another child is linked from another participating school, no second family password is issued.
- The Madrasati student email is not the family username and does not prove guardian status.
- The family QR option is available only after a guardian request, school verification/approval, and a documented signed acknowledgement.
- Family QR is issued and managed by the central identity service, not by the school as a reusable password.
- The school cannot see or retrieve the current family password.
- Access to every child is independently authorized through a verified, active guardian relationship and the relevant school/resource permissions.

The exact family username, recovery channel, and separate adult-guardian credential model remain subject to explicit owner approval.

## 5. Madrasati federation and credential reuse

The goal is to avoid creating unnecessary student passwords where the existing Madrasati authentication can be safely reused.

The Madrasati integration is a technical gate:
1. Confirm that the relevant authority offers an official supported authentication integration and obtain its technical and usage requirements.
2. Implement only the actual protocol and flows supported by that authority.
3. Validate signed authentication assertions/tokens and all applicable issuer, audience, signature, state, nonce, expiry, redirect, and replay protections.
4. Map the external subject to the correct canonical Raven student identity and active school enrollment.
5. Raven applies its own RBAC, tenant isolation, and resource authorization after authentication.
6. Do not request, import, store, or log the Madrasati password.
7. If official federation is not available, use a clearly disclosed, owner-approved fallback.

Importing the student's email/username from Excel or another school data export is not an authentication integration and cannot validate the student's Madrasati password.

Teacher or administrator federation with any external identity provider is not automatically approved by the student Madrasati decision. It requires separate verification of the supported identity source, account mapping, role assignment, and owner approval.

## 6. Quick Access QR — platform-wide policy

### 6.1 Eligibility

- Platform Super Admin: prohibited.
- School principal: prohibited.
- Teacher: permitted.
- Student: permitted.
- Family / guardian: permitted only by request, verification/approval, and signed acknowledgement.

The identity service must enforce this eligibility. Hiding the QR button in the UI is not sufficient.

### 6.2 Security properties

All QR flows must:
- Avoid embedding passwords, personal data, student records, or long-lived reusable bearer secrets.
- Use cryptographically random, scoped, short-lived challenges or tokens.
- Be single-use where the flow permits; prevent replay and reuse.
- Bind authorization to the correct canonical identity, role, tenant, and approved device/session context.
- Require an additional confirmation or student-safe verification step when appropriate.
- Support expiry, revocation, device loss response, and session termination.
- Apply rate limits and abuse detection.
- Record issuance, attempt, success, failure, revocation, and relevant device/session events without recording secrets.

A printed/static QR that permanently opens an account is not an acceptable implementation.

### 6.3 Family QR acknowledgement

The signed acknowledgement records the guardian's duties for safe handling and use. It does not waive Raven's own security, privacy, or legal obligations. The final text and workflow require owner and legal/privacy review before activation.

## 7. Authorization across every portal section

The same server-side authorization pipeline must protect all sections and operations:

1. Authenticate the session or validate the federated authentication result.
2. Resolve the canonical identity.
3. Resolve the active role and permitted tenant context.
4. Check the requested route, resource, action, and field-level permission.
5. For student/family data, verify the relevant student identity, enrollment, and guardian relationship as applicable.
6. Enforce school tenant isolation in the data query and service layer.
7. Return only the minimum permitted data.
8. Record security-relevant actions and denials.

This applies to:
- Dashboard summaries and search.
- Student, teacher, class, attendance, grade, behavior, homework, schedule, and school records.
- Decisions, assignments, plans, initiatives, programs, and follow-up.
- Evidence, documents, exports, reports, and Smart Files Library.
- Notifications, messages, support, and communication.
- Imports, data corrections, approvals, and administrative actions.
- Engine APIs, integrations, and background jobs.

A portal route is not a security boundary by itself. APIs and background jobs must enforce the same policy even if no UI is involved.

## 8. Tenant isolation and data boundaries

- Every school-owned record and operation must be scoped by the authenticated tenant context and validated server-side.
- A user cannot select an arbitrary `school_id` in a request to change their data scope.
- Platform-level access must be explicit, purpose-bound, and audited.
- A principal is restricted to assigned school scope.
- A teacher is restricted to assigned school/class/student scope.
- A student is restricted to their own permitted record and learning scope.
- A family identity may span multiple participating schools only through separately verified child relationships; it does not grant one school visibility into another school's records.
- Shared platform services must avoid leaking cross-tenant counts, identifiers, search results, files, or metadata.

## 9. Credential, session, and recovery lifecycle

- Raven-managed passwords must be securely hashed using an approved modern password-hashing configuration; plaintext storage is prohibited.
- Federated passwords remain with the external identity provider.
- Temporary credentials must be short-lived, securely delivered, single-use where appropriate, and changed at first sign-in.
- Password reset and account recovery must verify the account holder through an approved process and must not disclose whether unrelated accounts exist.
- Sessions must have defined expiry, renewal, rotation, secure cookie/token handling, and server-side revocation.
- Privileged administrative sessions require stronger controls and shorter/high-risk action reauthentication where approved.
- Logout and account disablement must revoke or invalidate applicable sessions and tokens.
- Lost-device response must revoke device authorization and sessions without altering unrelated users' identities.
- Credential changes must not silently merge accounts or alter a different student's or family's identity.

## 10. Audit and governance

Audit at minimum:
- Identity creation and changes.
- Role and tenant assignment changes.
- Login success/failure and suspicious authentication events.
- Federation subject mapping and failures.
- Password issuance, change, reset, and recovery metadata (never the password).
- QR request, approval, issuance, use, failure, expiry, and revocation.
- Guardian/student relationship creation, review, and revocation.
- Privileged access, sensitive data access, exports, and authorization denials.

Audit records must not contain passwords, raw QR tokens, bearer credentials, or unnecessary sensitive personal data. Audit storage must be durable and access-controlled; current persistence must be inspected before implementation is claimed.

## 11. Required platform-wide acceptance tests

### Authentication and identity
1. Each role authenticates through the central identity architecture.
2. A user cannot create a second identity by changing portal URLs or login identifiers.
3. Madrasati student password reuse works only through verified official federation.
4. Raven never receives or stores Madrasati passwords.
5. Imported email/username alone cannot authenticate.
6. Unsupported external federation is rejected and the approved fallback is used.

### Role and portal boundaries
7. Platform administrators cannot use QR.
8. Principals cannot use QR.
9. Teachers can use only their approved QR flow and teacher permissions.
10. Students can use only their approved QR flow and student permissions.
11. Family QR requires request, verification/approval, and acknowledgement.
12. No user can escalate a role by modifying client state, URL, payload, or token claims.

### Tenant and resource authorization
13. Principal access is limited to assigned school tenant(s).
14. Teacher access is limited to assigned classes, students, and duties.
15. Student access is limited to their own permitted data.
16. Family access is limited to verified children and approved resources.
17. Cross-school family links do not disclose another school's records to a school user.
18. All APIs, exports, files, background jobs, and engine calls enforce the same policy.

### QR, session, and audit
19. Expired, used, revoked, copied, or replayed QR challenges fail safely.
20. Lost devices and sessions can be revoked.
21. Credentials and QR secrets never appear in logs or audit records.
22. Sensitive actions and authorization denials are auditable.
23. Password recovery and account disablement do not expose other users' identities.

### Experience and accessibility
24. Arabic RTL and English LTR login and recovery flows are complete.
25. Responsive layouts, accessibility, keyboard navigation, and clear session-expiry states are tested.
26. Error messages do not leak account existence, school membership, or sensitive student information.

## 12. Explicitly unapproved or unverified items

The following must not be assumed or implemented as settled facts:
- Availability and terms of official Madrasati SSO/federation.
- Whether teachers may authenticate through Madrasati or another external provider.
- Specific identity provider vendor or database/session/audit storage technology.
- Exact administrator MFA method and recovery procedure.
- Exact teacher and student QR ceremonies, expiry values, and device policy.
- Family username format, adult-guardian credential model, and recovery channel.
- Final guardian QR acknowledgement wording and legal/privacy basis.
- Production readiness, security test results, or actual live integration.

These require inspection of the current Raven repository, technical evidence, and explicit owner approval where policy choices remain.

## 13. Implementation and change-control rule

This policy is a platform-wide architecture decision record, not a declaration that the features are implemented.

Before implementation:
1. Inspect the current rescue branch and identity/authentication/RBAC/tenant/audit code.
2. Reuse existing approved contracts, especially the student records and guardian access contract.
3. Verify official Madrasati integration capability.
4. Present unresolved provider, recovery, QR, privacy, and legal decisions for approval.
5. Implement centrally so all portals consume the same identity and authorization services.
6. Add unit, integration, API authorization, tenant-isolation, and browser acceptance tests.
7. Document evidence and limitations. Do not claim a feature works until it passes the relevant tests.

Work remains on the approved rescue branch. Do not modify `main`, merge, deploy, or replace the approved stack without explicit owner approval. Preserve existing portal structures and data relationships; do not rebuild from scratch or create parallel user/student databases.

---

## Engineering decision

Raven OS shall have one centrally governed identity, authentication, session, and authorization architecture across the entire platform. Role-specific sign-in methods are permitted only according to this contract. The platform and school administrators are excluded from QR Quick Access; teachers and students may use it; families may use it only after request and approval. Student Madrasati credential reuse is conditional on official federation. Every portal section and backend operation must enforce the same server-side role, tenant, relationship, and resource permissions.

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
