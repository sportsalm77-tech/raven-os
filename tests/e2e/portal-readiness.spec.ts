import { test, expect } from "@playwright/test";

for (const portal of ["platform","principal","teacher","family"] as const) {
  test(`${portal} shows explicit operational safeguards and keyboard main target`,async ({page})=>{
    await page.goto(`/${portal}`);
    const section=page.getByRole("region",{name:"متطلبات التفعيل التشغيلي"});
    await expect(section).toBeVisible();
    await section.getByRole("button",{name:"عرض ضوابط التشغيل"}).click();
    await expect(section.getByText("هوية وجلسة موثقتان")).toBeVisible();
    await expect(section.getByText("عزل school_id على الخادم")).toBeVisible();
    await expect(section.getByText("غير متحقق هنا")).toHaveCount(5);
    await expect(page.locator("#portal-main-content")).toBeVisible();
    await expect(page.locator('a[href="#portal-main-content"]')).toHaveCount(1);
    await section.getByRole("button",{name:"إخفاء الضوابط"}).click();
    await expect(section.getByText("هوية وجلسة موثقتان")).toHaveCount(0);
  });
}
