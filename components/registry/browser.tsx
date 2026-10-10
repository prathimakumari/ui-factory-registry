"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  LayoutGrid,
  List,
  Bookmark,
  Check,
  Layers,
  Command,
  X,
} from "lucide-react";
import { templates, styles, themes, motions } from "@/lib/registry";
import { Button, Badge, EmptyState, Pagination } from "@/components/ui/primitives";
import { RegistryShell } from "./shell";
const categories = [
  ["all", "All templates"],
  ["marketing", "Marketing"],
  ["dashboard", "Dashboards"],
  ["content-commerce", "Content & commerce"],
  ["industry", "Industry"],
  ["specialized", "Specialized"],
] as const;
export function RegistryBrowser() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState("curated");
  const matches = templates.filter(
    (t) =>
      (category === "all" || t.category === category) &&
      (!onlySaved || saved.includes(t.id)) &&
      (mode === "all" || t.defaultMode === mode) &&
      (t.name + " " + t.description + " " + t.tags.join(" "))
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  if (sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
  const pages = Math.max(1, Math.ceil(matches.length / 9));
  const current = Math.min(page, pages);
  return (
    <RegistryShell title="Templates">
      <div className="page-intro">
        <div>
          <div className="intro-eyebrow">
            <span />
            THE REUSABLE DESIGN LIBRARY
          </div>
          <h1>A good place to start.</h1>
          <p>Thoughtful foundations for whatever you’re building next.</p>
        </div>
        <Button asChild>
          <Link href="/playground">
            <SlidersHorizontal size={16} />
            Open playground
          </Link>
        </Button>
      </div>
      <section className="registry-feature">
        <div>
          <Badge>ONE REGISTRY. ENDLESS POSSIBILITIES.</Badge>
          <h2>
            Less starting from scratch.
            <br />
            More making it yours.
          </h2>
          <p>
            Combine a layout, a visual style, a color palette,
            <br className="desktop-break" /> and a little motion. Then build on solid ground.
          </p>
          <Link href="/playground">
            Find your combination <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="feature-composition" aria-hidden="true">
          <div className="composition-card back">
            <span />
            <span />
            <span />
          </div>
          <div className="composition-card middle">
            <div className="composition-nav" />
            <div className="composition-heading" />
            <div className="composition-lines" />
            <div className="composition-grid">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="composition-card front">
            <span className="composition-symbol">
              <Layers size={27} />
            </span>
            <strong>
              Made to
              <br />
              fit together.
            </strong>
            <div>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="composition-chip">
            <Check size={13} />
            Your design, connected.
          </div>
        </div>
      </section>
      <div className="registry-stats">
        <div>
          <strong>{templates.length}</strong>
          <span>Page templates</span>
        </div>
        <div>
          <strong>{styles.length}</strong>
          <span>Visual styles</span>
        </div>
        <div>
          <strong>{themes.length}</strong>
          <span>Color themes</span>
        </div>
        <div>
          <strong>{motions.length}</strong>
          <span>Motion presets</span>
        </div>
        <Link href="/docs">
          <Command size={17} />
          Ready for your next agent
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <section className="catalog-section" aria-label="Template catalog">
        <div className="catalog-heading">
          <div>
            <h2>
              Explore the collection <span>{matches.length}</span>
            </h2>
            <p>A starting point for every kind of project.</p>
          </div>
          <button
            className={onlySaved ? "saved-filter selected" : "saved-filter"}
            onClick={() => {
              setOnlySaved(!onlySaved);
              setPage(1);
            }}
          >
            <Bookmark size={16} fill={onlySaved ? "currentColor" : "none"} />
            Saved {saved.length > 0 && "(" + saved.length + ")"}
          </button>
        </div>
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <Search size={18} />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search templates, categories, or ideas…"
              aria-label="Search templates"
            />
            {q && (
              <button aria-label="Clear search" onClick={() => setQ("")}>
                <X size={15} />
              </button>
            )}
          </label>
          <button
            className={"filter-button" + (filterOpen ? " selected" : "")}
            onClick={() => setFilterOpen(!filterOpen)}
            aria-expanded={filterOpen}
          >
            <SlidersHorizontal size={16} />
            Filters{mode !== "all" && <span>1</span>}
          </button>
          <div className="view-toggle">
            <button
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={19} />
            </button>
          </div>
        </div>
        {filterOpen && (
          <div className="advanced-filters">
            <label>
              Default mode
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All modes</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Order
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="curated">Curated order</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
            <button
              onClick={() => {
                setMode("all");
                setSort("curated");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
        <div className="category-tabs" role="group" aria-label="Template categories">
          {categories.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={category === id}
              onClick={() => {
                setCategory(id);
                setPage(1);
              }}
            >
              {label}
              {id === "all" && <span>50</span>}
            </button>
          ))}
        </div>
        <div className={"template-catalog catalog-" + view}>
          {matches.slice((current - 1) * 9, current * 9).map((t, i) => (
            <article className="template-card" key={t.id}>
              <div className={"template-thumbnail thumb-" + t.category}>
                <iframe
                  title={t.name + " preview"}
                  src={"/preview/" + t.id + "?motion=no-motion"}
                  loading={i < 3 ? "eager" : "lazy"}
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <Link
                  className="thumbnail-link"
                  href={"/playground?template=" + t.id}
                  aria-label={"Customize " + t.name}
                >
                  <span>
                    Open in playground
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
                <button
                  className="save-template"
                  aria-label={(saved.includes(t.id) ? "Unsave " : "Save ") + t.name}
                  aria-pressed={saved.includes(t.id)}
                  onClick={() =>
                    setSaved(
                      saved.includes(t.id) ? saved.filter((s) => s !== t.id) : [...saved, t.id],
                    )
                  }
                >
                  <Bookmark size={16} fill={saved.includes(t.id) ? "currentColor" : "none"} />
                </button>
                {i === 0 && current === 1 && category === "all" && (
                  <span className="featured-tag">POPULAR</span>
                )}
              </div>
              <div className="template-card-body">
                <div>
                  <span className="template-category">
                    {categories.find(([id]) => id === t.category)?.[1]}
                  </span>
                  <h3>
                    <Link href={"/playground?template=" + t.id}>
                      {t.name.replace("01", " / 01").replace("02", " / 02")}
                    </Link>
                  </h3>
                  <p>{t.description}</p>
                </div>
                <div className="template-card-bottom">
                  <code>{t.id}</code>
                  <div className="theme-dots" aria-label="Supports all 24 themes">
                    {[t.defaultThemeId, "slate-neutral", "warm-sand"].map((id) => (
                      <span
                        key={id}
                        style={{ background: themes.find((t) => t.id === id)?.light.primary }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!matches.length && (
          <EmptyState
            title="No templates match just yet."
            description="Try a broader search or clear your filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQ("");
                  setCategory("all");
                  setOnlySaved(false);
                  setMode("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
        <div className="catalog-footer">
          <span>
            Showing {matches.length ? (current - 1) * 9 + 1 : 0}–
            {Math.min(current * 9, matches.length)} of {matches.length} templates
          </span>
          <Pagination
            page={current}
            pages={pages}
            onChange={(p) => {
              setPage(p);
              document.querySelector(".catalog-section")?.scrollIntoView({ behavior: "instant" });
            }}
          />
        </div>
      </section>
      <section className="agent-banner">
        <div>
          <Command size={24} />
          <div>
            <h3>Give your next agent a head start.</h3>
            <p>Stable IDs, typed manifests, and components ready to reuse.</p>
          </div>
        </div>
        <Link href="/docs">
          Read the integration guide <ArrowUpRight size={16} />
        </Link>
      </section>
    </RegistryShell>
  );
}
