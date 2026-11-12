import { test, expect } from "@playwright/test";

const school = "11111111-1111-4111-8111-111111111111";

test.describe("Batch 19: operation capability boundary", () => {
  test("rejects invalid school ID", async ({ request }) => {
    const response = await request.get("/api/operations/capabilities?portal=principal&school_id=invalid");
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid_school_id" });
  });

  test("rejects unknown portal", async ({ request }) => {
    const response = await request.get(`/api/operations/capabilities?portal=unknown&school_id=${school}`);
    expect(response.status()).toBe(400);
  });

  for (const portalName of ["principal", "teacher", "family", "platform"]) {
    test(`rejects unauthenticated ${portalName} capability discovery`, async ({ request }) => {
      const response = await request.get(
        `/api/operations/capabilities?portal=${portalName}&school_id=${school}`,
      );
      expect([401, 503]).toContain(response.status());
      expect(response.headers()["cache-control"]).toContain("no-store");
    });
  }
});
