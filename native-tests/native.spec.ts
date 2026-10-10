import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync("registry/mobile/screens.json", "utf8")) as {
  screens: { id: string; name: string }[];
};
test("native kit renders every screen in its Expo web bundle", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Find your little reset." })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/native-mobile-home.png", fullPage: true });
  for (const screen of catalog.screens) {
    await page.getByRole("button", { name: "Design controls", exact: true }).click();
    await page.getByRole("button", { name: /^Screen:/ }).click();
    await page.getByRole("radio", { name: screen.name, exact: true }).click();
    await page.getByRole("button", { name: "View design", exact: true }).click();
    await expect(page.getByRole("heading").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
  expect(errors).toEqual([]);
});
test("native controls validate forms and update the bag", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Design controls", exact: true }).click();
  await page.getByRole("button", { name: /^Screen:/ }).click();
  await page
    .getByRole("radio", {
      name: catalog.screens.find((s) => s.id === "mobile-sign-in")!.name,
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "View design", exact: true }).click();
  await page.getByRole("button", { name: "Sign in to demo" }).click();
  await expect(page.getByRole("alert")).toContainText("valid email");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByLabel("Password", { exact: true }).fill("demopassword");
  await page.getByRole("button", { name: "Sign in to demo" }).click();
  await page.getByRole("button", { name: "Everyday bottle", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await page.getByRole("button", { name: "View bag", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Subtotal $74" })).toBeVisible();
});
