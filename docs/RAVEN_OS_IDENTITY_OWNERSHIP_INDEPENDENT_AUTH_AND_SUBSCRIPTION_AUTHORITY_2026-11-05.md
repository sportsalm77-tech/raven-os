# RAVEN OS — IDENTITY OWNERSHIP, INDEPENDENT AUTHENTICATION & SUBSCRIPTION AUTHORITY
## Architecture Decision Record — 2026-11-05

**Status:** Approved direction; implementation and provider selection pending  
**Project:** Raven OS  
**Branch target:** `rescue/unified-arena-integration-2026-11-03`

## 1. Decision

Raven OS is the sole owner and authoritative source of user identity within the Raven ecosystem. Raven owns the identity lifecycle and its domain records, including accounts, school membership, user relationships, roles, permissions, and account status.

The long-term target is a fully independent Raven-controlled identity and authentication capability, even if its secure implementation takes longer. No external managed identity provider may become the owner of Raven accounts, school memberships, subscriptions, or authorization policy.

## 2. Authentication operating model

- Raven-controlled authentication is the primary system of record and the intended primary operating path.
- A secondary recovery/verification path may use a managed identity service when a legitimate user cannot sign in or complete recovery through the normal Raven-controlled process.
- The managed service is a supporting mechanism only. It must not silently replace Raven authentication, create a second Raven identity, grant portal access by itself, or change roles, memberships, permissions, or subscription status.
- A successful recovery must be securely bound to the existing Raven account, followed by Raven-controlled credential reset and session/token revocation as appropriate.
- If no authorized Raven identity-operations owner is available, the user may still complete a controlled recovery process. This is not unrestricted self-approval: the recovery path must verify control of trusted factors or use documented alternative identity verification, apply anti-abuse controls, and create an auditable record.
- The exact managed-service role, fallback sequence, verification factors, and provider remain undecided and require a separate security design and approval before implementation.

## 3. Strict separation from subscriptions and payments

Identity verification is not subscription verification.

Subscriptions, plans, entitlements, renewals, suspension, cancellation, and payment confirmation remain under Raven Platform administration and the authorized Raven Platform team.

A managed identity service must not:
- create, activate, renew, upgrade, or cancel a subscription;
- mark an invoice or payment as paid;
- grant paid features or subscription entitlements;
- treat successful sign-in, email/phone verification, or password recovery as proof of payment.

Subscription activation requires an independently verified subscription transaction and payment evidence through the approved Raven subscription/payment process. Banking/payment confirmation and subscription state must be validated separately from authentication. The precise payment integration and reconciliation controls remain subject to a separate decision.

## 4. Authorization and portal boundaries

After authentication or recovery, Raven itself evaluates account status, school membership, subscription entitlements, role, permissions, and portal access.

Authentication does not imply authorization. A platform administrator does not gain the ability to enter another user's portal or impersonate that user merely by virtue of platform administration. Exceptional account recovery and password reset must follow the separately approved Raven recovery and manual-verification controls.

The four approved portals remain:
- `/platform` — Platform Management
- `/principal` — School Principal
- `/teacher` — Teacher
- `/family` — Family

## 5. Security requirements before implementation

Any implementation must include, as applicable:
- secure password hashing and credential handling; no plaintext or retrievable passwords;
- rate limiting, abuse detection, secure recovery tokens, expiry, single-use semantics, and replay protection;
- multi-factor authentication support and secure session lifecycle;
- session/token revocation after credential recovery and sensitive account changes;
- audit records for authentication, recovery, administrative intervention, and subscription changes;
- server-side authorization and tenant isolation; never rely on UI hiding;
- protection against account enumeration, unauthorized account linking, privilege escalation, and cross-school access;
- tested backup, recovery, incident response, and key/secret management procedures.

No specific identity vendor, database, authentication framework, or payment provider is selected by this ADR.

## 6. Explicit non-decisions

This ADR does not authorize:
- adding an identity provider or dependency;
- selecting or provisioning a database;
- implementing production authentication, sessions, password recovery, or payment processing;
- creating accounts or changing live user data;
- changing subscription/payment policy beyond the authority separation stated above;
- merging to `main` or deploying.

Those steps require technical design, security review, and the relevant approval.

## 7. Acceptance principle

Raven remains the sole authority for identity ownership, authorization, and subscription entitlement. A supporting managed identity service may assist with exceptional sign-in recovery only, while all subscription and payment decisions remain in Raven's Platform Management domain.

---
**Decision source:** User-approved direction stated in the Raven OS engineering conversation on 2026-11-05.
