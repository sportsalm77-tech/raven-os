import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lookupIdentity } from "@/lib/security/identity-lookup";
import { activeSchoolIds, canEnterPortal, type RavenPortal } from "@/lib/security/portal-authorization";

/** Deny-by-default when real authentication is enabled; preview remains non-operational. */
export async function requirePortalAccess(portal: RavenPortal) {
  if (process.env.RAVEN_AUTH_ENABLED !== "true") return;
  const session = (await cookies()).get("raven_session")?.value;
  if (!session) redirect("/login");
  let identity;
  try { identity = await lookupIdentity(`Bearer ${session}`); }
  catch { redirect("/login"); }
  if (portal === "platform") {
    if (!canEnterPortal(identity, "platform")) redirect("/login");
    return;
  }
  const allowed = activeSchoolIds(identity, portal);
  if (!allowed.length) redirect("/login");
}
