"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/home/icons";
import { BottleneckStage } from "@/components/openflow/bottleneck-stage";
import { CanvasHero } from "@/components/openflow/canvas-hero";
import { DecisionStage } from "@/components/openflow/decision-stage";
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

        // 板块 03 上篇：无限画布对比图的 SVG 贝塞尔连线随进入视口依次绘制
        const decisionWires = Array.from(
          root.querySelectorAll<SVGPathElement>(".decision-canvas-wire"),
        );
        if (decisionWires.length > 0) {
          for (const wire of decisionWires) {
            const len = wire.getTotalLength();
            gsap.set(wire, {
              strokeDasharray: len,
              strokeDashoffset: len,
            });
          }
          gsap.to(decisionWires, {
            strokeDashoffset: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: decisionWires[0],
              start: "top 84%",
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

        // B. 板块 02：3D 等距平台炸裂 → 全屏 clip-path 黑白反色切幕 → 720° 机械死循环转盘
        const painSection = painSectionRef.current;
        if (painSection) {
          const scrubBar =
            painSection.querySelector<HTMLElement>(".pain-scrub-bar");
          const marqueeLeft =
            painSection.querySelector<HTMLElement>(".pain-marquee-left");
          const marqueeRight = painSection.querySelector<HTMLElement>(
            ".pain-marquee-right",
          );
          const isoSlabs = Array.from(
            painSection.querySelectorAll<HTMLElement>(".pain-iso-slab"),
          );
          const plumbLine =
            painSection.querySelector<HTMLElement>(".pain-plumb-line");
          const curtain = painSection.querySelector<HTMLElement>(
            ".pain-inversion-curtain",
          );
          const sheetFront =
            painSection.querySelector<HTMLElement>(".pain-sheet-front");
          const sheetMid =
            painSection.querySelector<HTMLElement>(".pain-sheet-mid");
          const sheetBack =
            painSection.querySelector<HTMLElement>(".pain-sheet-back");
          const formProgress = painSection.querySelector<HTMLElement>(
            ".pain-form-progress",
          );
          const blockedQueue = painSection.querySelector<HTMLElement>(
            ".pain-blocked-queue",
          );

          // 初始化：5 块板紧凑堆叠在等距 3D 视角，反色幕布藏在视口底边之下（clip-path: inset(100% 0% 0% 0%)）
          if (scrubBar) {
            gsap.set(scrubBar, { scaleX: 0 });
          }
          if (curtain) {
            gsap.set(curtain, { clipPath: "inset(100% 0% 0% 0%)" });
          }
          isoSlabs.forEach((slab, idx) => {
            gsap.set(slab, {
              y: (idx - 2) * 14,
              rotateX: 46,
              rotateY: -12,
              rotateZ: 10,
              scale: 0.96,
            });
          });
          if (plumbLine) {
            gsap.set(plumbLine, { scaleY: 0, transformOrigin: "top center" });
          }

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
            end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
            onUpdate: (self) => {
              const p = self.progress;
              if (scrubBar) {
                scrubBar.style.transform = `scaleX(${p})`;
              }

              // 1) 背景巨型空心字标双向剪切滑行
              if (marqueeLeft) {
                marqueeLeft.style.transform = `translate3d(${(-p * 320).toFixed(1)}px, 0, 0)`;
              }
              if (marqueeRight) {
                marqueeRight.style.transform = `translate3d(${(-96 + p * 320).toFixed(1)}px, 0, 0)`;
              }

              // 2) 第一幕 (0.00 ~ 0.44)：5 块 3D 等距建筑板随滚动物理炸裂展开；(0.44 ~ 0.54)：拍扁坍缩合一！
              const explodeRatio = Math.min(1, p / 0.38);
              const collapseRatio =
                p <= 0.42 ? 0 : Math.min(1, (p - 0.42) / 0.12);

              const spread = (14 + explodeRatio * 56) * (1 - collapseRatio);
              const rotX = 46 * (1 - collapseRatio);
              const rotY = -12 * (1 - collapseRatio);
              const rotZ = 10 * (1 - collapseRatio);
              const slabScale =
                0.96 + explodeRatio * 0.04 - collapseRatio * 0.14;

              isoSlabs.forEach((slab, idx) => {
                const offset = (idx - 2) * spread;
                const shiftX =
                  (idx - 2) * 14 * explodeRatio * (1 - collapseRatio);
                slab.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${offset.toFixed(1)}px, 0) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg) scale(${slabScale.toFixed(3)})`;
              });

              if (plumbLine) {
                const plumbScale = explodeRatio * (1 - collapseRatio);
                plumbLine.style.transform = `translateX(-50%) scaleY(${plumbScale.toFixed(3)})`;
              }

              // 3) 震撼转场 (0.45 ~ 0.57)：全屏黑白反色幕布自底向上一刀切开整屏！
              const wipeRatio =
                p <= 0.45 ? 0 : p >= 0.57 ? 1 : (p - 0.45) / 0.12;
              const easedWipe =
                wipeRatio < 0.5
                  ? 2 * wipeRatio * wipeRatio
                  : 1 - (-2 * wipeRatio + 2) ** 2 / 2;
              if (curtain) {
                const topInset = ((1 - easedWipe) * 100).toFixed(2);
                curtain.style.clipPath = `inset(${topInset}% 0% 0% 0%)`;
              }

              // 4) 第二幕 (0.56 ~ 1.00)：无限撕页式单表单叠层传送带——每轮跑完 01→05，主表单向上剥离飞走，下一张同款表单顶上！
              const r2 = Math.max(0, Math.min(1, (p - 0.56) / 0.44));
              const cycles = 3;
              const cycleFloat = r2 * cycles;
              const cycleFrac = cycleFloat % 1;
              const currentCycle = Math.min(cycles, Math.floor(cycleFloat) + 1);

              // 单轮节奏：0.00~0.80 依次推进 01→05 与进度条；0.80~1.00 主表单剥离飞出、中卡顶上！
              const peel =
                cycleFrac <= 0.8 ? 0 : Math.min(1, (cycleFrac - 0.8) / 0.2);

              if (sheetFront) {
                const liftY = -peel * 44;
                const tilt = -peel * 2.2;
                const scale = 1 - peel * 0.05;
                sheetFront.style.transform = `translate3d(0, ${liftY.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
                sheetFront.style.opacity = String(1 - peel * 0.88);
              }
              if (sheetMid) {
                const riseY = -peel * 12;
                const scale = 0.985 + peel * 0.015;
                sheetMid.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
              }
              if (sheetBack) {
                const riseY = -peel * 8;
                sheetBack.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0)`;
              }
              if (formProgress) {
                // 在第 4 步（0.48 ~ 0.68）快速拉满单条耗时条，第 5 步保持满格
                const barRatio =
                  cycleFrac < 0.45
                    ? 0.06
                    : cycleFrac > 0.68
                      ? 1
                      : 0.06 + ((cycleFrac - 0.45) / 0.23) * 0.94;
                formProgress.style.transform = `scaleX(${barRatio.toFixed(3)})`;
              }
              if (blockedQueue) {
                const nudge = Math.sin(cycleFrac * Math.PI * 2) * 3;
                blockedQueue.style.transform = `translate3d(${nudge.toFixed(1)}px, 0, 0)`;
              }

              // 5) 离散文本状态同步
              if (p < 0.52) {
                if (prevStage !== 0) {
                  prevStage = 0;
                  setActivePainStage(0);
                }
                const r1 = Math.max(0, Math.min(0.999, p / 0.44));
                const nextPlatform = Math.floor(r1 * platformCount);
                if (nextPlatform !== prevPlatform) {
                  prevPlatform = nextPlatform;
                  setActivePlatformIndex(nextPlatform);
                }
              } else {
                if (prevStage !== 1) {
                  prevStage = 1;
                  setActivePainStage(1);
                }
                const stepRatio = Math.min(0.999, cycleFrac / 0.82);
                const nextLoop = Math.floor(stepRatio * loopStepCount);

                if (nextLoop !== prevLoop) {
                  prevLoop = nextLoop;
                  setActiveLoopIndex(nextLoop);
                }
                if (currentCycle !== prevCycle) {
                  prevCycle = currentCycle;
                  setLoopCycleCount(currentCycle);
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

      {/* 板块 03 上篇：我是怎么做的——自己动手、竞品调研与「对话框 vs 无限画布」形态取舍 */}
      <DecisionStage />

      {/* 板块 03 下篇：横向无限画布镜头漫游（确定无限画布形态后的 4 阶段工程落地） */}
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
        className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:px-12"
      >
        <div data-reveal className="max-w-3xl">
          <h2
            id="outcome-heading"
            className="text-balance text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[32px]"
          >
            最后的成果：团队复用与业务交付
          </h2>
          <p className="mt-3 max-w-[58ch] text-label leading-[1.7] text-fg-secondary md:text-[15px]">
            从解决一线重复劳动出发，最终沉淀为 12
            人产运团队每日依赖的跨平台生产工作流，并直接支撑公司级大会展示案例。
          </p>
        </div>

        {/* 建筑级纯排印量化成果带 */}
        <div
          data-reveal
          className="mt-10 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
        >
          {openflowStory.impactMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col justify-between py-6 sm:px-6 sm:first:pl-0 lg:py-8 lg:last:pr-0"
            >
              <div>
                <p className="text-[clamp(2.4rem,4.5vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums">
                  {metric.count !== undefined ? (
                    <span data-count={metric.count}>{metric.count}</span>
                  ) : (
                    metric.staticValue
                  )}
                  {metric.suffix ?? ""}
                </p>
                <h3 className="mt-3.5 text-label font-semibold text-fg md:text-[15px]">
                  {metric.label}
                </h3>
              </div>
              <p className="mt-2 text-label leading-[1.65] text-fg-secondary">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>

        {/* 使用前后核心环节对比表（0px 锐利直角容器） */}
        <div data-reveal className="mt-14 md:mt-16">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3
              id="openflow-compare-caption"
              className="text-[20px] font-semibold tracking-[-0.02em] text-fg md:text-[24px]"
            >
              使用 OpenFlow 前后核心环节对比
            </h3>
            <span className="font-mono text-micro text-fg-muted">
              原有内部 API 平台 vs OpenFlow v1.4.0
            </span>
          </div>

          <section
            // biome-ignore lint/a11y/noNoninteractiveTabindex: 可滚动的响应式数据表容器需要支持键盘聚焦（遵循 modern-web-guidance: responsive-table）
            tabIndex={0}
            aria-labelledby="openflow-compare-caption"
            className="openflow-compare-wrap border border-border bg-bg"
          >
            <table className="openflow-compare-table w-full text-left">
              <caption className="sr-only">
                使用 OpenFlow 之前与使用 OpenFlow v1.4.0 之后的五个维度对比
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-border bg-surface px-4 py-3.5 font-mono text-micro font-medium tracking-wider text-fg-muted uppercase"
                  >
                    对比维度
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border bg-surface px-4 py-3.5 font-mono text-micro font-medium tracking-wider text-fg-muted uppercase"
                  >
                    使用 OpenFlow 之前
                  </th>
                  <th
                    scope="col"
                    className="border-b border-border bg-surface px-4 py-3.5 font-mono text-micro font-semibold tracking-wider text-fg uppercase"
                  >
                    使用 OpenFlow 之后（v1.4.0）
                  </th>
                </tr>
              </thead>
              <tbody>
                {openflowStory.comparisons.map((row) => (
                  <tr
                    key={row.dimension}
                    className="border-b border-border last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 align-top text-label font-semibold text-fg md:text-[15px]"
                    >
                      {row.dimension}
                    </th>
                    <td className="px-4 py-4 align-top text-label leading-[1.65] text-fg-secondary md:text-[15px]">
                      {row.before}
                    </td>
                    <td className="px-4 py-4 align-top text-label leading-[1.65] font-medium text-fg md:text-[15px]">
                      {row.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 合作 IP 视频播客成片案例入口（0px 平面块 + 9999px 胶囊返回） */}
        <div data-reveal className="mt-14 border-t border-border pt-10">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-fg md:text-[24px]">
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
                className="group flex min-h-22 items-center justify-between gap-4 border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-recessed sm:p-6"
              >
                <div>
                  <p className="text-case-title font-semibold text-fg underline-offset-4 group-hover:underline">
                    {item.title}
                  </p>
                  <p className="mt-1 text-caption text-fg-secondary">
                    {item.subtitle}
                  </p>
                </div>
                <ArrowIcon className="size-4 shrink-0 text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/works"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-bg px-5 text-caption font-medium text-fg transition-colors hover:bg-surface md:min-h-9"
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
