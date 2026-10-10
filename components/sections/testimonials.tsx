"use client";
import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { Avatar, Button, Card } from "@/components/ui/primitives";
import { Heading, type SectionProps } from "./shared";
export function TestimonialsSection({ content, variant, className = "" }: SectionProps) {
  const [index, setIndex] = useState(0);
  const selected =
    variant === "spotlight" || variant === "editorial"
      ? content.items.slice(0, 1)
      : variant === "carousel"
        ? [content.items[index]]
        : content.items;
  return (
    <section className={"section testimonials testimonials-" + variant + " " + className}>
      <Heading content={content} />
      {variant === "logos" && (
        <div className="logo-cloud">
          <strong>fieldwork</strong>
          <strong>Northstar</strong>
          <strong>FORMA</strong>
          <strong>Layer</strong>
        </div>
      )}
      <div className="quote-grid" aria-live={variant === "carousel" ? "polite" : undefined}>
        {selected.map((item, i) => (
          <Card key={item.title}>
            {variant === "rating" ? (
              <div aria-label="5 out of 5 stars" className="stars">
                {[0, 1, 2, 3, 4].map((n) => (
                  <Star key={n} size={16} fill="currentColor" />
                ))}
              </div>
            ) : (
              <Quote size={28} />
            )}
            <blockquote>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </blockquote>
            <Avatar name={["Jamie Parker", "Alex Kim", "Morgan Reed"][i % 3]} />
          </Card>
        ))}
      </div>
      {variant === "carousel" && (
        <div className="carousel-controls">
          <Button
            variant="outline"
            onClick={() => setIndex((index + content.items.length - 1) % content.items.length)}
          >
            Previous
          </Button>
          <span>
            {index + 1} / {content.items.length}
          </span>
          <Button variant="outline" onClick={() => setIndex((index + 1) % content.items.length)}>
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
