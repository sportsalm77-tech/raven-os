/**
 * Contract-only policy for future server-side operational records.
 * This module never grants access: authorization must be enforced on the server.
 */
export type RavenPortalRole = "platform" | "principal" | "teacher" | "family";
export type OperationalRecordKind = "decision" | "assignment" | "plan" | "evidence" | "impact";
export type OperationalRecordState = "draft" | "submitted" | "approved" | "closed";

export type OperationalRecordReference = Readonly<{
  id: string;
  schoolId: string;
  kind: OperationalRecordKind;
  state: OperationalRecordState;
  version: number;
  sourceId?: string;
}>;

export type ContractCheck = Readonly<{valid: boolean; errors: string[]}>;

const STATES: Record<OperationalRecordState,readonly OperationalRecordState[]> = {
  draft: ["submitted"],
  submitted: ["draft","approved"],
  approved: ["closed"],
  closed: [],
};

/** Structural validation only; never an authorization or tenant-isolation decision. */
export function validateOperationalReference(value: OperationalRecordReference): ContractCheck {
  const errors: string[] = [];
  if (!value.id.trim()) errors.push("missing_record_id");
  if (!value.schoolId.trim()) errors.push("missing_school_id");
  if (!["decision","assignment","plan","evidence","impact"].includes(value.kind)) errors.push("invalid_kind");
  if (!["draft","submitted","approved","closed"].includes(value.state)) errors.push("invalid_state");
  if (!Number.isSafeInteger(value.version) || value.version < 1) errors.push("invalid_version");
  if (value.sourceId !== undefined && !value.sourceId.trim()) errors.push("invalid_source_reference");
  return {valid: errors.length===0, errors};
}

/** Lifecycle proposal only; transitions require authenticated server authorization and audit. */
export function canProposeOperationalTransition(from: OperationalRecordState,to: OperationalRecordState): boolean {
  return (STATES[from]??[]).includes(to);
}

/** A plan can reference an assignment without duplicating its contents. */
export function validateCrossCenterReference(plan:OperationalRecordReference, linked:OperationalRecordReference):ContractCheck {
  const errors=[...validateOperationalReference(plan).errors,...validateOperationalReference(linked).errors];
  if (plan.kind!=="plan") errors.push("source_not_plan");
  if (!["decision","assignment","evidence","impact"].includes(linked.kind)) errors.push("unsupported_link_kind");
  if (plan.schoolId!==linked.schoolId) errors.push("cross_school_reference");
  if (plan.id===linked.id) errors.push("self_reference");
  return {valid:errors.length===0,errors};
}
