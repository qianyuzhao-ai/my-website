"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

const THEME_OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export function SiteFooter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (theme ?? "system") : "system";

  return (
    <footer className="mt-16 overflow-hidden px-4 pt-0 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1120px] border-t border-border pt-12">
        {/* 4 列结构化链接矩阵（严格对齐 Figma EditorialFooter） */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">Explore</h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/works" className="transition-colors hover:text-fg">
                  Works
                </Link>
              </li>
              <li>
                <Link
                  href="/writing"
                  className="transition-colors hover:text-fg"
                >
                  Writing
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-fg">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/island"
                  className="transition-colors hover:text-fg"
                >
                  Sky Island 3D
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">Topics</h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              <li>
                <Link
                  href="/writing?tag=Agent"
                  className="transition-colors hover:text-fg"
                >
                  Agent Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/writing?tag=AIGC"
                  className="transition-colors hover:text-fg"
                >
                  AIGC Workflows
                </Link>
              </li>
              <li>
                <Link
                  href="/writing?tag=%E5%89%8D%E7%AB%AF"
                  className="transition-colors hover:text-fg"
                >
                  Full-Stack UI
                </Link>
              </li>
              <li>
                <Link
                  href="/writing?tag=%E8%AE%BE%E8%AE%A1%E6%B5%81%E7%A8%8B"
                  className="transition-colors hover:text-fg"
                >
                  Design Systems
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">Projects</h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              <li>
                <Link
                  href="/works/openflow"
                  className="transition-colors hover:text-fg"
                >
                  OpenFlow
                </Link>
              </li>
              <li>
                <Link
                  href="/writing/aigc-flow-retrospective"
                  className="transition-colors hover:text-fg"
                >
                  Latent Storyboard
                </Link>
              </li>
              <li>
                <Link
                  href="/writing/agent-design-workflow"
                  className="transition-colors hover:text-fg"
                >
                  Agentic Compiler
                </Link>
              </li>
              <li>
                <Link
                  href="/island"
                  className="transition-colors hover:text-fg"
                >
                  Sky Island 3D
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">Connect</h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              {siteConfig.socials.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-fg"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权与 System / Light / Dark 主题胶囊 */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-micro text-fg-muted">
            © {new Date().getFullYear()} {siteConfig.name} ·{" "}
            {siteConfig.location} · Built with Next.js
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <fieldset className="inline-flex items-center gap-0.5 rounded-full bg-surface p-1">
              <legend className="sr-only">主题模式</legend>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = activeTheme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    aria-pressed={isSelected}
                    className={`min-h-8 rounded-full px-3 text-micro transition-colors sm:min-h-7 ${
                      isSelected
                        ? "bg-bg font-semibold text-fg"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </fieldset>

            <span className="inline-flex h-8 items-center rounded-full border border-border px-3 text-micro font-medium text-fg-secondary">
              中文 / EN
            </span>
          </div>
        </div>

        {/* 标志性通栏空心描边字标（QIANYU.AI） */}
        <div aria-hidden="true" className="mt-8 pb-4 text-center">
          <p className="editorial-wordmark font-sans text-[clamp(3.2rem,11.6vw,9.75rem)] leading-[0.9] font-bold tracking-[-0.035em] whitespace-nowrap">
            QIANYU.AI
          </p>
        </div>
      </div>
    </footer>
  );
}
