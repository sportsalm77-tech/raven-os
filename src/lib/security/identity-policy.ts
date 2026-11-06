/**
 * Pure identity-policy rules shared by the server authentication boundary.
 * This module does not authenticate users, issue sessions, or mint QR tokens.
 */
export type RavenIdentityRole =
  | "platform_super_admin"
  | "platform_system_admin"
  | "school_admin"
  | "principal"
  | "vice_principal"
  | "teacher"
  | "student"
  | "family_guardian";

export type RavenIdentityPortal = "platform" | "principal" | "teacher" | "family" | null;
export type RavenAccountStatus = "active" | "pending" | "suspended" | "disabled";

const PLATFORM_ROLES: readonly RavenIdentityRole[] = [
  "platform_super_admin",
  "platform_system_admin",
];
const PRINCIPAL_ROLES: readonly RavenIdentityRole[] = [
  "school_admin",
  "principal",
  "vice_principal",
];

export function isAccountOperational(status: RavenAccountStatus): boolean {
  return status === "active";
}

/**
 * Student is an identity role, not a fifth portal. Its final destination remains
 * the approved student route mapping; null deliberately avoids inventing a route.
 */
export function isRolePortalCompatible(
  role: RavenIdentityRole,
  portal: RavenIdentityPortal,
  schoolId: string | null,
): boolean {
  if (PLATFORM_ROLES.includes(role)) return portal === "platform" && schoolId === null;
  if (PRINCIPAL_ROLES.includes(role)) return portal === "principal" && Boolean(schoolId?.trim());
  if (role === "teacher") return portal === "teacher" && Boolean(schoolId?.trim());
  if (role === "family_guardian") return portal === "family" && Boolean(schoolId?.trim());
  if (role === "student") return portal === null && Boolean(schoolId?.trim());
  return false;
}

export function requiresStrongMfa(role: RavenIdentityRole): boolean {
  return PLATFORM_ROLES.includes(role) || PRINCIPAL_ROLES.includes(role);
}

export type FamilyQuickAccessApproval = Readonly<{
  requestedByGuardian: boolean;
  identityVerified: boolean;
  schoolApproved: boolean;
  signedAcknowledgementRecorded: boolean;
}>;

/** QR eligibility is a role policy only; it does not issue or validate a QR token. */
export function canUseQuickAccess(
  role: RavenIdentityRole,
  familyApproval?: FamilyQuickAccessApproval,
): boolean {
  if (role === "teacher" || role === "student") return true;
  if (role !== "family_guardian" || !familyApproval) return false;
  return familyApproval.requestedByGuardian &&
    familyApproval.identityVerified &&
    familyApproval.schoolApproved &&
    familyApproval.signedAcknowledgementRecorded;
}

/**
 * School-scoped actors must operate only in the server-selected active school.
 * Platform roles use explicit platform permissions, never this tenant shortcut.
 */
export function matchesActiveSchoolScope(
  role: RavenIdentityRole,
  activeSchoolId: string | null,
  targetSchoolId: string | null,
): boolean {
  if (PLATFORM_ROLES.includes(role)) return false;
  return Boolean(
    activeSchoolId?.trim() &&
    targetSchoolId?.trim() &&
    activeSchoolId === targetSchoolId,
  );
}
