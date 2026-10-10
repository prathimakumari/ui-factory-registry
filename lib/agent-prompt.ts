import { resolveDesign } from "./registry";
import type { DesignInput } from "@/registry/schema";
export function designAgentPrompt(input: DesignInput) {
  const design = resolveDesign(input);
  return (
    "Use UI Factory Registry. Read AGENTS.md, docs/agent-usage.md, and the selected manifests in registry/index.json.\n\nConfiguration:\n" +
    JSON.stringify(design.config, null, 2) +
    "\n\nReuse TemplateRenderer from @/lib/template-renderer and import @/styles/globals.css. For a separate project, run pnpm registry:export --template " +
    design.template.id +
    " --copy in the registry repository, follow INTEGRATION.md, then replace the exported config with the complete configuration above.\n\nUse embedded={true} when mounting inside an application panel. Layouts respond to their container width. Supply your own content and callbacks; do not recreate existing sections or effects. Respect reduced motion, keyboard focus, and semantic theme tokens. Test the actual container at 320, 768, and 1280px and verify form validation before release."
  );
}
