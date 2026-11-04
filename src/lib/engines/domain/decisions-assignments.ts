/** Engine 2 — decisions, assignments, circulars, letters, workshops, and visits. */
import type { SchoolScoped, DomainValidation } from "./shared";
import { result, validateRequired, validateIsoDate, assertSchoolScope, assertTransition } from "./shared";

export type AdministrativeActionType = "decision" | "assignment" | "circular" | "letter" | "workshop" | "professional_development" | "field_visit";
export type AdministrativeActionState = "draft" | "submitted" | "approved" | "active" | "completed" | "rejected" | "archived";
export type AdministrativeAction = SchoolScoped & Readonly<{
  actionType: AdministrativeActionType;
  title: string;
  body: string;
  ownerStaffId: string | null;
  participantStaffIds: readonly string[];
  startsAt: string | null;
  dueAt: string | null;
  state: AdministrativeActionState;
  operationalPlanRefs: readonly string[];
  evidenceRefs: readonly string[];
  approvedBy: string | null;
  approvedAt: string | null;
  closedAt: string | null;
}>;
const transitions: Readonly<Record<AdministrativeActionState, readonly AdministrativeActionState[]>> = {
  draft: ["submitted", "archived"], submitted: ["approved", "rejected"], approved: ["active", "archived"],
  active: ["completed", "archived"], completed: ["archived"], rejected: ["draft", "archived"], archived: [],
};
export function validateAdministrativeAction(a: AdministrativeAction): DomainValidation {
  const errors: string[] = []; validateRequired(a.id,"id",errors); validateRequired(a.schoolId,"schoolId",errors); validateRequired(a.title,"title",errors);
  if (a.startsAt && !Number.isFinite(Date.parse(a.startsAt))) errors.push("startsAt must be a valid date");
  if (a.dueAt && !Number.isFinite(Date.parse(a.dueAt))) errors.push("dueAt must be a valid date");
  if (a.startsAt && a.dueAt && Date.parse(a.dueAt) < Date.parse(a.startsAt)) errors.push("dueAt cannot precede startsAt");
  if (a.state === "approved" && (!a.approvedBy || !a.approvedAt)) errors.push("approved actions require approver and timestamp");
  if (a.state === "completed" && !a.closedAt) errors.push("completed actions require closedAt");
  return result(errors);
}
export function transitionAdministrativeAction(a: AdministrativeAction, next: AdministrativeActionState, actorId: string, at: string): AdministrativeAction {
  assertTransition(a.state,next,transitions);
  if (next === "approved" && a.actionType !== "decision" && a.actionType !== "assignment" && !actorId) throw new Error("RAVEN_APPROVER_REQUIRED");
  if (next === "approved" && (!actorId || !Number.isFinite(Date.parse(at)))) throw new Error("RAVEN_APPROVER_REQUIRED");
  return Object.freeze({...a,state:next,approvedBy:next==="approved"?actorId:a.approvedBy,approvedAt:next==="approved"?at:a.approvedAt,closedAt:next==="completed"?at:a.closedAt,updatedBy:actorId,updatedAt:at,version:a.version+1});
}
export function assertAdministrativeActionSchool(a: AdministrativeAction, actorSchoolId: string | null): void { assertSchoolScope(a.schoolId,actorSchoolId); }
