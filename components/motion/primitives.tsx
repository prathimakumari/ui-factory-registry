"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  AnimatePresence,
  Reorder,
  LayoutGroup,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import type { MotionProfile } from "@/registry/schema";
import { motionSettings } from "@/lib/motion";
const Context = createContext<MotionProfile | null>(null);
export function MotionProvider({
  profile,
  children,
}: {
  profile: MotionProfile;
  children: ReactNode;
}) {
  return (
    <Context.Provider value={profile}>
      <MotionConfig reducedMotion="user" transition={{ duration: profile.duration }}>
        {children}
      </MotionConfig>
    </Context.Provider>
  );
}
export function useFactoryMotion() {
  const profile = useContext(Context);
  const reduced = useReducedMotion();
  if (!profile) throw new Error("MotionProvider is required.");
  return { profile, ...motionSettings(profile, !!reduced) };
}
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const s = useFactoryMotion();
  return (
    <motion.div
      className={className}
      initial={s.initial}
      animate={!s.profile.scroll || s.disabled ? s.visible : undefined}
      whileInView={s.profile.scroll && !s.disabled ? s.visible : undefined}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ ...s.transition, delay: index * s.stagger }}
    >
      {children}
    </motion.div>
  );
}
export function MotionCard({ children, className }: { children: ReactNode; className?: string }) {
  const s = useFactoryMotion();
  return (
    <motion.div
      className={className}
      whileHover={{ scale: s.hover }}
      whileFocus={{ scale: s.hover }}
      whileTap={{ scale: s.disabled ? 1 : 0.985 }}
      transition={s.transition}
    >
      {children}
    </motion.div>
  );
}
export function Presence({ show, children }: { show: boolean; children: ReactNode }) {
  const s = useFactoryMotion();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="presence"
          initial={s.initial}
          animate={s.visible}
          exit={s.disabled ? {} : { opacity: 0, y: -4 }}
          transition={s.transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const s = useFactoryMotion();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (s.disabled) return;
    const controls = animate(0, value, {
      duration: s.profile.duration,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, s.disabled, s.profile.duration]);
  return (
    <span aria-label={label + ": " + value}>
      <span aria-hidden="true">{display.toLocaleString("en-US")}</span>
    </span>
  );
}
export function ReorderList({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const s = useFactoryMotion();
  return (
    <Reorder.Group axis="y" values={items} onReorder={onChange}>
      {items.map((item, i) => (
        <Reorder.Item
          dragListener={!s.disabled}
          key={item}
          value={item}
          transition={s.transition}
          className="reorder-item"
        >
          <span>{item}</span>
          <button
            disabled={i === 0}
            onClick={() => {
              const next = [...items];
              [next[i - 1], next[i]] = [next[i], next[i - 1]];
              onChange(next);
            }}
          >
            Move up
          </button>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
export function MotionProgress({ value }: { value: number }) {
  const s = useFactoryMotion();
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Completion"
      className="motion-progress"
    >
      <motion.span initial={false} animate={{ scaleX: value / 100 }} transition={s.transition} />
    </div>
  );
}
export function ImageReveal({ children }: { children: ReactNode }) {
  return <Reveal className="image-reveal">{children}</Reveal>;
}
export function SharedLayout({ children }: { children: ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
export function Parallax({ children }: { children: ReactNode }) {
  const s = useFactoryMotion();
  const y = useMotionValue(0);
  const offset = useTransform(y, [0, 1], [0, s.disabled ? 0 : -s.profile.distance]);
  return (
    <motion.div
      onViewportEnter={() => {
        if (s.profile.pattern === "parallax") animate(y, 1, s.transition);
      }}
      style={{ y: offset }}
    >
      {children}
    </motion.div>
  );
}
