"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LanguageToggle, useLocale } from "@/components/site/locale-provider";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const { dict } = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (theme ?? "system") : "system";

  const themeOptions = [
    { value: "system", label: dict.footer.themeSystem },
    { value: "light", label: dict.footer.themeLight },
    { value: "dark", label: dict.footer.themeDark },
  ] as const;

  return (
    <footer className="mt-16 overflow-hidden px-4 pt-0 sm:px-6 md:px-10 lg:px-12">
      <div className="mx-auto max-w-[1120px] border-t border-border pt-12">
        {/* 4 列结构化链接矩阵 */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">
              {dict.footer.explore}
            </h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">
                  {dict.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/works" className="transition-colors hover:text-fg">
                  {dict.nav.works}
                </Link>
              </li>
              <li>
                <Link
                  href="/writing"
                  className="transition-colors hover:text-fg"
                >
                  {dict.nav.writing}
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-fg">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/island"
                  className="transition-colors hover:text-fg"
                >
                  {dict.nav.island}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">
              {dict.footer.topics}
            </h2>
            <ul className="flex flex-col gap-2 text-caption text-fg-muted">
              {dict.home.topicLinks.slice(0, 4).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">
              {dict.footer.projects}
            </h2>
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
                  {dict.nav.island}
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-caption font-semibold text-fg">
              {dict.footer.connect}
            </h2>
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

        {/* 版权与主题 / 语言双胶囊 */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-micro text-fg-muted">
            © {new Date().getFullYear()} {siteConfig.name} ·{" "}
            {dict.footer.copyright}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <fieldset className="inline-flex items-center gap-0.5 rounded-full bg-surface p-1">
              <legend className="sr-only">{dict.footer.themeLegend}</legend>
              {themeOptions.map((opt) => {
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

            <LanguageToggle variant="footer" />
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
