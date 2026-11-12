/**
 * Server-side authorization policy. Use only with a verified identity returned
 * by lookupIdentity, never with request-supplied role or school identifiers.
 */
export type RavenPortal = "platform" | "principal" | "teacher" | "family";
export type VerifiedRavenIdentity = Readonly<{
  user: Readonly<{ id: string }>;
  schoolMemberships: readonly Readonly<{
    school_id: string | null;
    role: string;
    status: string;
  }>[];
  platformMembership: Readonly<{
    role: string;
    status: string;
  }> | null;
}>;

const principalRoles = new Set(["school_admin", "principal", "vice_principal"]);
const teacherRoles = new Set(["teacher"]);
const familyRoles = new Set(["family_guardian"]);
const platformRoles = new Set(["platform_super_admin", "platform_system_admin"]);

export function canEnterPortal(
  identity: VerifiedRavenIdentity,
  portal: RavenPortal,
  schoolId?: string,
): boolean {
  if (portal === "platform") {
    return identity.platformMembership?.status === "active" &&
      platformRoles.has(identity.platformMembership.role);
  }
  if (!schoolId || !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(schoolId)) return false;
  const permitted = portal === "principal" ? principalRoles :
    portal === "teacher" ? teacherRoles : familyRoles;
  return identity.schoolMemberships.some(m =>
    m.school_id === schoolId && m.status === "active" && permitted.has(m.role)
  );
}

export function activeSchoolIds(
  identity: VerifiedRavenIdentity,
  portal: Exclude<RavenPortal, "platform">,
): string[] {
  const permitted = portal === "principal" ? principalRoles :
    portal === "teacher" ? teacherRoles : familyRoles;
  return [...new Set(identity.schoolMemberships
    .filter(m => m.status === "active" && m.school_id &&
      permitted.has(m.role))
    .map(m => m.school_id as string))];
}
