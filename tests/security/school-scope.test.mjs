import { test } from "node:test";
import assert from "node:assert/strict";
import { assertSchoolScope, schoolScopedInsert, SchoolScopeViolation } from "../../src/lib/security/school-scope.ts";

const schoolA = "11111111-1111-4111-8111-111111111111";
const schoolB = "22222222-2222-4222-8222-222222222222";

test("same-school related records pass", () => {
  assert.doesNotThrow(() => assertSchoolScope(schoolA, { school_id: schoolA }, { school_id: schoolA }));
});

test("cross-school records fail closed", () => {
  assert.throws(() => assertSchoolScope(schoolA, { school_id: schoolB }), SchoolScopeViolation);
});

test("empty or invalid school scope is rejected", () => {
  assert.throws(() => assertSchoolScope("invalid", { school_id: schoolA }), SchoolScopeViolation);
  assert.throws(() => assertSchoolScope(schoolA), SchoolScopeViolation);
});

test("insert always derives school_id from verified context", () => {
  assert.deepEqual(schoolScopedInsert(schoolA, { title: "Plan" }), {
    title: "Plan", school_id: schoolA,
  });
});

test("injected cross-school school_id is rejected", () => {
  assert.throws(() => schoolScopedInsert(schoolA, { school_id: schoolB, title: "Plan" }), SchoolScopeViolation);
});
