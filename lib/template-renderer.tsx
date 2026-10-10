import { resolveDesign, lookup } from "@/lib/registry";
import { themeVariables, styleVariables, layoutVariables } from "@/lib/theme";
import { sectionMap } from "@/lib/section-map";
import { ThemeScope } from "@/components/ui/theme-scope";
import { MotionProvider, Reveal } from "@/components/motion/primitives";
import { ShellSection } from "@/components/dashboards/shells";
import type { DesignInput } from "@/registry/schema";
export function TemplateRenderer({
  config,
  className = "",
  style: containerStyle,
  embedded = false,
}: {
  config: DesignInput;
  className?: string;
  style?: React.CSSProperties;
  embedded?: boolean;
}) {
  const design = resolveDesign(config);
  const ContentRoot = embedded ? "div" : "main";
  const { template, style, theme, motion } = design;
  const shell = design.sections.find((s) => lookup(s.id, "section").group === "shell");
  const content = design.sections
    .filter((s) => lookup(s.id, "section").group !== "shell")
    .map((section, index) => {
      const meta = lookup(section.id, "section");
      const Component = sectionMap[section.id];
      if (!Component) throw new Error("No implementation for " + section.id);
      return (
        <div key={section.key} id={section.key} data-section-id={section.id}>
          {index === 2 && <span id="content" />}
          {meta.group === "features" && <span id="features" />}
          {["navbar", "hero", "footer"].includes(meta.group) ? (
            <Component variant={meta.variant} content={section.content} />
          ) : (
            <Reveal>
              <Component variant={meta.variant} content={section.content} />
            </Reveal>
          )}
        </div>
      );
    });
  const variables = {
    ...themeVariables(theme, design.config.mode),
    ...styleVariables(style),
    ...layoutVariables(design.config.layout),
    "--preview-min-height": embedded ? "0px" : "100dvh",
    "--motion-duration": motion.duration + "s",
  } as React.CSSProperties;
  return (
    <ThemeScope variables={variables}>
      <div
        id="top"
        className={"factory-preview " + className}
        style={{ ...variables, ...containerStyle }}
        data-template={template.id}
        data-style={style.id}
        data-theme={theme.id}
        data-mode={design.config.mode}
        data-motion={motion.id}
        data-surface={style.surface}
        data-decoration={style.decoration}
        data-button={style.button}
        data-input={style.input}
        data-background={style.background}
        data-card={design.config.card}
      >
        <MotionProvider profile={motion}>
          {shell ? (
            <ShellSection
              embedded={embedded}
              variant={lookup(shell.id, "section").variant}
              content={shell.content}
            >
              {content}
            </ShellSection>
          ) : (
            <ContentRoot>{content}</ContentRoot>
          )}
        </MotionProvider>
      </div>
    </ThemeScope>
  );
}
