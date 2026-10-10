"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Download,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Settings2,
} from "lucide-react";
import {
  templates,
  themes,
  styles,
  motions,
  sections,
  resolveDesign,
  lookup,
} from "@/lib/registry";
import { type DesignInput } from "@/registry/schema";
import { Button, Select, Switch, Alert, Tabs, Input } from "@/components/ui/primitives";
import { designAgentPrompt } from "@/lib/agent-prompt";
import { downloadText } from "@/components/dashboards/data";
import { RegistryShell } from "@/components/registry/shell";
export function Playground() {
  const params = useSearchParams();
  const requested = params.get("template");
  const initial = templates.some((t) => t.id === requested) ? requested! : "saas-landing-01";
  const [config, setConfig] = useState<DesignInput>(() => {
    try {
      return resolveDesign({
        template: initial,
        theme: params.get("theme") || undefined,
        style: params.get("style") || undefined,
        motion: params.get("motion") || undefined,
      }).config;
    } catch {
      return { template: initial };
    }
  });
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(900);
  const [promptCopied, setPromptCopied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [inspect, setInspect] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const design = resolveDesign(config);
  const normalized = design.config;
  const snippet =
    'import { TemplateRenderer } from "@/lib/template-renderer";\n\nexport default function Page() {\n  return <TemplateRenderer config={' +
    JSON.stringify(normalized, null, 2) +
    "} />;\n}";
  const apply = (next: DesignInput) => {
    try {
      const valid = resolveDesign(next).config;
      setConfig(valid);
      setError("");
      try {
        localStorage.setItem("ui-factory-playground-v1", JSON.stringify(valid));
      } catch {
        /* Storage is optional for the playground. */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid selection");
    }
  };
  const send = () =>
    frame.current?.contentWindow?.postMessage(
      { type: "ui-factory-config", config: normalized },
      window.location.origin,
    );
  useEffect(() => {
    const target = frame.current?.contentWindow;
    target?.postMessage({ type: "ui-factory-config", config: normalized }, window.location.origin);
    const ready = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.source === target &&
        event.data?.type === "ui-factory-ready"
      )
        target?.postMessage(
          { type: "ui-factory-config", config: normalized },
          window.location.origin,
        );
    };
    window.addEventListener("message", ready);
    return () => window.removeEventListener("message", ready);
  }, [normalized]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Clipboard access is unavailable. Select the code below or download the configuration.",
      );
      setInspect(true);
    }
  };
  const changeTemplate = (id: string) => apply({ template: id });
  return (
    <RegistryShell title="Playground" wide>
      <div className="playground-heading">
        <div>
          <span className="intro-eyebrow">MAKE IT YOURS</span>
          <h1>A few choices. Your own direction.</h1>
          <p>Compose a foundation, explore the details, and take it with you.</p>
        </div>
        <div className="filter-chips">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(designAgentPrompt(normalized));
                setPromptCopied(true);
                setTimeout(() => setPromptCopied(false), 2000);
              } catch {
                setError("Clipboard unavailable. Copy the Agent prompt from the inspector.");
                setInspect(true);
              }
            }}
          >
            {promptCopied ? "Prompt copied" : "Copy agent prompt"}
          </Button>
          <Button variant="outline" onClick={() => setInspect(!inspect)}>
            <Code2 size={16} />
            Inspect code
          </Button>
          <Button
            onClick={() =>
              downloadText(
                normalized.template + ".config.json",
                JSON.stringify(normalized, null, 2) + "\n",
              )
            }
          >
            <Download size={16} />
            Export config
          </Button>
        </div>
      </div>
      {error && (
        <Alert title="Selection needs attention" variant="error">
          {error}
        </Alert>
      )}
      <div className="playground-layout">
        <aside className="playground-controls">
          <div className="controls-title">
            <Settings2 size={17} />
            <strong>Design configuration</strong>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Reset configuration"
              onClick={() => apply({ template: config.template })}
            >
              <RotateCcw size={15} />
            </Button>
          </div>
          <Select
            label="01 / Layout template"
            value={config.template}
            onChange={(e) => changeTemplate(e.target.value)}
            options={templates.map((t) => ({ value: t.id, label: t.name }))}
          />
          <Select
            label="02 / Visual style"
            value={normalized.style}
            onChange={(e) => apply({ ...normalized, style: e.target.value })}
            options={styles.map((t) => ({ value: t.id, label: t.name }))}
          />
          <Select
            label="03 / Color theme"
            value={normalized.theme}
            onChange={(e) => apply({ ...normalized, theme: e.target.value })}
            options={themes.map((t) => ({ value: t.id, label: t.name }))}
          />
          <div className="selected-palette">
            {Object.entries(design.theme[normalized.mode])
              .filter(([k]) =>
                ["primary", "background", "foreground", "accent", "chart-2"].includes(k),
              )
              .map(([key, value]) => (
                <span key={key} title={key + ": " + value} style={{ background: value }} />
              ))}
          </div>
          <Switch
            label="Dark appearance"
            checked={normalized.mode === "dark"}
            onCheckedChange={(dark) => apply({ ...normalized, mode: dark ? "dark" : "light" })}
          />
          <Select
            label="04 / Motion profile"
            value={normalized.motion}
            onChange={(e) => apply({ ...normalized, motion: e.target.value })}
            options={motions.map((t) => ({ value: t.id, label: t.name }))}
          />
          <div className="controls-divider">SECTION VARIANTS</div>
          {["navbar", "hero", "features", "footer"].map((group) => {
            const slot = design.template.sections.find(
              (s) => lookup(s.id, "section").group === group,
            );
            return (
              <Select
                key={group}
                label={
                  group === "features" ? "Feature section" : group[0].toUpperCase() + group.slice(1)
                }
                disabled={!slot}
                value={normalized.overrides[group] || slot?.id || ""}
                onChange={(e) =>
                  apply({
                    ...normalized,
                    overrides: { ...normalized.overrides, [group]: e.target.value },
                  })
                }
                options={
                  slot
                    ? sections
                        .filter((s) => s.group === group)
                        .map((s) => ({ value: s.id, label: s.name }))
                    : [{ value: "", label: "Not in this template" }]
                }
              />
            );
          })}
          <Select
            label="Card treatment"
            value={normalized.card}
            onChange={(e) =>
              apply({ ...normalized, card: e.target.value as typeof normalized.card })
            }
            options={sections
              .filter((s) => s.group === "card")
              .map((s) => ({ value: s.variant, label: s.name.replace("Card ", "") }))}
          />
          <div className="controls-note">
            <strong>Built on shared foundations.</strong>
            <p>
              Every selection changes the actual template. Your exported configuration uses the same
              validated IDs.
            </p>
            <button
              onClick={() => {
                try {
                  const saved = localStorage.getItem("ui-factory-playground-v1");
                  if (saved) apply(JSON.parse(saved));
                  else setError("No saved playground configuration yet.");
                } catch {
                  setError("Saved preferences could not be read.");
                }
              }}
            >
              Restore saved configuration
            </button>
          </div>
          <div className="controls-divider">LAYOUT & DIMENSIONS</div>
          <label className="ui-field">
            Content width: {normalized.layout?.contentWidth ?? design.style.maxWidth}px
            <Input
              type="range"
              min={320}
              max={1920}
              step={20}
              value={normalized.layout?.contentWidth ?? design.style.maxWidth}
              onChange={(e) =>
                apply({
                  ...normalized,
                  layout: { ...normalized.layout, contentWidth: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className="ui-field">
            Spacing density: {normalized.layout?.density ?? design.style.density}
            <Input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={normalized.layout?.density ?? design.style.density}
              onChange={(e) =>
                apply({
                  ...normalized,
                  layout: { ...normalized.layout, density: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className="ui-field">
            Corner radius: {normalized.layout?.radius ?? design.style.radius}px
            <Input
              type="range"
              min={0}
              max={40}
              step={1}
              value={normalized.layout?.radius ?? design.style.radius}
              onChange={(e) =>
                apply({
                  ...normalized,
                  layout: { ...normalized.layout, radius: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className="ui-field">
            Preview width: {width}px
            <Input
              type="range"
              min={280}
              max={1920}
              step={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </label>
          <label className="ui-field">
            Preview height: {height}px
            <Input
              type="range"
              min={320}
              max={1600}
              step={20}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </label>
        </aside>
        <div className="playground-stage">
          <div className="preview-toolbar">
            <div className="viewport-buttons">
              {[
                [1280, "Desktop", Monitor],
                [768, "Tablet", Tablet],
                [390, "Mobile", Smartphone],
              ].map(([size, label, Icon]) => {
                const I = Icon as typeof Monitor;
                return (
                  <button
                    key={String(size)}
                    aria-label={String(label) + " preview"}
                    aria-pressed={width === size}
                    onClick={() => setWidth(Number(size))}
                  >
                    <I size={17} />
                    <span>{String(label)}</span>
                  </button>
                );
              })}
            </div>
            <span>{width}px</span>
            <a
              href={
                "/preview/" +
                config.template +
                "?" +
                new URLSearchParams({
                  style: normalized.style,
                  theme: normalized.theme,
                  motion: normalized.motion,
                  mode: normalized.mode,
                  card: normalized.card,
                  ...(normalized.layout ? { layout: JSON.stringify(normalized.layout) } : {}),
                  ...normalized.overrides,
                })
              }
              target="_blank"
              rel="noreferrer"
              aria-label="Open full preview"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="preview-scroll">
            <iframe
              ref={frame}
              key={config.template}
              title="Live template preview"
              src={"/preview/" + config.template}
              onLoad={send}
              style={{ width, height }}
            />
          </div>
          {inspect && (
            <section className="code-inspector">
              <div className="spread">
                <h2>Ready to reuse.</h2>
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
                  {copied ? "Copied" : "Copy import"}
                </Button>
              </div>
              <Tabs
                items={[
                  {
                    id: "agent",
                    label: "Agent prompt",
                    content: (
                      <pre>
                        <code>{designAgentPrompt(normalized)}</code>
                      </pre>
                    ),
                  },
                  {
                    id: "configuration",
                    label: "Configuration",
                    content: (
                      <pre>
                        <code>{JSON.stringify(normalized, null, 2)}</code>
                      </pre>
                    ),
                  },
                  {
                    id: "import",
                    label: "React import",
                    content: (
                      <pre>
                        <code>{snippet}</code>
                      </pre>
                    ),
                  },
                  {
                    id: "sections",
                    label: "Resolved sections",
                    content: (
                      <ul className="resolved-sections">
                        {design.sections.map((s) => (
                          <li key={s.key}>
                            <code>{s.id}</code>
                            <span>{lookup(s.id, "section").files[0]}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            </section>
          )}
          <div className="preview-caption">
            <span>
              {design.template.id} · {design.style.id}
            </span>
            <Link href="/docs">How to use this in your app</Link>
          </div>
        </div>
      </div>
    </RegistryShell>
  );
}
