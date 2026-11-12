import { test, expect } from "@playwright/test";

for (const [portal, term, target] of [
  ["principal", "القرارات", "/principal/decision-center"],
  ["family", "الحضور", "/family/attendance"],
] as const) {
  test(`${portal} dashboard filters role workspaces without mock records`, async ({ page }) => {
    await page.goto(`/${portal}`);
    const search = page.getByRole("searchbox", { name: "البحث في مساحات العمل" });
    await search.fill(term);
    await expect(page.locator(`a[href="${target}"]`).first()).toBeVisible();
    await search.fill("zz-no-workspace-matches");
    await expect(page.getByRole("status").filter({ hasText: "لا توجد مساحات عمل مطابقة للبحث." })).toBeVisible();
  });
}
