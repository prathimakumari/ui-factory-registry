"use client";
import { useState } from "react";
import { RegistryShell } from "@/components/registry/shell";
import { ThemeScope } from "@/components/ui/theme-scope";
import { MotionProvider, Reveal } from "@/components/motion/primitives";
import { themes, styles, motions } from "@/lib/registry";
import { mobileScreens, resolveMobileDesign } from "@/lib/mobile";
import { themeVariables, styleVariables } from "@/lib/theme";
import { MobileExperience } from "./experience";
import type { ScreenId } from "@/registry/mobile/state";
import type { MobileConfig } from "@/registry/mobile-schema";

export function MobileRenderer({
  config,
  onDarkChange,
}: {
  config: MobileConfig;
  onDarkChange: () => void;
}) {
  const design = resolveMobileDesign(config);
  const variables = {
    ...themeVariables(design.theme, config.mode),
    ...styleVariables(design.style),
  };
  return (
    <ThemeScope variables={variables}>
      <div
        className="factory-preview mobile-preview"
        style={variables}
        data-style={config.style}
        data-theme={config.theme}
        data-mode={config.mode}
        data-surface={design.style.surface}
        data-button={design.style.button}
        data-input={design.style.input}
        data-background={design.style.background}
        data-decoration={design.style.decoration}
      >
        <MotionProvider profile={design.motion}>
          <Reveal key={config.screen}>
            <MobileExperience
              initialScreen={config.screen as ScreenId}
              dark={config.mode === "dark"}
              onDarkChange={onDarkChange}
            />
          </Reveal>
        </MotionProvider>
      </div>
    </ThemeScope>
  );
}
export function MobileStudio() {
  const [config, setConfig] = useState<MobileConfig>({
    screen: "mobile-home",
    style: "modern-minimal",
    theme: "emerald",
    motion: "subtle",
    mode: "light",
  });
  const [width, setWidth] = useState(390);
  const [notice, setNotice] = useState("");
  const change = (key: keyof MobileConfig, value: string) =>
    setConfig((old) => ({ ...old, [key]: value }));
  return (
    <RegistryShell title="Mobile designs" wide>
      <div className="mobile-studio">
        <header>
          <p>WEB · iOS · ANDROID</p>
          <h1>Small screen. Full of possibility.</h1>
          <p>Twelve connected app screens. Explore styles, colors and a little everyday calm.</p>
          <p>
            Local demo data. Native source and run instructions: <code>mobile/</code> and{" "}
            <code>docs/mobile-designs.md</code>.
          </p>
        </header>
        <div className="mobile-controls">
          <label>
            Mobile screen
            <select
              aria-label="Mobile screen"
              value={config.screen}
              onChange={(event) => {
                const screen = mobileScreens.find((s) => s.id === event.target.value)!;
                setConfig((old) => ({
                  ...old,
                  screen: screen.id,
                  style: screen.defaultStyle,
                  theme: screen.defaultTheme,
                  motion: screen.defaultMotion,
                }));
              }}
            >
              {mobileScreens.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["style", "Mobile style", styles],
              ["theme", "Mobile theme", themes],
              ["motion", "Mobile motion", motions],
            ] as const
          ).map(([key, label, options]) => (
            <label key={key}>
              {label}
              <select
                aria-label={label}
                value={config[key]}
                onChange={(event) => change(key, event.target.value)}
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Preview width: {width}px
            <input
              aria-label="Mobile preview width"
              type="range"
              min="320"
              max="840"
              step="10"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={config.mode === "dark"}
              onChange={() => change("mode", config.mode === "light" ? "dark" : "light")}
            />{" "}
            Dark appearance
          </label>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  "Use UI Factory Registry mobile screens. Read docs/mobile-designs.md. Reuse the shared flow and the web or native kit. Configuration: " +
                    JSON.stringify(config),
                );
                setNotice("Agent prompt copied.");
              } catch {
                setNotice("Clipboard unavailable. Copy the configuration below.");
              }
            }}
          >
            Copy agent prompt
          </button>
          <button
            type="button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(config, null, 2)], { type: "application/json" }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "mobile-design.json";
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Export config
          </button>
          <details>
            <summary>Configuration</summary>
            <pre>{JSON.stringify(config, null, 2)}</pre>
          </details>
          <p role="status">{notice}</p>
        </div>
        <div className="mobile-stage">
          <div style={{ width, maxWidth: "100%" }}>
            <MobileRenderer
              config={config}
              onDarkChange={() => change("mode", config.mode === "light" ? "dark" : "light")}
            />
          </div>
        </div>
      </div>
    </RegistryShell>
  );
}
