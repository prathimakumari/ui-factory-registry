import type { MotionProfile } from "@/registry/schema";
export function motionSettings(profile: MotionProfile, reduced: boolean) {
  const disabled = reduced || profile.id === "no-motion";
  return {
    disabled,
    initial: disabled
      ? { opacity: 1, x: 0, y: 0, scale: 1 }
      : {
          opacity: 0,
          x: profile.pattern === "slide" ? profile.distance / 3 : 0,
          y: profile.pattern === "fade" ? 0 : profile.distance,
          scale: profile.scale,
        },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: disabled
      ? { duration: 0 }
      : profile.spring
        ? { type: "spring" as const, ...profile.spring }
        : { duration: profile.duration, ease: profile.ease },
    hover: disabled ? 1 : profile.hover,
    stagger: disabled ? 0 : profile.stagger,
  };
}
