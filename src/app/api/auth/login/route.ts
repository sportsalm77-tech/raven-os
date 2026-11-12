import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity } from "@/lib/security/identity-lookup";
import { activeSchoolIds, canEnterPortal, type RavenPortal } from "@/lib/security/portal-authorization";

export const dynamic = "force-dynamic";
const COOKIE = "raven_session";
const portals: RavenPortal[] = ["platform", "principal", "teacher", "family"];
function error(code: string, status: number) {
  return NextResponse.json({ error: code }, { status, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return error("forbidden_origin", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return error("invalid_request", 415);
  let body: unknown;
  try { body = await request.json(); } catch { return error("invalid_request", 400); }
  if (!body || typeof body !== "object") return error("invalid_request", 400);
  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      typeof password !== "string" || password.length < 1 || password.length > 1024) return error("invalid_request", 400);
  const base = process.env.RAVEN_SUPABASE_URL;
  const key = process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(base) ||
      !key || !/^sb_publishable_[a-zA-Z0-9_-]+$/.test(key)) return error("service_unavailable", 503);
  try {
    const response = await fetch(new URL("/auth/v1/token?grant_type=password", base), {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 400 || response.status === 401 || response.status === 422) return error("invalid_credentials", 401);
    if (!response.ok) return error("service_unavailable", 503);
    const session = await response.json() as { access_token?: unknown; expires_in?: unknown };
    if (typeof session.access_token !== "string" || !Number.isFinite(session.expires_in) ||
        typeof session.expires_in !== "number" || session.expires_in < 1 ||
        session.access_token.length > 8192) return error("service_unavailable", 503);
    const identity = await lookupIdentity(`Bearer ${session.access_token}`);
    const destinations: { portal: RavenPortal; school_id?: string; href: string }[] = [];
    for (const portal of portals) {
      if (portal === "platform") {
        if (canEnterPortal(identity, portal)) destinations.push({ portal, href: "/platform" });
      } else {
        for (const school_id of activeSchoolIds(identity, portal)) {
          if (canEnterPortal(identity, portal, school_id))
            destinations.push({ portal, school_id, href: `/${portal}?school_id=${encodeURIComponent(school_id)}` });
        }
      }
    }
    if (!destinations.length) return error("no_active_membership", 403);
    const result = NextResponse.json({ destinations }, { headers: { "Cache-Control": "no-store" } });
    result.cookies.set(COOKIE, session.access_token, {
      httpOnly: true, secure: true, sameSite: "strict", path: "/",
      maxAge: Math.min(Math.floor(session.expires_in), 3600),
    });
    return result;
  } catch { return error("service_unavailable", 503); }
}
