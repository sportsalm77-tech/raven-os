import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { authorizeOperationRead } from "@/lib/operations/authorize-operation";
import { RAVEN_OPERATION_MODULES } from "@/lib/operations/school-module-registry";

export const dynamic = "force-dynamic";

function respond(body: unknown, status: number) {
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
 * Read-only tenant-scoped operational data endpoint.
 * Uses the original user JWT, not service_role; Supabase RLS remains
 * authoritative. No writes, storage access or audit claims.
 */
export async function GET(request: NextRequest) {
  const moduleName = request.nextUrl.searchParams.get("module");
  const schoolId = request.nextUrl.searchParams.get("school_id");
  const rawLimit = request.nextUrl.searchParams.get("limit") ?? "25";
  if (!/^[1-9][0-9]{0,2}$/.test(rawLimit) || Number(rawLimit) > 50) {
    return respond({ error: "invalid_limit" }, 400);
  }
  try {
    const auth = request.headers.get("authorization");
    const identity = await lookupIdentity(auth);
    const decision = authorizeOperationRead(identity, moduleName, schoolId);
    if (!decision.allowed) {
      return respond({ error: decision.reason }, decision.reason === "forbidden" ? 403 : 400);
    }
    // RLS currently permits principal roles only; teacher capability metadata
    // is not equivalent to data access.
    if (!identity.schoolMemberships.some(m =>
      m.school_id === decision.schoolId && m.status === "active" &&
      ["school_admin", "principal", "vice_principal"].includes(m.role)
    )) {
      return respond({ error: "forbidden" }, 403);
    }
    const base = process.env.RAVEN_SUPABASE_URL;
    const key = process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key || !auth) return respond({ error: "service_unavailable" }, 503);
    const endpoint = new URL(`/rest/v1/${RAVEN_OPERATION_MODULES[decision.moduleName].table}`, base);
    endpoint.searchParams.set("select", "*");
    endpoint.searchParams.set("school_id", `eq.${decision.schoolId}`);
    endpoint.searchParams.set("order", "created_at.desc");
    endpoint.searchParams.set("limit", rawLimit);
    const response = await fetch(endpoint, {
      headers: { apikey: key, Authorization: auth, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return respond({ error: "data_service_unavailable" }, 503);
    const records: unknown = await response.json();
    if (!Array.isArray(records)) return respond({ error: "data_service_unavailable" }, 503);
    return respond({ module: decision.moduleName, school_id: decision.schoolId, records }, 200);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return respond({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return respond({ error: "service_unavailable" }, 503);
  }
}
