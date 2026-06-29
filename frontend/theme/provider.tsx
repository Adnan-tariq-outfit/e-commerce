"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "dark" | "light";
} | null>(null);

const KEY = "theme-preference";

const getSystem = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const apply = (theme: Theme) => {
  const resolved = theme === "system" ? getSystem() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"dark" | "light">("light");

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const initial =
      stored && ["dark", "light", "system"].includes(stored)
        ? stored
        : "system";
    setTheme(initial);
    setResolved(apply(initial));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => theme === "system" && setResolved(apply("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const set = (t: Theme) => {
    localStorage.setItem(KEY, t);
    setTheme(t);
    setResolved(apply(t));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: set, resolvedTheme: resolved }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
