"use client";
import { useId } from "react";
import { MobileFlow, type MobileKit } from "@/registry/mobile/experience";
import type { ScreenId } from "@/registry/mobile/state";
import { Button } from "@/components/ui/button";

const kit: MobileKit = {
  Navigation: ({ items, active, onChange }) => (
    <nav className="mobile-tabs" aria-label="Demo app navigation">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={active === item.id ? "page" : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  ),
  Stack: ({ children }) => <div className="mobile-flow">{children}</div>,
  Card: ({ children }) => <section className="mobile-card">{children}</section>,
  Title: ({ children }) => <h2>{children}</h2>,
  Text: ({ children }) => <p>{children}</p>,
  Art: ({ children }) => (
    <div className="mobile-art" aria-hidden="true">
      {children}
    </div>
  ),
  Button: ({ children, onPress, selected, disabled }) => (
    <Button
      onClick={onPress}
      disabled={disabled}
      aria-pressed={selected}
      variant={selected ? "secondary" : "default"}
    >
      {children}
    </Button>
  ),
  Field: function Field({ label, value, onChange, secure, email }) {
    const id = useId();
    return (
      <label className="mobile-field" htmlFor={id}>
        {label}
        <input
          id={id}
          type={secure ? "password" : email ? "email" : "text"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={secure ? "new-password" : "off"}
          maxLength={label === "Message" ? 2000 : 200}
        />
      </label>
    );
  },
  Choice: ({ label, value, options, onChange }) => (
    <label className="mobile-field">
      {label}
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  ),
  Toggle: ({ label, value, onChange }) => (
    <label className="mobile-toggle">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={value} onChange={onChange} />
    </label>
  ),
  Status: ({ children, error }) => (
    <p className={error ? "mobile-error" : "mobile-status"} role={error ? "alert" : "status"}>
      {children}
    </p>
  ),
};
export function MobileExperience(props: {
  initialScreen?: ScreenId;
  dark: boolean;
  onDarkChange: () => void;
}) {
  return <MobileFlow kit={kit} {...props} />;
}
