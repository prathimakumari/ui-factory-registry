"use client";
import { useState } from "react";
import { Copy, Check, BookOpen, Terminal } from "lucide-react";
import { Button, Badge, Input, Alert } from "@/components/ui/primitives";
import type { SectionProps } from "./shared";
const guides = [
  {
    id: "quickstart",
    title: "Quickstart",
    description: "Create a working integration in a few small steps.",
    code: 'import { TemplateRenderer } from "@/lib/template-renderer";\n\nexport default function Page() {\n  return <TemplateRenderer config={{\n    template: "saas-landing-01",\n    theme: "ocean-blue"\n  }} />;\n}',
    steps: [
      "Copy or install the registry source into your React project.",
      "Configure the @/* import alias and include styles/globals.css.",
      "Choose a template ID and render it with your own content.",
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    description: "Keep structure and appearance independent.",
    code: 'const design = {\n  template: "admin-dashboard",\n  style: "corporate-enterprise",\n  theme: "enterprise-neutral",\n  motion: "dashboard-fast",\n  mode: "light"\n};',
    steps: [
      "Select IDs from the compact registry catalog.",
      "Omitted dimensions use the template's defaults.",
      "Validate with resolveDesign before saving a configuration.",
    ],
  },
  {
    id: "content",
    title: "Content & sections",
    description: "Bring your own story to a reusable composition.",
    code: 'const config = {\n  template: "saas-landing-01",\n  overrides: { hero: "hero-centered" },\n  content: {\n    "hero-split": {\n      title: "Your product story.",\n      description: "A clear promise to your customers.",\n      items: []\n    }\n  }\n};',
    steps: [
      "Inspect the template manifest for its original section keys.",
      "Use family-compatible implementation IDs for overrides.",
      "Content stays keyed to the original slot when a variant changes.",
    ],
  },
  {
    id: "errors",
    title: "Errors & validation",
    description: "Handle invalid selections with useful feedback.",
    code: 'import { resolveDesign } from "@/lib/registry";\n\ntry {\n  const design = resolveDesign(input);\n  saveConfiguration(design.config);\n} catch (error) {\n  showValidationMessage(error.message);\n}',
    steps: [
      "Unknown IDs produce explicit errors.",
      "Cross-family overrides and absent slots are rejected.",
      "Keep a valid previous configuration when a new selection fails.",
    ],
  },
];
export function DocumentationSection({ content, className = "" }: SectionProps) {
  const [selected, setSelected] = useState("quickstart");
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const guide = guides.find((g) => g.id === selected)!;
  return (
    <section className={"section documentation-section " + className}>
      <aside>
        <span className="eyebrow">{content.eyebrow || "DEVELOPER GUIDES"}</span>
        <Input
          aria-label="Search documentation"
          placeholder="Find a guide…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <nav aria-label="Documentation topics">
          {guides
            .filter((g) => (g.title + " " + g.description).toLowerCase().includes(q.toLowerCase()))
            .map((g) => (
              <button
                key={g.id}
                aria-current={selected === g.id ? "page" : undefined}
                onClick={() => {
                  setSelected(g.id);
                  setCopied(false);
                }}
              >
                <BookOpen size={16} />
                {g.title}
              </button>
            ))}
        </nav>
      </aside>
      <article>
        <Badge>Guide · React</Badge>
        <h2>{guide.title}</h2>
        <p>{guide.description}</p>
        <ol>
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="documentation-code">
          <div>
            <span>
              <Terminal size={16} />
              example.tsx
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(guide.code);
                  setCopied(true);
                  setError("");
                } catch {
                  setError("Clipboard is unavailable. Select the code to copy it.");
                }
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre>
            <code>{guide.code}</code>
          </pre>
        </div>
        {error && <Alert title={error} />}
        <p>
          Need a different starting point? Choose another guide from the documentation navigation.
        </p>
      </article>
    </section>
  );
}
