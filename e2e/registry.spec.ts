import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
const templateIds = readdirSync("registry/templates")
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5));
test("registry search, categories, saved templates and empty state", async ({ page }) => {
  await page.goto("/registry");
  await expect(page.getByRole("heading", { name: "A good place to start." })).toBeVisible();
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await expect(page.locator(".template-card")).toHaveCount(9);
  await page.getByRole("textbox", { name: "Search templates" }).fill("inventory");
  await expect(page.locator(".template-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Save Inventory Management", exact: true }).click();
  await page.getByRole("button", { name: /Saved/ }).click();
  await expect(page.locator(".template-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search templates" }).fill("not-a-real-template");
  await expect(page.getByText("No templates match just yet.")).toBeVisible();
});
test("playground changes real preview, viewport and exports valid JSON", async ({ page }) => {
  await page.goto("/playground?template=saas-landing-01");
  await page.getByLabel("03 / Color theme").selectOption("ruby-red");
  await page.getByLabel("02 / Visual style").selectOption("neo-brutalism");
  await page.getByRole("combobox", { name: "Hero", exact: true }).selectOption("hero-centered");
  await page.getByLabel("Dark appearance").click();
  await page.getByRole("combobox", { name: "Navbar", exact: true }).selectOption("navbar-mega");
  await page
    .getByRole("combobox", { name: "Feature section", exact: true })
    .selectOption("features-timeline");
  await page.getByRole("combobox", { name: "Footer", exact: true }).selectOption("footer-minimal");
  await page.getByLabel("04 / Motion profile").selectOption("no-motion");
  await page.getByLabel("Card treatment").selectOption("outline");
  const frame = page.frameLocator('iframe[title="Live template preview"]');
  await expect(frame.locator(".factory-preview")).toHaveAttribute("data-theme", "ruby-red");
  await expect(frame.locator(".factory-preview")).toHaveAttribute("data-style", "neo-brutalism");
  await expect(frame.locator(".factory-preview")).toHaveAttribute("data-mode", "dark");
  await expect(frame.locator(".hero")).toHaveClass(/hero-centered/);
  await expect(frame.locator(".factory-preview")).toHaveCSS("background-color", "rgb(17, 21, 29)");
  await expect(frame.locator(".factory-preview")).toHaveAttribute("data-card", "outline");
  await expect(frame.locator(".factory-preview")).toHaveAttribute("data-motion", "no-motion");
  await expect(frame.locator('[data-section-id="navbar-mega"]')).toHaveCount(1);
  await expect(frame.locator('[data-section-id="features-timeline"]')).toHaveCount(1);
  await expect(frame.locator('[data-section-id="footer-minimal"]')).toHaveCount(1);
  await page.getByRole("button", { name: "Mobile preview" }).click();
  await expect(page.locator('iframe[title="Live template preview"]')).toHaveCSS("width", "390px");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export config" }).click();
  const download = await downloadPromise;
  const file = await download.path();
  const config = JSON.parse(readFileSync(file!, "utf8"));
  expect(config.theme).toBe("ruby-red");
  expect(config.overrides.hero).toBe("hero-centered");
});
test("commerce filtering and cart work", async ({ page }) => {
  await page.goto("/preview/ecommerce-premium-store?motion=no-motion");
  const section = page.locator("#content-products");
  await section.getByRole("button", { name: "Add to bag" }).first().click();
  await section.getByRole("button", { name: "Bag (1)" }).click();
  await expect(page.getByRole("dialog")).toContainText("Studio Chair");
  await page.getByRole("button", { name: "Remove one" }).click();
  await expect(page.getByText("Your bag is empty")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await section.getByRole("textbox", { name: "Search products" }).fill("no-product");
  await expect(section.getByRole("heading", { name: "No results" })).toBeVisible();
});
test("documentation topics and search work", async ({ page }) => {
  await page.goto("/preview/docs-developer?motion=no-motion");
  const docs = page.locator("#content-docs");
  await docs.getByRole("button", { name: "Configuration", exact: true }).click();
  await expect(docs.getByRole("heading", { name: "Configuration", exact: true })).toBeVisible();
  await expect(docs.locator("pre")).toContainText("admin-dashboard");
  await docs.getByRole("textbox", { name: "Search documentation" }).fill("errors");
  await expect(docs.getByRole("navigation").getByRole("button")).toHaveCount(1);
  await docs.getByRole("button", { name: "Errors & validation" }).click();
  await expect(docs.locator("pre")).toContainText("resolveDesign");
});
test("dashboard table filtering and keyboard dialog", async ({ page }) => {
  await page.goto("/preview/admin-dashboard?motion=no-motion");
  await page.getByRole("textbox", { name: "Search Recent projects" }).fill("Website");
  await expect(page.locator(".data-panel tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "Notifications", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("theme, style, component and motion explorers respond", async ({ page }) => {
  await page.goto("/themes");
  await expect(page.locator(".explorer-entry")).toHaveCount(24);
  await page.getByLabel("Dark appearance").click();
  await expect(page.locator(".explorer-sample").first()).toHaveCSS("color-scheme", "dark");
  await page.goto("/styles");
  await expect(page.locator(".explorer-entry")).toHaveCount(20);
  await page.goto("/components");
  await page.getByRole("button", { name: "Dialog", exact: true }).click();
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/motion");
  await page.getByRole("button", { name: /No Motion/ }).click();
  await page.getByRole("button", { name: "Replay motion" }).click();
  await expect(page.locator(".motion-example")).toBeVisible();
});
test("representative responsive screenshots and reduced motion", async ({ page }) => {
  mkdirSync("docs/screenshots", { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/registry");
  const loadThumbnails = async () => {
    await page.locator("iframe").evaluateAll((frames) => {
      for (const frame of frames) frame.setAttribute("loading", "eager");
    });
    for (const thumbnail of await page.locator("iframe").all()) {
      await expect(thumbnail.contentFrame().locator(".factory-preview")).toHaveCount(1);
    }
  };
  await loadThumbnails();
  await page.screenshot({ path: "docs/screenshots/registry-desktop.png", fullPage: true });
  await page.goto("/preview/saas-landing-01");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/saas-desktop.png", fullPage: true });
  await page.goto("/preview/analytics-dashboard");
  await page.screenshot({ path: "docs/screenshots/analytics-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/registry");
  await loadThumbnails();
  await page.screenshot({ path: "docs/screenshots/registry-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.goto("/preview/saas-landing-01");
  await page.screenshot({ path: "docs/screenshots/saas-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/preview/analytics-dashboard?motion=no-motion");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: "docs/screenshots/analytics-tablet.png", fullPage: true });
});
for (const id of templateIds)
  test("template smoke: " + id, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/preview/" + id + "?motion=no-motion");
    await expect(page.locator(".factory-preview")).toHaveAttribute("data-template", id);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      id + " must not overflow the mobile viewport",
    ).toBe(true);
    expect(errors).toEqual([]);
  });
