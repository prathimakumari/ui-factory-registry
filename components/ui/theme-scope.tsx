"use client";
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
const ThemeContext = createContext<CSSProperties>({});
export function ThemeScope({
  variables,
  children,
}: {
  variables: CSSProperties;
  children: ReactNode;
}) {
  return <ThemeContext.Provider value={variables}>{children}</ThemeContext.Provider>;
}
export function useThemeVariables() {
  return useContext(ThemeContext);
}
