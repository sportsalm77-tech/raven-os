import { test, expect } from "@playwright/test";

const school = "11111111-1111-4111-8111-111111111111";
const modules = ["decisions", "assignments", "plans", "evidence", "impact", "documents"];

test.describe("School operations records read security", () => {
  for (const moduleName of modules) {
    test(`unauthenticated ${moduleName} records are denied`, async ({ request }) => {
      const response = await request.get(
        `/api/operations/records?module=${moduleName}&school_id=${school}`,
      );
      expect([401, 503]).toContain(response.status());
      expect(response.headers()["cache-control"]).toContain("no-store");
    });
  }
  test("rejects zero and oversized pagination", async ({ request }) => {
    for (const limit of ["0", "51", "10000", "-1", "1.5"]) {
      const response = await request.get(
        `/api/operations/records?module=decisions&school_id=${school}&limit=${limit}`,
      );
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: "invalid_limit" });
    }
  });
  test("rejects unauthenticated writes", async ({ request }) => {
    const response = await request.post(
      `/api/operations/records?module=decisions&school_id=${school}`,
      { data: { title: "unauthorized" } },
    );
    expect(response.status()).toBe(405);
  });
});
