import { test, expect } from "@playwright/test";

for (const portal of ["platform", "principal", "teacher", "family"] as const) {
  test(`${portal} navigation search exposes matching links`, async ({ page }) => {
    await page.goto(`/${portal}`);
    const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
    const search = nav.getByRole("textbox", { name: "البحث في أقسام البوابة" });
    await search.fill(portal === "family" ? "الحضور" : portal === "teacher" ? "الدرجات" : portal === "principal" ? "الخطة" : "المدارس");
    await expect(nav.getByRole("link").first()).toBeVisible();
    await search.fill("zz-no-matching-section-zz");
    await expect(nav.getByText("لا توجد أقسام مطابقة")).toBeVisible();
  });
}
test("family navigation search works on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/family");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.getByRole("navigation", { name: "التنقل الرئيسي" });
  await nav.getByRole("textbox", { name: "البحث في أقسام البوابة" }).fill("الحضور");
  await expect(nav.getByRole("link", { name: "الحضور والغياب" })).toBeVisible();
  await nav.getByRole("link", { name: "الحضور والغياب" }).click();
  await expect(page).toHaveURL(/\/family\/attendance$/);
});
