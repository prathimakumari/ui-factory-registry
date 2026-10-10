import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync("registry/mobile/screens.json", "utf8")) as {
  screens: { id: string; name: string }[];
};

test("mobile styles fit a narrow preview and export selected configuration", async ({ page }) => {
  await page.goto("/mobile");
  await page.getByLabel("Mobile motion", { exact: true }).selectOption("no-motion");
  const preview = page.locator(".mobile-preview");
  await preview.screenshot({ path: "docs/screenshots/mobile-web-home.png" });
  const width = page.getByRole("slider", { name: "Mobile preview width" });
  await width.focus();
  await width.press("Home");
  const selector = page.getByLabel("Mobile style", { exact: true });
  const styles = await selector
    .locator("option")
    .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
  expect(styles).toHaveLength(20);
  for (const style of styles) {
    await selector.selectOption(style);
    await expect(preview).toHaveAttribute("data-style", style);
    expect(await preview.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  }
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export config", exact: true }).click();
  const file = await (await download).path();
  expect(JSON.parse(readFileSync(file!, "utf8"))).toMatchObject({
    screen: "mobile-home",
    style: styles.at(-1),
    motion: "no-motion",
  });
});

for (const screen of catalog.screens)
  test(screen.id + " fits phone and tablet containers", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/mobile");
    await page.getByLabel("Mobile screen", { exact: true }).selectOption(screen.id);
    await page.getByLabel("Mobile motion", { exact: true }).selectOption("no-motion");
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      const preview = page.locator(".mobile-preview");
      await expect(preview).toBeVisible();
      expect(await preview.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });

test("mobile forms, cart and checkout work through navigation", async ({ page }) => {
  await page.goto("/mobile");
  await page.getByLabel("Mobile screen", { exact: true }).selectOption("mobile-sign-in");
  const app = page.locator(".mobile-preview");
  await app.getByRole("button", { name: "Sign in to demo" }).click();
  await expect(app.getByRole("alert")).toContainText("valid email");
  await app.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await app.getByLabel("Password", { exact: true }).fill("demopassword");
  await app.getByRole("button", { name: "Sign in to demo" }).click();
  await app.getByRole("button", { name: "Everyday bottle", exact: true }).click();
  await app.getByLabel("Finish", { exact: true }).selectOption("Ocean");
  await app.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(app.getByRole("status")).toContainText("Added");
  await app.getByRole("button", { name: "View bag", exact: true }).click();
  await expect(app.getByRole("heading", { name: "Subtotal $74" })).toBeVisible();
  await app.getByRole("button", { name: "Continue to checkout" }).click();
  await app.getByRole("button", { name: "Confirm demo order" }).click();
  await expect(app.getByRole("alert")).toContainText("address");
  await app.getByLabel("Delivery address").fill("12 Sample Street");
  await app.getByRole("button", { name: "Confirm demo order" }).click();
  await expect(app.getByRole("heading", { name: "You’re all set." })).toBeVisible();
});

test("mobile search, messages, booking and settings preserve local state", async ({ page }) => {
  await page.goto("/mobile");
  const app = page.locator(".mobile-preview");
  await app.getByRole("button", { name: "Discover", exact: true }).click();
  await app.getByLabel("Search products").fill("no matching product");
  await expect(app.getByRole("heading", { name: "No matches yet." })).toBeVisible();
  await app.getByRole("button", { name: "Clear filters" }).click();
  await app.getByRole("button", { name: "Home", exact: true }).click();
  await app.getByRole("button", { name: "Messages from Jordan" }).click();
  await app.getByLabel("Message", { exact: true }).fill("A local test message");
  await app.getByRole("button", { name: "Send locally" }).click();
  await expect(app.getByText("A local test message", { exact: true })).toBeVisible();
  await app.getByRole("button", { name: "Home", exact: true }).click();
  await app.getByRole("button", { name: "Book a session" }).click();
  await app.getByLabel("Time", { exact: true }).selectOption("14:00");
  await app.getByRole("button", { name: "Save demo booking" }).click();
  await expect(app.getByRole("status")).toContainText("No reservation");
  await app.getByRole("button", { name: "Profile", exact: true }).click();
  await expect(app.getByText(/Next session:.*14:00/)).toBeVisible();
  await app.getByRole("button", { name: "Open settings" }).click();
  await app.getByRole("switch", { name: "Dark appearance" }).click();
  await expect(app).toHaveAttribute("data-mode", "dark");
  await app.getByRole("button", { name: "Reset demo", exact: true }).click();
  await app.getByRole("button", { name: "Confirm reset", exact: true }).click();
  await app.getByRole("button", { name: "Profile", exact: true }).click();
  await expect(app.getByText("Next session: Not booked")).toBeVisible();
});
