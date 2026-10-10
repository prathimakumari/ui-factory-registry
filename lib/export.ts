import { resolveDesign } from "./registry";
import type { DesignInput } from "@/registry/schema";
export function exportConfiguration(input: DesignInput) {
  const design = resolveDesign(input);
  const { schemaVersion, template, style, theme, motion, mode, layout, overrides, card, content } =
    design.config;
  const config = {
    schemaVersion,
    template,
    style,
    theme,
    motion,
    mode,
    layout,
    overrides,
    card,
    content,
  };
  return {
    filename: design.template.id + ".config.json",
    content: JSON.stringify(config, null, 2) + "\n",
    config,
  };
}
