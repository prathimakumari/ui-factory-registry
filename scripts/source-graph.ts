import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
export function sourceClosure(entries: string[]) {
  const seen = new Set<string>();
  const visit = (file: string) => {
    file = file.replaceAll("\\", "/");
    if (seen.has(file)) return;
    if (!existsSync(file)) throw new Error("Missing source file: " + file);
    seen.add(file);
    if (file.endsWith(".css")) {
      for (const match of readFileSync(file, "utf8").matchAll(/@import\s+["'](\.[^"']+)["']/g)) {
        visit(path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1])));
      }
      return;
    }
    if (!/\.[cm]?[jt]sx?$/.test(file)) return;
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    for (const node of source.statements) {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const spec = node.moduleSpecifier.text;
        if (!spec.startsWith("@/") && !spec.startsWith(".")) continue;
        const base = spec.startsWith("@/")
          ? spec.slice(2)
          : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
        const resolved = [
          base,
          base + ".ts",
          base + ".tsx",
          base + ".json",
          base + "/index.ts",
          base + "/index.tsx",
        ].find((f) => existsSync(f));
        if (!resolved) throw new Error(file + ": unresolved import " + spec);
        visit(resolved);
      }
    }
  };
  entries.forEach(visit);
  return [...seen].sort();
}
export function externalDependencies(files: string[]) {
  const names = new Set<string>();
  for (const file of files) {
    if (!/\.[jt]sx?$/.test(file)) continue;
    const source = ts.createSourceFile(
      file,
      readFileSync(file, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    for (const node of source.statements) {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const spec = node.moduleSpecifier.text;
        if (spec.startsWith("@/") || spec.startsWith(".") || spec.startsWith("node:")) continue;
        names.add(
          spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0],
        );
      }
    }
  }
  return [...names].sort();
}
