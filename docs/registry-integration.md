# Local and shadcn integration

## Local workflow (works without publishing)

Run registry:export with --copy. It validates selections, calculates the renderer's static source import closure, copies files and local sample assets, and writes a dependency manifest and page example.

The full renderer references the entire catalog and section mapping; a full copy therefore includes the registry runtime, not only one template's JSON. This is an explicit portability tradeoff. For a small feature, import or install individual section/component items instead.

Install dependencies.json versions in a compatible React project. Set @/* to the copied source root. Include styles/globals.css once and configure Tailwind v4's PostCSS integration. UI behavior is local; integrate your application's persistence/API/payment logic separately.

## shadcn-compatible registry

registry:generate writes registry.json using the official registry schema. registry:build invokes the installed official shadcn CLI and emits public/r/*.json.

```sh
pnpm registry:build
pnpm dev
# In a separate compatible consuming project:
pnpm dlx shadcn@4.21.4 add http://localhost:3000/r/ui-button.json
pnpm dlx shadcn@4.21.4 add http://localhost:3000/r/hero-split.json
pnpm dlx shadcn@4.21.4 add http://localhost:3000/r/saas-landing-01.json
```

Template items reference the ui-factory runtime by an absolute registry URL. Individual items include their transitive local source imports and declared external dependencies. Keep @/* configured in the consumer. Styles are copied as a stylesheet and must be included by the application. Sample photography is not encoded in shadcn JSON: copy public/images or supply your own media.

## Remote publishing

No remote deployment is required or performed. Set REGISTRY_BASE_URL to the actual registry origin before registry:build, so template dependencies resolve to the same hosted registry. Serve public/r from that origin. Use the resulting item URLs with the official CLI. Regenerate after changing the origin.

PowerShell:

```powershell
$env:REGISTRY_BASE_URL = "https://your-registry.example"
pnpm registry:build
```

A shadcn registry is source distribution, not an executable remote code loader in the application. Review incoming source changes as you would any dependency.

Official references:

- https://ui.shadcn.com/docs/registry/registry-json
- https://ui.shadcn.com/docs/registry/registry-item-json
- https://ui.shadcn.com/docs/registry/getting-started
