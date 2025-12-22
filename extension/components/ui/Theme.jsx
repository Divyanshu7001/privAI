import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  STORAGE_KEY,
  THEME_OPTIONS,
  THEME_STYLES,
} from "../shared/constants.js";

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored && THEME_OPTIONS.some((t) => t.id === stored)
        ? stored
        : "system";
    } catch {
      return "system";
    }
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    try {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } catch {
      // older browsers
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeStyles() {
  const { resolvedTheme } = useTheme();
  const key = resolvedTheme in THEME_STYLES ? resolvedTheme : "dark";
  return THEME_STYLES[key];
}

export function ThemeSelector({ open, onClose }) {
  const { theme, setTheme } = useTheme();

  if (!open) return null;

  return (
    <div className="absolute right-2 top-10 z-30 w-44 rounded-xl border border-white/10 bg-zinc-900/95 p-3 text-xs text-zinc-100 shadow-lg ring-1 ring-black/40">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-zinc-200">Theme</span>
        <button
          type="button"
          onClick={onClose}
          className="h-5 w-5 rounded-full text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] hover:bg-zinc-800/80 ${
              theme === option.id
                ? "bg-zinc-800/80 text-zinc-50"
                : "text-zinc-300"
            }`}
          >
            <span>{option.label}</span>
            {theme === option.id && <span className="text-[9px]">●</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
