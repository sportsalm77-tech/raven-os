# RAVEN OS — Unified Family Identity, Student Sign-In & Quick Access Contract
**Date:** 2026-11-06  
**Decision reference:** TWO POINT FOUR  
**Status:** Owner-directed architecture decision — approved principles; technical integrations remain subject to verification  
**Target branch:** `rescue/unified-arena-integration-2026-11-03`  
**Scope:** Family portal identity, cross-school family linking, student sign-in using Madrasati identity, and role-scoped QR Quick Access.

---

## 1. Purpose and governing principles

This contract records the decisions discussed for a consistent, low-friction and secure sign-in model across Raven OS. It extends the existing student/guardian relationship contract; it does not replace it and does not create a parallel student or school database.

Governing principles:

- One unified Raven account identity and one Raven-managed password serve the family and its linked students across participating schools and education stages.
- Each student retains an independent canonical student identity, school enrollment, school scope, and student permissions; unified sign-in does not merge student records or grant cross-child access.
- A verified Madrasati student email/username may be used as a Raven sign-in identifier after validation. Reuse of a Madrasati password is conditional on a supported, official authentication federation/integration; it must not be achieved by importing, extracting, or storing the password.
- Student and family are distinct authorized contexts/roles under the unified Raven account, not separate passwords.
- QR Quick Access is role-limited. It is not a replacement for the central identity provider or authorization checks.
- School boundaries and guardian-to-student authorization are enforced server-side on every protected request.
- No production integration or live credential behavior is claimed by this document.

## 2. Identity model

### 2.1 Canonical student identity

Each student has one canonical Raven student record, governed by:
`docs/STUDENT_RECORDS_ENROLLMENT_GUARDIAN_ACCESS_CONTRACT_2026-11-04.md`

The student record is distinct from:
- Madrasati account identifiers and authentication credentials.
- Enrollment in one or more schools over time.
- Class membership.
- Verified guardian relationships.
- The student's Raven access method.

A student may be enrolled in a primary, intermediate, secondary, boys', or girls' school, subject to the platform's approved tenant and enrollment rules. The student's family association does not merge student records or school records.

### 2.2 Unified family identity

Raven OS provides one unified platform-level Raven account for family/student sign-in rather than creating a separate family login or password for every child or school.

- One family identity can be associated with multiple verified guardian-to-student relationships.
- The family can include multiple children enrolled in different Raven-participating schools.
- Adding a child from another participating school must not create a second family password when a verified family identity already exists.
- The family identity is a grouping and access context; it does not grant access by itself. Access to each child remains dependent on an active, verified relationship and the child's school/resource permissions.
- A school may initiate a link request for its enrolled student, but it must not search other schools' student rosters or view the family's other children.
- Cross-school matching must use approved reliable identifiers and verification workflow. Name similarity, shared phone number, or a student email alone is not proof of family identity or legal relationship.
- Conflicts and uncertain matches go to authorized human review; no automatic family merge or guardian link is permitted.

### 2.3 Unified Raven username and password

The student and family contexts use the same unified Raven account identity and one Raven-managed password:

- One password serves the linked family and student contexts regardless of the number of children, their education stages, or their participating schools.
- Raven may issue one temporary initial Raven password through the approved secure handover process; it must be changed after first sign-in.
- Linking another verified child must not create another account or issue another password.
- A verified Madrasati student email/username may be used as a sign-in identifier after source, ownership, and uniqueness validation.
- Where several children have distinct Madrasati identifiers, the account-linking design may map verified identifiers to the same unified Raven account only after collision, ownership, and account-recovery risks are resolved. No automatic or silent merge is allowed.
- The Raven password is not the Madrasati password. Reuse of the latter requires official supported federation.
- A school must not be able to view or retrieve the current Raven password.

The exact primary identifier, safe multi-identifier mapping, recovery channel, and separate access for additional adult guardians remain technical/owner approval gates; this contract does not silently decide them.

## 3. Student sign-in using Madrasati identity

### 3.1 Username

Each student has a Madrasati username/email identifier in the school's source data. When that value is imported and validated through the Unified School Data Center:

- Raven may use the student's Madrasati email/username as the Raven student username.
- The identifier is linked to the canonical Raven student ID and the appropriate school enrollment.
- The import pipeline validates format, source provenance, tenant scope, and uniqueness/conflict conditions.
- If the identifier changes or conflicts, the system routes the change through an authorized reconciliation process; it must not silently reassign an account to another student.
- The Madrasati email identifies a student sign-in alias only after validation; it does not by itself prove authentication, unified-account ownership, or a guardian relationship.

### 3.2 Password reuse and authentication federation

The owner-approved sign-in objective is one Raven-managed password for the unified family/student account. A Madrasati username/email may be used as a sign-in identifier after validation. The same Madrasati password may be accepted only if an official, supported authentication integration permits it; this is a separate capability and is not assumed by the unified-account decision.

Required implementation conditions:

1. Verify that the relevant Madrasati authority provides an approved authentication protocol/API or identity federation suitable for Raven OS.
2. Use the supported federation flow (for example, an approved SSO/OIDC/SAML arrangement where actually offered); do not infer availability of a protocol.
3. Raven receives and validates a signed authentication result/token and maps the verified external subject to the unified Raven account and the relevant canonical student identity without merging student records.
4. Raven does not request, import, scrape, log, or store the student's Madrasati password.
5. Raven validates issuer, audience, signature, expiry, nonce/state, redirect URI, and replay protections as applicable to the selected protocol.
6. Raven independently applies its own school tenant, role, student status, and resource authorization after authentication.
7. Logout, session expiry, account disablement, and credential changes follow the documented integration capabilities and Raven session policy.

**Critical boundary:** importing the Madrasati email/username from Excel or a school data export is not authentication federation. A data export does not provide a legitimate way to validate or reuse the student's Madrasati password.

### 3.3 Fallback if official federation is unavailable

If the Madrasati authority does not provide an approved integration for authentication:

- Raven must not claim that Madrasati passwords work in Raven.
- Raven may use the imported Madrasati identifier as the username, subject to policy.
- The unified account uses its approved Raven-managed password or another owner-approved identity method; this is not represented as Madrasati password compatibility.
- This fallback must be clearly communicated and must not silently attempt to test Madrasati credentials against an unofficial endpoint.
- The owner must approve the fallback credential issuance and recovery policy before implementation.

No student password is generated solely because a student has been imported if a supported federation is available.

## 4. Cross-school family linking workflow

1. A participating school imports/enrolls the student through the Unified School Data Center.
2. The system validates the student identifier and the minimum approved guardian-link information.
3. The school submits a family-link request for the student; it does not create a duplicate family account by default.
4. Raven checks for the existing unified Raven account using approved stable identifiers and verified relationships; it must not create a duplicate account or password for a linked child.
5. If the existing unified account and guardian relationship are confidently verified under the approved policy, Raven links the new canonical student record to that account through an authorized workflow.
6. If no unified account exists, the system initiates first-time account creation and one secure Raven password handover.
7. If matching or relationship evidence is incomplete or conflicting, the request is held for human verification; no access is granted while pending.
8. Once verified, the new child appears in the family portal, while the school sees only its own enrollment and the status of its own request.
9. Every creation, verification, rejection, correction, and revocation is audited.

The existing guardian relationship contract remains authoritative for verification, revocation, and per-request authorization. This contract does not approve any particular legal-document, national-ID, or contact-data collection method; those require separate privacy/legal and owner approval.

## 5. Family portal authorization

The Family portal remains at `/family`. Its twelve approved functional sections remain the design baseline.

For every child-specific read or action, Raven must:

1. Authenticate the family identity/session.
2. Resolve the selected canonical student on the server.
3. Verify an active, verified guardian-to-student relationship for the authenticated family identity.
4. Resolve and verify the child's school tenant and active enrollment context.
5. Apply resource-level and field-level permissions for the requested data/action.
6. Return only the approved projection for that child and purpose.
7. Record security-relevant access and changes according to the audit policy.

The client-side child selector is navigation only. A changed URL, student ID, browser state, QR, or cached view must never bypass server authorization. Revoking a relationship must block subsequent requests and invalidate relevant cached access promptly.

A family may see multiple children in one portal session, but the session does not collapse school boundaries. Each child's data remains tenant-scoped and independently authorized.

## 6. Raven Quick Access — QR policy

### 6.1 Role policy

| Role | QR Quick Access |
|---|---|
| Platform Super Admin / platform manager | **Prohibited** |
| School principal / school manager | **Prohibited** |
| Teacher | **Permitted** |
| Student | **Permitted** |
| Family / guardian | **Permitted only by request, school verification/approval, and documented acknowledgement** |

The prohibition for platform and school administrators is intentional and must be enforced by the identity service, not merely by hiding a UI option.

### 6.2 Teacher and student

- Quick Access is an optional convenience method linked to the central identity provider.
- A student QR may identify or initiate a login flow, but a printed/static QR must not by itself provide permanent unrestricted account access.
- Use short-lived, single-use challenges/tokens, replay prevention, appropriate device/session controls, and additional student verification where required by the school's approved policy.
- Teacher access must be bound to the teacher's identity and authorized device/session flow.
- All successful and failed attempts are rate-limited and audited.

### 6.3 Family / guardian QR

The family QR option is available only after the guardian requests it and the school completes the approved verification and approval workflow.

- The school records the request and the guardian's signed acknowledgement of the service terms and safe-use responsibilities.
- The platform issues the QR credential through the central identity service; the school does not create, read, or retain the secret credential.
- The QR must not contain a password, reusable bearer secret, student data, or personal information.
- Prefer a short-lived, single-use activation/login challenge or a device-binding flow with explicit confirmation, revocation, expiry, and session controls.
- A permanent image that can be copied and used indefinitely is not an acceptable implementation.
- The guardian can revoke the QR/device authorization; the school may submit a revocation request under its approved authority.
- The acknowledgement records the guardian's responsibilities but does not waive Raven's own security, privacy, or legal obligations.

The exact QR interaction (guardian device scans a school login challenge, school device scans a guardian challenge, or another supported flow) is an implementation choice to be tested and approved. The role policy above is the governing decision.

### 6.4 Administrator exclusion

Neither the platform manager nor the school principal may use QR Quick Access, issue a QR to themselves, or impersonate a teacher, student, or guardian through this service. Their access requires the separately approved stronger administrative authentication policy.

## 7. Data ownership and service boundaries

| Component | Responsibility |
|---|---|
| Unified School Data Center | Canonical student data, school enrollment references, import provenance and reconciliation |
| Central Identity Provider | Authentication, sessions, credential lifecycle, external federation and QR challenge validation |
| Family Identity / Relationship service | Family identity and verified guardian-to-student relationships |
| School tenant / RBAC services | School scope, role permissions, resource and field authorization |
| Family portal | Permission-filtered presentation and approved family actions |
| Audit service | Security events, credential lifecycle metadata and privileged actions |

This is a logical service boundary, not authorization to create a separate family database or duplicate student master. Storage design must reuse the approved Raven data/identity architecture after it is inspected and approved.

## 8. Security, privacy and operational requirements

- Never store plaintext passwords or log credentials, QR secrets, authentication codes, or bearer tokens.
- Use approved password hashing only for Raven-managed credentials; externally federated passwords remain with the external identity provider.
- Protect session cookies/tokens with appropriate secure attributes, expiry, rotation, CSRF protections where applicable, and server-side revocation.
- QR tokens/challenges must be cryptographically random, scoped, short-lived, single-use where appropriate, replay-resistant, rate-limited, and revocable.
- Apply tenant isolation and guardian relationship authorization on every protected request.
- Do not disclose whether a family account exists to an unauthorized school or requester.
- Avoid unnecessary collection of national IDs, personal emails, phone numbers, or other sensitive data; approve purpose, legal basis, access, and retention first.
- Audit account creation, credential reset, federation mapping, family link creation/review/revocation, QR issuance/use/revocation, access denials, and privileged actions.
- Provide safe recovery, lost-device handling, family-link dispute handling, and account-compromise response before production activation.
- Never treat a signed acknowledgement as a substitute for technical security controls or as a blanket waiver of platform responsibility.

## 9. Required acceptance tests

1. A student with valid supported Madrasati federation can authenticate without a second Raven password.
2. Raven never receives or stores the student's Madrasati password.
3. If federation is unavailable, Raven clearly uses the approved fallback and does not claim Madrasati password compatibility.
4. An imported Madrasati email/username alone cannot authenticate a student.
5. Duplicate or conflicting student usernames are quarantined for authorized resolution.
6. A student username maps to the correct canonical student and tenant.
7. One family identity can be linked to multiple verified children across multiple participating schools.
8. A second school cannot create a duplicate family password when a verified family identity already exists.
9. A school cannot discover or read another school's student roster or the family's other children's records.
10. A guardian cannot access an unverified, revoked, or unrelated student.
11. Changing a student ID, URL, client state, or request payload cannot bypass guardian authorization.
12. Each child's resources are checked independently for school, relationship, and field-level permission.
13. Platform and school administrators cannot obtain or use QR Quick Access.
14. Teachers and students can use only their approved QR flows.
15. Family QR cannot be activated without request, verification/approval, and acknowledgement.
16. Expired, used, revoked, copied, or replayed QR challenges fail safely.
17. A lost device/session can be revoked without changing unrelated family/student identities.
18. Credential and QR secrets never appear in logs, audit payloads, exports, or client-visible data.
19. Family link conflicts are held for review; no automatic merge occurs.
20. Arabic RTL, English LTR, responsive behavior, accessibility, and session-expiry states are verified.

## 10. Decisions recorded vs. implementation gates

### Owner-directed principles recorded in this contract

- One unified Raven account identity for student and family sign-in across participating schools and education stages.
- One Raven-managed password, issued once through secure handover and changed after first sign-in.
- No duplicate account or password when another verified child is linked.
- A validated Madrasati student username/email may be used as a sign-in identifier; multiple child identifiers may map to one account only through an explicitly designed and verified mapping process.
- Reuse of the Madrasati password is conditional on official supported authentication federation; it is never imported or stored by Raven.
- Student records, family/guardian relationships, roles, school memberships, and permissions remain separate and independently authorized.
- QR Quick Access is allowed for teachers and students.
- Family QR is allowed only on guardian request with school verification/approval and signed acknowledgement.
- QR Quick Access is prohibited for platform and school administrators.
- Family portal remains `/family`; the twelve-section design baseline is preserved.
- No parallel student master or school data store is created.

### Technical/legal gates not yet proven or approved

- Availability, terms, protocol, and technical documentation for official Madrasati authentication federation.
- Exact family username format and account recovery channel.
- Whether multiple adult guardians may have separate credentials linked to one family identity.
- Approved guardian verification evidence and legal/privacy basis.
- Exact QR ceremony, trusted-device policy, expiry values, and session duration.
- Exact school approval authority and signed acknowledgement wording.
- Identity provider, database, token/session storage, and audit persistence selection.
- Production tenant-isolation, security, privacy, recovery, and end-to-end acceptance evidence.

## 11. Activation rule

This contract is an architecture and policy record. It does not itself implement or activate:
- Madrasati SSO/federation;
- student credential reuse;
- family account issuance or recovery;
- cross-school family matching/linking;
- QR issuance or login;
- live Family portal data access.

Implementation may begin only after inspecting the current identity/data architecture, verifying official Madrasati integration capability, approving unresolved owner/privacy decisions, and defining backend contracts and acceptance tests. No live credential integration may be simulated or represented as complete.

---

**Engineering conclusion**

Raven OS should minimize duplicate credentials without weakening identity boundaries: reuse Madrasati authentication only through an official federation; maintain one centrally managed family identity across participating schools; preserve independent student identities and school tenancy; and provide QR convenience only to the explicitly permitted roles under revocable, auditable security controls.

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
