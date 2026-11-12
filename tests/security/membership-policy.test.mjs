import test from "node:test";
import assert from "node:assert/strict";
import { evaluateMembership } from "../../src/lib/security/membership-policy.ts";

const session = {
  subjectId: "user-a", sessionId: "session-a",
  verifiedAt: "2026-11-12T08:00:00Z", expiresAt: "2026-11-12T12:00:00Z",
  mfaVerified: true,
};
const membership = {
  subjectId: "user-a", schoolId: "school-a", role: "teacher",
  portal: "teacher", status: "active",
};
const base = {
  session, membership, requestedPortal: "teacher",
  requestedSchoolId: "school-a", now: "2026-11-12T09:00:00Z",
};
function reason(changes) { return evaluateMembership({ ...base, ...changes }).reason; }

test("active teacher with matching verified session and tenant is eligible", () => {
  assert.equal(reason({}), "authorized");
});
test("missing and malformed sessions are denied", () => {
  assert.equal(reason({ session: null }), "invalid_session");
  assert.equal(reason({ session: { ...session, sessionId: "" } }), "invalid_session");
});
test("expired and future-dated sessions are denied", () => {
  assert.equal(reason({ session: { ...session, expiresAt: base.now } }), "expired_session");
  assert.equal(reason({ session: { ...session, verifiedAt: "2026-11-13T00:00:00Z" } }), "expired_session");
});
test("cross-school, wrong portal and wrong subject are denied", () => {
  assert.equal(reason({ requestedSchoolId: "school-b" }), "tenant_mismatch");
  assert.equal(reason({ requestedPortal: "principal" }), "portal_mismatch");
  assert.equal(reason({ membership: { ...membership, subjectId: "user-b" } }), "identity_mismatch");
});
test("inactive and invalid membership are denied", () => {
  for (const status of ["invited", "suspended", "revoked"]) {
    assert.equal(reason({ membership: { ...membership, status } }), "inactive_membership");
  }
  assert.equal(reason({ membership: { ...membership, role: "unknown" } }), "invalid_membership");
});
test("administrators require verified MFA", () => {
  const leader = { ...membership, role: "principal", portal: "principal" };
  assert.equal(reason({ membership: leader, requestedPortal: "principal",
    session: { ...session, mfaVerified: false } }), "mfa_required");
});
test("platform identity cannot be attached to a school", () => {
  const platform = { ...membership, role: "platform_super_admin", portal: "platform", schoolId: null };
  assert.equal(reason({ membership: platform, requestedPortal: "platform", requestedSchoolId: null }), "authorized");
  assert.equal(reason({ membership: { ...platform, schoolId: "school-a" },
    requestedPortal: "platform", requestedSchoolId: null }), "tenant_mismatch");
});
