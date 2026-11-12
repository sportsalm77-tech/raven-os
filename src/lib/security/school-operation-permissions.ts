/**
 * Explicit permission matrix for school operational centers.
 * This is a pure policy; callers must first verify identity and tenant
 * membership using the server and enforce RLS at the data boundary.
 */
export type SchoolRole = "school_admin" | "principal" | "vice_principal" | "teacher" | "family_guardian";
export type SchoolModule = "decisions" | "assignments" | "plans" | "evidence" | "impact" | "documents";
export type SchoolAction = "read" | "create" | "update" | "approve" | "close";

const permissions: Record<SchoolRole, Partial<Record<SchoolModule, readonly SchoolAction[]>>> = {
  school_admin: {
    decisions: ["read", "create", "update", "approve", "close"],
    assignments: ["read", "create", "update", "approve", "close"],
    plans: ["read", "create", "update", "approve", "close"],
    evidence: ["read", "create", "update", "approve", "close"],
    impact: ["read", "create", "update", "approve", "close"],
    documents: ["read", "create", "update", "approve", "close"],
  },
  principal: {
    decisions: ["read", "create", "update", "approve", "close"],
    assignments: ["read", "create", "update", "approve", "close"],
    plans: ["read", "create", "update", "approve", "close"],
    evidence: ["read", "create", "update", "approve", "close"],
    impact: ["read", "create", "update", "approve", "close"],
    documents: ["read", "create", "update", "approve", "close"],
  },
  vice_principal: {
    decisions: ["read", "create", "update"],
    assignments: ["read", "create", "update"],
    plans: ["read", "create", "update"],
    evidence: ["read", "create", "update"],
    impact: ["read", "create", "update"],
    documents: ["read", "create", "update"],
  },
  teacher: {
    assignments: ["read"],
    plans: ["read"],
    evidence: ["read", "create"],
    documents: ["read"],
  },
  family_guardian: {},
};

export function canPerformSchoolAction(
  role: string,
  moduleName: SchoolModule,
  action: SchoolAction,
): boolean {
  if (!Object.prototype.hasOwnProperty.call(permissions, role)) return false;
  const allowed = permissions[role as SchoolRole][moduleName];
  return Array.isArray(allowed) && allowed.includes(action);
}

export function canPerformInSchool(
  memberships: readonly Readonly<{ school_id: string | null; role: string; status: string }>[],
  schoolId: string,
  moduleName: SchoolModule,
  action: SchoolAction,
): boolean {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(schoolId)) return false;
  return memberships.some(m =>
    m.school_id === schoolId && m.status === "active" &&
    canPerformSchoolAction(m.role, moduleName, action)
  );
}
