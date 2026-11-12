import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { activeSchoolIds, canEnterPortal, type RavenPortal } from "@/lib/security/portal-authorization";

export const dynamic = "force-dynamic";

const portalNames = new Set(["platform", "principal", "teacher", "family"]);
function reply(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Vary": "Authorization",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * Read-only portal authorization decision. This endpoint never authorizes
 * other API routes: each resource handler must independently verify identity
 * and tenant membership before accessing data.
 */
export async function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal");
  const schoolId = request.nextUrl.searchParams.get("school_id") ?? undefined;
  if (!portal || !portalNames.has(portal)) return reply({ error: "invalid_portal" }, 400);
  if (portal !== "platform" && schoolId && !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(schoolId)) {
    return reply({ error: "invalid_school_id" }, 400);
  }
  try {
    const identity = await lookupIdentity(request.headers.get("authorization"));
    const typedPortal = portal as RavenPortal;
    if (typedPortal !== "platform" && !schoolId) {
      return reply({
        allowed: false,
        eligible_school_ids: activeSchoolIds(identity, typedPortal),
      }, 200);
    }
    return reply({ allowed: canEnterPortal(identity, typedPortal, schoolId) }, 200);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return reply({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return reply({ error: "service_unavailable" }, 503);
  }
}
