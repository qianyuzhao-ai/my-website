"use client";

import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { EditorialWordmark } from "@/components/site/editorial-wordmark";
import { useLocale } from "@/components/site/locale-provider";
import { siteConfig } from "@/lib/site-config";

/** 系统主题图标：极简笔记本轮廓（对齐参考图） */
function SystemThemeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-[18px]"
    >
      <rect
        x="4"
        y="4.5"
        width="12"
        height="8.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.5 13.75h15a.75.75 0 0 1-.65 1.12H3.15a.75.75 0 0 1-.65-1.12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 浅色主题图标：实心圆点 + 8 道短射线太阳（对齐参考图） */
function LightThemeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-[18px]"
    >
      <circle cx="10" cy="10" r="2.75" fill="currentColor" />
      <path
        d="M10 3.25v1.5M10 15.25v1.5M3.25 10h1.5M15.25 10h1.5M5.23 5.23l1.06 1.06M13.71 13.71l1.06 1.06M14.77 5.23l-1.06 1.06M6.29 13.71l-1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 深色主题图标：细线弯月轮廓（对齐参考图） */
function DarkThemeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-[18px]"
    >
      <path
        d="M15.7 12.65a5.8 5.8 0 0 1-7.85-7.85A6.25 6.25 0 1 0 15.7 12.65Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  const { dict } = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (theme ?? "system") : "system";

  const themeOptions: readonly {
    value: "system" | "light" | "dark";
    label: string;
    icon: ReactNode;
  }[] = [
    {
      value: "system",
      label: dict.footer.themeSystem,
      icon: <SystemThemeIcon />,
    },
    {
      value: "light",
      label: dict.footer.themeLight,
      icon: <LightThemeIcon />,
    },
    {
      value: "dark",
      label: dict.footer.themeDark,
      icon: <DarkThemeIcon />,
    },
  ];

  return (
    <footer className="mt-16 overflow-hidden px-4 pt-0 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1120px] border-t border-border">
        {/* 标志性通栏双层图纸印刷视差字标（QIANYU.AI） */}
        <EditorialWordmark />

        {/* 最底部：版权信息 + 图标式颜色模式切换 */}
        <div className="flex flex-col gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-micro text-fg-muted">
            © {new Date().getFullYear()} {siteConfig.name} ·{" "}
            {dict.footer.copyright}
          </p>

          <fieldset className="inline-flex w-fit items-center gap-1.5">
            <legend className="sr-only">{dict.footer.themeLegend}</legend>
            {themeOptions.map((opt) => {
              const isSelected = activeTheme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  aria-label={opt.label}
                  title={opt.label}
                  aria-pressed={isSelected}
                  className={`inline-flex size-11 items-center justify-center rounded-full border border-transparent transition-colors sm:size-9 ${
                    isSelected
                      ? "bg-surface text-fg forced-colors:border-[Highlight]"
                      : "bg-transparent text-fg-muted hover:text-fg"
                  }`}
                >
                  {opt.icon}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>
    </footer>
  );
}
