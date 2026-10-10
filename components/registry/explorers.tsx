"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, Check, RotateCcw, Play } from "lucide-react";
import { themes, styles, motions, sections, components, lookup } from "@/lib/registry";
import { themeVariables, styleVariables } from "@/lib/theme";
import { sectionMap } from "@/lib/section-map";
import { RegistryShell } from "./shell";
import * as UI from "@/components/ui/primitives";
import { ThemeScope } from "@/components/ui/theme-scope";
import { EffectDemo } from "./effect-demo";
import {
  MotionProvider,
  Reveal,
  MotionCard,
  AnimatedCounter,
  MotionProgress,
  Presence,
  ReorderList,
} from "@/components/motion/primitives";
import { Chart, DataTable } from "@/components/dashboards/data";
import type { SectionContent } from "@/registry/schema";
const sample: SectionContent = {
  eyebrow: "A thoughtful foundation",
  title: "A little clarity goes a long way.",
  description: "Useful tools, considered details, and a clear path to your next idea.",
  action: "Explore the details",
  href: "#explorer",
  items: [
    {
      title: "Clarity from the start",
      description: "Everything you need, thoughtfully organized.",
    },
    { title: "Room for your ideas", description: "Flexible foundations that grow with you." },
    { title: "Details that matter", description: "Accessible, responsive, and ready to use." },
  ],
};
function SampleInterface() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="explorer-interface">
      <div className="spread">
        <UI.Badge>Workspace</UI.Badge>
        <UI.Avatar name="Alex Morgan" />
      </div>
      <span className="eyebrow">A FRESH PERSPECTIVE</span>
      <h3>
        Make space for
        <br />
        your best work.
      </h3>
      <p>A thoughtful foundation for your next idea.</p>
      <div className="sample-interface-metrics">
        <div>
          <strong>2,420</strong>
          <span>Active members</span>
        </div>
        <div>
          <strong>+18.6%</strong>
          <span>This month</span>
        </div>
      </div>
      <UI.Button onClick={() => setSaved(true)}>{saved ? "Saved" : "Save project"}</UI.Button>
      <UI.Button variant="outline" onClick={() => setSaved(false)}>
        Reset
      </UI.Button>
      <span role="status" className="sr-only">
        {saved ? "Project saved in this preview." : "Ready to preview."}
      </span>
      <UI.Progress value={68} label="Project progress" />
    </div>
  );
}
export function ThemeExplorer() {
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");
  return (
    <RegistryShell title="Color themes">
      <div className="page-intro">
        <div>
          <span className="intro-eyebrow">24 CURATED PALETTES</span>
          <h1>Set the right tone.</h1>
          <p>One interface. Twenty-four ways to make it feel like yours.</p>
        </div>
        <UI.Switch label="Dark appearance" checked={dark} onCheckedChange={setDark} />
      </div>
      <UI.Input
        aria-label="Search themes"
        placeholder="Find a color theme…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="explorer-search"
      />
      <div className="explorer-grid">
        {themes
          .filter((t) => (t.name + " " + t.id).toLowerCase().includes(q.toLowerCase()))
          .map((t) => (
            <article key={t.id} className="explorer-entry">
              <div style={themeVariables(t, dark ? "dark" : "light")} className="explorer-sample">
                <SampleInterface />
              </div>
              <div className="explorer-entry-caption">
                <div>
                  <h2>{t.name}</h2>
                  <code>{t.id}</code>
                </div>
                <Link href={"/playground?template=saas-landing-01&theme=" + t.id}>Use theme</Link>
              </div>
              <details>
                <summary>Inspect semantic tokens</summary>
                <pre>{JSON.stringify(t[dark ? "dark" : "light"], null, 2)}</pre>
              </details>
            </article>
          ))}
      </div>
    </RegistryShell>
  );
}
export function StyleExplorer() {
  const [theme, setTheme] = useState("ocean-blue");
  return (
    <RegistryShell title="Visual styles">
      <div className="page-intro">
        <div>
          <span className="intro-eyebrow">20 DESIGN LANGUAGES</span>
          <h1>More than a coat of paint.</h1>
          <p>Typography, spacing, surfaces, and details that change the whole character.</p>
        </div>
        <UI.Select
          label="Comparison palette"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          options={themes.map((t) => ({ value: t.id, label: t.name }))}
        />
      </div>
      <div className="explorer-grid">
        {styles.map((s) => (
          <article className="explorer-entry" key={s.id}>
            <div
              className="factory-preview explorer-sample"
              style={{ ...themeVariables(lookup(theme, "theme"), "light"), ...styleVariables(s) }}
              data-style={s.id}
              data-surface={s.surface}
              data-button={s.button}
              data-input={s.input}
              data-background={s.background}
            >
              <SampleInterface />
            </div>
            <div className="explorer-entry-caption">
              <div>
                <h2>{s.name}</h2>
                <code>{s.id}</code>
              </div>
              <Link href={"/playground?style=" + s.id}>Use style</Link>
            </div>
            <details>
              <summary>Inspect design parameters</summary>
              <pre>{JSON.stringify(s, null, 2)}</pre>
            </details>
          </article>
        ))}
      </div>
    </RegistryShell>
  );
}
function MotionExample() {
  const [show, setShow] = useState(true);
  const [value, setValue] = useState(68);
  const [items, setItems] = useState([
    "Plan the work",
    "Make a little progress",
    "Share what you learned",
  ]);
  return (
    <div className="motion-example">
      <div className="motion-example-cards">
        {[0, 1, 2].map((i) => (
          <Reveal key={i} index={i}>
            <MotionCard>
              <UI.Card>
                <span className="eyebrow">0{i + 1}</span>
                <strong>{["Think", "Make", "Share"][i]}</strong>
              </UI.Card>
            </MotionCard>
          </Reveal>
        ))}
      </div>
      <div className="filter-chips">
        <UI.Button size="sm" variant="outline" onClick={() => setShow(!show)}>
          Toggle notification
        </UI.Button>
        <UI.Button size="sm" variant="outline" onClick={() => setValue(value === 68 ? 100 : 68)}>
          Update progress
        </UI.Button>
      </div>
      <Presence show={show}>
        <UI.Alert title="A little progress, every day." variant="success" />
      </Presence>
      <MotionProgress value={value} />
      <p>
        Members: <AnimatedCounter value={2420} label="Active members" />
      </p>
      <details>
        <summary>Try keyboard and drag reordering</summary>
        <ReorderList items={items} onChange={setItems} />
      </details>
    </div>
  );
}
export function MotionExplorer() {
  const [selected, setSelected] = useState("premium-smooth");
  const [replay, setReplay] = useState(0);
  const profile = lookup(selected, "motion");
  return (
    <RegistryShell title="Motion library">
      <div className="page-intro">
        <div>
          <span className="intro-eyebrow">16 MOTION PROFILES</span>
          <h1>A little movement. A lot of character.</h1>
          <p>Purposeful transitions that respect reduced-motion preferences.</p>
        </div>
        <UI.Button onClick={() => setReplay(replay + 1)}>
          <RotateCcw size={16} />
          Replay motion
        </UI.Button>
      </div>
      <div className="motion-explorer-layout">
        <div className="motion-preset-list">
          {motions.map((m) => (
            <button
              key={m.id}
              aria-pressed={selected === m.id}
              onClick={() => {
                setSelected(m.id);
                setReplay(replay + 1);
              }}
            >
              <Play size={14} />
              <span>{m.name}</span>
              <small>{m.duration}s</small>
            </button>
          ))}
        </div>
        <div>
          <div className="motion-demo-stage">
            <span className="eyebrow">{profile.name}</span>
            <h2>Movement with a purpose.</h2>
            <MotionProvider profile={profile} key={selected + replay}>
              <MotionExample />
            </MotionProvider>
          </div>
          <div className="code-inspector">
            <h3>Preset configuration</h3>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      </div>
    </RegistryShell>
  );
}
function CoreDemo({ id }: { id: string }) {
  const [value, setValue] = useState(false);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(false);
  switch (id) {
    case "border-glow":
    case "status-orb":
    case "metallic-button":
      return <EffectDemo key={id} kind={id} />;
    case "button":
      return (
        <div className="filter-chips">
          {(["default", "secondary", "outline", "ghost", "destructive"] as const).map((variant) => (
            <UI.Button key={variant} variant={variant} onClick={() => setValue(!value)}>
              {variant}
            </UI.Button>
          ))}
          <span role="status">{value ? "Clicked" : "Ready"}</span>
        </div>
      );
    case "link":
      return <UI.Link href="/playground">Open the playground</UI.Link>;
    case "input":
      return <UI.Input aria-label="Example input" placeholder="A little room for your ideas" />;
    case "textarea":
      return (
        <UI.Textarea
          aria-label="Example message"
          placeholder="Tell us what you have in mind"
          rows={4}
        />
      );
    case "label":
      return (
        <div>
          <UI.Label htmlFor="label-demo">Project name</UI.Label>
          <UI.Input id="label-demo" placeholder="My next project" />
        </div>
      );
    case "select":
      return (
        <UI.Select
          label="Workspace"
          options={["Design", "Engineering", "Operations"].map((x) => ({ value: x, label: x }))}
        />
      );
    case "checkbox":
      return (
        <UI.Checkbox
          label="Keep me updated"
          checked={value}
          onChange={(e) => setValue(e.target.checked)}
        />
      );
    case "radio":
      return (
        <div>
          <UI.Radio name="radio-demo" label="Monthly" defaultChecked />
          <UI.Radio name="radio-demo" label="Annually" />
        </div>
      );
    case "switch":
      return <UI.Switch label="Enable notifications" checked={value} onCheckedChange={setValue} />;
    case "badge":
      return (
        <div className="filter-chips">
          <UI.Badge>In progress</UI.Badge>
          <UI.Badge>New release</UI.Badge>
        </div>
      );
    case "avatar":
      return (
        <div className="filter-chips">
          {["Alex Morgan", "Jordan Lee", "Sam Rivera"].map((name) => (
            <UI.Avatar name={name} key={name} />
          ))}
        </div>
      );
    case "card":
      return (
        <UI.Card>
          <h3>A thoughtful foundation</h3>
          <p>Space for the work that matters.</p>
          <UI.Button onClick={() => setValue(!value)}>
            {value ? "Saved" : "Save this card"}
          </UI.Button>
        </UI.Card>
      );
    case "separator":
      return (
        <>
          <p>First section</p>
          <UI.Separator />
          <p>Second section</p>
        </>
      );
    case "tooltip":
      return (
        <UI.Tooltip label="Keyboard and pointer accessible">
          <UI.Button variant="outline">Hover or focus me</UI.Button>
        </UI.Tooltip>
      );
    case "popover":
      return (
        <UI.Popover trigger={<UI.Button variant="outline">Open preferences</UI.Button>}>
          <h3>Display preferences</h3>
          <UI.Switch label="Compact view" checked={value} onCheckedChange={setValue} />
        </UI.Popover>
      );
    case "dialog":
    case "drawer": {
      const D = id === "dialog" ? UI.Dialog : UI.Drawer;
      return (
        <D
          title="A little more detail"
          description="Accessible focus management, escape dismissal, and screen-reader labels."
          trigger={<UI.Button>Open {id}</UI.Button>}
        >
          <UI.Input aria-label="Project name" placeholder="Name your project" />
          <p>Your work belongs here.</p>
        </D>
      );
    }
    case "accordion":
      return (
        <UI.Accordion
          items={sample.items.map((i) => ({ title: i.title, content: i.description }))}
        />
      );
    case "tabs":
      return (
        <UI.Tabs
          items={[
            { id: "overview", label: "Overview", content: <p>Your workspace at a glance.</p> },
            {
              id: "activity",
              label: "Activity",
              content: <p>Jordan updated the project 12 minutes ago.</p>,
            },
          ]}
        />
      );
    case "breadcrumbs":
      return (
        <UI.Breadcrumbs
          items={[
            { label: "Registry", href: "/registry" },
            { label: "Components", href: "/components" },
            { label: "Breadcrumbs" },
          ]}
        />
      );
    case "pagination":
      return <UI.Pagination page={page} pages={5} onChange={setPage} />;
    case "skeleton":
      return (
        <div aria-label="Loading card preview">
          <UI.Skeleton className="demo-skeleton" />
          <UI.Skeleton />
          <UI.Skeleton />
        </div>
      );
    case "progress":
      return (
        <>
          <UI.Progress label="Project progress" value={value ? 100 : 68} />
          <UI.Button onClick={() => setValue(!value)}>Update progress</UI.Button>
        </>
      );
    case "alert":
      return (
        <UI.Alert title="Your changes are saved" variant="success">
          Everything is up to date.
        </UI.Alert>
      );
    case "toast":
      return (
        <>
          <UI.Button onClick={() => setToast(true)}>Show notification</UI.Button>
          {toast && (
            <UI.Toast message="Your changes are saved." onDismiss={() => setToast(false)} />
          )}
        </>
      );
    case "dropdown-menu":
      return (
        <>
          <UI.DropdownMenu
            label="Project actions"
            items={[
              { label: "Save project", onSelect: () => setValue(true) },
              { label: "Clear selection", onSelect: () => setValue(false) },
            ]}
          />
          <p role="status">{value ? "Project saved" : "Choose an action"}</p>
        </>
      );
    case "command-menu":
      return (
        <UI.CommandMenu
          items={[
            { label: "Open playground", href: "/playground" },
            { label: "Read documentation", href: "/docs" },
          ]}
        />
      );
    case "form-field":
      return (
        <UI.FormField
          label="Email"
          error={value ? "Please enter a valid email address." : undefined}
        >
          <UI.Input type="email" onBlur={(e) => setValue(!e.target.validity.valid)} />
        </UI.FormField>
      );
    case "loading":
      return <UI.Loading label="Preparing your workspace…" />;
    case "empty-state":
      return <UI.EmptyState />;
    case "chart":
      return <Chart title="Monthly activity" />;
    case "data-table":
      return (
        <DataTable
          title="Team directory"
          rows={[
            { name: "Alex Morgan", role: "Designer", status: "Active" },
            { name: "Jordan Lee", role: "Engineer", status: "Invited" },
          ]}
          columns={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
          ]}
        />
      );
    default:
      throw new Error("Unimplemented component demo: " + id);
  }
}
export function ComponentExplorer() {
  const [group, setGroup] = useState("ui");
  const [id, setId] = useState("ui-button");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [styleId, setStyleId] = useState("modern-minimal");
  const [themeId, setThemeId] = useState("ocean-blue");
  const [motionId, setMotionId] = useState("subtle");
  const [dark, setDark] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(960);
  const visualStyle = lookup(styleId, "style");
  const variables = {
    ...themeVariables(lookup(themeId, "theme"), dark ? "dark" : "light"),
    ...styleVariables(visualStyle),
  };
  const options = group === "ui" ? components : sections.filter((s) => s.group === group);
  const selected = options.find((s) => s.id === id) || options[0];
  const Component = group !== "ui" ? sectionMap[selected.id] : null;
  const snippet =
    "import { " +
    selected.exportName +
    ' } from "@/' +
    selected.files[0].replace(/\.tsx?$/, "") +
    '";';
  return (
    <RegistryShell title="Components">
      <div className="page-intro">
        <div>
          <span className="intro-eyebrow">SHARED BUILDING BLOCKS</span>
          <h1>Good details, ready to go.</h1>
          <p>Explore primitives and section compositions in a working preview.</p>
        </div>
        <UI.Badge>
          {components.length} primitives · {sections.length} sections
        </UI.Badge>
      </div>
      <div className="component-explorer-layout">
        <aside>
          <UI.Select
            label="Component family"
            value={group}
            onChange={(e) => {
              setGroup(e.target.value);
              setId("");
            }}
            options={["ui", ...new Set(sections.map((s) => s.group))].map((x) => ({
              value: x,
              label: x[0].toUpperCase() + x.slice(1),
            }))}
          />
          <nav aria-label="Component variants" className="component-list">
            {options.map((c) => (
              <button key={c.id} aria-pressed={selected.id === c.id} onClick={() => setId(c.id)}>
                {c.name.replace("Ui ", "")}
              </button>
            ))}
          </nav>
        </aside>
        <div>
          <div className="component-demo-header">
            <div>
              <h2>{selected.name.replace("Ui ", "")}</h2>
              <code>{selected.id}</code>
            </div>
            <UI.Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(snippet);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                  setCopyError(
                    "Clipboard unavailable. Select the import snippet below to copy it.",
                  );
                }
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy import"}
            </UI.Button>
          </div>
          <div className="component-tuning">
            <UI.Select
              label="Component style"
              value={styleId}
              onChange={(e) => setStyleId(e.target.value)}
              options={styles.map((s) => ({ value: s.id, label: s.name }))}
            />
            <UI.Select
              label="Component theme"
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              options={themes.map((s) => ({ value: s.id, label: s.name }))}
            />
            <UI.Select
              label="Component motion"
              value={motionId}
              onChange={(e) => setMotionId(e.target.value)}
              options={motions.map((s) => ({ value: s.id, label: s.name }))}
            />
            <UI.Switch label="Component dark mode" checked={dark} onCheckedChange={setDark} />
            <label className="ui-field">
              Component width: {previewWidth}px
              <UI.Input
                type="range"
                min={280}
                max={1280}
                step={10}
                value={previewWidth}
                onChange={(e) => setPreviewWidth(Number(e.target.value))}
              />
            </label>
          </div>
          {copyError && <UI.Alert title={copyError} variant="error" />}
          <ThemeScope variables={variables}>
            <div
              id="explorer"
              className="factory-preview component-demo-stage"
              style={{ ...variables, width: previewWidth, maxWidth: "100%" }}
              data-style={styleId}
              data-theme={themeId}
              data-motion={motionId}
              data-surface={visualStyle.surface}
              data-button={visualStyle.button}
              data-input={visualStyle.input}
              data-background={visualStyle.background}
            >
              <MotionProvider profile={lookup(motionId, "motion")}>
                {Component ? (
                  <Component variant={lookup(selected.id, "section").variant} content={sample} />
                ) : (
                  <CoreDemo key={selected.id} id={selected.id.slice(3)} />
                )}
              </MotionProvider>
            </div>
          </ThemeScope>
          <pre className="import-snippet">{snippet}</pre>
          <p className="component-description">
            {selected.description} Accepts semantic content and follows the registry’s token
            conventions.
          </p>
        </div>
      </div>
    </RegistryShell>
  );
}
