import catalog from "@/registry/mobile/screens.json";
import { mobileCatalogSchema, mobileConfigSchema } from "@/registry/mobile-schema";
import { lookup } from "./registry";
export const mobileCatalog = mobileCatalogSchema.parse(catalog);
export const mobileScreens = mobileCatalog.screens;
export function resolveMobileDesign(input: unknown) {
  const config = mobileConfigSchema.parse(input);
  const screen = mobileScreens.find((s) => s.id === config.screen);
  if (!screen) throw new Error("Unknown mobile screen: " + config.screen);
  return {
    config,
    screen,
    theme: lookup(config.theme, "theme"),
    style: lookup(config.style, "style"),
    motion: lookup(config.motion, "motion"),
  };
}
