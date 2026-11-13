import { expect, test } from "@playwright/test";

const platformRoutes = [
  "/platform",
  "/platform/security",
  "/platform/schools",
  "/platform/users",
  "/platform/communications",
  "/platform/support",
  "/platform/subscriptions",
  "/platform/engines",
  "/platform/evidence",
  "/platform/roles",
  "/platform/settings",
];

test.describe("Platform portal browser acceptance", () => {
  test("loads the executive command center and exposes the approved administration section", async ({ page }) => {
    const response = await page.goto("/platform");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /مركز القيادة التنفيذي|Executive Command Center/ }).first()).toBeVisible();
    await expect(page.getByText(/قسم إدارة المدارس والمستخدمين|Schools & Users Administration/).first()).toBeVisible();
    await expect(page.getByText(/غير متصل|not connected/i).first()).toBeVisible();
  });

  for (const route of platformRoutes) {
    test(`route responds successfully: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `Unexpected response for ${route}`).toBe(200);
      await expect(page.locator("body")).not.toContainText("Internal Server Error");
    });
  }

  test("switches the document direction and language control", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/platform");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.getByRole("button", { name: /Change language|English|العربية/ }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    test(`avoids document-level horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/platform");
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  test("opens and closes the mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/platform");
    const openButton = page.getByRole("button", { name: "Open navigation" });
    await expect(openButton).toBeVisible();
    await openButton.click();
    await expect(page.getByRole("navigation", { name: /التنقل الرئيسي|Main navigation/ })).toBeVisible();
    await page.getByRole("button", { name: "Close navigation" }).last().click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  });

  test("shows the real administration interface without claiming unauthenticated success", async ({ page }) => {
    await page.goto("/platform/communications");
    await expect(page.getByRole("region", { name: /إدارة السجلات الفعلية|Live administration records/ })).toBeVisible();
    await expect(page.getByText(/العمليات المتصلة بقاعدة البيانات|Database-backed operations/)).toBeVisible();
    await expect(page.getByRole("alert").filter({ hasText: /يلزم تسجيل الدخول|Sign in with an authorized platform admin account/ })).toContainText(/يلزم تسجيل الدخول|Sign in with an authorized platform admin account/);
    await expect(page.getByText(/تم الحفظ بنجاح|Saved successfully/)).toHaveCount(0);
  });
});
