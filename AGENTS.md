# UI Factory Registry — agent entry point

1. Read this AGENTS.md.
2. Read docs/agent-usage.md.
3. Read registry/index.json (generated compact catalog).
4. Identify requested template, style, theme, motion and component IDs.
5. Open only the needed manifests and source files.
6. Reuse existing components before creating anything.
7. Reuse existing animations before implementing new animations.
8. Reuse design tokens; justify any new color or spacing.
9. Never duplicate a component under another filename because it is unfamiliar.
10. Implement only genuinely missing functionality, following docs/extension-guide.md.
11. Validate the chosen configuration with resolveDesign or registry:export.
12. Run relevant tests, lint, typecheck and production build.
13. Report IDs/files reused, new files and unresolved issues.
    Source manifests live under `registry/*/*.json`. Generated catalogs are not edited by hand.
    Keep layout, style, theme, motion and application behavior separate.
    Use semantic tokens, visible keyboard focus and reduced-motion support.
    Do not claim a catalog count establishes visual quality; inspect changed previews.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
