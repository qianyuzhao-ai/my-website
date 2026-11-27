"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon, ArrowRightIcon } from "@/components/home/icons";
import { featuredWorks, type WorkItem } from "@/lib/works";

gsap.registerPlugin(ScrollTrigger);

function AigcCompareStage({
  work,
}: {
  work: WorkItem & { aigcSpec: NonNullable<WorkItem["aigcSpec"]> };
}) {
  const [split, setSplit] = useState(58);
  const { aigcSpec } = work;
  const isAmber = aigcSpec.palette === "amber-obsidian";

  return (
    <div className="flex flex-col gap-3">
      {/* 外层不设 clip-path，保证键盘聚焦外框完整显示（遵循 modern-web-guidance: motion） */}
      <div className="relative h-60 w-full overflow-hidden rounded-xl border border-border bg-ink select-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus sm:h-72">
        {/* 底层：RENDER 最终成片层 */}
        <svg
          viewBox="0 0 600 340"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <defs>
            <linearGradient
              id={`render-bg-${work.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={isAmber ? "#24130f" : "#0b221c"} />
              <stop offset="52%" stopColor={isAmber ? "#6e2714" : "#124e3f"} />
              <stop offset="100%" stopColor="#090a0d" />
            </linearGradient>
            <radialGradient
              id={`render-glow-${work.id}`}
              cx="68%"
              cy="38%"
              r="52%"
            >
              <stop
                offset="0%"
                stopColor={isAmber ? "#ff7847" : "#34f5a6"}
                stopOpacity="0.88"
              />
              <stop
                offset="65%"
                stopColor={isAmber ? "#c23b18" : "#127353"}
                stopOpacity="0.22"
              />
              <stop offset="100%" stopColor="#090a0d" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="600" height="340" fill={`url(#render-bg-${work.id})`} />
          <rect
            width="600"
            height="340"
            fill={`url(#render-glow-${work.id})`}
          />
          <circle cx="396" cy="138" r="88" fill="#ffffff" fillOpacity="0.12" />
          <circle
            cx="396"
            cy="138"
            r="56"
            fill={isAmber ? "#ff9d76" : "#7ef7c4"}
            fillOpacity="0.34"
          />
          <path
            d="M48 286 C168 188, 274 246, 398 136 C462 78, 520 112, 568 68 L568 340 L48 340 Z"
            fill="#090a0d"
            fillOpacity="0.58"
          />
          <rect
            x="56"
            y="246"
            width="230"
            height="54"
            rx="8"
            fill="#090a0d"
            fillOpacity="0.68"
            stroke="#ffffff"
            strokeOpacity="0.18"
          />
          <text
            x="72"
            y="270"
            fill="#ffffff"
            fontSize="11"
            fontFamily="monospace"
            letterSpacing="1.5"
          >
            {aigcSpec.renderCaption}
          </text>
          <text
            x="72"
            y="288"
            fill="#d4d4d8"
            fontSize="10"
            fontFamily="monospace"
          >
            {aigcSpec.pipeline}
          </text>
        </svg>

        {/* 顶层（被裁切）：RAW 线框蓝图与景深骨架层 */}
        <div
          aria-hidden="true"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          className="pointer-events-none absolute inset-0 bg-surface-elevated"
        >
          <svg
            viewBox="0 0 600 340"
            aria-hidden="true"
            className="h-full w-full object-cover text-fg"
          >
            <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1">
              <line x1="0" y1="85" x2="600" y2="85" />
              <line x1="0" y1="170" x2="600" y2="170" />
              <line x1="0" y1="255" x2="600" y2="255" />
              <line x1="150" y1="0" x2="150" y2="340" />
              <line x1="300" y1="0" x2="300" y2="340" />
              <line x1="450" y1="0" x2="450" y2="340" />
            </g>
            <circle
              cx="396"
              cy="138"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeDasharray="5 5"
            />
            <circle
              cx="396"
              cy="138"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M48 286 C168 188, 274 246, 398 136 C462 78, 520 112, 568 68"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeDasharray="6 4"
            />
            <rect
              x="56"
              y="32"
              width="256"
              height="42"
              rx="6"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeOpacity="0.3"
            />
            <text
              x="70"
              y="57"
              fill="currentColor"
              fontSize="11"
              fontFamily="monospace"
            >
              {aigcSpec.blueprintCaption}
            </text>
          </svg>
        </div>

        {/* 分割标尺线与手柄视觉指示 */}
        <div
          aria-hidden="true"
          style={{ left: `${split}%` }}
          className="pointer-events-none absolute inset-y-0 z-10 -translate-x-1/2"
        >
          <div className="h-full w-0.5 bg-accent" />
          <div className="absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full border border-white/40 bg-accent font-mono text-micro font-bold text-white shadow-lg">
            ↔
          </div>
        </div>

        {/* 原生无障碍滑块输入：兼容触控拖拽、鼠标与键盘方向键 */}
        <input
          type="range"
          min={8}
          max={92}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label={`拖动对比 ${work.title} 的蓝图骨架与最终成片`}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      {/* Prompt 摘录条 */}
      <div className="rounded-lg border border-border bg-surface-elevated/60 px-3.5 py-2.5 font-mono text-micro text-fg-muted">
        <span className="font-semibold text-accent">PROMPT {"//"} </span>
        <span>{aigcSpec.promptExcerpt}</span>
      </div>
    </div>
  );
}

function CodePipelineStage({
  work,
}: {
  work: WorkItem & { codeSpec: NonNullable<WorkItem["codeSpec"]> };
}) {
  const [activeStep, setActiveStep] = useState(0);
  const { codeSpec } = work;

  return (
    <div className="lab-grid flex h-full flex-col justify-between rounded-xl border border-border bg-surface-elevated/50 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3.5 py-2.5 font-mono text-caption">
        <span className="truncate text-fg">$ {codeSpec.command}</span>
        <span className="shrink-0 rounded-full bg-signal-soft px-2 py-0.5 text-micro text-signal">
          PASS
        </span>
      </div>

      <div className="my-4 flex flex-col gap-2">
        {codeSpec.stages.map((item, idx) => {
          const isCurrent = idx === activeStep;
          return (
            <button
              key={item.step}
              type="button"
              onClick={() => setActiveStep(idx)}
              aria-pressed={isCurrent}
              className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                isCurrent
                  ? "border-accent bg-surface shadow-lg"
                  : "border-border bg-surface/70 hover:border-border-strong"
              }`}
            >
              <div className="min-w-0">
                <p className="font-mono text-caption font-semibold text-fg">
                  {item.step}
                </p>
                <p className="mt-0.5 text-caption text-fg-muted">
                  {item.detail}
                </p>
              </div>
              <span className="shrink-0 font-mono text-micro text-accent">
                {item.latency}
              </span>
            </button>
          );
        })}
      </div>

      <p className="font-mono text-micro text-fg-muted">
        点击任意编译阶段以检视执行链路指标 · ZERO RUNTIME OVERHEAD
      </p>
    </div>
  );
}

export function WorksShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", root);
      for (const card of cards) {
        gsap.from(card, {
          y: 32,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            once: true,
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="selected-works"
      aria-labelledby="works-heading"
      className="border-t border-border px-4 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* 章节眉题与大标题 */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-caption tracking-widest text-accent uppercase">
              ACT II {"//"} SELECTED BUILDS &amp; LATENT WORKS
            </p>
            <h2
              id="works-heading"
              className="mt-2 font-serif text-section font-bold tracking-tight"
            >
              造物展廊：代码骨架与生成影像
            </h2>
          </div>
          <p className="max-w-md text-label text-fg-muted">
            不堆砌静态截图——直接在下方滑动分镜对比轴或切换工程节点，体验从想法到产物的真实管线。
          </p>
        </div>

        {/* 作品卷宗列表 */}
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:gap-12">
          {featuredWorks.map((work) => (
            <article
              key={work.id}
              data-work-card
              className="grid grid-cols-1 gap-6 rounded-card-sm border border-border bg-surface p-5 sm:p-7 md:rounded-card lg:grid-cols-12 lg:gap-8 lg:p-9"
            >
              {/* 左侧信息说明 */}
              <div className="flex flex-col justify-between gap-6 lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-micro tracking-widest text-fg-muted uppercase">
                    <span>
                      NO.{work.index} · {work.categoryLabel}
                    </span>
                    <span>{work.year}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-display-sm font-bold tracking-tight text-fg">
                    {work.title}
                  </h3>
                  <p className="mt-1.5 text-body font-medium text-fg">
                    {work.subtitle}
                  </p>
                  <p className="mt-3 text-label text-fg-muted">
                    {work.summary}
                  </p>

                  {/* 关键指标组 */}
                  <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-border py-3.5">
                    {work.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="font-mono text-micro text-fg-muted">
                          {metric.label}
                        </dt>
                        <dd className="mt-0.5 font-mono text-label font-semibold text-fg">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex flex-col gap-4">
                  <ul
                    aria-label="技术栈与工具"
                    className="flex flex-wrap gap-1.5"
                  >
                    {work.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-border bg-surface-elevated px-3 py-1 font-mono text-micro text-fg"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  {work.href ? (
                    <div>
                      {work.isExternal ? (
                        <a
                          href={work.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-label font-medium text-bg transition-opacity hover:opacity-90"
                        >
                          <span>{work.ctaLabel}</span>
                          <ArrowIcon className="size-4" />
                        </a>
                      ) : (
                        <Link
                          href={work.href}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-label font-medium text-bg transition-opacity hover:opacity-90"
                        >
                          <span>{work.ctaLabel}</span>
                          <ArrowRightIcon className="size-4" />
                        </Link>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 右侧可交互舞台 */}
              <div className="lg:col-span-7">
                {work.aigcSpec ? (
                  <AigcCompareStage
                    work={{ ...work, aigcSpec: work.aigcSpec }}
                  />
                ) : null}
                {work.codeSpec ? (
                  <CodePipelineStage
                    work={{ ...work, codeSpec: work.codeSpec }}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
