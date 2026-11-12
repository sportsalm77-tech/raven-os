import { NextRequest, NextResponse } from "next/server";
import { IdentityLookupError, lookupIdentity } from "@/lib/security/identity-lookup";

export const dynamic = "force-dynamic";

function json(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Pragma": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Vary": "Authorization",
    },
  });
}

/**
 * Diagnostic authenticated identity endpoint. Never authorizes access to
 * operational records; all resource routes require separate permission checks.
 */
export async function GET(request: NextRequest) {
  try {
    const identity = await lookupIdentity(request.headers.get("authorization"));
    return json(identity, 200);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return json({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return json({ error: "service_unavailable" }, 503);
  }
}
