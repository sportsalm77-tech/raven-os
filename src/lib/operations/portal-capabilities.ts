import { authorizeOperationRead } from "@/lib/operations/authorize-operation";
import type { VerifiedRavenIdentity } from "@/lib/security/portal-authorization";

export type PortalOperationSurface = "principal" | "teacher" | "family" | "platform";

const principalModules = ["decisions", "assignments", "plans", "evidence", "impact", "documents"] as const;
const teacherModules = ["assignments", "plans", "evidence", "documents"] as const;

/**
 * Portal capability manifest, never a data response.
 * Platform governance is deliberately NOT granted access to school records.
 * Family access requires a separate child/guardian-scoped design and is denied.
 */
export function visibleOperationModules(
  identity: VerifiedRavenIdentity,
  portal: PortalOperationSurface,
  schoolId: string,
): string[] {
  const candidates: readonly string[] =
    portal === "principal" ? principalModules :
    portal === "teacher" ? teacherModules : [];
  return candidates.filter(moduleName =>
    authorizeOperationRead(identity, moduleName, schoolId).allowed
  );
}
