import { parseArgs } from "node:util";
import { mkdirSync, writeFileSync, copyFileSync, cpSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { exportConfiguration } from "../lib/export";
import { items } from "../lib/registry";
import { sourceClosure, externalDependencies } from "./source-graph";
try {
  const { values } = parseArgs({
    options: {
      template: { type: "string" },
      style: { type: "string" },
      theme: { type: "string" },
      motion: { type: "string" },
      mode: { type: "string" },
      out: { type: "string" },
      copy: { type: "boolean" },
      help: { type: "boolean" },
    },
    strict: true,
  });
  if (values.help) {
    console.log(
      "Usage: pnpm registry:export --template <id> [--style <id>] [--theme <id>] [--motion <id>] [--mode light|dark] [--copy] [--out <directory>]\nDefault output: exports/<template-id>/. JSON configuration is always generated.\n--copy includes the complete renderer dependency closure and local sample assets.",
    );
  } else {
    if (!values.template)
      throw new Error("--template is required. Use pnpm registry:list --kind template.");
    const result = exportConfiguration({
      template: values.template,
      style: values.style,
      theme: values.theme,
      motion: values.motion,
      mode: values.mode as "light" | "dark" | undefined,
    });
    const output = path.resolve(values.out || path.join("exports", values.template));
    const root = path.resolve(".");
    if (output === root || root.startsWith(output + path.sep))
      throw new Error(
        "Choose a dedicated output directory, not the repository root or its parent.",
      );
    mkdirSync(output, { recursive: true });
    writeFileSync(path.join(output, result.filename), result.content);
    if (values.copy) {
      const files = sourceClosure([
        "lib/template-renderer.tsx",
        "styles/globals.css",
        ...items.flatMap((item) => item.files),
      ]);
      for (const file of files) {
        const target = path.join(output, file);
        mkdirSync(path.dirname(target), { recursive: true });
        copyFileSync(file, target);
      }
      if (existsSync("public/images"))
        cpSync("public/images", path.join(output, "public/images"), { recursive: true });
      copyFileSync("docs/asset-credits.md", path.join(output, "ASSET-CREDITS.md"));
      writeFileSync(
        path.join(output, "styles", "css.d.ts"),
        '// Side-effect CSS imports for strict TypeScript consumers.\ndeclare module "*.css";\n',
      );
      const pkg = JSON.parse(readFileSync("package.json", "utf8"));
      writeFileSync(
        path.join(output, "dependencies.json"),
        JSON.stringify(
          Object.fromEntries(
            externalDependencies(files).map((name) => [
              name,
              pkg.dependencies[name] || pkg.devDependencies[name],
            ]),
          ),
          null,
          2,
        ),
      );
      writeFileSync(
        path.join(output, "page.tsx"),
        'import { TemplateRenderer } from "@/lib/template-renderer";\nimport "@/styles/globals.css";\n\nexport default function Page(){return <TemplateRenderer config={' +
          JSON.stringify(result.config, null, 2) +
          "}/>;}\n",
      );
      writeFileSync(
        path.join(output, "INTEGRATION.md"),
        "# Local copy integration\n\nCopy components/, lib/, registry/, styles/ into your React source root. Keep @/* mapped to that root. Copy public/images/ to your public directory. Install packages in dependencies.json, using mutually compatible React versions. This runtime has no Next-specific imports. Include styles/globals.css using Tailwind v4 and its PostCSS plugin. The provided page.tsx is a Next App Router example; mount TemplateRenderer directly in other React apps. Replace fictional content and connect real application behavior yourself. See ASSET-CREDITS.md for sample image sources. No backend or secrets are included.\n",
      );
      console.log("Copied " + files.length + " source files plus local assets to " + output);
    }
    console.log("Exported validated configuration: " + path.join(output, result.filename));
  }
} catch (e) {
  console.error("Export failed: " + (e instanceof Error ? e.message : String(e)));
  process.exitCode = 1;
}
