import { test } from "node:test";
import assert from "node:assert/strict";
import { canPerformSchoolAction, canPerformInSchool } from "../../src/lib/security/school-operation-permissions.ts";

const a = "11111111-1111-4111-8111-111111111111";
const b = "22222222-2222-4222-8222-222222222222";

test("principal may approve decisions and plans", () => {
  assert.equal(canPerformSchoolAction("principal", "decisions", "approve"), true);
  assert.equal(canPerformSchoolAction("principal", "plans", "approve"), true);
});

test("vice principal cannot approve or close records", () => {
  assert.equal(canPerformSchoolAction("vice_principal", "plans", "approve"), false);
  assert.equal(canPerformSchoolAction("vice_principal", "assignments", "close"), false);
});

test("teacher access is limited and cannot approve", () => {
  assert.equal(canPerformSchoolAction("teacher", "evidence", "create"), true);
  assert.equal(canPerformSchoolAction("teacher", "decisions", "read"), false);
  assert.equal(canPerformSchoolAction("teacher", "evidence", "approve"), false);
});

test("family role has no operational access", () => {
  assert.equal(canPerformSchoolAction("family_guardian", "documents", "read"), false);
});

test("unknown roles fail closed", () => {
  assert.equal(canPerformSchoolAction("superuser", "decisions", "read"), false);
});

test("school membership must match tenant and be active", () => {
  const memberships = [{ school_id: a, role: "principal", status: "active" }];
  assert.equal(canPerformInSchool(memberships, a, "decisions", "approve"), true);
  assert.equal(canPerformInSchool(memberships, b, "decisions", "approve"), false);
  assert.equal(canPerformInSchool([{ ...memberships[0], status: "suspended" }], a, "decisions", "approve"), false);
});
