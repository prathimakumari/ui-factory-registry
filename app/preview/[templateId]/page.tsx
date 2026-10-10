import { notFound } from "next/navigation";
import { templates, resolveDesign } from "@/lib/registry";
import { TemplateRenderer } from "@/lib/template-renderer";
import { PreviewBridge } from "@/components/factory/preview-bridge";
export function generateStaticParams() {
  return templates.map((t) => ({ templateId: t.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const t = templates.find((t) => t.id === templateId);
  return { title: t?.name || "Template not found" };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { templateId } = await params;
  if (!templates.some((t) => t.id === templateId)) notFound();
  const p = await searchParams;
  const text = (key: string) => (typeof p[key] === "string" ? p[key] : undefined);
  let config;
  try {
    config = resolveDesign({
      template: templateId,
      style: text("style"),
      theme: text("theme"),
      motion: text("motion"),
      mode: text("mode") as "light" | "dark" | undefined,
      layout: text("layout") ? JSON.parse(text("layout")!) : undefined,
      card: text("card") as "plain" | undefined,
      overrides: Object.fromEntries(
        ["navbar", "hero", "features", "footer"].flatMap((k) => (text(k) ? [[k, text(k)!]] : [])),
      ),
    }).config;
  } catch (error) {
    return (
      <main id="main-content" className="error-page">
        <h1>Invalid preview configuration</h1>
        <p>{error instanceof Error ? error.message : "Check the selected IDs."}</p>
        <a href={"/preview/" + templateId}>Reset to template defaults</a>
      </main>
    );
  }
  return (
    <div id="main-content">
      <PreviewBridge initial={config}>
        <TemplateRenderer config={config} />
      </PreviewBridge>
    </div>
  );
}
