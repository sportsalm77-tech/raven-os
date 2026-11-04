/** Engine 3 — workflow instances, task ownership, deadlines, and blockers. */
import type { SchoolScoped, DomainValidation } from "./shared";
import { result, validateRequired, assertSchoolScope, assertTransition } from "./shared";

export type WorkflowState = "queued" | "in_progress" | "blocked" | "completed" | "cancelled";
export type WorkflowInstance = SchoolScoped & Readonly<{
  templateId: string;
  sourceRecordType: "administrative_action" | "operational_plan" | "plan_initiative" | "plan_program" | "evidence_review";
  sourceRecordId: string;
  ownerId: string;
  dueAt: string;
  state: WorkflowState;
  blockerReason: string | null;
  completedAt: string | null;
  evidenceRefs: readonly string[];
}>;
const transitions: Readonly<Record<WorkflowState, readonly WorkflowState[]>> = {
  queued:["in_progress","cancelled"], in_progress:["blocked","completed","cancelled"],
  blocked:["in_progress","cancelled"], completed:[], cancelled:[],
};
export function validateWorkflow(w: WorkflowInstance): DomainValidation {
  const errors: string[]=[]; validateRequired(w.id,"id",errors); validateRequired(w.schoolId,"schoolId",errors);
  validateRequired(w.templateId,"templateId",errors); validateRequired(w.sourceRecordId,"sourceRecordId",errors); validateRequired(w.ownerId,"ownerId",errors);
  if (!Number.isFinite(Date.parse(w.dueAt))) errors.push("dueAt must be a valid date");
  if (w.state==="blocked" && !w.blockerReason?.trim()) errors.push("blocked workflows require blockerReason");
  if (w.state==="completed" && !w.completedAt) errors.push("completed workflows require completedAt");
  return result(errors);
}
export function transitionWorkflow(w: WorkflowInstance,next:WorkflowState,actorId:string,at:string,blockerReason?:string):WorkflowInstance {
  assertTransition(w.state,next,transitions);
  if(next==="blocked"&&!blockerReason?.trim()) throw new Error("RAVEN_BLOCKER_REASON_REQUIRED");
  if(next==="completed"&&!Number.isFinite(Date.parse(at))) throw new Error("RAVEN_COMPLETION_TIMESTAMP_REQUIRED");
  return Object.freeze({...w,state:next,blockerReason:next==="blocked"?blockerReason!:null,completedAt:next==="completed"?at:w.completedAt,updatedBy:actorId,updatedAt:at,version:w.version+1});
}
export function isWorkflowOverdue(w:WorkflowInstance,now:string):boolean {
  return w.state!=="completed"&&w.state!=="cancelled"&&Number.isFinite(Date.parse(now))&&Date.parse(w.dueAt)<Date.parse(now);
}
export function assertWorkflowSchool(w:WorkflowInstance,actorSchoolId:string|null):void {assertSchoolScope(w.schoolId,actorSchoolId);}
