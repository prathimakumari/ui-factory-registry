import { parseArgs } from "node:util";
import { items } from "../lib/registry";
import { mobileCatalog, mobileScreens } from "../lib/mobile";
try {
  const { values } = parseArgs({
    options: {
      kind: { type: "string" },
      search: { type: "string" },
      json: { type: "boolean" },
      help: { type: "boolean" },
    },
    strict: true,
  });
  if (values.help) {
    console.log(
      "Usage: pnpm registry:list [--kind template|style|theme|motion|component|section|mobile-screen] [--search text] [--json]",
    );
  } else {
    if (
      values.kind &&
      !["template", "style", "theme", "motion", "component", "section", "mobile-screen"].includes(
        values.kind,
      )
    )
      throw new Error("Unknown kind: " + values.kind);
    const found = [
      ...items,
      ...mobileScreens.map((screen) => ({
        ...screen,
        kind: "mobile-screen",
        files: mobileCatalog.files,
        platforms: ["web", "ios", "android"],
      })),
    ].filter(
      (i) =>
        (!values.kind || i.kind === values.kind) &&
        (!values.search ||
          (i.id + " " + i.description + " " + i.tags.join(" "))
            .toLowerCase()
            .includes(values.search.toLowerCase())),
    );
    console.log(
      values.json
        ? JSON.stringify(found, null, 2)
        : found
            .map((i) => i.id.padEnd(34) + " " + i.kind.padEnd(10) + " " + i.description)
            .join("\n") +
            "\n\n" +
            found.length +
            " entries.",
    );
  }
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
}
