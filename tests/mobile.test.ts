import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { mobileScreens, resolveMobileDesign } from "../lib/mobile";
import {
  screenIds,
  initialMobileState,
  mobileReducer,
  cartTotal,
  signInError,
  checkoutError,
} from "../registry/mobile/state";

describe("shared mobile catalog and behavior", () => {
  it("resolves each registered screen and its default tokens", () => {
    expect(mobileScreens.map((s) => s.id)).toEqual([...screenIds]);
    for (const screen of mobileScreens)
      expect(
        resolveMobileDesign({
          screen: screen.id,
          style: screen.defaultStyle,
          theme: screen.defaultTheme,
          motion: screen.defaultMotion,
        }).screen.id,
      ).toBe(screen.id);
    expect(() => resolveMobileDesign({ screen: "mobile-unknown" })).toThrow();
    expect(() => resolveMobileDesign({ theme: "not-a-theme" })).toThrow();
  });
  it("keeps native flow and data synchronized with editable sources", () => {
    for (const file of ["data.json", "state.ts", "experience.tsx"])
      expect(readFileSync("mobile/generated/" + file, "utf8")).toBe(
        readFileSync("registry/mobile/" + file, "utf8"),
      );
  });
  it("adds variants, bounds quantity, removes items and computes a checkout total", () => {
    let state = initialMobileState("mobile-cart");
    expect(cartTotal(state.cart)).toBe(46);
    state = mobileReducer(state, {
      type: "add",
      productId: "bottle",
      finish: "Ocean",
      quantity: 2,
    });
    expect(cartTotal(state.cart)).toBe(102);
    state = mobileReducer(state, { type: "quantity", index: 0, delta: -1 });
    expect(cartTotal(state.cart)).toBe(74);
    expect(
      mobileReducer(state, { type: "add", productId: "unknown", finish: "Ocean", quantity: 1 }),
    ).toBe(state);
    expect(
      mobileReducer(state, {
        type: "add",
        productId: "bottle",
        finish: "Ocean",
        quantity: Infinity,
      }),
    ).toBe(state);
    state = mobileReducer(state, { type: "order" });
    expect(state.order).toBe(true);
    expect(state.cart).toEqual([]);
    expect(mobileReducer(state, { type: "order" })).toBe(state);
  });
  it("validates forms and empty input", () => {
    expect(signInError("bad", "password")).toMatch(/email/);
    expect(signInError("a@example.com", "short")).toMatch(/8/);
    expect(signInError("a@example.com", "demopassword")).toBe("");
    expect(checkoutError("", "a@example.com", "Sample street")).toMatch(/name/);
    expect(checkoutError("Alex", "bad", "Sample street")).toMatch(/email/);
    expect(checkoutError("Alex", "a@example.com", "")).toMatch(/address/);
    expect(checkoutError("Alex", "a@example.com", "Sample street")).toBe("");
    const state = initialMobileState();
    expect(mobileReducer(state, { type: "send", text: " " })).toBe(state);
    expect(mobileReducer(state, { type: "send", text: " Hello " }).messages.at(-1)?.text).toBe(
      "Hello",
    );
  });
  it("handles onboarding, back navigation, booking and reset", () => {
    let state = initialMobileState("mobile-onboarding");
    for (let i = 0; i < 3; i++) state = mobileReducer(state, { type: "next" });
    expect(state.screen).toBe("mobile-sign-in");
    state = mobileReducer(state, { type: "sign-in" });
    expect(state.signedIn).toBe(true);
    expect(mobileReducer(state, { type: "back" }).screen).toBe("mobile-sign-in");
    expect(
      mobileReducer(state, { type: "book", service: "bad", day: "Mon 12", time: "09:00" }),
    ).toBe(state);
    state = mobileReducer(state, { type: "book", service: "reset", day: "Mon 12", time: "09:00" });
    expect(state.booking).toContain("Mindful reset");
    expect(mobileReducer(state, { type: "reset" })).toEqual(initialMobileState("mobile-settings"));
  });
});
