# Registry schema

Internal manifests use schemaVersion: 1 and independent semantic item versions such as 1.0.0. IDs are lowercase kebab-case, stable, and globally unique.

All items include id, kind, name, description, version, tags, files and dependencies. Optional extension fields belong under metadata to preserve older readers.

Templates additionally declare category, defaultStyleId/defaultThemeId/defaultMotionId/defaultMode, compatibleStyles/supportedThemes/supportedMotion, component IDs, section uses, responsive and accessible support. Each section use has an implementation id, a unique stable key and typed content.

Section manifests declare group, variant, exportName and component references. The mapping in lib/section-map.tsx is authoritative for rendering. Component manifests identify their export and source. Styles, themes and motions have dedicated schemas with concrete validated parameters.

DesignInput accepts template, optional style/theme/motion/mode, section-family overrides, a card treatment, content keyed by the original section key, and optional layout overrides: contentWidth (320–1920), density (0.6–1.6), radius (0–40). resolveDesign supplies defaults, rejects unknown IDs and enforces compatibility.

registry:validate checks duplicates, references, source paths, runtime imports, dependencies, defaults and section implementations. registry:generate rejects malformed source JSON before producing artifacts.

The internal schema is deliberately separate from the official shadcn registry schema. registry.json uses only supported shadcn fields; internal metadata is not injected as invented shadcn fields.

## Mobile extension

`registry/mobile/screens.json` uses `mobileCatalogSchema` with 12 screen descriptions, stable IDs, kind, version, tags, defaultStyle/defaultTheme/defaultMotion and shared source locations. `MobileConfig` contains screen/style/theme/motion/mode. `resolveMobileDesign` validates those IDs against the mobile catalog and existing tokens. It is separate from `DesignInput` and the website template exporter.

The generated compact catalog exposes `mobileScreens`, including platform and source metadata. `pnpm registry:list --kind mobile-screen` discovers them. `pnpm mobile:generate` copies shared screen data, behavior and token catalogs to the independent native starter. See [mobile designs](mobile-designs.md) for reuse and platform differences.
