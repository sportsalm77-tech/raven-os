import { test, expect } from "@playwright/test";
test("public homepage bilingual content and navigation", async ({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{level:1,name:"رافـيـيـن"})).toBeVisible();
 await expect(page.locator("#library").getByRole("heading",{level:2,name:"مكتبة رافيين"})).toBeVisible();
 await expect(page.locator("#about")).toContainText("نؤمن بأن التعليم الذكي ليس مجرد أدوات رقمية");
 await expect(page.locator("#portals").locator("a[href^='/']")).toHaveCount(3);
 await page.getByRole("button",{name:"Switch to English"}).click();
 await expect(page.getByRole("heading",{level:1,name:"RAVEN"})).toBeVisible();
 await expect(page.locator("html")).toHaveAttribute("dir","ltr");
 await expect(page.locator("#about")).toContainText("We believe smart education");
});
test("family sections render purpose without private data entry",async({page})=>{
 for(const section of ["children","attendance","progress","grades","homework","behavior","timetable","notifications","contact","reports","profile"]){
  await page.goto("/family/"+section);
  await expect(page.getByText("هذه واجهة تطويرية آمنة.",{exact:false})).toBeVisible();
  await expect(page.locator("main input")).toHaveCount(0);
 }
});
