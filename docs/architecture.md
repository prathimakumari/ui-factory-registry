# Architecture

The system separates structure from appearance and application behavior.

1. JSON source manifests declare IDs, content, defaults, compatibility, dependencies and sources.
2. scripts/generate-registry.ts validates manifests and generates explicit static imports, the compact index and a shadcn registry.
3. lib/registry.ts parses entries and resolves a DesignInput into a complete design.
4. lib/section-map.tsx explicitly maps each registered section ID to a React implementation.
5. lib/template-renderer.tsx applies CSS variables, the theme portal context and motion profile, then renders the composition.

No eval, executable JSON or runtime filesystem discovery is used. Build-time filesystem scanning is confined to Node scripts. Registry code has no dependency on authentication, database, analytics or payment services.

## Four dimensions

Templates own section order and content slots. Styles own typography, density, width, border/radius, surfaces and treatment. Themes own semantic color values and gradients. Motion profiles own transition parameters. Switching a theme does not duplicate the component tree.

All current styles/themes/motions work with every template. The compatibility arrays are explicit and validated; future restrictions must reflect actual implementation requirements. A section override must belong to the requested family and that family must exist in the chosen template. Dashboards therefore reject hero or footer overrides.

Content overrides use original section keys, preserving content identity when the implementation ID changes. New content cannot introduce executable markup. Application callbacks belong in directly imported sections or application wrappers, never JSON.

## Client/server boundary

App Router route files and metadata are server components. Interactive controls, Radix primitives and Motion boundaries are client components. The full renderer is reusable in client React applications, so a playground import intentionally brings the registered section map into its client graph. Individual section imports offer a smaller integration. Heavy optional application features should be split into separate components as the registry grows.

## Responsive previews

Iframes create a true viewport for media queries. Changing a preset sends a validated same-origin message to the frame. Messages require matching origin and parent source; invalid messages leave the previous preview intact. Full preview URLs accept validated query selections. Template changes reset unsupported overrides.

## Local state

Demo interactions are in-memory and reset on reload. The playground alone stores preferences in localStorage and can explicitly restore them. No renderer or production consumer is forced into persistence. Portal content receives the same token variables as the originating template.

## Source ownership

Edit the individual JSON manifests, not registry/catalog.ts, registry/index.json, registry.json or public/r. Regenerate after source changes. Source graph analysis resolves local imports recursively for validation, copy exports and shadcn items.
