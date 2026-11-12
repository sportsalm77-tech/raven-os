import "server-only";

type UserIdentity = Readonly<{ id: string; email: string | null }>;
type Membership = Readonly<{
  school_id: string | null;
  role: string;
  status: string;
}>;

export type IdentitySnapshot = Readonly<{
  user: UserIdentity;
  schoolMemberships: readonly Membership[];
  platformMembership: Membership | null;
}>;

export class IdentityLookupError extends Error {
  constructor(public readonly statusCode: 401 | 503, message: string) {
    super(message);
    this.name = "IdentityLookupError";
  }
}

function configuration(): { url: string; key: string } {
  const rawUrl = process.env.RAVEN_SUPABASE_URL;
  const key = process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
  if (!rawUrl || !key || !/^sb_publishable_[a-zA-Z0-9_-]+$/.test(key)) {
    throw new IdentityLookupError(503, "Identity service is not configured");
  }
  let parsed: URL;
  try { parsed = new URL(rawUrl); } catch {
    throw new IdentityLookupError(503, "Identity service is not configured");
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password ||
      parsed.search || parsed.hash || parsed.pathname !== "/" ||
      !/^[a-z0-9-]+\.supabase\.co$/.test(parsed.hostname)) {
    throw new IdentityLookupError(503, "Identity service is not configured");
  }
  return { url: parsed.origin, key };
}

function bearerToken(header: string | null): string {
  if (!header || !/^Bearer [A-Za-z0-9._~-]{20,8192}$/.test(header)) {
    throw new IdentityLookupError(401, "Authentication required");
  }
  return header.slice(7);
}

async function remoteGet(url: string, key: string, token: string): Promise<Response> {
  try {
    return await fetch(url, {
      method: "GET",
      headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new IdentityLookupError(503, "Identity service unavailable");
  }
}

/**
 * Read-only server identity lookup. Bearer token must come from an HTTPS client
 * authorization header. Never use browser-provided roles, tenant IDs or claims.
 * Supabase Auth verifies the token; PostgREST enforces per-user RLS.
 * This does NOT authorize resource access or establish a cookie session.
 */
export async function lookupIdentity(authorization: string | null): Promise<IdentitySnapshot> {
  const token = bearerToken(authorization);
  const { url, key } = configuration();
  const userResponse = await remoteGet(`${url}/auth/v1/user`, key, token);
  if (userResponse.status === 401 || userResponse.status === 403) {
    throw new IdentityLookupError(401, "Authentication required");
  }
  if (!userResponse.ok) throw new IdentityLookupError(503, "Identity service unavailable");
  const user = await userResponse.json() as { id?: unknown; email?: unknown };
  if (typeof user.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f-]{27,36}$/i.test(user.id)) {
    throw new IdentityLookupError(503, "Invalid identity provider response");
  }
  const id = user.id;
  const encodedId = encodeURIComponent(id);
  const [schoolsResponse, platformResponse] = await Promise.all([
    remoteGet(`${url}/rest/v1/raven_school_memberships?select=school_id,role,status&user_id=eq.${encodedId}&limit=100`, key, token),
    remoteGet(`${url}/rest/v1/raven_platform_memberships?select=role,status&user_id=eq.${encodedId}&limit=1`, key, token),
  ]);
  if (!schoolsResponse.ok || !platformResponse.ok) {
    throw new IdentityLookupError(503, "Membership service unavailable");
  }
  const schoolMemberships = await schoolsResponse.json() as unknown;
  const platformMemberships = await platformResponse.json() as unknown;
  if (!Array.isArray(schoolMemberships) || !Array.isArray(platformMemberships) ||
      platformMemberships.length > 1 ||
      !schoolMemberships.every(x => x && typeof x.school_id === "string" &&
        typeof x.role === "string" && typeof x.status === "string") ||
      !platformMemberships.every(x => x && typeof x.role === "string" &&
        typeof x.status === "string")) {
    throw new IdentityLookupError(503, "Invalid membership provider response");
  }
  return {
    user: { id, email: typeof user.email === "string" ? user.email : null },
    schoolMemberships: schoolMemberships.map(x => ({
      school_id: x.school_id, role: x.role, status: x.status,
    })),
    platformMembership: platformMemberships.length ? {
      school_id: null,
      role: platformMemberships[0].role,
      status: platformMemberships[0].status,
    } : null,
  };
}
