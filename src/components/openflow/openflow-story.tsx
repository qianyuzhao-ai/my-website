"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/home/icons";
import { BottleneckStage } from "@/components/openflow/bottleneck-stage";
import { CanvasHero } from "@/components/openflow/canvas-hero";
import { InfiniteCanvasTrack } from "@/components/openflow/infinite-canvas-track";
import { openflowStory } from "@/lib/openflow-story";

export function OpenFlowStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLDivElement>(null);
  const painTriggerRef = useRef<ScrollTrigger | null>(null);

  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const canvasTrackRef = useRef<HTMLDivElement>(null);
  const canvasTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activePainStage, setActivePainStage] = useState(0);
  const [activePlatformIndex, setActivePlatformIndex] = useState(0);
  const [activeLoopIndex, setActiveLoopIndex] = useState(0);
  const [loopCycleCount, setLoopCycleCount] = useState(1);

  const [activeStation, setActiveStation] = useState(0);
  const [isPinnedDesktop, setIsPinnedDesktop] = useState(false);

  const platformCount = openflowStory.painStory.platforms.length;
  const loopStepCount = openflowStory.painStory.loopSteps.length;
  const stationCount = openflowStory.buildChapters.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // 1. 全视口温和入场与指标计数（尊重减弱动画）
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(root.querySelectorAll(".openflow-hero-reveal"), {
          y: 24,
          opacity: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });

        gsap.from(
          root.querySelectorAll(
            ".hero-float-tl, .hero-float-tr, .hero-float-bl, .hero-float-br",
          ),
          {
            scale: 0.92,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            delay: 0.18,
            ease: "power2.out",
            clearProps: "opacity",
          },
        );

        for (const el of root.querySelectorAll<HTMLElement>("[data-reveal]")) {
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          });
        }

        for (const counterEl of root.querySelectorAll<HTMLElement>(
          "[data-count]",
        )) {
          const target = Number(counterEl.dataset.count);
          const state = { value: 0 };
          gsap.to(state, {
            value: target,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: counterEl,
              start: "top 90%",
              once: true,
            },
            onUpdate: () => {
              counterEl.textContent = String(Math.round(state.value));
            },
          });
        }

        return () => {
          for (const counterEl of root.querySelectorAll<HTMLElement>(
            "[data-count]",
          )) {
            counterEl.textContent = counterEl.dataset.count ?? "";
          }
        };
      },
      root,
    );

    // 2. 桌面端核心 GSAP 沉浸式滚动编排（贴合 64px 顶栏固定）
    mm.add(
      {
        desktopMotion:
          "(min-width: 1024px) and (min-height: 660px) and (prefers-reduced-motion: no-preference)",
        fallback: "(min-width: 0px)",
      },
      (context) => {
        const enablePin = Boolean(context.conditions?.desktopMotion);
        setIsPinnedDesktop(enablePin);
        if (!enablePin) return;

        // A. 第一屏空间退景散开
        const heroScreen =
          root.querySelector<HTMLElement>("[data-hero-screen]");
        if (heroScreen) {
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroScreen,
              start: "top 64px",
              end: "bottom top",
              scrub: 0.6,
            },
          });

          heroTl
            .to(
              ".hero-float-tl",
              { x: -90, y: -48, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-tr",
              { x: 90, y: -48, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-bl",
              { x: -84, y: 42, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-br",
              { x: 84, y: 42, opacity: 0.15, ease: "none" },
              0,
            )
            .to(".hero-wire", { opacity: 0, ease: "none" }, 0)
            .to(".hero-center-core", { y: -24, scale: 0.96, ease: "none" }, 0);
        }

        // B. 板块 02：两幕真实业务痛点情景模拟器（Pin 在 64px 顶栏正下方）
        const painSection = painSectionRef.current;
        if (painSection) {
          const scrubBar =
            painSection.querySelector<HTMLElement>(".pain-scrub-bar");

          let prevStage = 0;
          let prevPlatform = 0;
          let prevLoop = 0;
          let prevCycle = 1;

          painTriggerRef.current = ScrollTrigger.create({
            trigger: painSection,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            start: "top 64px",
            end: () => `+=${Math.round(window.innerHeight * 2.8)}`,
            onUpdate: (self) => {
              const p = self.progress;
              if (scrubBar) {
                scrubBar.style.transform = `scaleX(${p})`;
              }

              // 前半段 (0 ~ 0.52)：情景一 · 5 个付费平台依次切标签搬运
              if (p < 0.52) {
                if (prevStage !== 0) {
                  prevStage = 0;
                  setActivePainStage(0);
                }
                const ratio1 = Math.min(0.999, p / 0.52);
                const nextPlatform = Math.floor(ratio1 * platformCount);
                if (nextPlatform !== prevPlatform) {
                  prevPlatform = nextPlatform;
                  setActivePlatformIndex(nextPlatform);
                }
              } else {
                // 后半段 (0.52 ~ 1.0)：情景二 · 公司统一 API 单线程死循环（滚动期间跑 3 整圈，直观感受无休止循环）
                if (prevStage !== 1) {
                  prevStage = 1;
                  setActivePainStage(1);
                }
                const ratio2 = Math.min(0.999, (p - 0.52) / 0.48);
                const totalSteps = loopStepCount * 3;
                const stepCursor = Math.floor(ratio2 * totalSteps);
                const nextLoop = stepCursor % loopStepCount;
                const nextCycle = Math.floor(stepCursor / loopStepCount) + 1;

                if (nextLoop !== prevLoop) {
                  prevLoop = nextLoop;
                  setActiveLoopIndex(nextLoop);
                }
                if (nextCycle !== prevCycle) {
                  prevCycle = nextCycle;
                  setLoopCycleCount(nextCycle);
                }
              }
            },
          });
        }

        // C. 板块 03：横向无限画布镜头漫游（Pin 在 64px 顶栏正下方）
        const viewport = canvasViewportRef.current;
        const track = canvasTrackRef.current;
        if (viewport && track) {
          const getTravel = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const spineGlow =
            track.querySelector<SVGPathElement>(".canvas-spine-glow");
          let spineLen = 0;
          if (spineGlow) {
            spineLen = spineGlow.getTotalLength();
            gsap.set(spineGlow, {
              strokeDasharray: spineLen,
              strokeDashoffset: spineLen,
            });
          }

          const panBar = viewport.querySelector<HTMLElement>(".canvas-pan-bar");
          const parallelBars = track.querySelectorAll<HTMLElement>(
            ".parallel-surge-bar",
          );
          gsap.set(parallelBars, { scaleX: 0.08 });

          let prevStation = 0;
          const panTl = gsap.timeline({
            scrollTrigger: {
              trigger: viewport,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              start: "top 64px",
              end: () =>
                `+=${Math.max(Math.round(window.innerHeight * 2.6), Math.round(getTravel() * 1.05))}`,
              onUpdate: (self) => {
                if (panBar) {
                  panBar.style.transform = `scaleX(${self.progress})`;
                }
                const next = Math.min(
                  stationCount - 1,
                  Math.floor(self.progress * stationCount),
                );
                if (next !== prevStation) {
                  prevStation = next;
                  setActiveStation(next);
                }
              },
            },
          });

          panTl.to(
            track,
            {
              x: () => -getTravel(),
              ease: "none",
              duration: 1,
            },
            0,
          );

          if (spineGlow && spineLen > 0) {
            panTl.to(
              spineGlow,
              {
                strokeDashoffset: 0,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (parallelBars.length > 0) {
            panTl.to(
              parallelBars,
              {
                scaleX: 1,
                stagger: 0.025,
                duration: 0.24,
                ease: "power2.out",
              },
              0.2,
            );
          }

          canvasTriggerRef.current = panTl.scrollTrigger ?? null;
        }

        return () => {
          painTriggerRef.current = null;
          canvasTriggerRef.current = null;
        };
      },
      root,
    );

    let mounted = true;
    void document.fonts.ready.then(() => {
      if (mounted) {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }
    });

    return () => {
      mounted = false;
      mm.revert();
    };
  }, [platformCount, loopStepCount, stationCount]);

  // 移动端或非 Pin 模式下，定时柔和演示当前情景内的步骤推进？不自动循环（尊重 WCAG 2.2.2），改为点击切换阶段即展示清晰代表态
  function handleSelectPainStage(index: number) {
    const st = painTriggerRef.current;
    if (st && isPinnedDesktop) {
      const targetProgress = index === 0 ? 0.25 : 0.72;
      const target = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      setActivePainStage(index);
      if (index === 0) {
        setActivePlatformIndex(platformCount - 1);
      } else {
        setActiveLoopIndex(3);
        setLoopCycleCount(3);
      }
    }
  }

  function handleSelectStation(index: number) {
    const st = canvasTriggerRef.current;
    if (st && isPinnedDesktop) {
      const ratio = stationCount > 1 ? index / (stationCount - 1) : 0;
      const target = st.start + ratio * (st.end - st.start);
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    setActiveStation(index);
  }

  return (
    <div ref={rootRef} className="relative">
      {/* 顶部纯 CSS 滚动进度细线（遵循 modern-web-guidance: motion） */}
      <div
        aria-hidden="true"
        className="reading-progress-bar fixed inset-x-0 top-0 z-50 h-0.5 bg-accent"
      />

      {/* 板块 01（第一屏）：项目名称 · 我的角色 · 项目目标 */}
      <CanvasHero
        onStartStory={() => {
          const el =
            rootRef.current?.querySelector<HTMLElement>("#openflow-pain");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {/* 板块 02：真实业务场景下的痛点（两幕情景故事模拟） */}
      <BottleneckStage
        sectionRef={painSectionRef}
        activeStageIndex={activePainStage}
        activePlatformIndex={activePlatformIndex}
        activeLoopIndex={activeLoopIndex}
        loopCycleCount={loopCycleCount}
        isPinnedDesktop={isPinnedDesktop}
        onSelectStage={handleSelectPainStage}
      />

      {/* 板块 03：横向无限画布镜头漫游（我是怎么做的） */}
      <InfiniteCanvasTrack
        viewportRef={canvasViewportRef}
        trackRef={canvasTrackRef}
        activeStation={activeStation}
        isPinnedDesktop={isPinnedDesktop}
        onSelectStation={handleSelectStation}
      />

      {/* 板块 04：大字排印成果墙 + 响应式前后对比表 + 案例收束 */}
      <section
        id="openflow-outcome"
        aria-labelledby="outcome-heading"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:px-8 md:py-28"
      >
        <div data-reveal className="max-w-3xl">
          <h2
            id="outcome-heading"
            className="text-balance text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.04em] text-fg"
          >
            最后的成果：团队复用与业务交付
          </h2>
          <p className="mt-4 max-w-[58ch] text-body leading-relaxed text-fg-secondary">
            从解决一线重复劳动出发，最终沉淀为 12
            人产运团队每日依赖的跨平台生产工作流，并直接支撑公司级大会展示案例。
          </p>
        </div>

        {/* 建筑级纯排印量化成果带 */}
        <div
          data-reveal
          className="mt-12 grid grid-cols-1 divide-y divide-border/80 border-y border-border/80 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
        >
          {openflowStory.impactMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col justify-between py-7 sm:px-6 sm:first:pl-0 lg:py-8 lg:last:pr-0"
            >
              <div>
                <p className="text-[clamp(2.75rem,5vw,4.25rem)] leading-none font-bold tracking-[-0.045em] text-fg tabular-nums">
                  {metric.count !== undefined ? (
                    <span data-count={metric.count}>{metric.count}</span>
                  ) : (
                    metric.staticValue
                  )}
                  {metric.suffix ?? ""}
                </p>
                <h3 className="mt-4 text-body font-semibold text-fg">
                  {metric.label}
                </h3>
              </div>
              <p className="mt-2.5 text-label leading-relaxed text-fg-secondary">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        {/* 使用前后核心环节对比表 */}
        <div data-reveal className="mt-16 md:mt-20">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h3
              id="openflow-compare-caption"
              className="text-title font-bold tracking-[-0.025em] text-fg"
            >
              使用 OpenFlow 前后核心环节对比
            </h3>
            <span className="text-caption text-fg-muted">
              原有内部 API 平台 vs OpenFlow v1.4.0
            </span>
          </div>

          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 可滚动的响应式数据表容器需要支持键盘聚焦（遵循 modern-web-guidance: responsive-table）
            tabIndex={0}
            aria-labelledby="openflow-compare-caption"
            className="openflow-compare-wrap glass-panel rounded-[24px] p-1 sm:p-2"
          >
            <table className="openflow-compare-table w-full text-left">
              <caption className="sr-only">
                使用 OpenFlow 之前与使用 OpenFlow v1.4.0 之后的五个维度对比
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-border/80 bg-surface-solid/95 px-4 py-3.5 text-caption font-semibold text-fg-muted"
                  >
                    对比维度
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border/80 bg-surface-solid/95 px-4 py-3.5 text-caption font-semibold text-fg-muted"
                  >
                    使用 OpenFlow 之前
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border/80 bg-surface-solid/95 px-4 py-3.5 text-caption font-semibold text-accent"
                  >
                    使用 OpenFlow 之后（v1.4.0）
                  </th>
                </tr>
              </thead>
              <tbody>
                {openflowStory.comparisons.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 align-top text-body font-semibold text-fg"
                    >
                      {row.dimension}
                    </th>
                    <td className="px-4 py-4 align-top text-body leading-relaxed text-fg-secondary">
                      {row.before}
                    </td>
                    <td className="px-4 py-4 align-top text-body leading-relaxed font-medium text-fg">
                      {row.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 合作 IP 视频播客成片案例入口 */}
        <div data-reveal className="mt-16 border-t border-border/80 pt-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-title font-bold tracking-[-0.025em] text-fg">
              代表交付成片
            </h3>
            <p className="text-caption text-fg-secondary">
              保障 9 人团队交付 8 个合作 IP 共 14
              期播客，标杆案例入选公司开发者大会与世界大会
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {openflowStory.showcaseLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel group flex min-h-24 items-center justify-between gap-4 rounded-[24px] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-accent/45 sm:p-6"
              >
                <div>
                  <p className="text-body font-semibold text-fg transition-colors group-hover:text-accent">
                    {item.title}
                  </p>
                  <p className="mt-1 text-caption text-fg-secondary">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowIcon className="size-4.5 shrink-0 text-fg-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </a>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/works"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 bg-surface/85 px-5 py-2.5 text-caption font-medium text-fg-secondary backdrop-blur-md transition-colors hover:border-accent/45 hover:text-accent"
            >
              <span aria-hidden="true">←</span>
              <span>返回作品列表</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
