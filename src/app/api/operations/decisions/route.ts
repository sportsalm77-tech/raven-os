import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { canPerformInSchool } from "@/lib/security/school-operation-permissions";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function reply(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: {
    "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
  } });
}

/** Persist a draft school decision under the caller's own JWT and database RLS. */
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  try {
    const identity = await lookupIdentity(auth);
    const type = request.headers.get("content-type") ?? "";
    if (!/^application\/json(?:\s*;|$)/i.test(type)) return reply({ error: "invalid_content_type" }, 415);
    if (Number(request.headers.get("content-length") || "0") > 8192) return reply({ error: "payload_too_large" }, 413);
    let input: unknown;
    try { input = await request.json(); } catch { return reply({ error: "invalid_json" }, 400); }
    if (!input || typeof input !== "object" || Array.isArray(input)) return reply({ error: "invalid_input" }, 400);
    const row = input as Record<string, unknown>;
    if (Object.keys(row).some(key => !["school_id", "title", "details"].includes(key))) {
      return reply({ error: "unexpected_fields" }, 400);
    }
    if (typeof row.school_id !== "string" || !UUID.test(row.school_id) ||
        typeof row.title !== "string" || !row.title.trim() || row.title.length > 200 ||
        (row.details !== undefined && (typeof row.details !== "string" || row.details.length > 4000))) {
      return reply({ error: "invalid_input" }, 400);
    }
    // Match the database's actual write policy, not the broader UI permission matrix.
    const mayWrite = identity.schoolMemberships.some(m =>
      m.school_id === row.school_id && m.status === "active" &&
      ["school_admin", "principal"].includes(m.role));
    if (!mayWrite || !canPerformInSchool(identity.schoolMemberships, row.school_id, "decisions", "create")) {
      return reply({ error: "forbidden" }, 403);
    }
    const base = process.env.RAVEN_SUPABASE_URL;
    const key = process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key || !auth) return reply({ error: "service_unavailable" }, 503);
    const url = new URL("/rest/v1/raven_school_decisions", base);
    url.searchParams.set("select", "id,school_id,title,details,status,created_at");
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        apikey: key, Authorization: auth, "Content-Type": "application/json",
        Prefer: "return=representation", Accept: "application/json",
      },
      body: JSON.stringify({
        school_id: row.school_id, title: row.title.trim(),
        details: typeof row.details === "string" ? row.details : "",
        status: "draft", created_by: identity.user.id,
      }),
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) return reply({ error: "write_failed" }, upstream.status === 401 ? 401 : upstream.status === 403 ? 403 : 503);
    const saved: unknown = await upstream.json();
    if (!Array.isArray(saved) || saved.length !== 1 ||
        !saved[0] || typeof saved[0] !== "object" ||
        saved[0].school_id !== row.school_id || saved[0].status !== "draft") {
      return reply({ error: "unexpected_upstream_response" }, 503);
    }
    const result = saved[0] as Record<string, unknown>;
    return reply({ decision: {
      id: result.id, school_id: result.school_id, title: result.title,
      details: result.details, status: result.status, created_at: result.created_at,
    } }, 201);
  } catch (error) {
    if (error instanceof IdentityLookupError) {
      return reply({ error: error.statusCode === 401 ? "unauthorized" : "service_unavailable" }, error.statusCode);
    }
    return reply({ error: "service_unavailable" }, 503);
  }
}
