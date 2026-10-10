"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const options = [
  ["system", "跟随系统"],
  ["light", "Light"],
  ["dark", "Dark"],
] as const;

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <fieldset
      aria-label="预览主题"
      className="inline-flex self-start rounded-full border border-border p-0.5"
    >
      {options.map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={mounted && theme === value}
          disabled={!mounted}
          onClick={() => setTheme(value)}
          className="min-h-11 rounded-full px-3 text-caption font-medium text-fg-muted transition-colors disabled:cursor-wait aria-pressed:bg-surface aria-pressed:text-fg aria-pressed:shadow-[inset_0_0_0_1px_var(--border)] sm:min-h-8"
        >
          {label}
        </button>
      ))}
    </fieldset>
  );
}
