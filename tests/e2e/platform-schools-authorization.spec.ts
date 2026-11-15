import { test, expect } from "@playwright/test";

test.describe("platform schools API authorization", () => {
  test("unauthenticated users cannot list schools", async ({ request }) => {
    const result = await request.get("/api/platform/records?module=schools");
    expect(result.status()).toBe(401);
    expect(result.headers()["cache-control"]).toContain("no-store");
    expect(await result.json()).toEqual({ error: "unauthorized" });
  });

  test("unauthenticated users cannot create schools", async ({ request, baseURL }) => {
    const result = await request.post("/api/platform/records?module=schools", {
      headers: { origin: new URL(baseURL!).origin },
      data: { name: "مدرسة اختبار غير مصرح", status: "pending" },
    });
    expect(result.status()).toBe(401);
    expect(await result.json()).toEqual({ error: "unauthorized" });
  });

  test("unauthenticated users cannot update schools", async ({ request, baseURL }) => {
    const result = await request.patch("/api/platform/records?module=schools&id=00000000-0000-4000-8000-000000000001", {
      headers: { origin: new URL(baseURL!).origin },
      data: { name: "تعديل غير مصرح" },
    });
    expect(result.status()).toBe(401);
    expect(await result.json()).toEqual({ error: "unauthorized" });
  });

  test("cross-origin school writes are rejected", async ({ request }) => {
    const result = await request.post("/api/platform/records?module=schools", {
      headers: { origin: "https://attacker.example" },
      data: { name: "مدرسة غير مصرح بها" },
    });
    expect(result.status()).toBe(403);
    expect(await result.json()).toEqual({ error: "forbidden_origin" });
  });
});
