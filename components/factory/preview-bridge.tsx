"use client";
import { useEffect, useState, type ReactNode } from "react";
import { TemplateRenderer } from "@/lib/template-renderer";
import { resolveDesign } from "@/lib/registry";
import type { DesignInput } from "@/registry/schema";
export function PreviewBridge({
  initial,
  children,
}: {
  initial: DesignInput;
  children: ReactNode;
}) {
  const [config, setConfig] = useState<DesignInput | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.type !== "ui-factory-config"
      )
        return;
      try {
        setConfig(resolveDesign(event.data.config).config);
      } catch {
        /* Invalid parent messages do not replace a working preview. */
      }
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "ui-factory-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);
  return config ? (
    <TemplateRenderer key={JSON.stringify(config)} config={config || initial} />
  ) : (
    children
  );
}
