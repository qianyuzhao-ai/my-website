import Link from "next/link";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  onStartStory: () => void;
};

/**
 * 第 0 幕：第一屏总览（项目名称 · 我的角色 · 项目目标）+ 独立缘起板块
 * 第一屏专注一眼说清「这是什么项目、我的角色是什么、要达成什么目标」，
 * 四周保留轻量画布节点与贝塞尔连线呼应 OpenFlow 气质，桌面端随滚动向画外散开。
 */
export function CanvasHero({ onStartStory }: Props) {
  const { hero } = openflowStory;

  return (
    <section
      id="openflow-origin"
      data-hero-screen
      aria-label="OpenFlow 项目总览"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-x-clip border-b border-border/80"
    >
      {/* 无限画布微点阵背景与柔和氛围光 */}
      <div
        aria-hidden="true"
        className="lab-grid pointer-events-none absolute inset-0 opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_28rem_at_50%_36%,rgb(29_108_246/0.12),transparent_68%),radial-gradient(36rem_22rem_at_82%_76%,rgb(14_165_114/0.09),transparent_65%)] dark:bg-[radial-gradient(48rem_28rem_at_50%_36%,rgb(79_148_255/0.18),transparent_68%),radial-gradient(36rem_22rem_at_82%_76%,rgb(52_211_153/0.12),transparent_65%)]"
      />

      {/* 桌面端连接四隅悬浮节点的 SVG 贝塞尔导流线 */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 820"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        <path
          className="hero-wire stroke-accent/30"
          d="M 245 190 C 420 190, 495 290, 610 315"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          className="hero-wire stroke-signal/35"
          d="M 1195 190 C 1020 190, 945 290, 830 315"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          className="hero-wire stroke-accent/25"
          d="M 230 685 C 400 685, 510 645, 620 640"
          strokeWidth="1.5"
        />
        <path
          className="hero-wire stroke-signal/30"
          d="M 1210 685 C 1040 685, 930 645, 820 640"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between px-4 pt-6 pb-8 sm:px-6 md:px-8 md:pt-8 md:pb-10">
        {/* 顶部返回与版本元信息 */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/works"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 bg-surface/85 px-4 py-2 text-caption font-medium text-fg-secondary backdrop-blur-md transition-colors hover:border-accent/45 hover:text-accent"
          >
            <span aria-hidden="true">←</span>
            <span>返回作品</span>
          </Link>
          <span className="font-mono text-caption text-fg-muted tabular-nums">
            {hero.version}
          </span>
        </div>

        {/* 第一屏核心主体：项目名称 + 我的角色 + 项目目标 */}
        <div className="relative my-auto py-6 lg:py-8">
          {/* 左上悬浮画布节点（避让中部文字与下方角色/目标区） */}
          <div
            aria-hidden="true"
            className="hero-float-tl glass-panel pointer-events-none absolute top-0 left-0 hidden w-52 rounded-2xl p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">脚本切割节点</span>
              <span className="text-accent">8 字/秒</span>
            </div>
            <p className="mt-1 text-micro leading-relaxed text-fg-secondary">
              自动切分 4–15s 片段
            </p>
          </div>

          {/* 右上悬浮画布节点 */}
          <div
            aria-hidden="true"
            className="hero-float-tr glass-panel pointer-events-none absolute top-0 right-0 hidden w-56 rounded-2xl p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">并发队列引擎</span>
              <span className="text-signal">1 → N</span>
            </div>
            <div className="mt-2 flex gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-signal" />
              <span className="h-1.5 flex-1 rounded-full bg-signal" />
              <span className="h-1.5 flex-1 rounded-full bg-accent" />
              <span className="h-1.5 flex-1 rounded-full bg-accent/60" />
            </div>
          </div>

          {/* 中央核心块：项目名称 */}
          <div className="hero-center-core relative z-10 mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="openflow-hero-reveal text-[clamp(3.4rem,9.5vw,6.75rem)] leading-[0.94] font-bold tracking-[-0.055em] text-fg">
                {hero.title}
              </h1>
              <p className="openflow-hero-reveal mx-auto mt-4 max-w-2xl text-balance text-[clamp(1.125rem,2.2vw,1.5rem)] leading-[1.38] font-medium tracking-[-0.015em] text-fg-secondary">
                {hero.subtitle}
              </p>
            </div>

            {/* 双栏结构化总览：我的角色 | 项目目标 */}
            <div className="openflow-hero-reveal glass-panel mt-8 grid grid-cols-1 divide-y divide-border/80 rounded-[26px] md:mt-10 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-5 sm:p-6 md:p-7">
                <p className="font-mono text-caption font-semibold text-accent">
                  {hero.role.label}
                </p>
                <h2 className="mt-2 text-title font-bold tracking-[-0.02em] text-fg">
                  {hero.role.headline}
                </h2>
                <p className="mt-2.5 text-label leading-relaxed text-fg-secondary">
                  {hero.role.detail}
                </p>
              </div>

              <div className="p-5 sm:p-6 md:p-7">
                <p className="font-mono text-caption font-semibold text-signal">
                  {hero.goal.label}
                </p>
                <h2 className="mt-2 text-title font-bold tracking-[-0.02em] text-fg">
                  {hero.goal.headline}
                </h2>
                <p className="mt-2.5 text-label leading-relaxed text-fg-secondary">
                  {hero.goal.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部行动按钮 + 宽屏两隅呼应节点 */}
        <div className="relative flex items-center justify-center pt-2">
          <div
            aria-hidden="true"
            className="hero-float-bl glass-panel pointer-events-none absolute bottom-0 left-0 hidden w-52 rounded-2xl px-3.5 py-2.5 xl:block"
          >
            <div className="flex items-center justify-between font-mono text-micro">
              <span className="font-semibold text-fg">@ 资产直连</span>
              <span className="text-accent">悬停预览</span>
            </div>
          </div>

          <div className="openflow-hero-reveal">
            <button
              type="button"
              onClick={onStartStory}
              className="ui-button"
              data-variant="primary"
              data-size="lg"
            >
              <span>向下进入项目叙事</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          <div
            aria-hidden="true"
            className="hero-float-br glass-panel pointer-events-none absolute right-0 bottom-0 hidden w-56 rounded-2xl px-3.5 py-2.5 xl:block"
          >
            <div className="flex items-center justify-between font-mono text-micro">
              <span className="font-semibold text-fg">SQLite 断连认领</span>
              <span className="text-signal tabular-nums">12 人复用</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
