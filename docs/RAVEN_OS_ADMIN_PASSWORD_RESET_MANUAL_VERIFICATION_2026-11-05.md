# Raven OS — Administrative Password Reset and Manual Identity Verification Addendum
**Date:** 2026-11-05  
**Status:** User-approved policy clarification; implementation not implied  
**Branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Purpose and relationship to prior decision

This addendum clarifies the exceptional account-support policy in `RAVEN_OS_STRICT_PORTAL_SEPARATION_EXCEPTIONAL_ACCESS_2026-11-05.md`.

Raven platform administration is authorized to reset a school's account password through the school's management record/page in the Raven platform. This is an account-recovery capability; it does not grant the Platform Administrator a normal sign-in session as the principal or unrestricted access to the school's portal.

## 2. Two approved recovery paths

### Path A — electronic confirmation

1. The support request is associated with the relevant school and principal account.
2. Raven sends a notification/confirmation request to the principal using the verified contact details on record.
3. The principal provides the requested confirmation or code.
4. After validating the confirmation, authorized Raven support/platform administration resets the password through the school's Raven management record.
5. The principal is notified that the password was reset and is provided with the approved secure next step to regain access.

### Path B — manual identity verification when electronic confirmation is unavailable

If the principal cannot provide the electronic code/confirmation, Raven may proceed without that electronic confirmation after direct identity verification through an alternative method, such as:
- A direct telephone call using a previously verified contact number and appropriate identity checks.
- In-person identity verification by an authorized Raven representative.
- Another reliable, documented verification method approved by Raven.

Once the authorized team is satisfied that the requester is the legitimate principal or authorized account owner, it may reset the password directly through the school's management record/page in Raven.

The absence of an electronic code must not itself be treated as proof of identity. The alternative verification must actually be completed and recorded before the reset.

## 3. Required controls

- Only specifically authorized platform/support personnel may perform this reset.
- The reset must be tied to a support case identifying the school, target account, reason, verifying staff member, verification method, and timestamp.
- Record the verification outcome and evidence reference; avoid collecting or retaining unnecessary identity documents or sensitive personal data.
- Never retrieve, display, or disclose the old password.
- Use a secure password reset/temporary credential issuance flow; do not send a permanent password in an insecure channel.
- Notify the principal through the verified contact channel after the reset, where possible.
- Require the principal to establish their own new password at the next secure opportunity; revoke affected sessions or recovery tokens as appropriate.
- Audit who initiated, verified, approved, and executed the reset, and when.
- The action must be recorded as an administrative password reset, not as a login or action performed by the principal.

## 4. Strict portal separation remains in force

This password-reset authority does not grant the Platform Administrator permission to:
- Sign in as the principal or impersonate the principal.
- Open the principal's normal portal session merely by virtue of platform-admin privileges.
- Read or retrieve the principal's password.
- Perform ordinary school operations as the principal.

After the reset, the principal signs in through Raven's single sign-in entry using their own credentials. Portal routing and permissions continue to be determined by the authenticated identity, membership, subscription, role, and server-side authorization.

## 5. Scope clarification

The user has approved direct administrative password reset after manual identity verification when electronic confirmation is unavailable. This is distinct from the earlier exceptional-access mechanism for entering a user's account. The approved recovery path is password reset and restoration of the legitimate user's access, not silent impersonation.

Any broader emergency access or impersonation capability remains unapproved and requires a separate decision.

## 6. Acceptance criteria

- An authorized Raven administrator can initiate a password reset from the school's management record.
- Electronic confirmation is the normal path.
- If electronic confirmation cannot be completed, a documented alternative identity-verification method can authorize the reset.
- No reset occurs solely because the code was unavailable.
- No staff member can view the old password.
- The principal is notified and regains access using their own credentials.
- The reset is auditable and does not create an administrator session as the principal.
- Strict separation between platform administration and subscriber portals remains enforced.

## 7. Governance note

This addendum records the user's clarification and supersedes any interpretation of the prior exceptional-access decision that would require electronic principal approval in every password-reset case. It does not claim that the workflow is implemented, tested, or production-ready.
