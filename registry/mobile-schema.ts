import { z } from "zod";
import { idSchema } from "./schema";
export const mobileKinds = [
  "onboarding",
  "sign-in",
  "home",
  "search",
  "product",
  "cart",
  "checkout",
  "activity",
  "messages",
  "booking",
  "profile",
  "settings",
] as const;
export const mobileCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  screens: z.array(
    z.object({
      id: idSchema,
      kind: z.enum(mobileKinds),
      name: z.string().min(1),
      description: z.string().min(1),
      version: z.string().regex(/^\d+\.\d+\.\d+$/),
      tags: z.array(z.string()),
      defaultStyle: idSchema,
      defaultTheme: idSchema,
      defaultMotion: idSchema,
    }),
  ),
  files: z.object({ web: z.string(), native: z.string(), sharedData: z.string() }),
});
export const mobileConfigSchema = z
  .object({
    screen: idSchema.default("mobile-home"),
    style: idSchema.default("modern-minimal"),
    theme: idSchema.default("emerald"),
    motion: idSchema.default("subtle"),
    mode: z.enum(["light", "dark"]).default("light"),
  })
  .strict();
export type MobileConfig = z.infer<typeof mobileConfigSchema>;
export type MobileKind = (typeof mobileKinds)[number];
