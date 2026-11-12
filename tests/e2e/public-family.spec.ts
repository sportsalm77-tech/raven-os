import { test, expect } from "@playwright/test";
test("public homepage bilingual content and navigation", async ({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:"منصة رافين التعليمية"})).toBeVisible();
 await expect(page.getByRole("heading",{name:"مكتبة الملفات الذكية"})).toBeVisible();
 await page.getByRole("button",{name:"Switch to English"}).click();
 await expect(page.getByRole("heading",{name:"Raven Education Platform"})).toBeVisible();
 await expect(page.locator("html")).toHaveAttribute("dir","ltr");
});
test("family sections render purpose without private data entry",async({page})=>{
 for(const section of ["children","attendance","progress","grades","homework","behavior","timetable","notifications","contact","reports","profile"]){
  await page.goto("/family/"+section);
  await expect(page.getByText("هذه واجهة تطويرية آمنة.",{exact:false})).toBeVisible();
  await expect(page.locator("main input")).toHaveCount(0);
 }
});
