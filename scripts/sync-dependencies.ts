import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { sourceClosure, externalDependencies } from "./source-graph";
for (const group of ["templates", "styles", "themes", "motion", "components", "sections"]) {
  for (const file of readdirSync("registry/" + group).filter((name) => name.endsWith(".json"))) {
    const path = "registry/" + group + "/" + file;
    const item = JSON.parse(readFileSync(path, "utf8"));
    item.dependencies = externalDependencies(sourceClosure(item.files));
    writeFileSync(path, JSON.stringify(item, null, 2) + "\n");
  }
}
console.log("Synchronized manifest dependencies from their source import graphs.");
