import React from "react";
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";
import { templates, sections, resolveDesign, lookup } from "../lib/registry";
import { sectionMap } from "../lib/section-map";
import { TemplateRenderer } from "../lib/template-renderer";
import { MotionProvider } from "../components/motion/primitives";
const sample = {
  title: "Representative section",
  description: "Meaningful content for rendering verification.",
  items: [
    { title: "First item", description: "A useful description" },
    { title: "Second item", description: "Another useful description" },
    { title: "Third item", description: "More context" },
  ],
};
describe("template compositions", () => {
  it.each(["saas-landing-01", "admin-dashboard"])(
    "%s embeds without nesting main landmarks",
    (template) => {
      const html = renderToString(
        <TemplateRenderer embedded config={{ template, motion: "no-motion" }} />,
      );
      expect(html).not.toContain("<main");
      expect(html).toContain("--preview-min-height:0px");
    },
  );
  it.each(templates)("$id renders its actual registered structure", (t) => {
    const html = renderToString(
      <TemplateRenderer config={{ template: t.id, motion: "no-motion" }} />,
    );
    expect(html).toContain('data-template="' + t.id + '"');
    expect(html).toContain(
      t.sections
        .find((s) => s.id.startsWith("hero-") || s.id.startsWith("app-"))!
        .content.title.replaceAll("&", "&amp;")
        .replaceAll("'", "&#x27;"),
    );
    for (const section of t.sections.filter((s) => !s.id.startsWith("shell-")))
      expect(html).toContain('data-section-id="' + section.id + '"');
  });
  it("all template section sequences are distinct", () =>
    expect(new Set(templates.map((t) => t.sections.map((s) => s.id).join("|"))).size).toBe(50));
  it.each(sections)("$id maps to a real renderable section", (section) => {
    const Component = sectionMap[section.id];
    expect(Component).toBeDefined();
    const html = renderToString(
      <MotionProvider profile={lookup("no-motion", "motion")}>
        <Component variant={section.variant} content={sample} />
      </MotionProvider>,
    );
    expect(html.length).toBeGreaterThan(50);
  });
  it("applies section and content overrides", () => {
    const t = templates.find((t) => t.id === "saas-landing-01")!;
    const hero = t.sections.find((s) => s.id.startsWith("hero-"))!;
    const result = resolveDesign({
      template: t.id,
      overrides: { hero: "hero-centered" },
      content: { [hero.key]: { title: "My application", items: [] } },
    });
    expect(result.sections.find((s) => s.key === hero.key)?.id).toBe("hero-centered");
    expect(result.sections.find((s) => s.key === hero.key)?.content.title).toBe("My application");
  });
});
