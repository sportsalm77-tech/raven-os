import { test, expect } from "@playwright/test";

for (const [path, heading, linked] of [
  ["/principal/decision-center", "دليل مراجعة القرار الإداري", "/principal/assignments"],
  ["/principal/operational-plan", "دليل مراجعة الخطة التشغيلية", "/principal/impact"],
  ["/principal/impact", "دليل مراجعة قياس الأثر", "/principal/operational-plan"],
] as const) {
  test(`principal review workflow ${path}`, async ({page})=>{
    await page.goto(path);
    const section=page.locator("section[aria-label]").filter({hasText:heading});
    await expect(section).toBeVisible();
    await expect(section.getByRole("checkbox")).toHaveCount(4);
    await section.getByRole("checkbox").first().check();
    await expect(section.getByRole("status")).toContainText("1 من 4");
    await section.getByRole("button",{name:"إعادة تعيين"}).click();
    await expect(section.getByRole("status")).toContainText("0 من 4");
    await expect(section.locator(`a[href="${linked}"]`)).toBeVisible();
  });
}
