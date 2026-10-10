"use client";
import { Search, Terminal, Play, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useFactoryMotion } from "@/components/motion/primitives";
import { Button, Input, Badge, Dialog } from "@/components/ui/primitives";
import { Action, SampleVisual, Signup, type SectionProps } from "./shared";
function Copy({ content }: SectionProps) {
  const s = useFactoryMotion();
  return (
    <motion.div
      initial={s.initial}
      animate={s.visible}
      transition={s.transition}
      className="hero-copy"
    >
      <span className="eyebrow">{content.eyebrow}</span>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      <div className="hero-actions">
        <Action content={content} />
        <a className="text-link" href="#content-contact">
          Let’s talk <ArrowUpRight size={16} />
        </a>
      </div>
    </motion.div>
  );
}
function Photo({ content }: SectionProps) {
  return (
    <div
      className="hero-photo"
      role="img"
      aria-label={content.title}
      style={{ backgroundImage: "url(" + (content.image || "/images/architecture.jpg") + ")" }}
    />
  );
}
function Split(p: SectionProps) {
  return (
    <>
      <Copy {...p} />
      {p.content.image ? <Photo {...p} /> : <SampleVisual />}
    </>
  );
}
function Centered(p: SectionProps) {
  return (
    <>
      <Copy {...p} />
      <div className="hero-proof">
        <Badge>Made for thoughtful teams</Badge>
        <span>Start simply. Build something great.</span>
      </div>
      <SampleVisual />
    </>
  );
}
function Editorial(p: SectionProps) {
  return (
    <>
      <div className="edition-label">INDEPENDENT PERSPECTIVES / 2026</div>
      <Copy {...p} />
      <Photo {...p} />
      <p className="editorial-caption">01 — A new perspective on the everyday</p>
    </>
  );
}
function Statement(p: SectionProps) {
  return (
    <>
      <span className="display-index" aria-hidden="true">
        01/
      </span>
      <Copy {...p} />
      <div className="statement-foot">
        <span>Ideas into action.</span>
        <span>Good things take commitment.</span>
      </div>
    </>
  );
}
function Product(p: SectionProps) {
  return (
    <>
      <Copy {...p} />
      <div className="product-stage">
        <Badge>Thoughtfully designed</Badge>
        {p.content.image ? <Photo {...p} /> : <SampleVisual variant="product" />}
        <div className="product-caption">Less friction. More possibility.</div>
      </div>
    </>
  );
}
function Immersive(p: SectionProps) {
  return (
    <>
      <Photo {...p} />
      <Copy {...p} />
      <div className="immersive-caption">Discover something worth your time.</div>
    </>
  );
}
function TerminalHero(p: SectionProps) {
  return (
    <>
      <Copy {...p} />
      <div className="terminal-window">
        <div>
          <Terminal size={16} /> ~/workspace
        </div>
        <pre>
          <code>
            {
              "$ build something meaningful\n\n✓ Ideas connected\n✓ Systems ready\n✓ Possibilities unlocked\n\n→ Your next chapter starts here_"
            }
          </code>
        </pre>
        <Badge>Built with care</Badge>
      </div>
    </>
  );
}
function Mosaic(p: SectionProps) {
  return (
    <>
      <Copy {...p} />
      <div className="hero-mosaic">
        <Photo {...p} />
        <div className="mosaic-note">
          <span className="eyebrow">A fresh perspective</span>
          <h3>
            Less ordinary.
            <br />
            More you.
          </h3>
        </div>
        <div className="mosaic-small" style={{ backgroundImage: "url(/images/interior.jpg)" }} />
      </div>
    </>
  );
}
function Video(p: SectionProps) {
  return (
    <>
      <Photo {...p} />
      <Copy {...p} />
      <Dialog
        title="A closer look"
        description="Explore the story in this local preview."
        trigger={
          <Button className="hero-play" variant="secondary">
            <Play size={18} />
            Explore the story
          </Button>
        }
      >
        <p>{p.content.description}</p>
        <SampleVisual />
      </Dialog>
    </>
  );
}
function SearchHero(p: SectionProps) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  return (
    <>
      <Copy {...p} />
      <form
        className="hero-search"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(q);
        }}
      >
        <Search size={20} />
        <Input
          aria-label="Search this collection"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What are you looking for?"
        />
        <Button type="submit">Search</Button>
      </form>
      {query && (
        <div role="status" className="search-suggestions">
          <strong>Explore “{query}”</strong>
          <p>Use the collection filters below to narrow the sample results.</p>
          <a href={p.content.href}>Browse the collection</a>
        </div>
      )}
      <div className="hero-proof">
        <Badge>Carefully selected</Badge>
        <span>Useful answers. Clear choices.</span>
      </div>
    </>
  );
}
function Profile(p: SectionProps) {
  return (
    <>
      <Photo {...p} />
      <Copy {...p} />
      <div className="profile-signature">
        {p.content.eyebrow}
        <span>Thoughtful work. Personal attention.</span>
      </div>
    </>
  );
}
function Countdown(p: SectionProps) {
  return (
    <>
      <Badge>Registration is open</Badge>
      <Copy {...p} />
      <div className="event-date">
        <strong>22—23</strong>
        <span>
          OCTOBER
          <br />
          2026
        </span>
        <span>
          Ideas. People.
          <br />
          Possibilities.
        </span>
      </div>
      <Signup label="Keep me updated" />
    </>
  );
}
const layouts: Record<string, (p: SectionProps) => React.ReactNode> = {
  split: Split,
  centered: Centered,
  editorial: Editorial,
  statement: Statement,
  product: Product,
  immersive: Immersive,
  terminal: TerminalHero,
  mosaic: Mosaic,
  video: Video,
  search: SearchHero,
  profile: Profile,
  countdown: Countdown,
};
export function HeroSection(p: SectionProps) {
  const Layout = layouts[p.variant];
  if (!Layout) throw new Error("Unknown hero " + p.variant);
  return (
    <section className={"hero hero-" + p.variant + " " + (p.className || "")}>
      <Layout {...p} />
    </section>
  );
}
