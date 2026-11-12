import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { visibleOperationModules } from "@/lib/operations/portal-capabilities";

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
 * Read-only capability manifest; no school records, PII or database writes.
 * A future operational data endpoint must independently enforce RLS.
 */
export async function GET(request: NextRequest) {
  const schoolId = request.nextUrl.searchParams.get("school_id");
  const portal = request.nextUrl.searchParams.get("portal");
  if (!schoolId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(schoolId)) {
    return respond({ error: "invalid_school_id" }, 400);
  }
  if (!portal || !["principal", "teacher", "family", "platform"].includes(portal)) {
    return respond({ error: "invalid_portal" }, 400);
  }
  try {
    const identity = await lookupIdentity(request.headers.get("authorization"));
    const modules = visibleOperationModules(identity, portal as "principal" | "teacher" | "family" | "platform", schoolId);
    if (modules.length === 0) return respond({ error: "forbidden" }, 403);
    return respond({ portal, school_id: schoolId, modules, dataAccess: false }, 200);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return respond({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return respond({ error: "service_unavailable" }, 503);
  }
}
