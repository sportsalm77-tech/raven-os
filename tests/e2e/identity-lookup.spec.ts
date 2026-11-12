import { test, expect } from "@playwright/test";

test("identity endpoint fails closed without credentials", async ({ request }) => {
  const response = await request.get("/api/auth/me");
  expect(response.status()).toBe(401);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers().vary?.toLowerCase()).toContain("authorization");
  expect(await response.json()).toEqual({ error: "unauthorized" });
});

test("identity endpoint rejects malformed bearer tokens", async ({ request }) => {
  for (const authorization of ["Bearer invalid", "Basic example", "Bearer fake token"]) {
    const response = await request.get("/api/auth/me", {
      headers: { authorization },
    });
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: "unauthorized" });
  }
});
