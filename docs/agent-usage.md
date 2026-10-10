# Agent usage — start here

1. Read root AGENTS.md.
2. Search registry/index.json for the requested IDs.
3. Open only matching source manifests and their referenced source files.
4. Resolve the complete configuration using resolveDesign or registry:export.
5. Reuse existing sections, primitives, semantic tokens and motion patterns.
6. Supply project-specific content and behavior.
7. Run relevant tests, lint, typecheck and build.
8. Report reused IDs/files, new source, verification and limitations.

Do not read all 50 implementations for a single request. Do not duplicate an unfamiliar component under another filename. Search the catalog before creating anything.

## Example instruction

```text
Use the UI Factory Registry.
Template: saas-landing-01
Style: modern-minimal
Theme: ocean-blue
Motion: premium-smooth
Navbar: navbar-floating
Hero: hero-split
Features: features-bento
Footer: footer-mega
Reuse the existing implementation; only add missing behavior.
```

## Lookup workflow

```sh
pnpm registry:list --search saas
pnpm registry:list --kind section --search pricing
pnpm registry:export --template saas-landing-01 --style modern-minimal --theme ocean-blue --motion premium-smooth
```

Open registry/templates/saas-landing-01.json to inspect its section keys. Its sections reference registered implementations; do not copy the entire registry browser into your application.

For a new repository, use --copy and follow the generated INTEGRATION.md. For an individual section, locate its exported component and pass typed SectionProps. Wrap rich motion sections in MotionProvider. Apply themeVariables/styleVariables and ThemeScope when composing outside TemplateRenderer.

## Content override

```tsx
<TemplateRenderer
  config={{
    template: "saas-landing-01",
    content: {
      "hero-split": {
        eyebrow: "YOUR PRODUCT",
        title: "Your own product story.",
        description: "Describe the specific value you provide.",
        action: "See the features",
        href: "#features-bento",
        items: [],
      },
    },
  }}
/>
```

## Missing functionality

For new visual directions or combining external design skills with this registry, read [design-principles-and-skills.md](design-principles-and-skills.md). Apply relevant installed skills when requested or useful, preserve the registry's reusable structure, and distinguish proposed integrations from implemented components. Installing a skill does not install its recommended runtime libraries.

For mobile application work, read [mobile-designs.md](mobile-designs.md), use `pnpm registry:list --kind mobile-screen`, and choose the web or native kit. The Expo starter has its own package and generated token copies. Native motion and styles adapt portable values; do not promise identical CSS effects on devices.

Use docs/flexible-designs.md for container embedding, layout dimensions and optional effects. Prefer the playground's Copy agent prompt action to preserve all design selections. Buttons default to type="button"; declare type="submit" explicitly in application forms. Validate responsive behavior using the actual parent container, not only the browser viewport.

Search IDs/tags first, inspect the nearest family, and follow docs/extension-guide.md. Add a reusable variant only if existing sections cannot represent the needed behavior. Keep payment/auth/data logic in application adapters. Update source manifests, regenerate, validate and test.
