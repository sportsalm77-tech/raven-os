import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  if (!request.headers.get("origin") || request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ error: "forbidden_origin" }, { status: 403 });
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set("raven_session", "", {
    httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0,
  });
  return response;
}
