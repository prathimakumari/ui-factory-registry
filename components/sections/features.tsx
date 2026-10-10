"use client";
import { Check, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";
import { Tabs, Card } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion/primitives";
import { Heading, SampleVisual, type SectionProps } from "./shared";
const icons = [Layers, Zap, ShieldCheck, Sparkles];
export function FeaturesSection({ content, variant, className = "" }: SectionProps) {
  const cards = content.items.map((item, i) => {
    const Icon = icons[i % 4];
    return (
      <Reveal key={i} index={i}>
        <Card>
          <span className="feature-icon">
            {variant === "numbered" || variant === "timeline" ? (
              String(i + 1).padStart(2, "0")
            ) : (
              <Icon size={23} />
            )}
          </span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          {((variant === "bento" && i === 0) || (variant === "spotlight" && i === 0)) && (
            <SampleVisual />
          )}
          {variant === "comparison" && (
            <ul>
              <li>
                <Check size={16} />
                Included from day one
              </li>
              <li>
                <Check size={16} />
                Flexible and adaptable
              </li>
            </ul>
          )}
        </Card>
      </Reveal>
    );
  });
  return (
    <section className={"section features features-" + variant + " " + className}>
      <Heading content={content} />
      {variant === "tabs" ? (
        <Tabs
          items={content.items.map((item, i) => ({
            id: String(i),
            label: item.title,
            content: (
              <div className="feature-tab">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <SampleVisual variant="product" />
              </div>
            ),
          }))}
        />
      ) : variant === "alternating" ? (
        <div className="alternating-items">
          {content.items.slice(0, 3).map((item, i) => (
            <div key={i}>
              <div>
                <span className="eyebrow">0{i + 1} / A better everyday</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <SampleVisual variant={String(i)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="feature-grid">{cards}</div>
      )}
    </section>
  );
}
