import { z } from "zod";
export const idSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);
const base = z.object({
  schemaVersion: z.literal(1),
  id: idSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  files: z.array(z.string()).min(1),
  dependencies: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export const contentItemSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  value: z.string().optional(),
  label: z.string().optional(),
  image: z.string().optional(),
  href: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
});
export const sectionContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  action: z.string().optional(),
  href: z.string().optional(),
  image: z.string().optional(),
  items: z.array(contentItemSchema).default([]),
});
export const sectionUseSchema = z.object({
  id: idSchema,
  key: idSchema,
  content: sectionContentSchema,
});
export const templateSchema = base.extend({
  kind: z.literal("template"),
  category: z.enum(["marketing", "content-commerce", "industry", "dashboard", "specialized"]),
  defaultStyleId: idSchema,
  defaultThemeId: idSchema,
  defaultMotionId: idSchema,
  defaultMode: z.enum(["light", "dark"]),
  compatibleStyles: z.array(idSchema).min(1),
  supportedThemes: z.array(idSchema).min(1),
  supportedMotion: z.array(idSchema).min(1),
  components: z.array(idSchema),
  sections: z.array(sectionUseSchema).min(2),
  responsive: z.literal(true),
  accessible: z.literal(true),
});
export const tokenKeys = [
  "background",
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "card",
  "card-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "success",
  "warning",
  "destructive",
  "info",
  "link",
  "selected",
  "sidebar",
  "sidebar-foreground",
  "sidebar-accent",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const tokensSchema = z.object(
  Object.fromEntries(tokenKeys.map((k) => [k, color])) as Record<
    (typeof tokenKeys)[number],
    typeof color
  >,
);
export const themeSchema = base.extend({
  kind: z.literal("theme"),
  light: tokensSchema,
  dark: tokensSchema,
  gradients: z.object({ hero: z.string(), accent: z.string() }),
});
export const styleSchema = base.extend({
  kind: z.literal("style"),
  headingFont: z.string(),
  bodyFont: z.string(),
  headingWeight: z.number(),
  bodyWeight: z.number(),
  headingScale: z.number().positive(),
  density: z.number().positive(),
  maxWidth: z.number().positive(),
  spacing: z.number().positive(),
  borderWidth: z.number().min(0),
  borderStyle: z.enum(["solid", "dashed", "double"]),
  radius: z.number().min(0),
  surface: z.enum(["flat", "glass", "raised", "outlined", "inset"]),
  shadow: z.string(),
  decoration: z.enum(["none", "grid", "dots", "lines", "glow"]),
  button: z.enum(["solid", "outline", "pill", "offset"]),
  input: z.enum(["boxed", "underline", "inset"]),
  background: z.enum(["plain", "grid", "gradient"]),
  defaultMotionId: idSchema,
  suitableCategories: z.array(z.string()),
  accessibility: z.string(),
});
export const motionSchema = base.extend({
  kind: z.literal("motion"),
  duration: z.number().min(0).max(2),
  ease: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  distance: z.number().min(0).max(100),
  scale: z.number().min(0.5).max(1),
  stagger: z.number().min(0).max(1),
  spring: z.object({ stiffness: z.number(), damping: z.number(), mass: z.number() }).nullable(),
  hover: z.number().min(1).max(1.1),
  scroll: z.boolean(),
  pattern: z.enum(["none", "fade", "slide", "scale", "stagger", "parallax"]),
  reducedMotion: z.literal("disable"),
});
export const componentSchema = base.extend({
  kind: z.literal("component"),
  exportName: z.string(),
  group: z.string(),
  responsive: z.literal(true),
  accessible: z.literal(true),
});
export const sectionSchema = base.extend({
  kind: z.literal("section"),
  exportName: z.string(),
  group: z.string(),
  variant: z.string(),
  components: z.array(idSchema),
  responsive: z.literal(true),
  accessible: z.literal(true),
});
export const registryItemSchema = z.discriminatedUnion("kind", [
  templateSchema,
  themeSchema,
  styleSchema,
  motionSchema,
  componentSchema,
  sectionSchema,
]);
export const designConfigSchema = z
  .object({
    schemaVersion: z.literal(1).default(1),
    template: idSchema,
    style: idSchema.optional(),
    theme: idSchema.optional(),
    motion: idSchema.optional(),
    mode: z.enum(["light", "dark"]).optional(),
    layout: z
      .object({
        contentWidth: z.number().finite().min(320).max(1920).optional(),
        density: z.number().finite().min(0.6).max(1.6).optional(),
        radius: z.number().finite().min(0).max(40).optional(),
      })
      .strict()
      .optional(),
    overrides: z.record(z.string(), idSchema).default({}),
    card: z
      .enum([
        "plain",
        "elevated",
        "outline",
        "metric",
        "image",
        "horizontal",
        "interactive",
        "accent",
      ])
      .default("plain"),
    content: z.record(z.string(), sectionContentSchema).default({}),
  })
  .strict();
export type Template = z.infer<typeof templateSchema>;
export type SectionContent = z.infer<typeof sectionContentSchema>;
export type SectionUse = z.infer<typeof sectionUseSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type StyleProfile = z.infer<typeof styleSchema>;
export type MotionProfile = z.infer<typeof motionSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
export type DesignConfig = z.infer<typeof designConfigSchema>;
export type DesignInput = z.input<typeof designConfigSchema>;
