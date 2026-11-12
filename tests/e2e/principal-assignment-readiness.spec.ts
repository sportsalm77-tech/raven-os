import { test, expect } from "@playwright/test";

test("principal assignments readiness checklist is interactive but explicitly not operational", async ({ page }) => {
  await page.goto("/principal/assignments");
  await page.getByRole("button", { name: "مراجعة متطلبات التفعيل" }).click();
  await expect(page.getByText("بنود تمت مراجعتها محليًا: 0 من 4", { exact: false })).toBeVisible();
  await page.getByRole("checkbox").first().check();
  await expect(page.getByText("بنود تمت مراجعتها محليًا: 1 من 4", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "إعادة تعيين المراجعة" }).click();
  await expect(page.getByText("بنود تمت مراجعتها محليًا: 0 من 4", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "مركز الخطة التشغيلية" })).toHaveAttribute("href", "/principal/operational-plan");
});
