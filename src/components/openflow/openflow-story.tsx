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

type ChapterId = (typeof openflowStory.chapters)[number]["id"];

function formatClock(totalSeconds: number) {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function OpenFlowStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLDivElement>(null);
  const painTriggerRef = useRef<ScrollTrigger | null>(null);

  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const canvasTrackRef = useRef<HTMLDivElement>(null);
  const canvasTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activePainIndex, setActivePainIndex] = useState(0);
  const [activeStation, setActiveStation] = useState(0);
  const [isPinnedDesktop, setIsPinnedDesktop] = useState(false);

  const painCount = openflowStory.painPoints.length;
  const stationCount = openflowStory.buildChapters.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // 1. 全视口温和入场、指标滚动计数与章节进度跟踪（尊重减弱动画）
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(root.querySelectorAll(".openflow-hero-reveal"), {
          y: 26,
          opacity: 0,
          duration: 0.78,
          stagger: 0.09,
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
            duration: 0.85,
            stagger: 0.08,
            delay: 0.2,
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

    // 2. 桌面端核心 GSAP 沉浸式电影编排（首屏空间散景 + 暗房痛点剧场 + 横向无限画布漫游）
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

        // A. 首屏空间退景散开（向下滚动时四周悬浮画布节点向画外退散）
        const originSection =
          root.querySelector<HTMLElement>("#openflow-origin");
        if (originSection) {
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: originSection,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });

          heroTl
            .to(
              ".hero-float-tl",
              { x: -90, y: -56, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-tr",
              { x: 90, y: -56, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-bl",
              { x: -84, y: 48, opacity: 0.15, ease: "none" },
              0,
            )
            .to(
              ".hero-float-br",
              { x: 84, y: 48, opacity: 0.15, ease: "none" },
              0,
            )
            .to(".hero-wire", { opacity: 0, ease: "none" }, 0)
            .to(".hero-center-core", { y: -28, scale: 0.95, ease: "none" }, 0);
        }

        // B. 第一幕：暗房痛点固定舞台（含串行时钟实时跳动 + 4 幕连续切换）
        const painSection = painSectionRef.current;
        if (painSection) {
          const scrubBar =
            painSection.querySelector<HTMLElement>(".pain-scrub-bar");
          const clockEl = painSection.querySelector<HTMLElement>(".pain-clock");
          const serialBar1 =
            painSection.querySelector<HTMLElement>(".pain-serial-bar-1");
          const serialBar2 =
            painSection.querySelector<HTMLElement>(".pain-serial-bar-2");
          const serialBar3 =
            painSection.querySelector<HTMLElement>(".pain-serial-bar-3");
          const serialBar4 =
            painSection.querySelector<HTMLElement>(".pain-serial-bar-4");

          let prevPain = 0;
          painTriggerRef.current = ScrollTrigger.create({
            trigger: painSection,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
            onUpdate: (self) => {
              const p = self.progress;
              if (scrubBar) {
                scrubBar.style.transform = `scaleX(${p})`;
              }

              // 在第 1 幕痛点区间 (0 ~ 0.28) 内把滚动实时映射成 00:00 -> 19:48 串行耗时与逐条爬行进度
              const serialRatio = Math.min(1, p / 0.25);
              if (clockEl) {
                clockEl.textContent = formatClock(serialRatio * (19 * 60 + 48));
              }
              if (serialBar1) {
                serialBar1.style.transform = `scaleX(${Math.min(1, serialRatio * 2.2)})`;
              }
              if (serialBar2) {
                serialBar2.style.transform = `scaleX(${Math.max(0.08, Math.min(1, (serialRatio - 0.35) * 2))})`;
              }
              if (serialBar3) {
                serialBar3.style.transform = `scaleX(${Math.max(0.08, Math.min(1, (serialRatio - 0.65) * 2.2))})`;
              }
              if (serialBar4) {
                serialBar4.style.transform = `scaleX(${Math.max(0.06, Math.min(1, (serialRatio - 0.82) * 3))})`;
              }

              const next = Math.min(painCount - 1, Math.floor(p * painCount));
              if (next !== prevPain) {
                prevPain = next;
                setActivePainIndex(next);
              }
            },
          });
        }

        // C. 第二幕：横向无限画布镜头漫游（垂直滚动 -> 横向平推 4 站 + SVG 电缆绘制 + 6 路并发爆发）
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
              start: "top top",
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

          // 横向镜头平推
          panTl.to(
            track,
            {
              x: () => -getTravel(),
              ease: "none",
              duration: 1,
            },
            0,
          );

          // SVG 电缆脊线同步点亮贯穿 4 站
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

          // 镜头经过第 2 站时，6 路并行视频条同时爆发冲刺
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
  }, [painCount, stationCount]);

  function scrollToChapter(id: ChapterId) {
    const el = rootRef.current?.querySelector<HTMLElement>(`#openflow-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSelectPain(index: number) {
    const st = painTriggerRef.current;
    if (st && isPinnedDesktop) {
      const target =
        st.start + ((index + 0.35) / painCount) * (st.end - st.start);
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    setActivePainIndex(index);
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

      {/* 第 0 幕：全幅无限画布入口 */}
      <CanvasHero onStartStory={() => scrollToChapter("pain")} />

      {/* 第 1 幕：暗房痛点剧场（Pin + Scrub 物理动态演绎） */}
      <BottleneckStage
        sectionRef={painSectionRef}
        activeIndex={activePainIndex}
        isPinnedDesktop={isPinnedDesktop}
        onSelect={handleSelectPain}
      />

      {/* 第 2 幕：横向无限画布镜头漫游（Pin + Horizontal Pan + SVG 数据脊线点亮） */}
      <InfiniteCanvasTrack
        viewportRef={canvasViewportRef}
        trackRef={canvasTrackRef}
        activeStation={activeStation}
        isPinnedDesktop={isPinnedDesktop}
        onSelectStation={handleSelectStation}
      />

      {/* 第 3 幕：大字排印成果墙 + 响应式前后对比表 + 案例收束 */}
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

        {/* 建筑级纯排印量化成果带（用细线分隔取代平庸卡片阵列） */}
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

        {/* 使用前后核心环节对比表（遵循 modern-web-guidance: responsive-table @container 堆叠方案） */}
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
