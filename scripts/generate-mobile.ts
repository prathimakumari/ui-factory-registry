import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { mobileCatalogSchema } from "../registry/mobile-schema";
import { registryItemSchema } from "../registry/schema";
import { readdirSync } from "node:fs";
export function generateMobile() {
  const catalog = mobileCatalogSchema.parse(
    JSON.parse(readFileSync("registry/mobile/screens.json", "utf8")),
  );
  const entries = ["styles", "themes", "motion"].flatMap((group) =>
    readdirSync("registry/" + group)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) =>
        registryItemSchema.parse(JSON.parse(readFileSync("registry/" + group + "/" + f, "utf8"))),
      ),
  );
  mkdirSync("mobile/generated", { recursive: true });
  writeFileSync(
    "mobile/generated/catalog.json",
    JSON.stringify(
      {
        ...catalog,
        styles: entries.filter((i) => i.kind === "style"),
        themes: entries.filter((i) => i.kind === "theme"),
        motions: entries.filter((i) => i.kind === "motion"),
      },
      null,
      2,
    ) + "\n",
  );
  copyFileSync("registry/mobile/data.json", "mobile/generated/data.json");
  copyFileSync("registry/mobile/state.ts", "mobile/generated/state.ts");
  copyFileSync("registry/mobile/experience.tsx", "mobile/generated/experience.tsx");
  console.log(
    "Generated native data for " +
      catalog.screens.length +
      " mobile screens, 20 styles, 24 themes and 16 motion profiles.",
  );
  return catalog;
}
if (process.argv[1]?.replaceAll("\\", "/").endsWith("generate-mobile.ts")) generateMobile();
