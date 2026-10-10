"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button, Card, Badge, Switch, Input, Dialog } from "@/components/ui/primitives";
import { Heading, type SectionProps } from "./shared";
export function PricingSection({ content, variant, className = "" }: SectionProps) {
  const [annual, setAnnual] = useState(false);
  const [seats, setSeats] = useState(5);
  const [selected, setSelected] = useState<string | null>(null);
  const plans =
    variant === "single"
      ? content.items.slice(0, 1)
      : variant === "toggle"
        ? content.items.slice(0, 2)
        : content.items;
  return (
    <section className={"section pricing pricing-" + variant + " " + className}>
      <Heading content={content}>
        {["toggle", "three-tier"].includes(variant) && (
          <Switch label="Annual billing · save 20%" checked={annual} onCheckedChange={setAnnual} />
        )}
      </Heading>
      {variant === "usage" && (
        <label className="usage-control">
          Team members: {seats}
          <Input
            type="range"
            min={1}
            max={100}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
          />
        </label>
      )}
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <Card key={i} className={i === 1 ? "featured-plan" : ""}>
            {i === 1 && <Badge>Most popular</Badge>}
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <div className="price">
              {variant === "enterprise" && i === 2
                ? "Let's talk"
                : "$" +
                  Math.round(
                    [19, 49, 99][i] * (annual ? 0.8 : 1) * (variant === "usage" ? seats : 1),
                  )}
              <small>{variant === "enterprise" && i === 2 ? "Custom plans" : "/ month"}</small>
            </div>
            <ul>
              {[
                "Core features included",
                "Flexible configuration",
                "Helpful documentation",
                ...(i > 0 ? ["Team collaboration", "Priority support"] : []),
              ].map((f) => (
                <li key={f}>
                  <Check size={16} />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={i === 1 ? "default" : "outline"} onClick={() => setSelected(p.title)}>
              Choose {p.title}
            </Button>
          </Card>
        ))}
      </div>
      {variant === "comparison" && (
        <table className="comparison-table">
          <caption>Plan comparison</caption>
          <thead>
            <tr>
              <th>Feature</th>
              {plans.map((p) => (
                <th key={p.title}>{p.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["Projects", "Members", "Support"].map((r, i) => (
              <tr key={r}>
                <th>{r}</th>
                <td>{["3", "1", "Community"][i]}</td>
                <td>{["Unlimited", "10", "Priority"][i]}</td>
                <td>{["Unlimited", "Unlimited", "Dedicated"][i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Dialog
        title={(selected || "Plan") + " selected"}
        description="Demo plan selection. Connect your own checkout to accept payments."
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <p>
          Your selected plan is <strong>{selected}</strong>, billed{" "}
          {annual ? "annually" : "monthly"}.
        </p>
        <Button onClick={() => setSelected(null)}>Continue exploring</Button>
      </Dialog>
    </section>
  );
}
