import { existsSync, readFileSync } from "node:fs";
import { items, validateReferences, templates, resolveDesign } from "../lib/registry";
import { sectionMap } from "../lib/section-map";
import { sourceClosure, externalDependencies } from "./source-graph";
import { mobileCatalog, mobileScreens, resolveMobileDesign } from "../lib/mobile";
import { screenIds } from "../registry/mobile/state";
if (process.argv.includes("--help")) {
  console.log(
    "Usage: pnpm registry:validate\nValidate schemas, IDs, references, defaults, source paths, implementations, and transitive dependencies.",
  );
  process.exit(0);
}
const errors = validateReferences();
if (JSON.stringify(mobileScreens.map((s) => s.id)) !== JSON.stringify(screenIds))
  errors.push("Mobile catalog and screen implementations disagree.");
for (const file of Object.values(mobileCatalog.files))
  if (!existsSync(file)) errors.push("Mobile source missing: " + file);
for (const screen of mobileScreens) {
  try {
    resolveMobileDesign({
      screen: screen.id,
      style: screen.defaultStyle,
      theme: screen.defaultTheme,
      motion: screen.defaultMotion,
    });
  } catch (error) {
    errors.push(String(error));
  }
}
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const item of items) {
  try {
    for (const dependency of externalDependencies(sourceClosure(item.files)))
      if (!item.dependencies.includes(dependency))
        errors.push(item.id + ": manifest must declare transitive dependency " + dependency);
  } catch (error) {
    errors.push(String(error));
  }
  for (const file of item.files)
    if (!existsSync(file)) errors.push(item.id + ": missing file " + file);
  for (const dependency of item.dependencies)
    if (!pkg.dependencies[dependency] && !pkg.devDependencies[dependency])
      errors.push(item.id + ": undeclared dependency " + dependency);
  if (item.kind === "section" && !sectionMap[item.id])
    errors.push(item.id + ": missing React implementation");
  if (item.kind === "template") {
    try {
      resolveDesign({ template: item.id });
    } catch (e) {
      errors.push(String(e));
    }
  }
}
try {
  const closure = sourceClosure(["lib/template-renderer.tsx"]);
  for (const dep of externalDependencies(closure))
    if (!pkg.dependencies[dep])
      errors.push("Runtime import requires undeclared dependency: " + dep);
} catch (e) {
  errors.push(String(e));
}
if (errors.length) {
  console.error("Registry validation failed:\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Validated " +
      items.length +
      " items, " +
      templates.length +
      " templates, references, imports, dependencies and implementations.",
  );
