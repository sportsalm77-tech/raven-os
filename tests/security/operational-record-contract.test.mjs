import test from "node:test";
import assert from "node:assert/strict";
import {
  validateOperationalReference,
  validateCrossCenterReference,
  canProposeOperationalTransition,
} from "../../src/lib/operations/record-contract.ts";

const plan={id:"plan-1",schoolId:"school-A",kind:"plan",state:"draft",version:1};
const assignment={id:"assignment-1",schoolId:"school-A",kind:"assignment",state:"submitted",version:2};

test("valid operational record reference",()=>{
  assert.equal(validateOperationalReference(plan).valid,true);
  assert.equal(validateOperationalReference({...plan,schoolId:""}).valid,false);
  assert.equal(validateOperationalReference({...plan,version:0}).valid,false);
});
test("cross-center references reject cross-school and self links",()=>{
  assert.equal(validateCrossCenterReference(plan,assignment).valid,true);
  assert.ok(validateCrossCenterReference(plan,{...assignment,schoolId:"school-B"}).errors.includes("cross_school_reference"));
  assert.ok(validateCrossCenterReference(plan,{...assignment,id:plan.id}).errors.includes("self_reference"));
});
test("lifecycle proposals never skip approval or reopen closure",()=>{
  assert.equal(canProposeOperationalTransition("draft","approved"),false);
  assert.equal(canProposeOperationalTransition("draft","submitted"),true);
  assert.equal(canProposeOperationalTransition("submitted","approved"),true);
  assert.equal(canProposeOperationalTransition("approved","closed"),true);
  assert.equal(canProposeOperationalTransition("closed","draft"),false);
});
