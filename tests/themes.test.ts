import { describe, it, expect } from "vitest";
import { themes, styles } from "../lib/registry";
import { themeVariables, styleVariables, contrastRatio } from "../lib/theme";
import { tokenKeys } from "../registry/schema";
describe("semantic themes", () => {
  it.each(themes)("$id has complete, readable light and dark tokens", (theme) => {
    for (const mode of ["light", "dark"] as const) {
      const tokens = theme[mode];
      for (const key of tokenKeys) expect(tokens[key]).toMatch(/^#[0-9a-f]{6}$/i);
      for (const [fg, bg] of [
        ["foreground", "background"],
        ["card-foreground", "card"],
        ["primary-foreground", "primary"],
        ["muted-foreground", "background"],
        ["link", "background"],
        ["secondary-foreground", "secondary"],
        ["sidebar-foreground", "sidebar"],
        ["accent-foreground", "accent"],
      ] as const)
        expect(
          contrastRatio(tokens[fg], tokens[bg]),
          theme.id + " " + mode + " " + fg + "/" + bg,
        ).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("switches semantic variables without rebuilding the component tree", () => {
    const a = themeVariables(themes[0], "light");
    const b = themeVariables(themes[1], "dark");
    expect(Object.keys(a)).toEqual(Object.keys(b));
    expect(a).not.toEqual(b);
    expect(a).toHaveProperty("--background");
  });
  it("styles independently change typography, density, shape and surfaces", () => {
    const signatures = styles.map((s) => JSON.stringify(styleVariables(s)));
    expect(new Set(signatures).size).toBe(20);
    expect(new Set(styles.map((s) => s.headingFont)).size).toBeGreaterThan(1);
    expect(new Set(styles.map((s) => s.radius)).size).toBeGreaterThan(5);
  });
});
