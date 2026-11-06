/**
 * Fail-closed authorization primitives for Raven OS server code.
 *
 * IMPORTANT: TrustedActor must be created only from a verified server-side session.
 * Never construct it from request JSON, query parameters, or client-side state.
 * This module is a policy foundation, not an authentication provider or session store.
 */
import "server-only";

export type RavenPortal = "platform" | "principal" | "teacher" | "family";
export type RavenRole =
  | "platform_super_admin"
  | "platform_system_admin"
  | "school_admin"
  | "principal"
  | "vice_principal"
  | "teacher"
  | "family_guardian";

export type RavenPermission =
  | "platform:engines:read"
  | "platform:security:read"
  | "platform:schools:password_reset"
  | "school:accounts:read"
  | "school:accounts:generate"
  | "school:data:read"
  | "school:data:write"
  | "school:decisions:read"
  | "school:decisions:write"
  | "school:plans:read"
  | "school:plans:write"
  | "school:evidence:read"
  | "school:evidence:write"
  | "school:attendance:read"
  | "school:attendance:write"
  | "school:assessment:read"
  | "school:assessment:write"
  | "school:integrations:read"
  | "school:integrations:execute"
  | "family:children:read";

export type TrustedActor = Readonly<{
  subjectId: string;
  role: RavenRole;
  portal: RavenPortal;
  /** Server-resolved active school context, not a browser-supplied selector. */
  schoolId: string | null;
  sessionId: string;
  authenticatedAt: string;
}>;

export type AuthorizationRequest = Readonly<{
  actor: TrustedActor | null;
  permission: RavenPermission;
  targetSchoolId?: string | null;
}>;

export type AuthorizationDecision =
  | Readonly<{ allowed: true; actor: TrustedActor; reason: "authorized" }>
  | Readonly<{ allowed: false; reason: "unauthenticated" | "invalid_actor" | "role_denied" | "tenant_mismatch" | "scope_required" | "relationship_denied" }>;

const PLATFORM_ROLES: readonly RavenRole[] = ["platform_super_admin", "platform_system_admin"];
const SCHOOL_ADMIN_ROLES: readonly RavenRole[] = ["school_admin", "principal"];
const VICE_ROLES: readonly RavenRole[] = ["vice_principal"];
const SAFE_ID = /^[a-zA-Z0-9:_./-]{1,160}$/;

const ROLE_PERMISSIONS: Readonly<Record<RavenRole, readonly RavenPermission[]>> = {
  platform_super_admin: [
    "platform:engines:read", "platform:security:read", "platform:schools:password_reset",
  ],
  platform_system_admin: ["platform:engines:read", "platform:security:read"],
  school_admin: [
    "school:accounts:read", "school:accounts:generate",
    "school:data:read", "school:data:write", "school:decisions:read", "school:decisions:write",
    "school:plans:read", "school:plans:write", "school:evidence:read", "school:evidence:write",
    "school:attendance:read", "school:attendance:write", "school:assessment:read", "school:assessment:write",
    "school:integrations:read", "school:integrations:execute",
  ],
  principal: [
    "school:accounts:read", "school:accounts:generate",
    "school:data:read", "school:data:write", "school:decisions:read", "school:decisions:write",
    "school:plans:read", "school:plans:write", "school:evidence:read", "school:evidence:write",
    "school:attendance:read", "school:attendance:write", "school:assessment:read", "school:assessment:write",
    "school:integrations:read", "school:integrations:execute",
  ],
  vice_principal: [
    "school:data:read", "school:decisions:read", "school:decisions:write",
    "school:plans:read", "school:plans:write", "school:evidence:read", "school:evidence:write",
    "school:attendance:read", "school:attendance:write", "school:assessment:read",
    "school:integrations:read",
  ],
  teacher: [
    "school:data:read", "school:decisions:read", "school:plans:read",
    "school:evidence:read", "school:evidence:write", "school:attendance:read",
    "school:attendance:write", "school:assessment:read", "school:integrations:read",
  ],
  family_guardian: ["family:children:read"],
};

function validActor(actor: TrustedActor): boolean {
  const portalMatchesRole =
    (actor.role === "platform_super_admin" || actor.role === "platform_system_admin") ? actor.portal === "platform" :
    (actor.role === "school_admin" || actor.role === "principal" || actor.role === "vice_principal") ? actor.portal === "principal" :
    actor.role === "teacher" ? actor.portal === "teacher" :
    actor.role === "family_guardian" ? actor.portal === "family" : false;
  return Boolean(
    portalMatchesRole &&
    SAFE_ID.test(actor.subjectId) &&
    SAFE_ID.test(actor.sessionId) &&
    Number.isFinite(Date.parse(actor.authenticatedAt)) &&
    (actor.role === "platform_super_admin" || actor.role === "platform_system_admin"
      ? actor.schoolId === null && actor.portal === "platform"
      : Boolean(actor.schoolId && SAFE_ID.test(actor.schoolId)) && actor.portal !== "platform"),
  );
}

/** Evaluate general role and active-tenant permission. Missing identity always denies. */
export function authorize(request: AuthorizationRequest): AuthorizationDecision {
  const { actor, permission, targetSchoolId } = request;
  if (!actor) return { allowed: false, reason: "unauthenticated" };
  if (!validActor(actor)) return { allowed: false, reason: "invalid_actor" };
  if (!ROLE_PERMISSIONS[actor.role].includes(permission)) return { allowed: false, reason: "role_denied" };

  // A family role cannot read children through a generic school permission check.
  // Child-specific reads must use authorizeFamilyChildRead and a trusted relationship resolver.
  if (actor.role === "family_guardian" && permission === "family:children:read") {
    return { allowed: false, reason: "relationship_denied" };
  }

  if (PLATFORM_ROLES.includes(actor.role)) {
    if (!permission.startsWith("platform:")) return { allowed: false, reason: "role_denied" };
    if (permission === "platform:schools:password_reset" && !targetSchoolId) {
      return { allowed: false, reason: "scope_required" };
    }
    return { allowed: true, actor, reason: "authorized" };
  }

  if (SCHOOL_ADMIN_ROLES.includes(actor.role) || VICE_ROLES.includes(actor.role) || actor.role === "teacher" || actor.role === "family_guardian") {
    if (!actor.schoolId) return { allowed: false, reason: "scope_required" };
    if (targetSchoolId && targetSchoolId !== actor.schoolId) return { allowed: false, reason: "tenant_mismatch" };
    return { allowed: true, actor, reason: "authorized" };
  }

  return { allowed: false, reason: "role_denied" };
}

export type GuardianRelationshipResolver = (input: Readonly<{
  guardianSubjectId: string;
  childId: string;
  schoolId: string;
}>) => Promise<boolean>;

/**
 * The only generic entry point for guardian child reads. The resolver must query
 * the authoritative Raven relationship source on the server for this exact child
 * and school. Missing, false, or failing resolvers deny access.
 */
export async function authorizeFamilyChildRead(
  input: Readonly<{
    actor: TrustedActor | null;
    childId: string;
    targetSchoolId: string | null;
  }>,
  resolveRelationship: GuardianRelationshipResolver | null,
): Promise<AuthorizationDecision> {
  const { actor, childId, targetSchoolId } = input;
  if (!actor) return { allowed: false, reason: "unauthenticated" };
  if (!validActor(actor) || actor.role !== "family_guardian") {
    return { allowed: false, reason: "invalid_actor" };
  }
  if (!SAFE_ID.test(childId) || !targetSchoolId || !SAFE_ID.test(targetSchoolId)) {
    return { allowed: false, reason: "scope_required" };
  }
  if (actor.schoolId !== targetSchoolId) return { allowed: false, reason: "tenant_mismatch" };
  if (!resolveRelationship) return { allowed: false, reason: "relationship_denied" };

  try {
    const linked = await resolveRelationship({
      guardianSubjectId: actor.subjectId,
      childId,
      schoolId: targetSchoolId,
    });
    return linked
      ? { allowed: true, actor, reason: "authorized" }
      : { allowed: false, reason: "relationship_denied" };
  } catch {
    return { allowed: false, reason: "relationship_denied" };
  }
}

/** Throwing guard for server handlers; caller must translate to a safe HTTP response. */
export function requirePermission(request: AuthorizationRequest): TrustedActor {
  const decision = authorize(request);
  if (!decision.allowed) {
    const error = new Error("Raven authorization denied");
    Object.assign(error, { code: "RAVEN_FORBIDDEN", reason: decision.reason });
    throw error;
  }
  return decision.actor;
}

export function isPlatformRole(role: RavenRole): boolean {
  return PLATFORM_ROLES.includes(role);
}
