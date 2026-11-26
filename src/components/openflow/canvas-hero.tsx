import Link from "next/link";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  onStartStory: () => void;
};

/**
 * 第 0 幕：全幅无限画布入口（Spatial Infinite-Canvas Portal）
 * 整屏即 OpenFlow 画布：四周悬浮 4 个真实工作流节点并由贝塞尔连线汇向中心大字，
 * 桌面端随向下滚动由 GSAP 驱动向四周退景散开，把读者拉入项目叙事。
 */
export function CanvasHero({ onStartStory }: Props) {
  return (
    <section
      id="openflow-origin"
      className="relative min-h-[92dvh] overflow-x-clip border-b border-border/80"
    >
      {/* 无限画布微点阵背景与柔和径向氛围 */}
      <div
        aria-hidden="true"
        className="lab-grid pointer-events-none absolute inset-0 opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_28rem_at_50%_42%,rgb(29_108_246/0.12),transparent_68%),radial-gradient(36rem_22rem_at_82%_72%,rgb(14_165_114/0.09),transparent_65%)] dark:bg-[radial-gradient(48rem_28rem_at_50%_42%,rgb(79_148_255/0.18),transparent_68%),radial-gradient(36rem_22rem_at_82%_72%,rgb(52_211_153/0.12),transparent_65%)]"
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
          className="hero-wire stroke-accent/35"
          d="M 270 210 C 440 210, 500 355, 620 390"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          className="hero-wire stroke-signal/40"
          d="M 1170 205 C 1000 205, 940 350, 820 390"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <path
          className="hero-wire stroke-accent/30"
          d="M 265 615 C 430 615, 515 470, 620 435"
          strokeWidth="1.5"
        />
        <path
          className="hero-wire stroke-signal/35"
          d="M 1175 615 C 1010 615, 925 470, 820 435"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative mx-auto flex min-h-[92dvh] max-w-6xl flex-col justify-between px-4 pt-24 pb-14 sm:px-6 md:px-8 md:pt-28 md:pb-16">
        {/* 顶部极简返回条 */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/works"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/80 bg-surface/85 px-4 py-2 text-caption font-medium text-fg-secondary backdrop-blur-md transition-colors hover:border-accent/45 hover:text-accent"
          >
            <span aria-hidden="true">←</span>
            <span>返回作品</span>
          </Link>
          <span className="font-mono text-caption text-fg-muted tabular-nums">
            {openflowStory.hero.version}
          </span>
        </div>

        {/* 中央空间剧场：悬浮真实画布节点环绕超大标题 */}
        <div className="relative my-auto py-10 lg:py-16">
          {/* 左上悬浮节点：脚本切割 */}
          <div
            aria-hidden="true"
            className="hero-float-tl glass-panel pointer-events-none absolute top-0 left-0 hidden w-56 rounded-2xl p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">脚本切割节点</span>
              <span className="text-accent">8 字/秒</span>
            </div>
            <p className="mt-1.5 text-micro leading-relaxed text-fg-secondary">
              自动切分 4–15s 片段 · 识别发言人
            </p>
          </div>

          {/* 右上悬浮节点：并发视频队列 */}
          <div
            aria-hidden="true"
            className="hero-float-tr glass-panel pointer-events-none absolute top-0 right-0 hidden w-60 rounded-2xl p-3.5 lg:block"
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
            <p className="mt-1.5 font-mono text-micro text-fg-secondary tabular-nums">
              Seedance 2.0 · 7/7 并行生成
            </p>
          </div>

          {/* 左下悬浮节点：@资产直连 */}
          <div
            aria-hidden="true"
            className="hero-float-bl glass-panel pointer-events-none absolute bottom-0 left-2 hidden w-56 rounded-2xl p-3.5 lg:block"
          >
            <div className="font-mono text-micro font-semibold text-fg">
              @ 资产直连引用
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-micro">
              <span className="rounded bg-accent-soft px-1.5 py-0.5 text-accent">
                @双人画面.jpg
              </span>
              <span className="rounded bg-signal-soft px-1.5 py-0.5 text-signal">
                @刘飞.wav
              </span>
            </div>
          </div>

          {/* 右下悬浮节点：生成统计与断连认领 */}
          <div
            aria-hidden="true"
            className="hero-float-br glass-panel pointer-events-none absolute right-2 bottom-0 hidden w-60 rounded-2xl p-3.5 lg:block"
          >
            <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">SQLite 持久认领</span>
              <span className="text-signal tabular-nums">1028s</span>
            </div>
            <p className="mt-1.5 text-micro leading-relaxed text-fg-secondary">
              request_id 指纹轮询 · 关页重启不丢成片
            </p>
          </div>

          {/* 中央主角标题 */}
          <div className="hero-center-core relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="openflow-hero-reveal text-[clamp(3.6rem,11vw,7.75rem)] leading-[0.92] font-bold tracking-[-0.055em] text-fg">
              {openflowStory.hero.title}
            </h1>
            <p className="openflow-hero-reveal mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.25rem,2.6vw,1.75rem)] leading-[1.35] font-semibold tracking-[-0.02em] text-fg">
              {openflowStory.hero.subtitle}
            </p>
            <p className="openflow-hero-reveal mx-auto mt-4 max-w-[58ch] text-balance text-body leading-relaxed text-fg-secondary">
              {openflowStory.hero.lead}
            </p>

            <div className="openflow-hero-reveal mt-8 flex justify-center">
              <button
                type="button"
                onClick={onStartStory}
                className="ui-button"
                data-variant="primary"
                data-size="lg"
              >
                <span>进入画布叙事</span>
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* 底部缘起一句定调：无边框纯排版衔接第一幕 */}
        <div
          data-reveal
          className="grid grid-cols-1 gap-4 border-t border-border/80 pt-7 lg:grid-cols-12 lg:items-baseline"
        >
          <h2 className="text-title font-bold tracking-[-0.025em] text-fg lg:col-span-4">
            {openflowStory.origin.heading}
          </h2>
          <p className="max-w-[65ch] text-body leading-relaxed text-fg-secondary lg:col-span-8">
            {openflowStory.origin.lead} {openflowStory.origin.premise}
          </p>
        </div>
      </div>
    </section>
  );
}
