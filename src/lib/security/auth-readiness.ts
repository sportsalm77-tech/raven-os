/** Server-only readiness snapshot. No client input may enable authentication. */
import "server-only";

export type AuthReadiness = Readonly<{
  enabled: false;
  status: "not_configured";
  loginAvailable: false;
  sessionAvailable: false;
  schoolMembershipAvailable: false;
  serverAuthorizationRequired: true;
  auditPersistenceRequired: true;
}>;

/**
 * Intentionally fail closed until a verified identity provider, session validator,
 * school-membership resolver and durable audit sink are integrated together.
 * Never infer readiness from the mere presence of environment variables.
 */
export function getAuthReadiness(): AuthReadiness {
  return Object.freeze({
    enabled: false,
    status: "not_configured",
    loginAvailable: false,
    sessionAvailable: false,
    schoolMembershipAvailable: false,
    serverAuthorizationRequired: true,
    auditPersistenceRequired: true,
  });
}
