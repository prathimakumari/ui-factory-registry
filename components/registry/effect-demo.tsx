"use client";
import { useState } from "react";
import { BorderGlow, MetallicButton, StatusOrb, type OrbState } from "@/components/ui/effects";
import { Button, Input, Select, Switch, Alert } from "@/components/ui/primitives";
export function EffectDemo({ kind }: { kind: string }) {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [strength, setStrength] = useState(0.6);
  const [size, setSize] = useState(64);
  const [state, setState] = useState<OrbState>("working");
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const code =
    kind === "border-glow"
      ? "<BorderGlow active={" +
        !paused +
        "} speed={" +
        speed +
        "} strength={" +
        strength +
        "}>\n  <YourCard />\n</BorderGlow>"
      : kind === "status-orb"
        ? '<StatusOrb state="' +
          state +
          '" size={' +
          size +
          "} speed={" +
          speed +
          "} paused={" +
          paused +
          "} />"
        : "<MetallicButton active={" + !paused + "} onClick={yourAction}>Continue</MetallicButton>";
  const exportName =
    kind === "border-glow" ? "BorderGlow" : kind === "status-orb" ? "StatusOrb" : "MetallicButton";
  const prompt =
    "Use UI Factory Registry component ui-" +
    kind +
    ". Read AGENTS.md and its manifest. Reuse components/ui/effects.tsx; include styles/globals.css and semantic theme tokens.\n\nimport { " +
    exportName +
    ' } from "@/components/ui/effects";\n\n' +
    code +
    "\n\nReplace example content and callbacks with application behavior. Preserve reduced-motion support, visible focus, accessible labels, and container responsiveness. Do not recreate this component.";
  return (
    <div className="effect-demo">
      <div className="effect-demo-canvas">
        {kind === "border-glow" ? (
          <BorderGlow active={!paused} speed={speed} strength={strength}>
            <span className="eyebrow">A CONSIDERED DETAIL</span>
            <h3>Give good ideas a little light.</h3>
            <p>A reusable border around your own content.</p>
            <Button onClick={() => setClicks(clicks + 1)}>Explore this detail</Button>
          </BorderGlow>
        ) : kind === "status-orb" ? (
          <StatusOrb state={state} size={size} speed={speed} paused={paused} />
        ) : (
          <MetallicButton active={!paused} onClick={() => setClicks(clicks + 1)}>
            Continue your work
          </MetallicButton>
        )}
      </div>
      <div className="effect-controls">
        <Switch label="Pause effect" checked={paused} onCheckedChange={setPaused} />
        {kind !== "metallic-button" && (
          <label className="ui-field">
            Effect speed: {speed}×
            <Input
              type="range"
              min={0.25}
              max={3}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
        )}
        {kind === "border-glow" && (
          <label className="ui-field">
            Glow strength: {strength}
            <Input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
            />
          </label>
        )}
        {kind === "status-orb" && (
          <>
            <Select
              label="Orb state"
              value={state}
              onChange={(e) => setState(e.target.value as OrbState)}
              options={["idle", "working", "listening", "complete", "error"].map((value) => ({
                value,
                label: value,
              }))}
            />
            <label className="ui-field">
              Orb size: {size}px
              <Input
                type="range"
                min={20}
                max={160}
                step={4}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </label>
          </>
        )}
      </div>
      {kind !== "status-orb" && (
        <p role="status">
          {clicks ? "Action completed " + clicks + " time(s)." : "Try the button above."}
        </p>
      )}
      <pre>
        <code>{code}</code>
      </pre>
      <Button
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setError("");
          } catch {
            setError("Clipboard unavailable. Select the prompt below to copy it.");
          }
        }}
      >
        {copied ? "Prompt copied" : "Copy effect prompt"}
      </Button>
      <details>
        <summary>Agent prompt and integration</summary>
        <pre>{prompt}</pre>
      </details>
      {error && <Alert title={error} variant="error" />}
    </div>
  );
}
