import { NextResponse } from "next/server";
import { getAuthReadiness } from "@/lib/security/auth-readiness";

/** Public capability metadata only: never return provider keys or configuration. */
export async function GET() {
  return NextResponse.json(getAuthReadiness(), {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
