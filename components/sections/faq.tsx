"use client";
import { useState } from "react";
import { Accordion, Input, Tabs, EmptyState } from "@/components/ui/primitives";
import { Heading, type SectionProps } from "./shared";
export function FaqSection({ content, variant, className = "" }: SectionProps) {
  const [q, setQ] = useState("");
  const items = content.items
    .filter((i) => (i.title + " " + i.description).toLowerCase().includes(q.toLowerCase()))
    .map((i, n) => ({
      title: (variant === "numbered" ? String(n + 1).padStart(2, "0") + ". " : "") + i.title,
      content: i.description,
    }));
  return (
    <section className={"section faq faq-" + variant + " " + className}>
      <Heading content={content} />
      <div>
        {variant === "search" && (
          <Input
            aria-label="Search questions"
            placeholder="Search questions…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        )}{" "}
        {variant === "tabs" ? (
          <Tabs
            items={[
              {
                id: "getting-started",
                label: "Getting started",
                content: <Accordion items={items.slice(0, 2)} />,
              },
              {
                id: "support",
                label: "Support & details",
                content: <Accordion items={items.slice(2)} />,
              },
            ]}
          />
        ) : items.length ? (
          <Accordion items={items} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
