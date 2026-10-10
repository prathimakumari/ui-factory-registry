import { describe, it, expect } from "vitest";
import { exportConfiguration } from "../lib/export";
import { sourceClosure } from "../scripts/source-graph";
describe("configuration export", () => {
  it("exports a complete round-trippable config", () => {
    const result = exportConfiguration({
      template: "admin-dashboard",
      style: "corporate-enterprise",
      theme: "enterprise-neutral",
      motion: "dashboard-fast",
    });
    const parsed = JSON.parse(result.content);
    expect(exportConfiguration(parsed).content).toBe(result.content);
    expect(result.filename).toBe("admin-dashboard.config.json");
    expect(parsed.schemaVersion).toBe(1);
  });
  it("rejects invalid export selections", () => {
    expect(() => exportConfiguration({ template: "not-real" })).toThrow();
    expect(() => exportConfiguration({ template: "saas-landing-01", theme: "not-real" })).toThrow();
  });
  it("computes a complete local source dependency closure", () => {
    const files = sourceClosure(["lib/template-renderer.tsx"]);
    expect(files).toContain("registry/catalog.ts");
    expect(files).toContain("components/ui/button.tsx");
    expect(files).toContain("registry/templates/saas-landing-01.json");
    expect(files).toContain("lib/utils.ts");
  });
  it("reports missing source files", () =>
    expect(() => sourceClosure(["missing.tsx"])).toThrow(/Missing source file/));
});
