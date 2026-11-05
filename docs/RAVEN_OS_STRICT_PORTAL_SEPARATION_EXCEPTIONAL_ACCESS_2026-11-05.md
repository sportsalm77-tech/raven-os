# Raven OS — Strict Portal Separation and Exceptional Account Access Decision
**Date:** 2026-11-05  
**Status:** User-approved security/product decision; implementation not implied  
**Branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Core decision: strict separation of portal access

Raven OS must enforce strict separation between platform administration and all subscriber/user account spaces.

- The Platform Administrator has full authority within the Platform Management portal and its explicitly assigned platform-wide administration functions.
- Platform Administrator privileges do not automatically grant the ability to sign in as, impersonate, or open the Principal portal, Teacher portal, Student/Family account, individual subscriber account, or any other user's account.
- A platform-wide administrative role is not an implicit user-account session and must not be treated as one.
- Each user portal/session must be authorized independently according to the authenticated identity, membership, role, and permissions.

## 2. Normal account recovery comes first

When a school principal cannot access their account, the first route is the approved support-assisted password/account recovery process.

- Support must use a secure reset or recovery flow.
- No staff member may view or retrieve the user's existing password.
- Passwords or reusable authentication secrets must never be sent in clear text.
- Recovery actions must be auditable.

## 3. Exceptional, consent-based access to a school account

If normal recovery cannot resolve the issue and there is a legitimate support need to access the school account, an exceptional access request may be initiated.

Required sequence:
1. A support case is created and identifies the school, target account, reason, and requested scope.
2. Raven sends a confirmation request to the principal through a previously verified contact channel.
3. The principal explicitly approves the specific request using a secure, verifiable confirmation mechanism.
4. The approval is bound to the case, target account, requested scope, expiry, and one-time use. A generic message or an unverified forwarded statement is not sufficient.
5. Only after server-side verification may Raven grant a temporary, restricted exceptional-access session for the approved school account and purpose.
6. The session expires automatically and can be revoked. It must not create permanent membership, standing impersonation rights, or a reusable credential.

The user's described confirmation handoff (the principal sends the confirmation to the Platform Administrator) must be implemented as a verifiable approval, not as an ordinary message that an attacker or intermediary could forge or replay.

## 4. Scope and safeguards

- Exceptional access is denied by default.
- The request must be justified, scoped, time-limited, and approved by the target principal.
- The Platform Administrator must not silently bypass the principal's consent.
- The exceptional session must be visibly and technically distinguishable from the principal's normal session.
- Actions performed during exceptional access must be attributable to the actual Platform Administrator and the support case; they must not be falsely recorded as actions performed by the principal.
- Sensitive actions (for example, changing credentials, changing ownership, changing subscription/payment details, or creating another privileged administrator) should be excluded from exceptional access unless separately authorized through a distinct, stronger approval workflow.
- Every request, approval, denial, session start/end, revocation, and action must be recorded in tamper-resistant audit records with actor, target, case reference, reason, timestamps, and scope.
- Access must be revocable and monitored. Notify the principal about access start and completion where technically appropriate.

## 5. Security distinction

This decision distinguishes:
- Platform administration: manage the platform from the Platform Management portal.
- Account recovery: restore the legitimate user's ability to access their own account.
- Exceptional support access: a temporary, consent-based, audited access path to a narrowly scoped target account when recovery is insufficient.

These are separate capabilities and must not be conflated.

## 6. Explicit non-decisions

This decision does not select:
- An authentication/identity provider, database, session technology, MFA provider, or messaging provider.
- A specific verification channel or cryptographic confirmation protocol.
- A universal break-glass or emergency bypass that ignores user consent.
- Permanent support impersonation or unrestricted account takeover.
- Production implementation, migrations, live writes, or deployment.

Any emergency path for cases where the principal is unavailable or cannot provide consent requires a separate user-approved policy decision. It must not be inferred from this document.

## 7. Acceptance criteria

- Platform Administrator cannot enter another user's portal/account merely by virtue of platform-admin permissions.
- Normal password/account recovery is offered before exceptional access.
- Exceptional access cannot be established without verified, request-specific principal approval.
- Approval is single-use, scoped, expires, and is enforced server-side.
- Exceptional sessions are clearly distinguished and fully audited.
- Actions are attributed to the real actor, not misrepresented as the target user.
- No password disclosure or silent impersonation is possible.
- Denied, expired, replayed, or out-of-scope approvals cannot grant access.

## 8. Governance note

This document records the user's decision for strict separation and consent-based exceptional access. It does not claim that these controls are implemented or tested in the current application.
