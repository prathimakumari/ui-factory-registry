import { describe, it, expect } from "vitest";
import { motions } from "../lib/registry";
import { motionSettings } from "../lib/motion";
describe("motion profiles", () => {
  it.each(motions)("$id disables motion for reduced-motion users", (profile) => {
    const settings = motionSettings(profile, true);
    expect(settings.disabled).toBe(true);
    expect(settings.transition.duration).toBe(0);
    expect(settings.initial).toEqual(settings.visible);
    expect(settings.hover).toBe(1);
    expect(settings.stagger).toBe(0);
  });
  it("no-motion is immediate even without system preference", () => {
    const p = motions.find((m) => m.id === "no-motion")!;
    expect(motionSettings(p, false).transition.duration).toBe(0);
  });
  it("presets have distinct motion configurations", () =>
    expect(new Set(motions.map((m) => JSON.stringify(motionSettings(m, false)))).size).toBe(16));
});
