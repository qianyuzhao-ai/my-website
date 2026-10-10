"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BentoCard } from "@/components/home/bento-card";
import { MoonIcon, SunIcon } from "@/components/home/icons";

export function ThemeCard() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <BentoCard className="bg-surface">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        disabled={!mounted}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex size-full min-h-[110px] items-center justify-between rounded-[inherit] px-6 text-left disabled:cursor-wait md:justify-center md:px-0"
      >
        <span className="text-label font-medium md:sr-only">
          Appearance<span className="sr-only">：深色模式</span>
        </span>
        {/* 位置与图标由 .dark 类驱动，首屏无需等待客户端主题状态 */}
        <span
          aria-hidden="true"
          className="relative h-12 w-20 shrink-0 rounded-full bg-toggle-track"
        >
          <span className="toggle-knob absolute top-1.5 left-1.5 flex size-9 items-center justify-center rounded-full bg-ink text-brand-yellow dark:translate-x-8">
            <MoonIcon className="size-4 dark:hidden" />
            <SunIcon className="hidden size-6 dark:block" />
          </span>
        </span>
      </button>
    </BentoCard>
  );
}
