import { test, expect } from "@playwright/test";

test("auth readiness endpoint remains explicitly disabled and non-cacheable", async ({ request }) => {
  const response = await request.get("/api/auth/readiness");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  const body = await response.json();
  expect(body).toEqual({
    enabled: false,
    status: "not_configured",
    loginAvailable: false,
    sessionAvailable: false,
    schoolMembershipAvailable: false,
    serverAuthorizationRequired: true,
    auditPersistenceRequired: true,
  });
  expect(JSON.stringify(body)).not.toMatch(/secret|password|token|api_key/i);
});

test("login never solicits passwords before real auth is enabled", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("لا توجد مصادقة فعلية مفعّلة")).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});
