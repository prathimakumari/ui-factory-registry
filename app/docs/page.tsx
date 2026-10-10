import Link from "next/link";
import { RegistryShell } from "@/components/registry/shell";
export default function Page() {
  return (
    <RegistryShell title="Documentation">
      <div className="page-intro">
        <div>
          <span className="intro-eyebrow">BUILD ON WHAT ALREADY WORKS</span>
          <h1>A foundation you can take with you.</h1>
          <p>Choose IDs. Reuse the implementation. Make only what is missing.</p>
        </div>
      </div>
      <div className="docs-layout">
        <nav aria-label="Documentation sections">
          {[
            "Quick start",
            "Architecture",
            "Agent workflow",
            "Export & install",
            "Extend the registry",
            "Accessibility",
          ].map((s, i) => (
            <a key={s} href={"#doc-" + i}>
              {s}
            </a>
          ))}
        </nav>
        <article>
          <section id="doc-0">
            <span className="eyebrow">01 / QUICK START</span>
            <h2>From a selection to a working page.</h2>
            <p>
              Open the playground, choose a template, and adjust its style, theme, and motion.
              Export the validated configuration, then render it with the shared template system.
            </p>
            <pre>
              <code>
                {
                  'import { TemplateRenderer } from "@/lib/template-renderer";\n\nexport default function Page() {\n  return <TemplateRenderer config={{\n    template: "saas-landing-01",\n    style: "modern-minimal",\n    theme: "ocean-blue",\n    motion: "premium-smooth",\n    mode: "light"\n  }} />;\n}'
                }
              </code>
            </pre>
            <Link href="/playground" className="ui-button button-primary">
              Try it in the playground
            </Link>
          </section>
          <section id="doc-1">
            <span className="eyebrow">02 / ARCHITECTURE</span>
            <h2>Four independent decisions.</h2>
            <div className="docs-dimensions">
              {[
                ["Template", "Page structure and section order."],
                ["Style", "Typography, density, surfaces, borders, and shape."],
                ["Theme", "Semantic colors for light and dark appearances."],
                ["Motion", "Timing, easing, reveal patterns, and feedback."],
              ].map(([name, text]) => (
                <div key={name}>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p>
              Source manifests live in registry/templates, registry/styles, registry/themes, and
              registry/motion. The generated registry/index.json is the compact discovery catalog.
              React implementations are mapped explicitly in lib/section-map.tsx.
            </p>
          </section>
          <section id="doc-2">
            <span className="eyebrow">03 / AGENT WORKFLOW</span>
            <h2>Start with an ID, not a blank file.</h2>
            <ol>
              <li>Read AGENTS.md and docs/agent-usage.md.</li>
              <li>Search registry/index.json for the requested IDs.</li>
              <li>Open only the required manifests and source files.</li>
              <li>Reuse existing sections, motion utilities, and semantic tokens.</li>
              <li>Supply project-specific content and application behavior.</li>
              <li>Validate the configuration and run relevant checks.</li>
            </ol>
            <pre>
              <code>
                {
                  "Use the UI Factory Registry.\nTemplate: admin-dashboard\nStyle: corporate-enterprise\nTheme: enterprise-neutral\nMotion: dashboard-fast\n\nReuse the existing code. Do not duplicate registry components.\nRead AGENTS.md and docs/agent-usage.md first."
                }
              </code>
            </pre>
          </section>
          <section id="doc-3">
            <span className="eyebrow">04 / EXPORT & INSTALL</span>
            <h2>Useful before you publish anything.</h2>
            <pre>
              <code>
                {
                  "pnpm registry:list --kind template\npnpm registry:validate\npnpm registry:export --template saas-landing-01 \\\n  --style modern-minimal --theme ocean-blue \\\n  --motion premium-smooth\npnpm registry:export --template admin-dashboard --copy\npnpm registry:build"
                }
              </code>
            </pre>
            <p>
              The default export writes a validated JSON configuration. The copy export includes the
              registry runtime, styles, local sample assets, dependency instructions, and a
              ready-to-use page. Install the declared dependencies and keep the @/* alias pointed at
              your source root.
            </p>
            <p>
              registry.json follows the official shadcn registry format. registry:build produces
              installable item JSON under public/r. Configure your own registry hostname before
              remote publishing; the repository itself remains the source of truth.
            </p>
          </section>
          <section id="doc-4">
            <span className="eyebrow">05 / EXTENSION</span>
            <h2>Add only what is genuinely missing.</h2>
            <p>
              Search the catalog first. To add a section, implement it under components, add a
              manifest under registry/sections, and register its component in lib/section-map.tsx.
              Reference its stable ID from a template manifest, then regenerate the catalog.
            </p>
            <p>
              Use optional metadata for additions that do not alter behavior. Breaking schema
              changes require a new schema version and a migration. Keep APIs, authentication,
              payments, and persistence in the consuming application.
            </p>
          </section>
          <section id="doc-5">
            <span className="eyebrow">06 / ACCESSIBILITY & VALIDATION</span>
            <h2>Care for the details.</h2>
            <p>
              Use semantic HTML, visible focus, accessible labels, and keyboard-operable controls.
              Motion respects the operating system’s reduced-motion setting; no-motion disables
              decorative transitions. Preview forms use local sample state and clearly identify
              actions that do not contact a backend.
            </p>
            <pre>
              <code>
                {"pnpm typecheck\npnpm lint\npnpm registry:test\npnpm build\npnpm test:e2e"}
              </code>
            </pre>
            <p>
              For full implementation details, extension guides, source references, and the latest
              verification results, read the Markdown documents in the repository’s docs directory.
            </p>
          </section>
        </article>
      </div>
    </RegistryShell>
  );
}
