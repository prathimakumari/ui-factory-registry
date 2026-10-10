import type { CSSProperties } from "react";
import type { Theme, StyleProfile, DesignInput } from "@/registry/schema";
export function layoutVariables(layout: DesignInput["layout"]): CSSProperties {
  return {
    ...(layout?.contentWidth !== undefined && { "--content-width": layout.contentWidth + "px" }),
    ...(layout?.density !== undefined && { "--density": layout.density }),
    ...(layout?.radius !== undefined && { "--radius": layout.radius + "px" }),
  } as CSSProperties;
}
export function themeVariables(theme: Theme, mode: "light" | "dark"): CSSProperties {
  return Object.fromEntries([
    ...Object.entries(theme[mode]).map(([k, v]) => ["--" + k, v]),
    ["--gradient-hero", theme.gradients.hero],
    ["--gradient-accent", theme.gradients.accent],
    ["colorScheme", mode],
  ]) as CSSProperties;
}
export function styleVariables(style: StyleProfile): CSSProperties {
  return {
    "--font-heading": style.headingFont,
    "--font-body": style.bodyFont,
    "--heading-weight": style.headingWeight,
    "--body-weight": style.bodyWeight,
    "--heading-scale": style.headingScale,
    "--density": style.density,
    "--content-width": style.maxWidth + "px",
    "--space": style.spacing + "px",
    "--border-width": style.borderWidth + "px",
    "--border-style": style.borderStyle,
    "--radius": style.radius + "px",
    "--elevation": style.shadow,
  } as CSSProperties;
}
export function contrastRatio(a: string, b: string) {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
