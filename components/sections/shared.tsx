"use client";
import { useState, type ReactNode } from "react";
import { Layers, Check, BarChart3, Zap, Command } from "lucide-react";
import { Button, Input, Alert, Card, Badge } from "@/components/ui/primitives";
import type { SectionContent } from "@/registry/schema";
export type SectionProps = { content: SectionContent; variant: string; className?: string };
export function Heading({ content, children }: { content: SectionContent; children?: ReactNode }) {
  return (
    <header className="section-heading">
      <div>
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.title}</h2>
        {content.description && <p>{content.description}</p>}
      </div>
      {children}
    </header>
  );
}
export function Action({
  content,
  secondary = false,
}: {
  content: SectionContent;
  secondary?: boolean;
}) {
  return (
    <Button asChild variant={secondary ? "outline" : "default"}>
      <a href={content.href || "#content-contact"}>{content.action || "Explore the details"}</a>
    </Button>
  );
}
export function Signup({ label = "Join the list" }: { label?: string }) {
  const [done, setDone] = useState(false);
  return done ? (
    <Alert title="You're on the demo list." variant="success">
      This sample saves no personal data and sends no email.
    </Alert>
  ) : (
    <form
      className="signup-form"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <Input type="email" aria-label="Email address" placeholder="you@example.com" required />
      <Button type="submit">{label}</Button>
    </form>
  );
}
export function SampleVisual({ variant = "dashboard" }: { variant?: string }) {
  return (
    <div className={"sample-visual sample-" + variant} aria-label="Sample product interface">
      <div className="sample-top">
        <span>
          <Layers size={16} /> Workspace
        </span>
        <Badge>Live preview</Badge>
      </div>
      <div className="sample-body">
        <aside>
          <Command size={18} />
          <BarChart3 size={18} />
          <Layers size={18} />
          <Zap size={18} />
        </aside>
        <div>
          <div className="spread">
            <div>
              <span className="muted">This week’s progress</span>
              <h3>A little better, every day.</h3>
            </div>
            <Badge>+18.6%</Badge>
          </div>
          <div className="mini-metrics">
            <Card>
              <small>Completed</small>
              <strong>248</strong>
            </Card>
            <Card>
              <small>In progress</small>
              <strong>32</strong>
            </Card>
          </div>
          <div className="mini-bars" aria-label="Weekly activity chart">
            {[38, 52, 45, 72, 58, 84, 68, 92, 78, 100, 86, 96].map((h, i) => (
              <span key={i} style={{ height: h + "%" }} />
            ))}
          </div>
          <div className="sample-task">
            <Check size={15} /> Launch checklist completed <span className="muted">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function ItemCards({
  content,
  className = "",
}: {
  content: SectionContent;
  className?: string;
}) {
  return (
    <div className={"item-grid " + className}>
      {content.items.map((item, i) => (
        <Card key={i}>
          <span className="item-number">{String(i + 1).padStart(2, "0")}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
