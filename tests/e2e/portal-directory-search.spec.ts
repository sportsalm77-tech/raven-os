import { test, expect } from "@playwright/test";

for (const [portal, term, target] of [
  ["principal", "الاختبارات", "/principal/exams/grades"],
  ["family", "التقارير", "/family/reports"],
] as const) {
  test(`${portal} dashboard full directory search`, async ({ page }) => {
    await page.goto(`/${portal}`);
    const search = page.getByRole("searchbox", { name: "البحث في جميع أقسام البوابة" });
    await search.fill(term);
    await expect(page.locator(`a[href="${target}"]`).first()).toBeVisible();
    await search.fill("zz-unmatched-directory-term");
    await expect(page.getByRole("status").filter({ hasText: "لا توجد أقسام مطابقة للبحث." })).toBeVisible();
    await search.fill("");
    await expect(page.locator(`a[href="${target}"]`).first()).toBeVisible();
  });
}
