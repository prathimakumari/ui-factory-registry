import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { registryItemSchema } from "../registry/schema";
import { sourceClosure, externalDependencies } from "./source-graph";
import { generateMobile } from "./generate-mobile";
const mobileCatalog = generateMobile();
const groups = ["templates", "styles", "themes", "motion", "components", "sections"];
const entries = groups.flatMap((group) =>
  readdirSync("registry/" + group)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((file) => ({
      file: "registry/" + group + "/" + file,
      item: registryItemSchema.parse(
        JSON.parse(readFileSync("registry/" + group + "/" + file, "utf8")),
      ),
    })),
);
const imports = entries
  .map((e, i) => "import item" + i + ' from "./' + e.file.slice(9) + '";')
  .join("\n");
writeFileSync(
  "registry/catalog.ts",
  imports + "\nexport const rawItems = [" + entries.map((_, i) => "item" + i).join(",") + "];\n",
);
writeFileSync(
  "registry/index.json",
  JSON.stringify(
    {
      schemaVersion: 1,
      mobileScreens: mobileCatalog.screens.map((screen) => ({
        ...screen,
        manifest: "registry/mobile/screens.json",
        files: mobileCatalog.files,
        platforms: ["web", "ios", "android"],
      })),
      items: entries.map(({ file, item }) => ({
        id: item.id,
        kind: item.kind,
        description: item.description,
        tags: item.tags,
        manifest: file,
        files: item.files,
        ...(item.kind === "template"
          ? {
              compatibleStyles: item.compatibleStyles,
              supportedThemes: item.supportedThemes,
              supportedMotion: item.supportedMotion,
            }
          : {}),
      })),
    },
    null,
    2,
  ) + "\n",
);
const baseUrl = (process.env.REGISTRY_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const filesFor = (paths: string[]) =>
  paths.map((file) => ({
    path: file,
    type: file.endsWith(".css")
      ? "registry:style"
      : file.startsWith("components/ui/")
        ? "registry:ui"
        : file.startsWith("components/")
          ? "registry:component"
          : "registry:lib",
    target: file,
  }));
const runtime = sourceClosure([
  "lib/template-renderer.tsx",
  "styles/globals.css",
  ...entries.flatMap(({ item }) => item.files),
]);
const runtimeItem = {
  name: "ui-factory",
  type: "registry:block",
  title: "UI Factory runtime",
  description:
    "Renderer, manifests, semantic tokens and shared sections. Copy public/images separately or supply your own media.",
  dependencies: externalDependencies(runtime).filter((d) => !["react", "react-dom"].includes(d)),
  files: filesFor(runtime),
};
const registryItems = entries.map(({ file, item }) => {
  if (item.kind === "template")
    return {
      name: item.id,
      type: "registry:block",
      title: item.name,
      description: item.description,
      registryDependencies: [baseUrl + "/r/ui-factory.json"],
      files: filesFor([file]),
    };
  const paths = sourceClosure([
    ...item.files,
    file,
    ...(item.kind === "component" || item.kind === "section" ? ["styles/globals.css"] : []),
  ]);
  return {
    name: item.id,
    type:
      item.kind === "component"
        ? "registry:ui"
        : item.kind === "section"
          ? "registry:block"
          : "registry:lib",
    title: item.name,
    description: item.description,
    dependencies: externalDependencies(paths).filter((d) => !["react", "react-dom"].includes(d)),
    files: filesFor(paths),
  };
});
writeFileSync(
  "registry.json",
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "ui-factory-registry",
      homepage: baseUrl,
      items: [runtimeItem, ...registryItems],
    },
    null,
    2,
  ) + "\n",
);
mkdirSync("public/r", { recursive: true });
console.log(
  "Generated static imports, compact catalog, and " +
    (registryItems.length + 1) +
    " shadcn items from " +
    entries.length +
    " source manifests.",
);

mkdirSync("docs", { recursive: true });
for (const kind of ["template", "style", "theme", "motion", "component"]) {
  const selected = entries.filter(
    (e) => e.item.kind === kind || (kind === "component" && e.item.kind === "section"),
  );
  const body =
    "# " +
    kind[0].toUpperCase() +
    kind.slice(1) +
    " catalog\n\nGenerated from source manifests by registry:generate. Do not edit this catalog by hand.\n\n| ID | Description | Source manifest |\n| --- | --- | --- |\n" +
    selected
      .map(
        ({ file, item }) =>
          "| " + item.id + " | " + item.description + " | [" + file + "](../" + file + ") |",
      )
      .join("\n") +
    "\n";
  writeFileSync("docs/" + kind + "-catalog.md", body);
}
