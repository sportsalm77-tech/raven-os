import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { canEnterPortal } from "@/lib/security/portal-authorization";
import { isRavenOperationModule, RAVEN_OPERATION_MODULES } from "@/lib/operations/school-module-registry";

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
 * Read-only module authorization and schema discovery. This endpoint does not
 * read school data or grant database privileges. Every eventual CRUD endpoint
 * must enforce tenant isolation independently.
 */
export async function GET(request: NextRequest) {
  const moduleName = request.nextUrl.searchParams.get("module");
  const schoolId = request.nextUrl.searchParams.get("school_id");
  if (!moduleName || !isRavenOperationModule(moduleName)) {
    return respond({ error: "invalid_module" }, 400);
  }
  if (!schoolId || !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(schoolId)) {
    return respond({ error: "invalid_school_id" }, 400);
  }
  try {
    const identity = await lookupIdentity(request.headers.get("authorization"));
    if (!canEnterPortal(identity, "principal", schoolId)) {
      return respond({ error: "forbidden" }, 403);
    }
    const config = RAVEN_OPERATION_MODULES[moduleName];
    return respond({ module: moduleName, title: config.titleAr, fields: config.fields, available: false }, 200);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return respond({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return respond({ error: "service_unavailable" }, 503);
  }
}
