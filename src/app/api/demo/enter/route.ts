import { NextRequest, NextResponse } from "next/server";
import { demoEnabled, issueDemoSession, DEMO_COOKIE } from "@/lib/security/demo-preview";
import type { RavenPortal } from "@/lib/security/portal-authorization";
export const dynamic = "force-dynamic";
const roles: RavenPortal[] = ["platform", "principal", "teacher", "family"];
export async function POST(request: NextRequest) {
  if (!demoEnabled()) return NextResponse.json({error:"not_found"},{status:404});
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) return NextResponse.json({error:"forbidden"},{status:403});
  if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({error:"invalid"},{status:415});
  let data: unknown;
  try { data = await request.json(); } catch { return NextResponse.json({error:"invalid"},{status:400}); }
  const role = data && typeof data === "object" && "role" in data ? (data as {role:unknown}).role : null;
  if (typeof role !== "string" || !roles.includes(role as RavenPortal)) return NextResponse.json({error:"invalid_role"},{status:400});
  const result = NextResponse.json({href:"/"+role},{headers:{"Cache-Control":"no-store"}});
  result.cookies.set(DEMO_COOKIE,issueDemoSession(role as RavenPortal),{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:1800});
  return result;
}
