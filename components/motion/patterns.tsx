"use client";
import { motion, AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useFactoryMotion, Reveal } from "./primitives";
export function PageTransition({ pageKey, children }: { pageKey: string; children: ReactNode }) {
  const s = useFactoryMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={s.initial}
        animate={s.visible}
        exit={s.disabled ? {} : { opacity: 0 }}
        transition={s.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
export function HeroText({ children }: { children: ReactNode }) {
  return <Reveal className="hero-text-entrance">{children}</Reveal>;
}
export function StaggerList({ children }: { children: ReactNode[] }) {
  return (
    <div>
      {children.map((child, index) => (
        <Reveal key={index} index={index}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
export function NavigationIndicator({ id = "active-navigation" }: { id?: string }) {
  const s = useFactoryMotion();
  return (
    <motion.span
      aria-hidden="true"
      layoutId={s.disabled ? undefined : id}
      transition={s.transition}
      className="navigation-indicator"
    />
  );
}
export function MotionSurface({
  open,
  kind,
  children,
}: {
  open: boolean;
  kind: "dropdown" | "popover" | "modal" | "toast" | "mobile-nav";
  children: ReactNode;
}) {
  const s = useFactoryMotion();
  const initial = s.disabled
    ? s.visible
    : kind === "modal"
      ? { opacity: 0, scale: s.profile.scale, y: s.profile.distance / 2 }
      : kind === "mobile-nav"
        ? { opacity: 0, x: s.profile.distance, y: 0 }
        : s.initial;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={kind}
          initial={initial}
          animate={s.visible}
          exit={s.disabled ? {} : { opacity: 0 }}
          transition={s.transition}
          className={"motion-surface motion-" + kind}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function BackgroundEffect() {
  const s = useFactoryMotion();
  return (
    <motion.div
      aria-hidden="true"
      className="motion-background-effect"
      initial={s.disabled ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={s.transition}
    />
  );
}
