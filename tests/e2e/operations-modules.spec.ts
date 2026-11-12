import { test, expect } from "@playwright/test";

const modules = ["decisions", "assignments", "plans", "evidence", "impact", "documents"];
const school = "00000000-0000-4000-8000-000000000001";

test("all six operational modules deny unauthenticated access", async ({ request }) => {
  for (const module of modules) {
    const response = await request.get(`/api/operations/modules?module=${module}&school_id=${school}`);
    expect(response.status()).toBe(401);
    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(await response.json()).toEqual({ error: "unauthorized" });
  }
});

test("invalid modules are rejected", async ({ request }) => {
  const response = await request.get(`/api/operations/modules?module=users&school_id=${school}`);
  expect(response.status()).toBe(400);
});

test("missing school context is rejected", async ({ request }) => {
  const response = await request.get("/api/operations/modules?module=plans");
  expect(response.status()).toBe(400);
});
