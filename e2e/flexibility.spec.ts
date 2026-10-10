import { test, expect } from "@playwright/test";
import { readdirSync, mkdirSync } from "node:fs";

for (const file of readdirSync("registry/templates").filter((f) => f.endsWith(".json"))) {
  const id = file.slice(0, -5);
  test("responsive container: " + id, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/preview/" + id + "?motion=no-motion");
    const preview = page.locator(".factory-preview");
    for (const width of [320, 480, 768, 1024, 1440]) {
      await preview.evaluate((element, w) => {
        element.style.width = w + "px";
      }, width);
      await expect
        .poll(() => preview.evaluate((element) => element.scrollWidth - element.clientWidth), {
          message: id + " must fit its " + width + "px container",
        })
        .toBeLessThanOrEqual(1);
    }
  });
}

test("tooltip keyboard access, themed portals, popover and form error recovery", async ({
  page,
}) => {
  await page.goto("/components");
  await page.getByLabel("Component theme", { exact: true }).selectOption("ruby-red");
  await page.getByLabel("Component dark mode").click();
  await page.getByRole("button", { name: "Tooltip", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Hover or focus me" });
  await trigger.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  const card = await page
    .locator("#explorer")
    .evaluate((e) => getComputedStyle(e).getPropertyValue("--card").trim());
  await expect
    .poll(() =>
      page
        .locator(".ui-tooltip")
        .evaluate((e) => getComputedStyle(e).getPropertyValue("--card").trim()),
    )
    .toBe(card);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).not.toBeVisible();
  await page.getByRole("button", { name: "Popover", exact: true }).click();
  await page.getByRole("button", { name: "Open preferences" }).click();
  await expect(page.getByText("Display preferences")).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Form Field", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await page.getByLabel("Email", { exact: true }).press("Tab");
  await expect(page.locator("#explorer").getByRole("alert")).toContainText("valid email");
  await page.getByLabel("Email", { exact: true }).fill("person@example.com");
  await page.getByLabel("Email", { exact: true }).press("Tab");
  await expect(page.locator("#explorer").getByRole("alert")).toHaveCount(0);
});

test("all styles fit a narrow embedded hero with alternating themes and modes", async ({
  page,
}) => {
  await page.goto("/components");
  await page.getByLabel("Component family").selectOption("hero");
  const control = page.getByLabel("Component style", { exact: true });
  const styles = await control
    .locator("option")
    .evaluateAll((options) => options.map((o) => (o as HTMLOptionElement).value));
  await page.getByRole("slider", { name: /Component width/ }).fill("320");
  for (const [i, style] of styles.entries()) {
    await control.selectOption(style);
    await page
      .getByLabel("Component theme", { exact: true })
      .selectOption(i % 2 ? "royal-purple" : "ocean-blue");
    await page.getByLabel("Component dark mode").setChecked(i % 2 === 1);
    await expect
      .poll(() => page.locator("#explorer").evaluate((e) => e.scrollWidth - e.clientWidth), {
        message: style,
      })
      .toBeLessThanOrEqual(1);
  }
});

test("custom viewport and layout dimensions survive download and full preview", async ({
  page,
}) => {
  await page.goto("/playground");
  await page.getByRole("slider", { name: /Preview width/ }).fill("320");
  await page.getByRole("slider", { name: /Preview height/ }).fill("640");
  await page.getByRole("slider", { name: /Content width/ }).fill("880");
  await page.getByRole("slider", { name: /Corner radius/ }).fill("22");
  const frame = page.locator('iframe[title="Live template preview"]');
  await expect(frame).toHaveCSS("width", "320px");
  await expect(frame).toHaveCSS("height", "640px");
  await expect
    .poll(() =>
      frame
        .contentFrame()
        .locator(".factory-preview")
        .evaluate((e) => getComputedStyle(e).getPropertyValue("--radius").trim()),
    )
    .toBe("22px");
  await expect(page.getByRole("link", { name: "Open full preview" })).toHaveAttribute(
    "href",
    /layout=/,
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export config" }).click();
  const result = await download;
  const { readFileSync } = await import("node:fs");
  expect(JSON.parse(readFileSync((await result.path())!, "utf8")).layout).toMatchObject({
    contentWidth: 880,
    radius: 22,
  });
});

test("effects tune, pause, respect reduced motion and keep buttons functional", async ({
  page,
}) => {
  await page.goto("/components");
  await page.getByRole("button", { name: "Border Glow", exact: true }).click();
  await expect(page.locator(".border-glow")).toBeVisible();
  await page.getByRole("button", { name: "Explore this detail" }).click();
  await expect(page.getByRole("status")).toContainText("Action completed 1");
  await page.getByLabel("Pause effect").click();
  await expect
    .poll(() =>
      page
        .locator(".effect-edge")
        .evaluate((e) => getComputedStyle(e, "::before").animationPlayState),
    )
    .toBe("paused");
  await page.getByRole("button", { name: "Status Orb", exact: true }).click();
  await page.getByLabel("Orb state").selectOption("complete");
  await expect(page.getByRole("status")).toContainText("Complete");
  await page.getByLabel("Orb state").selectOption("working");
  await page.getByLabel("Component motion", { exact: true }).selectOption("no-motion");
  await expect(page.locator(".status-orb > span")).toHaveCSS("animation-name", "none");
  await page.getByLabel("Component motion", { exact: true }).selectOption("subtle");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".status-orb > span")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Metallic Button", exact: true }).click();
  await page.getByRole("button", { name: "Continue your work" }).click();
  await expect(page.getByRole("status")).toContainText("Action completed 1");
  mkdirSync("docs/screenshots", { recursive: true });
  await page.getByRole("button", { name: "Border Glow", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.screenshot({ path: "docs/screenshots/component-effects.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
  await page.screenshot({ path: "docs/screenshots/component-effects-mobile.png", fullPage: true });
});
