import { test, expect } from "@playwright/test";

test("portal access denies unauthenticated requests", async ({ request }) => {
  for (const portal of ["platform", "principal", "teacher", "family"]) {
    const response = await request.get(`/api/auth/portal-access?portal=${portal}`);
    expect(response.status()).toBe(401);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(await response.json()).toEqual({ error: "unauthorized" });
  }
});

test("portal access rejects unknown portal", async ({ request }) => {
  const response = await request.get("/api/auth/portal-access?portal=admin");
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: "invalid_portal" });
});

test("portal access rejects malformed school ids", async ({ request }) => {
  const response = await request.get("/api/auth/portal-access?portal=teacher&school_id=other-school");
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ error: "invalid_school_id" });
});
