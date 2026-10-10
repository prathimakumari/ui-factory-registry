"use client";
import { useState } from "react";
import { Menu, X, Layers, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import type { SectionProps } from "@/components/sections/shared";
export function NavbarSection({ content, variant, className = "" }: SectionProps) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  return (
    <header className={"template-nav nav-" + variant + " " + className}>
      <a className="brand" href="#top">
        <Layers size={22} />
        {content.title}
      </a>
      <nav aria-label="Main navigation" className={open ? "nav-links is-open" : "nav-links"}>
        <a href="#features">Discover</a>
        <a href="#content">Our story</a>
        {variant === "mega" ? (
          <div className="mega-wrap">
            <button aria-expanded={mega} onClick={() => setMega(!mega)}>
              Explore <ChevronDown size={14} />
            </button>
            {mega && (
              <div className="mega-panel">
                <a href="#content">
                  Overview<span>Explore our work and ideas</span>
                </a>
                <a href="#content-contact">
                  Contact<span>Start a conversation</span>
                </a>
                <a href="#features">
                  Capabilities<span>See how we can help</span>
                </a>
              </div>
            )}
          </div>
        ) : (
          <a href="#content-contact">Contact</a>
        )}
      </nav>
      <Button
        asChild
        className="nav-action"
        variant={variant === "transparent" ? "outline" : "default"}
      >
        <a href={content.href || "#content"}>Get started</a>
      </Button>
      <Button
        className="nav-mobile"
        variant="ghost"
        size="icon"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </Button>
    </header>
  );
}
