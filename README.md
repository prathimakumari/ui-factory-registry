# UI Factory Registry

A local-first React design registry and working Next.js application. Select stable IDs, reuse existing source, supply your content, and connect your own application behavior.

**New here? Read [How to run and use the registry](HOW-TO-USE.md).**

Read [implemented design principles and external skill workflow](docs/design-principles-and-skills.md) for architecture, component coverage and Sonner status. Follow [the GitHub publishing steps](docs/push-to-github.md) when you are ready to upload this repository.

**Mobile apps:** 12 connected screen designs are available at `/mobile`, with a separate React Native/Expo starter in `mobile/`. See [mobile run and reuse instructions](docs/mobile-designs.md).

**50 templates · 20 style profiles · 24 light/dark themes · 16 motion profiles · 35 UI components · 125 registered section variants**

## Run locally

Requirements: Node.js 22.12+ (verified on Node 24.21), pnpm 12.10.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000. No API keys, account, database, hosted image service, or backend is required. Sample photography is stored in public/images.

## Explore

| Route                 | Purpose                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| / and /registry       | Search/filter templates, real preview thumbnails, saved selections, grid/list views             |
| /playground           | Combine dimensions, swap compatible section families, inspect/copy code, download configuration |
| /preview/[templateId] | Full template with local sample interactions                                                    |
| /components           | Every primitive and section variant, with working controls                                      |
| /styles               | Compare typography, density, borders, radii and surfaces                                        |
| /themes               | Compare all palettes on the same light/dark interface                                           |
| /motion               | Replay motion, inspect settings, try progress and reorder interactions                          |
| /docs                 | Quick start and integration reference                                                           |

The playground uses same-origin iframe previews at 1280, 768 and 390 CSS pixels. Preferences are saved only by the playground; the reusable renderer never assumes persistence.

Custom preview dimensions, validated layout overrides, container-responsive embedding, live component tuning, optional border/orb/metallic effects, and copyable agent prompts are described in [Flexible designs](docs/flexible-designs.md).

## Use a template

```tsx
import { TemplateRenderer } from "@/lib/template-renderer";
import "@/styles/globals.css";

export default function Page() {
  return (
    <TemplateRenderer
      config={{
        template: "saas-landing-01",
        style: "modern-minimal",
        theme: "ocean-blue",
        motion: "premium-smooth",
        mode: "light",
        overrides: {
          navbar: "navbar-floating",
          hero: "hero-split",
          features: "features-bento",
          footer: "footer-mega",
        },
      }}
    />
  );
}
```

The source project must be available at your @/* alias. To use it in another project, export a local copy first, or install built shadcn registry items. Do not import source from a URL.

```sh
pnpm registry:export --template saas-landing-01 --copy
```

The export contains a ready-to-use page, JSON configuration, source dependency closure, local assets, dependencies.json, and INTEGRATION.md. Copy those directories into a compatible React/Next project, install the listed runtime packages and Tailwind v4, and preserve the @/* alias. The full renderer includes all registered implementations; import individual sections for a smaller integration.

## Commands

```sh
pnpm dev
pnpm typecheck
pnpm lint
pnpm registry:list --kind template
pnpm registry:list --search pricing
pnpm registry:list --json
pnpm registry:generate
pnpm registry:sync-dependencies
pnpm registry:validate
pnpm registry:test
pnpm registry:export --template saas-landing-01
pnpm registry:export --template saas-landing-01 --style modern-minimal --theme ocean-blue --motion premium-smooth
pnpm registry:export --template admin-dashboard --copy
pnpm registry:build
pnpm build
pnpm start
pnpm exec playwright install chromium
pnpm test:e2e
```

The list, validate and export commands provide --help. Invalid IDs, incompatible overrides, missing sources and missing dependencies produce actionable errors and nonzero exit codes. After changing source imports, run registry:sync-dependencies to refresh manifest dependency lists, then registry:generate and registry:validate.

## Repository map

- app/: App Router pages and error/loading states
- components/ui/: semantic, accessible primitives; official shadcn Button adapted to shared tokens
- components/sections/: website layouts and domain interactions
- components/navigation/: eight navbar compositions
- components/dashboards/: eight shells, data tables/charts and domain workspaces
- components/motion/: reusable Motion primitives and reduced-motion handling
- components/registry/ and components/factory/: browser, explorers and playground
- registry/{templates,styles,themes,motion,components,sections}/: versioned source manifests
- registry/schema.ts: Zod schemas and inferred TypeScript contracts
- registry/catalog.ts and registry/index.json: generated imports and compact agent catalog
- lib/: lookup, rendering, tokens, source-independent configuration export
- styles/: semantic Tailwind v4 tokens and registry application chrome
- scripts/: generation, validation, listing, export and dependency analysis
- tests/ and e2e/: unit, registry, rendering and browser coverage
- docs/ and agent-prompts/: architecture, extension and agent integration

## Agent entry point

Read AGENTS.md, docs/agent-usage.md, then registry/index.json. Select IDs; open only their manifests and required sources. Reuse components and motion before adding new implementations. Validate, test, lint, typecheck and build. Report reused IDs/files and any limitations.

## Scope and representative data

All businesses, people, metrics, testimonials and products are fictional demo content. Forms, cart, bookings, task movement, settings, invites and donations demonstrate local UI state. They do not send email, charge cards, grant access, reserve inventory, or claim live fleet tracking. The music preview offers track details; applications supply licensed audio. See docs/implementation-status.md for verification and remaining limitations.

## Documentation

Start with docs/architecture.md, docs/agent-usage.md, docs/registry-integration.md and docs/extension-guide.md. Catalogs and example configurations are under docs/ and examples/. Setup sources and compatibility decisions are recorded in docs/dependency-verification.md. Sample image provenance is in docs/asset-credits.md.
