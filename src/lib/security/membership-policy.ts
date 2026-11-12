/**
 * Pure membership and verified-session policy. No persistence or authentication
 * provider is implied by these types. Call only after trusted server resolution.
 */
export type MembershipRole = "platform_super_admin" | "platform_system_admin" |
  "school_admin" | "principal" | "vice_principal" | "teacher" | "family_guardian";
export type MembershipPortal = "platform" | "principal" | "teacher" | "family";
export type MembershipStatus = "invited" | "active" | "suspended" | "revoked";
export type VerifiedSession = Readonly<{
  subjectId: string;
  sessionId: string;
  expiresAt: string;
  verifiedAt: string;
  mfaVerified: boolean;
}>;
export type SchoolMembership = Readonly<{
  subjectId: string;
  schoolId: string | null;
  role: MembershipRole;
  portal: MembershipPortal;
  status: MembershipStatus;
}>;
export type MembershipDecision = Readonly<{
  allowed: boolean;
  reason: "authorized" | "invalid_session" | "expired_session" |
    "invalid_membership" | "inactive_membership" | "identity_mismatch" |
    "tenant_mismatch" | "portal_mismatch" | "mfa_required";
}>;
const ID = /^[a-zA-Z0-9:_./-]{1,160}$/;
const ROLES: Readonly<Record<MembershipRole, MembershipPortal>> = {
  platform_super_admin: "platform", platform_system_admin: "platform",
  school_admin: "principal", principal: "principal", vice_principal: "principal",
  teacher: "teacher", family_guardian: "family",
};
const ADMIN = new Set<MembershipRole>([
  "platform_super_admin", "platform_system_admin", "school_admin",
  "principal", "vice_principal",
]);

/** Deny on missing, malformed, expired, suspended or cross-school memberships. */
export function evaluateMembership(input: Readonly<{
  session: VerifiedSession | null;
  membership: SchoolMembership | null;
  requestedPortal: MembershipPortal;
  requestedSchoolId: string | null;
  now: string;
}>): MembershipDecision {
  const { session, membership, requestedPortal, requestedSchoolId, now } = input;
  if (!session || !ID.test(session.subjectId) || !ID.test(session.sessionId) ||
      !Number.isFinite(Date.parse(session.verifiedAt)) ||
      !Number.isFinite(Date.parse(session.expiresAt)) ||
      !Number.isFinite(Date.parse(now))) {
    return { allowed: false, reason: "invalid_session" };
  }
  const nowMs = Date.parse(now);
  if (Date.parse(session.verifiedAt) > nowMs ||
      Date.parse(session.expiresAt) <= nowMs) {
    return { allowed: false, reason: "expired_session" };
  }
  if (!membership || !ID.test(membership.subjectId) ||
      !(membership.role in ROLES) ||
      !["invited", "active", "suspended", "revoked"].includes(membership.status) ||
      (membership.schoolId !== null && !ID.test(membership.schoolId))) {
    return { allowed: false, reason: "invalid_membership" };
  }
  if (membership.subjectId !== session.subjectId) {
    return { allowed: false, reason: "identity_mismatch" };
  }
  if (membership.status !== "active") {
    return { allowed: false, reason: "inactive_membership" };
  }
  if (membership.portal !== requestedPortal || ROLES[membership.role] !== requestedPortal) {
    return { allowed: false, reason: "portal_mismatch" };
  }
  if (requestedPortal === "platform") {
    if (membership.schoolId !== null || requestedSchoolId !== null) {
      return { allowed: false, reason: "tenant_mismatch" };
    }
  } else if (!membership.schoolId || !requestedSchoolId ||
             !ID.test(requestedSchoolId) ||
             membership.schoolId !== requestedSchoolId) {
    return { allowed: false, reason: "tenant_mismatch" };
  }
  if (ADMIN.has(membership.role) && !session.mfaVerified) {
    return { allowed: false, reason: "mfa_required" };
  }
  return { allowed: true, reason: "authorized" };
}
