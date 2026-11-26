import type { Metadata } from "next";
import Link from "next/link";
import { DualModeConsole } from "@/components/home/dual-mode-console";
import {
  ArrowIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/home/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";
import { featuredWorks } from "@/lib/works";

const description =
  "AI Agent 工程架构、全栈交互工具链与高可控 AIGC 视觉工作流代表作与实时交互实验台。";

export const metadata: Metadata = {
  title: `作品 · ${siteConfig.name}`,
  description,
};

export default function WorksPage() {
  return (
    <div className="glass-ambient-bg min-h-dvh text-fg">
      <main
        id="main"
        className="px-4 pt-24 pb-16 sm:px-6 md:px-8 md:pt-28 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          {/* 页面刊头 */}
          <header className="grid grid-cols-1 gap-5 pb-8 md:pb-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/85 px-3 py-1 font-mono text-micro font-medium tracking-wider text-accent uppercase backdrop-blur-md">
                <SparklesIcon className="size-3.5" />
                <span>WORKS &amp; INTERACTIVE LAB</span>
              </div>
              <h1 className="mt-3 text-[clamp(2.25rem,5.4vw,3.75rem)] leading-[1.04] font-bold tracking-[-0.035em] text-fg">
                作品与实验台
              </h1>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end lg:pb-1 lg:text-right">
              <p className="max-w-[46ch] text-body leading-relaxed text-fg-secondary">
                {description}
              </p>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 font-mono text-caption text-fg-muted tabular-nums backdrop-blur-md">
                <span className="font-semibold text-fg">
                  {featuredWorks.length} 项代表作
                </span>
                <span aria-hidden="true">·</span>
                <span>Coding × AIGC</span>
              </div>
            </div>
          </header>

          {/* 01 · 代表作毛玻璃卡片矩阵 */}
          <section
            aria-labelledby="featured-works-heading"
            className="border-t border-border/80 pt-8 md:pt-10"
          >
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2
                id="featured-works-heading"
                className="font-mono text-micro font-semibold tracking-widest text-fg-muted uppercase"
              >
                01 {"//"} SELECTED WORKS
              </h2>
              <span className="font-mono text-micro text-fg-muted">
                2026 EDITION
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {featuredWorks.map((work) => {
                const isCoding = work.kind === "coding";
                return (
                  <article
                    key={work.id}
                    className="glass-panel flex flex-col justify-between gap-5 rounded-[24px] p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-micro font-semibold ${
                            isCoding
                              ? "bg-signal-soft text-signal"
                              : "bg-accent-soft text-accent"
                          }`}
                        >
                          {work.index} · {work.kind.toUpperCase()}
                        </span>
                        <span className="font-mono text-micro text-fg-muted tabular-nums">
                          {work.year}
                        </span>
                      </div>

                      <h3 className="mt-3.5 text-title font-bold tracking-[-0.02em] text-fg">
                        {work.title}
                      </h3>
                      <p className="mt-1 text-caption font-medium text-fg-secondary">
                        {work.subtitle}
                      </p>
                      <p className="mt-2.5 text-label leading-relaxed text-fg-secondary">
                        {work.summary}
                      </p>

                      {/* 关键量化指标条 */}
                      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border/80 bg-surface-recessed/70 p-2.5">
                        {work.metrics.map((metric) => (
                          <div key={metric.label} className="min-w-0">
                            <dt className="truncate text-[10px] text-fg-muted">
                              {metric.label}
                            </dt>
                            <dd className="mt-0.5 truncate font-mono text-caption font-semibold text-fg tabular-nums">
                              {metric.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {/* 技术栈标签 */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {work.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-border/80 bg-surface-solid/80 px-2.5 py-0.5 font-mono text-micro text-fg-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/75 pt-3.5">
                      {work.isExternal ? (
                        <a
                          href={work.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-caption font-medium text-accent transition-opacity hover:opacity-80"
                        >
                          <span>{work.ctaLabel}</span>
                          <ArrowIcon className="size-3.5" />
                        </a>
                      ) : (
                        <Link
                          href={work.href}
                          className="group inline-flex min-h-11 items-center gap-1.5 font-mono text-caption font-medium text-accent transition-opacity hover:opacity-80"
                        >
                          <span>{work.ctaLabel}</span>
                          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 02 · 交互式双模控制台 */}
          <section
            aria-labelledby="dual-console-heading"
            className="mt-12 md:mt-16"
          >
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="dual-console-heading"
                className="font-mono text-micro font-semibold tracking-widest text-fg-muted uppercase"
              >
                02 {"//"} INTERACTIVE DUAL-MODE CONSOLE
              </h2>
              <span className="text-caption text-fg-muted">
                实时切换 Code 工程态与 AIGC 潜空间采样态
              </span>
            </div>

            <DualModeConsole />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
