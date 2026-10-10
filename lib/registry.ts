import { rawItems } from "@/registry/catalog";
import {
  registryItemSchema,
  designConfigSchema,
  type RegistryItem,
  type Template,
  type DesignInput,
} from "@/registry/schema";
export const items: RegistryItem[] = rawItems.map((item) => registryItemSchema.parse(item));
export const templates = items.filter((i): i is Template => i.kind === "template");
export const themes = items.filter((i) => i.kind === "theme");
export const styles = items.filter((i) => i.kind === "style");
export const motions = items.filter((i) => i.kind === "motion");
export const sections = items.filter((i) => i.kind === "section");
export const components = items.filter((i) => i.kind === "component");
export function lookup<K extends RegistryItem["kind"]>(
  id: string,
  kind: K,
): Extract<RegistryItem, { kind: K }> {
  const item = items.find((i) => i.id === id && i.kind === kind);
  if (!item)
    throw new Error(
      "Unknown " + kind + ' "' + id + '". Run pnpm registry:list --kind ' + kind + ".",
    );
  return item as Extract<RegistryItem, { kind: K }>;
}
export function resolveDesign(input: DesignInput) {
  const config = designConfigSchema.parse(input);
  const template = lookup(config.template, "template");
  const style = lookup(config.style || template.defaultStyleId, "style");
  const theme = lookup(config.theme || template.defaultThemeId, "theme");
  const motion = lookup(config.motion || template.defaultMotionId, "motion");
  if (!template.compatibleStyles.includes(style.id))
    throw new Error("Style " + style.id + " is incompatible with " + template.id);
  if (!template.supportedThemes.includes(theme.id))
    throw new Error("Theme " + theme.id + " is incompatible with " + template.id);
  if (!template.supportedMotion.includes(motion.id))
    throw new Error("Motion " + motion.id + " is incompatible with " + template.id);
  for (const [group, id] of Object.entries(config.overrides)) {
    const section = lookup(id, "section");
    if (section.group !== group)
      throw new Error("Override " + group + " requires a " + group + " section; received " + id);
    if (!template.sections.some((s) => lookup(s.id, "section").group === group))
      throw new Error(template.id + " has no " + group + " slot to override.");
  }
  for (const key of Object.keys(config.content))
    if (!template.sections.some((s) => s.key === key))
      throw new Error("Unknown content slot " + key + " in " + template.id);
  const resolvedSections = template.sections.map((section) => {
    const group = lookup(section.id, "section").group;
    return {
      ...section,
      id: config.overrides[group] || section.id,
      content: config.content[section.key] || section.content,
    };
  });
  return {
    template,
    style,
    theme,
    motion,
    sections: resolvedSections,
    config: {
      ...config,
      style: style.id,
      theme: theme.id,
      motion: motion.id,
      mode: config.mode || template.defaultMode,
    },
  };
}
export function validateReferences(catalog: RegistryItem[] = items) {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of catalog) {
    if (seen.has(item.id)) errors.push("Duplicate ID: " + item.id);
    seen.add(item.id);
  }
  const has = (id: string, kind: string, owner: string) => {
    if (!catalog.some((i) => i.id === id && i.kind === kind))
      errors.push(owner + ": missing " + kind + " reference " + id);
  };
  for (const item of catalog) {
    if (item.kind === "template") {
      for (const id of item.compatibleStyles) has(id, "style", item.id);
      for (const id of item.supportedThemes) has(id, "theme", item.id);
      for (const id of item.supportedMotion) has(id, "motion", item.id);
      for (const id of item.components) has(id, "component", item.id);
      for (const section of item.sections) has(section.id, "section", item.id);
      if (new Set(item.sections.map((s) => s.key)).size !== item.sections.length)
        errors.push(item.id + ": duplicate section keys");
      for (const [id, allowed, kind] of [
        [item.defaultStyleId, item.compatibleStyles, "style"],
        [item.defaultThemeId, item.supportedThemes, "theme"],
        [item.defaultMotionId, item.supportedMotion, "motion"],
      ] as const) {
        has(id, kind, item.id);
        if (!allowed.includes(id)) errors.push(item.id + ": invalid default " + kind + " " + id);
      }
    }
    if (item.kind === "section") for (const id of item.components) has(id, "component", item.id);
    if (item.kind === "style") has(item.defaultMotionId, "motion", item.id);
  }
  return errors;
}
