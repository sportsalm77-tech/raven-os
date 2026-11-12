import { test } from "node:test";
import assert from "node:assert/strict";
import { getOperationTransition, isTerminalOperationStatus } from "../../src/lib/operations/status-workflow.ts";

test("draft can be submitted but cannot be approved directly", () => {
  assert.equal(getOperationTransition("draft", "submit")?.to, "submitted");
  assert.equal(getOperationTransition("draft", "approve"), null);
});
test("submitted can be approved or returned for revision", () => {
  assert.equal(getOperationTransition("submitted", "approve")?.to, "approved");
  assert.equal(getOperationTransition("submitted", "return")?.to, "draft");
});
test("only approved records can close", () => {
  assert.equal(getOperationTransition("approved", "close")?.to, "closed");
  assert.equal(getOperationTransition("submitted", "close"), null);
});
test("closed records cannot be transitioned", () => {
  for (const action of ["submit", "approve", "return", "close"]) {
    assert.equal(getOperationTransition("closed", action), null);
  }
  assert.equal(isTerminalOperationStatus("closed"), true);
});
test("unrecognized states and actions are rejected", () => {
  assert.equal(getOperationTransition("deleted", "approve"), null);
  assert.equal(getOperationTransition("draft", "publish"), null);
});
