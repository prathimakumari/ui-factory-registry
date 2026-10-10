"use client";
import { Layers } from "lucide-react";
import { Signup, type SectionProps } from "./shared";
export function FooterSection({ content, variant, className = "" }: SectionProps) {
  return (
    <footer className={"template-footer footer-" + variant + " " + className}>
      <div className="footer-brand">
        <a href="#top">
          <Layers size={22} />
          {content.title}
        </a>
        <p>Thoughtful details. Meaningful experiences.</p>
        {["newsletter", "mega"].includes(variant) && <Signup label="Subscribe" />}
      </div>
      {!["minimal", "compact"].includes(variant) && (
        <nav aria-label="Footer navigation" className="footer-links">
          {["Discover", "Connect", ...(variant === "mega" ? ["Resources"] : [])].map((group, i) => (
            <div key={group}>
              <strong>{group}</strong>
              {(i === 0
                ? ["Overview", "Our story", "Details"]
                : i === 1
                  ? ["Contact", "Community", "Newsletter"]
                  : ["Help center", "Guides", "Updates"]
              ).map((s, j) => (
                <a key={s} href={j === 0 ? "#top" : j === 1 ? "#content" : "#content-contact"}>
                  {s}
                </a>
              ))}
            </div>
          ))}
        </nav>
      )}
      <div className="footer-bottom">
        <span>© 2026 {content.title}. Sample content.</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
