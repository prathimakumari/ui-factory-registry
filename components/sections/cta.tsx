"use client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { Action, Signup, type SectionProps } from "./shared";
export function CtaSection({ content, variant, className = "" }: SectionProps) {
  return (
    <section className={"section cta cta-" + variant + " " + className}>
      <div>
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>
      {variant === "newsletter" ? (
        <Signup />
      ) : variant === "download" ? (
        <Button asChild>
          <a
            download="getting-started.txt"
            href={
              "data:text/plain;charset=utf-8," +
              encodeURIComponent(
                content.title +
                  "\n\n" +
                  content.description +
                  "\n\nThanks for exploring this local demo.",
              )
            }
          >
            <Download size={18} />
            Download the guide
          </a>
        </Button>
      ) : (
        <Action
          content={{ ...content, href: "#content-contact", action: "Start a conversation" }}
        />
      )}
    </section>
  );
}
