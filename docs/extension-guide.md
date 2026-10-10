# Extending the registry

## Add a section

1. Search registry/index.json or use pnpm registry:list for an existing variant.
2. Implement a clearly scoped React component in the appropriate components directory. Accept semantic content, className, and a typed variant where variants share responsibilities.
3. Add registry/sections/<group>-<variant>.json with version, source path, export, dependencies and references.
4. Add the explicit ID mapping to lib/section-map.tsx.
5. Reference the section from a template, using a unique key.
6. Run registry:sync-dependencies, registry:generate, registry:validate, tests, lint, typecheck and build.
7. Inspect desktop, tablet, mobile, dark mode and reduced-motion output.

Do not put arbitrary JavaScript in JSON. Do not add silent fallback implementations for unknown IDs.

## Add a template

Author a new JSON manifest under registry/templates. Give it a meaningful hierarchy, representative content and a distinct composition. Declare all four defaults and compatibility arrays. A dashboard starts with one shell and contains domain views. A website starts with navigation/hero and ends with appropriate contact/footer sections.

Templates must reference real components and have purposeful interactions. A title/color substitution is not a new archetype.

## Add a theme

Copy only the token structure, not a component tree. Supply every light/dark token, sensible gradients, and tested foreground/background pairs. Theme validation requires valid six-digit hex colors. Use contrastRatio from lib/theme.ts to assess combinations.

## Add a style

Specify all typography, density, border, radius, surface, shadow, decoration and control treatments. Extend shared token/data-attribute CSS if a new treatment requires it. Demonstrate differences using the same sample interface.

## Add motion

Define duration, easing, distance, scale, stagger, spring/hover parameters and reveal pattern. Set reducedMotion to disable. Use motionSettings and existing primitives. Do not duplicate per-template animation logic or introduce scroll hijacking.

## Versions

Keep stable IDs. Increment item versions when behavior changes. Add optional metadata without breaking older entries. Breaking schema changes require an explicit schema version and documented migration.
