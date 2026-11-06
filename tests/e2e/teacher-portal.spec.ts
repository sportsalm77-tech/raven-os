import { expect, test } from "@playwright/test";

const teacherRoutes = [
  "/teacher/timetable",
  "/teacher/tasks",
  "/teacher/lesson-plans",
  "/teacher/classes",
  "/teacher/attendance",
  "/teacher/grades",
  "/teacher/exams",
  "/teacher/homework",
  "/teacher/behavior",
  "/teacher/achievements",
  "/teacher/library",
  "/teacher/notices",
  "/teacher/profile",
];

test.describe("Teacher portal browser acceptance", () => {
  test("loads the dedicated teacher workspace without sample identity or metrics", async ({ page }) => {
    const response = await page.goto("/teacher");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /مساحة المعلم اليومية|Teacher Daily Workspace/ })).toBeVisible();
    await expect(page.getByText(/مصدر البيانات غير متصل|Data source not connected/).first()).toBeVisible();
    await expect(page.getByText(/14 قسمًا ضمن البوابة|14 portal sections/)).toBeVisible();
    await expect(page.locator("body")).not.toContainText("سارة الحربي");
    await expect(page.locator("body")).not.toContainText("2,140");
  });

  for (const route of teacherRoutes) {
    test(`loads the specialized teacher workspace: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `Unexpected response for ${route}`).toBe(200);
      await expect(page.getByText(/مصدر البيانات غير متصل|Data source not connected/).first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText("Internal Server Error");
    });
  }

  test("switches the teacher workspace from Arabic RTL to English LTR", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/teacher");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.getByRole("button", { name: /Change language|English|العربية/ }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { name: "Teacher Daily Workspace" })).toBeVisible();
  });

  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    test(`avoids document-level horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/teacher");
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  for (const scenario of [
    { route: "/teacher/lesson-plans", title: "مسودة تحضير درس", first: "عنوان الدرس", second: "نواتج التعلم", button: "معاينة المسودة محليًا", value: "تحضير تجريبي غير مرتبط بطلاب" },
    { route: "/teacher/homework", title: "مسودة واجب أو نشاط", first: "عنوان المهمة", second: "التعليمات والأهداف", button: "معاينة المسودة محليًا", value: "مسودة نشاط محلية" },
    { route: "/teacher/achievements", title: "بطاقة وصف شاهد", first: "عنوان الشاهد", second: "المجال أو المؤشر المرتبط", button: "معاينة بطاقة الشاهد", value: "وصف شاهد غير مرفوع" },
  ]) {
    test(`supports a clearly temporary local draft on ${scenario.route}`, async ({ page }) => {
      await page.goto(scenario.route);
      await expect(page.getByRole("heading", { name: scenario.title })).toBeVisible();
      await page.getByLabel(scenario.first).fill(scenario.value);
      await page.getByLabel(scenario.second).fill("محتوى محلي للاختبار");
      await page.getByRole("button", { name: scenario.button }).click();
      await expect(page.getByText(/معاينة مؤقتة — غير محفوظة/)).toBeVisible();
      await expect(page.getByText(scenario.value)).toBeVisible();
      await page.reload();
      await expect(page.getByText(/معاينة مؤقتة — غير محفوظة/)).toHaveCount(0);
    });
  }

  test("keeps student-linked sections free of local student or attendance entry forms", async ({ page }) => {
    for (const route of ["/teacher/classes", "/teacher/attendance", "/teacher/grades"]) {
      await page.goto(route);
      await expect(page.getByText(/مصدر البيانات غير متصل/).first()).toBeVisible();
      await expect(page.locator("form")).toHaveCount(0);
    }
  });

  test("opens and closes the teacher mobile navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/teacher");
    const openButton = page.getByRole("button", { name: "Open navigation" });
    await expect(openButton).toBeVisible();
    await openButton.click();
    await expect(page.getByRole("navigation", { name: /التنقل الرئيسي|Main navigation/ })).toBeVisible();
    await page.getByRole("button", { name: "Close navigation" }).last().click();
    await expect(page.getByRole("button", { name: "Open navigation" })).toBeVisible();
  });
});
