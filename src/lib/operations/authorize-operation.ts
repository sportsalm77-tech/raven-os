import { canPerformInSchool } from "@/lib/security/school-operation-permissions";
import type { VerifiedRavenIdentity } from "@/lib/security/portal-authorization";
import { isRavenOperationModule, type RavenOperationModule } from "@/lib/operations/school-module-registry";

export type OperationAccessResult =
  | { allowed: true; moduleName: RavenOperationModule; schoolId: string; userId: string }
  | { allowed: false; reason: "invalid_module" | "invalid_school" | "forbidden" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Server-only authorization decision for operations.
 * Identity MUST be produced by lookupIdentity. This does not grant database
 * access: every query also needs user-JWT-scoped RLS and an explicit tenant filter.
 */
export function authorizeOperationRead(
  identity: VerifiedRavenIdentity,
  moduleName: string | null,
  schoolId: string | null,
): OperationAccessResult {
  if (!moduleName || !isRavenOperationModule(moduleName)) {
    return { allowed: false, reason: "invalid_module" };
  }
  if (!schoolId || !UUID.test(schoolId)) {
    return { allowed: false, reason: "invalid_school" };
  }
  if (!canPerformInSchool(identity.schoolMemberships, schoolId, moduleName, "read")) {
    return { allowed: false, reason: "forbidden" };
  }
  return { allowed: true, moduleName, schoolId, userId: identity.user.id };
}
