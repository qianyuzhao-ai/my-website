"use client";

import { useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
const key = "starter-ui-theme";
let currentTheme: Theme = "system";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(key);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return currentTheme;
  }
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    currentTheme = readTheme();
    applyTheme(currentTheme);
    notify();
  };
  sync();
  media.addEventListener("change", sync);
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", sync);
    window.removeEventListener("storage", sync);
  };
}

function setTheme(theme: Theme) {
  currentTheme = theme;
  try {
    localStorage.setItem(key, theme);
  } catch {
    /* Keep the selection for this tab when storage is unavailable. */
  }
  applyTheme(theme);
  notify();
}

const options = [
  ["system", "跟随系统"],
  ["light", "Light"],
  ["dark", "Dark"],
] as const;

export function ThemeSwitch() {
  const theme = useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => "system" as Theme,
  );

  return (
    <fieldset
      aria-label="预览主题"
      className="inline-flex self-start rounded-full border border-border p-0.5"
    >
      {options.map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className="min-h-11 rounded-full px-3 text-caption font-medium text-fg-muted transition-colors aria-pressed:bg-surface aria-pressed:text-fg aria-pressed:shadow-[inset_0_0_0_1px_var(--border)] sm:min-h-8"
        >
          {label}
        </button>
      ))}
    </fieldset>
  );
}
