import Link from "next/link";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  onStartStory: () => void;
};

/**
 * 板块 01 · 第一屏总览（项目名称 · 我的角色 · 项目目标）
 * 严格遵循全站 Monochrome Architectural Editorial 视觉规范：
 * 纯黑白灰语义色 · 0px 锐利直角建筑容器 · 9999px 胶囊交互控件 · 1120px 编辑部版心。
 */
export function CanvasHero({ onStartStory }: Props) {
  const { hero } = openflowStory;

  return (
    <section
      id="openflow-origin"
      data-hero-screen
      aria-label="OpenFlow 项目总览"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-x-clip border-b border-border bg-bg text-fg"
    >
      {/* 建筑图纸微点阵底纹 */}
      <div
        aria-hidden="true"
        className="lab-grid pointer-events-none absolute inset-0 opacity-45"
      />

      {/* 桌面端连接四隅图纸节点的单色建筑导流线 */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 820"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        <path
          className="hero-wire"
          d="M 245 190 C 420 190, 495 290, 610 315"
          stroke="var(--lineart-muted)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          className="hero-wire"
          d="M 1195 190 C 1020 190, 945 290, 830 315"
          stroke="var(--lineart-muted)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          className="hero-wire"
          d="M 230 685 C 400 685, 510 645, 620 640"
          stroke="var(--lineart-muted)"
          strokeWidth="1"
        />
        <path
          className="hero-wire"
          d="M 1210 685 C 1040 685, 930 645, 820 640"
          stroke="var(--lineart-muted)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-between px-4 pt-6 pb-8 sm:px-6 md:px-10 md:pt-8 md:pb-10 lg:px-12">
        {/* 顶部返回胶囊与版本元信息 */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/works"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-bg px-4 py-2 text-caption font-medium text-fg transition-colors hover:bg-surface md:min-h-9"
          >
            <span aria-hidden="true">←</span>
            <span>返回作品</span>
          </Link>
          <span className="font-mono text-micro tracking-wider text-fg-muted uppercase tabular-nums">
            {hero.version}
          </span>
        </div>

        {/* 第一屏核心主体：项目名称 + 我的角色 + 项目目标 */}
        <div className="relative my-auto py-6 lg:py-8">
          {/* 左上悬浮建筑线框节点 */}
          <div
            aria-hidden="true"
            className="hero-float-tl pointer-events-none absolute top-0 left-0 hidden w-52 border border-border bg-bg p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">脚本切割节点</span>
              <span>8 字/秒</span>
            </div>
            <p className="mt-1 text-micro leading-relaxed text-fg-secondary">
              自动切分 4–15s 片段
            </p>
          </div>

          {/* 右上悬浮建筑线框节点 */}
          <div
            aria-hidden="true"
            className="hero-float-tr pointer-events-none absolute top-0 right-0 hidden w-56 border border-border bg-bg p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">并发队列引擎</span>
              <span className="text-fg">1 → N</span>
            </div>
            <div className="mt-2 flex gap-1">
              <span className="h-1 flex-1 bg-fg" />
              <span className="h-1 flex-1 bg-fg" />
              <span className="h-1 flex-1 bg-fg/55" />
              <span className="h-1 flex-1 bg-border-strong" />
            </div>
          </div>

          {/* 中央主角：项目名称 + 角色/目标直角编辑部卡片 */}
          <div className="hero-center-core relative z-10 mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="openflow-hero-reveal text-[clamp(3.25rem,9vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-fg">
                {hero.title}
              </h1>
              <p className="openflow-hero-reveal mx-auto mt-4 max-w-2xl text-balance text-[clamp(1.0625rem,2vw,1.375rem)] leading-[1.4] font-normal tracking-[-0.015em] text-fg-secondary">
                {hero.subtitle}
              </p>
            </div>

            {/* 0px 锐利直角双栏总览：我的角色 | 项目目标 */}
            <div className="openflow-hero-reveal mt-8 grid grid-cols-1 divide-y divide-border border border-border bg-bg md:mt-10 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="p-5 sm:p-6 md:p-7">
                <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                  ROLE {"//"} {hero.role.label}
                </p>
                <h2 className="mt-2.5 text-[20px] leading-[1.3] font-semibold tracking-[-0.02em] text-fg md:text-[22px]">
                  {hero.role.headline}
                </h2>
                <p className="mt-2.5 text-label leading-[1.7] text-fg-secondary">
                  {hero.role.detail}
                </p>
              </div>

              <div className="bg-surface p-5 sm:p-6 md:p-7">
                <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                  GOAL {"//"} {hero.goal.label}
                </p>
                <h2 className="mt-2.5 text-[20px] leading-[1.3] font-semibold tracking-[-0.02em] text-fg md:text-[22px]">
                  {hero.goal.headline}
                </h2>
                <p className="mt-2.5 text-label leading-[1.7] text-fg-secondary">
                  {hero.goal.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部行动胶囊 + 宽屏两隅建筑标注块 */}
        <div className="relative flex items-center justify-center pt-2">
          <div
            aria-hidden="true"
            className="hero-float-bl pointer-events-none absolute bottom-0 left-0 hidden w-52 border border-border bg-bg px-3.5 py-2.5 xl:block"
          >
            <div className="flex items-center justify-between font-mono text-micro">
              <span className="font-semibold text-fg">@ 资产直连</span>
              <span className="text-fg-muted">悬停预览</span>
            </div>
          </div>

          <div className="openflow-hero-reveal">
            <button
              type="button"
              onClick={onStartStory}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85"
            >
              <span>向下进入项目叙事</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          <div
            aria-hidden="true"
            className="hero-float-br pointer-events-none absolute right-0 bottom-0 hidden w-56 border border-border bg-bg px-3.5 py-2.5 xl:block"
          >
            <div className="flex items-center justify-between font-mono text-micro">
              <span className="font-semibold text-fg">SQLite 断连认领</span>
              <span className="text-fg-muted tabular-nums">12 人复用</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
