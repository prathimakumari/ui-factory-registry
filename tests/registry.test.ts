import { describe, it, expect } from "vitest";
import {
  items,
  templates,
  styles,
  themes,
  motions,
  sections,
  components,
  validateReferences,
  resolveDesign,
} from "../lib/registry";
import { registryItemSchema, templateSchema, designConfigSchema } from "../registry/schema";
import { existsSync } from "node:fs";
describe("registry integrity", () => {
  it("meets the requested catalog counts", () => {
    expect(templates).toHaveLength(50);
    expect(styles).toHaveLength(20);
    expect(themes).toHaveLength(24);
    expect(motions).toHaveLength(16);
    expect(components.length).toBeGreaterThanOrEqual(32);
  });
  it("parses every manifest and resolves every reference", () => {
    items.forEach((i) => expect(registryItemSchema.safeParse(i).success, i.id).toBe(true));
    expect(validateReferences()).toEqual([]);
  });
  it("finds duplicate IDs", () =>
    expect(validateReferences([...items, items[0]]).some((x) => x.includes("Duplicate ID"))).toBe(
      true,
    ));
  it("reports missing component references", () => {
    const broken = { ...templates[0], components: ["ui-not-real"] };
    expect(
      validateReferences([...items.filter((i) => i.id !== broken.id), broken]).some((x) =>
        x.includes("ui-not-real"),
      ),
    ).toBe(true);
  });
  it("checks every declared file", () => {
    for (const i of items)
      for (const file of i.files) expect(existsSync(file), i.id + ": " + file).toBe(true);
  });
  it.each(["template", "style", "theme", "motion"] as const)("rejects unknown %s IDs", (key) =>
    expect(() => resolveDesign({ template: "saas-landing-01", [key]: "unknown-id" })).toThrow(
      /Unknown/,
    ),
  );
  it("rejects cross-family and unavailable overrides", () => {
    expect(() =>
      resolveDesign({ template: "saas-landing-01", overrides: { hero: "footer-mega" } }),
    ).toThrow(/requires a hero/);
    expect(() =>
      resolveDesign({ template: "admin-dashboard", overrides: { hero: "hero-split" } }),
    ).toThrow(/no hero slot/);
  });
  it("reports defaults outside compatibility lists", () => {
    const broken = { ...templates[0], compatibleStyles: [] };
    expect(
      validateReferences([...items.filter((i) => i.id !== broken.id), broken]).some((x) =>
        x.includes("invalid default style"),
      ),
    ).toBe(true);
  });
  it("rejects unknown configuration fields and invalid schema versions", () => {
    expect(designConfigSchema.safeParse({ template: "saas-landing-01", typo: true }).success).toBe(
      false,
    );
    expect(templateSchema.safeParse({ ...templates[0], schemaVersion: 2 }).success).toBe(false);
  });
  it("supports optional metadata without changing the schema version", () =>
    expect(
      templateSchema.parse({ ...templates[0], metadata: { owner: "design-systems" } }).metadata
        ?.owner,
    ).toBe("design-systems"));
  it("has the required section families", () => {
    const counts = {
      hero: 12,
      navbar: 8,
      features: 10,
      pricing: 8,
      testimonials: 8,
      cta: 8,
      footer: 8,
      shell: 8,
      card: 8,
      faq: 6,
    };
    for (const [group, count] of Object.entries(counts))
      expect(sections.filter((s) => s.group === group).length, group).toBeGreaterThanOrEqual(count);
  });
});
