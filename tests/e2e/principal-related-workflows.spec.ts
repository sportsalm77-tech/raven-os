import { test, expect } from "@playwright/test";

for (const [path, target] of [
  ["/principal/teachers", "/principal/assignments"],
  ["/principal/students", "/principal/classes"],
  ["/principal/exams/grades", "/principal/exams/control"],
  ["/principal/library", "/principal/impact"],
  ["/principal/timetable", "/principal/classes"],
  ["/principal/health", "/principal/reports"],
] as const) {
  test(`principal related workflows on ${path}`, async ({page})=>{
    await page.goto(path);
    const section=page.getByRole("region",{name:"المسارات المرتبطة"});
    await expect(section.locator(`a[href="${target}"]`)).toBeVisible();
    await section.getByRole("button",{name:"إخفاء المسارات"}).click();
    await expect(section.locator(`a[href="${target}"]`)).toHaveCount(0);
    await section.getByRole("button",{name:"إظهار المسارات"}).click();
    await expect(section.locator(`a[href="${target}"]`)).toBeVisible();
  });
}
