import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@/components/home/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";

const description =
  "AI Agent 工程架构、全栈交互工具链与高可控 AIGC 视觉工作流代表作与实时交互实验台。";

export const metadata: Metadata = {
  title: `作品 · ${siteConfig.name}`,
  description,
};

export default function WorksPage() {
  return (
    <div className="glass-ambient-bg flex min-h-dvh flex-col text-fg">
      <main
        id="main"
        className="flex-1 px-4 pt-24 pb-16 sm:px-6 md:px-8 md:pt-28 md:pb-24"
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
                <span className="font-semibold text-fg">OpenFlow</span>
                <span aria-hidden="true">·</span>
                <span>Featured Project</span>
              </div>
            </div>
          </header>

          {/* 01 · OpenFlow 子页面入口（占位） */}
          <section
            aria-labelledby="featured-openflow-heading"
            className="border-t border-border/80 pt-8 md:pt-10"
          >
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2
                id="featured-openflow-heading"
                className="font-mono text-micro font-semibold tracking-widest text-fg-muted uppercase"
              >
                01 {"//"} FEATURED PROJECT
              </h2>
              <span className="font-mono text-micro text-fg-muted">
                OPENFLOW
              </span>
            </div>

            <Link
              href="/works/openflow"
              className="glass-panel group block rounded-[28px] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 sm:p-7 md:p-8"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-8">
                {/* 左侧信息占位 */}
                <div className="flex flex-col justify-between gap-5 lg:col-span-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-micro font-semibold text-accent">
                        01 · OPENFLOW
                      </span>
                      <span className="rounded-full border border-border/80 bg-surface-recessed/80 px-2.5 py-0.5 font-mono text-micro text-fg-muted">
                        PLACEHOLDER
                      </span>
                    </div>

                    <h3 className="mt-4 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] font-bold tracking-[-0.03em] text-fg">
                      OpenFlow
                    </h3>

                    <p className="mt-2 text-body font-medium text-fg-secondary">
                      OpenFlow 项目展示子页入口（副标题占位）
                    </p>

                    <p className="mt-3 max-w-[52ch] text-label leading-relaxed text-fg-muted">
                      此处用于展示 OpenFlow
                      的核心简介、亮点信息与封面视觉，目前为结构占位，后续将替换为完整项目内容。
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Tag 01", "Tag 02", "Tag 03"].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-dashed border-border-strong/70 bg-surface-recessed/60 px-3 py-1 font-mono text-micro text-fg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/75 pt-4">
                    <span className="inline-flex min-h-11 items-center gap-2 font-mono text-caption font-semibold text-accent transition-opacity group-hover:opacity-85">
                      <span>进入 OpenFlow 页面</span>
                      <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>

                {/* 右侧视觉封面占位 */}
                <div className="lg:col-span-6">
                  <div className="lab-grid relative flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-border-strong/80 bg-surface-recessed/70 p-6 text-center">
                    <span className="rounded-full border border-border/80 bg-surface/90 px-3 py-1 font-mono text-micro font-medium text-fg-secondary backdrop-blur-md">
                      OPENFLOW PREVIEW PLACEHOLDER
                    </span>
                    <p className="mt-3 max-w-[30ch] text-caption text-fg-muted">
                      主视觉封面 / 交互预览占位区（16:10）
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
