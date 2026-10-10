"use client";
import type { CSSProperties, ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/** Decorative only: content and focus remain ordinary DOM elements. */
export function BorderGlow({
  children,
  active = true,
  speed = 1,
  strength = 0.6,
  className,
  style,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode;
  active?: boolean;
  speed?: number;
  strength?: number;
}) {
  return (
    <div
      {...props}
      className={cn("border-glow", className)}
      data-active={active}
      style={
        {
          "--effect-duration": 6 / Math.max(0.25, Math.min(3, speed)) + "s",
          "--effect-strength": Math.max(0, Math.min(1, strength)),
          ...style,
        } as CSSProperties
      }
    >
      <span className="effect-edge" aria-hidden="true" />
      <div className="border-glow-content">{children}</div>
    </div>
  );
}

export type OrbState = "idle" | "working" | "listening" | "complete" | "error";
export function StatusOrb({
  state = "working",
  size = 64,
  speed = 1,
  paused = false,
  label,
  className,
}: {
  state?: OrbState;
  size?: number;
  speed?: number;
  paused?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("status-orb-wrap", className)} role="status" aria-live="polite">
      <span
        aria-hidden="true"
        className={"status-orb orb-" + state}
        data-active={!paused && ["working", "listening"].includes(state)}
        style={
          {
            "--orb-size": Math.max(20, Math.min(160, size)) + "px",
            "--effect-duration": 4 / Math.max(0.25, Math.min(3, speed)) + "s",
          } as CSSProperties
        }
      >
        <span />
      </span>
      <span className="sr-only">
        {label ||
          (state === "complete"
            ? "Complete"
            : state === "error"
              ? "Something went wrong"
              : state === "idle"
                ? "Ready"
                : state === "listening"
                  ? "Listening"
                  : "Working")}
      </span>
    </span>
  );
}

export function MetallicButton({
  className,
  active = true,
  ...props
}: ComponentProps<typeof Button> & { active?: boolean }) {
  return <Button {...props} className={cn("metallic-button", className)} data-active={active} />;
}
