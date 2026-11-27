import type { RefObject } from "react";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  activeStation: number;
  isPinnedDesktop: boolean;
  onSelectStation: (index: number) => void;
};

/**
 * 板块 03 下篇 / 研发与 Agent 协作横向画布漫游（Monochrome Architectural Editorial）
 * 垂直滚动驱动横向平推 4 座研发工程站：
 * 01 全栈技术栈与 Electron 架构 → 02 我与 Claude Code 协作方法 → 03 核心并发与播客闭环落地 → 04 真实踩坑与联合排障
 */
export function InfiniteCanvasTrack({
  viewportRef,
  trackRef,
  activeStation,
  isPinnedDesktop,
  onSelectStation,
}: Props) {
  const { engineeringStory, buildChapters: stations } = openflowStory;

  return (
    <section
      id="openflow-build"
      aria-labelledby="build-heading"
      className="relative overflow-x-clip border-b border-border bg-bg text-fg"
    >
      {/* 建筑图纸微点阵底纹 */}
      <div
        aria-hidden="true"
        className="lab-grid pointer-events-none absolute inset-0 opacity-35"
      />

      <div
        ref={viewportRef}
        className="relative flex flex-col justify-between py-12 lg:min-h-[calc(100dvh-4rem)] lg:py-8"
      >
        {/* 顶栏固定画布坐标与标题 */}
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                ENGINEERING {"//"} TECH STACK &amp; AGENT COLLABORATION
              </p>
              <h2
                id="build-heading"
                className="mt-1.5 text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[32px]"
              >
                {engineeringStory.heading}
              </h2>
              <p className="mt-2 max-w-2xl text-balance text-label leading-relaxed text-fg-secondary md:text-[15px]">
                {engineeringStory.lead}
              </p>
            </div>
            <div className="font-mono text-micro tracking-wider text-fg-muted uppercase tabular-nums">
              STATION {String(activeStation + 1).padStart(2, "0")} /{" "}
              {String(stations.length).padStart(2, "0")}
            </div>
          </div>

          {/* 4 站胶囊跳点导航 */}
          <div
            role="tablist"
            aria-label="研发与协作阶段"
            className="mt-4 flex flex-wrap gap-2"
          >
            {stations.map((station, idx) => {
              const selected = idx === activeStation;
              return (
                <button
                  key={station.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onSelectStation(idx)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-1.5 text-caption font-medium transition-colors ${
                    selected
                      ? "border-ink bg-ink text-ink-fg"
                      : "border-border-strong bg-bg text-fg-secondary hover:border-fg hover:text-fg"
                  }`}
                >
                  <span className="font-mono text-micro opacity-75">
                    {station.index}
                  </span>
                  <span>{station.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 横向无限画布轨道 */}
        <div className="relative mt-6 overflow-hidden lg:my-auto lg:mt-5">
          <div
            ref={trackRef}
            className="canvas-horizontal-track relative flex flex-col gap-6 px-4 sm:px-6 md:px-10 lg:w-max lg:flex-row lg:items-stretch lg:gap-10 lg:px-[max(3rem,calc((100vw-1120px)/2))]"
          >
            {/* 桌面端贯穿全部 4 座站点的单色 SVG 建筑脊线 */}
            <svg
              aria-hidden="true"
              viewBox="0 0 3600 120"
              fill="none"
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-1/2 left-0 hidden h-28 w-full -translate-y-1/2 lg:block"
            >
              <path
                d="M 40 60 C 320 60, 420 20, 760 60 C 1120 100, 1320 20, 1740 60 C 2160 100, 2400 20, 2820 60 C 3150 90, 3360 60, 3560 60"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                className="canvas-spine-glow"
                d="M 40 60 C 320 60, 420 20, 760 60 C 1120 100, 1320 20, 1740 60 C 2160 100, 2400 20, 2820 60 C 3150 90, 3360 60, 3560 60"
                stroke="var(--lineart-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* 站点 01：用了什么技术栈（4 层全栈架构 + 双端发布产物） */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    01 {"//"} {stations[0].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[25px]">
                    {stations[0].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[0].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.62] text-fg-secondary">
                    {stations[0].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-mono text-fg-muted"
                        >
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 右侧：四层技术栈规格表 + GitHub Releases 双端产物 */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="divide-y divide-border border border-border bg-surface">
                    {engineeringStory.techLayers.map((row) => (
                      <div
                        key={row.layer}
                        className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-12 sm:items-baseline sm:gap-3"
                      >
                        <span className="font-mono text-micro tracking-wider text-fg-muted sm:col-span-3">
                          {row.layer}
                        </span>
                        <div className="sm:col-span-9">
                          <div className="font-mono text-caption font-semibold text-fg">
                            {row.stack}
                          </div>
                          <div className="mt-0.5 text-micro text-fg-secondary">
                            {row.note}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-border bg-surface px-4 py-3 font-mono text-micro tabular-nums">
                    <div className="flex items-center justify-between text-fg-muted">
                      <span>GITHUB ACTIONS 自动构建产物（v1.4.0）</span>
                      <span className="text-fg">双击即装</span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                      {openflowStory.releaseArtifacts.map((asset) => (
                        <div
                          key={asset.name}
                          className="border border-border bg-bg px-2.5 py-1.5"
                        >
                          <div className="truncate font-semibold text-fg">
                            {asset.target}
                          </div>
                          <div className="text-fg-muted">{asset.size}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 02：我是怎么和 AI Agent（Claude Code）协作的 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border-strong bg-bg p-6 sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    02 {"//"} {stations[1].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[25px]">
                    {stations[1].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[1].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.62] text-fg-secondary">
                    {stations[1].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-mono text-fg-muted"
                        >
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 右侧：人 × Coding Agent 清晰分工矩阵 + v1.0 → v1.4 演进轨 */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <div className="bg-bg p-4">
                      <div className="font-mono text-micro font-semibold tracking-wider text-fg uppercase">
                        HUMAN {"//"}{" "}
                        {engineeringStory.collaborationSplit.humanTitle}
                      </div>
                      <ul className="mt-3 space-y-2 text-micro leading-relaxed text-fg-secondary">
                        {engineeringStory.collaborationSplit.humanItems.map(
                          (item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="font-mono text-fg"
                              >
                                +
                              </span>
                              <span>{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="bg-ink p-4 text-ink-fg">
                      <div className="font-mono text-micro font-semibold tracking-wider text-ink-fg uppercase">
                        AGENT {"//"}{" "}
                        {engineeringStory.collaborationSplit.agentTitle}
                      </div>
                      <ul className="mt-3 space-y-2 text-micro leading-relaxed text-ink-fg/80">
                        {engineeringStory.collaborationSplit.agentItems.map(
                          (item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="font-mono text-ink-fg"
                              >
                                →
                              </span>
                              <span>{item}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* v1.0 → v1.4 迭代里程碑条 */}
                  <div className="grid grid-cols-2 divide-x divide-y divide-border border border-border bg-surface font-mono text-micro sm:grid-cols-4 sm:divide-y-0">
                    {engineeringStory.collaborationSplit.milestones.map((m) => (
                      <div key={m.ver} className="p-3">
                        <div className="font-semibold text-fg">{m.ver}</div>
                        <div className="mt-1 leading-snug text-fg-secondary">
                          {m.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 03：核心功能落地——1 → N 并发爆发 + 播客分镜与统计 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    03 {"//"} {stations[2].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[25px]">
                    {stations[2].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[2].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.62] text-fg-secondary">
                    {stations[2].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-mono text-fg-muted"
                        >
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 lg:col-span-7">
                  <div className="border border-border bg-surface p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro">
                      <span className="font-semibold text-fg">
                        @ 资产直连 → 1 次 N 条并发入队
                      </span>
                      <span className="text-fg-muted">6 路并行生成</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-micro tabular-nums sm:grid-cols-3">
                      {[
                        { seg: "Seg 01", status: "可用", tone: "bg-fg" },
                        { seg: "Seg 02", status: "可用", tone: "bg-fg" },
                        {
                          seg: "Seg 03",
                          status: "待定·重绘",
                          tone: "bg-fg-secondary",
                        },
                        { seg: "Seg 04", status: "可用", tone: "bg-fg" },
                        {
                          seg: "Seg 05",
                          status: "废弃·留档",
                          tone: "bg-border-strong",
                        },
                        { seg: "Seg 06", status: "可用", tone: "bg-fg" },
                      ].map((lane) => (
                        <div
                          key={lane.seg}
                          className="border border-border bg-bg p-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-fg">
                              {lane.seg}
                            </span>
                            <span className="truncate text-fg-muted">
                              {lane.status}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden bg-surface-recessed">
                            <div
                              className={`parallel-surge-bar h-full origin-left ${lane.tone}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 真实画布统计面板快照 */}
                  <div className="grid grid-cols-3 divide-x divide-border border border-border bg-surface font-mono tabular-nums">
                    <div className="p-3">
                      <div className="text-micro text-fg-muted">生成次数</div>
                      <div className="mt-1 text-title font-bold text-fg">
                        106
                      </div>
                      <div className="text-micro text-fg-secondary">
                        成功 102 · 失败 4
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-micro text-fg-muted">视频总秒数</div>
                      <div className="mt-1 text-title font-bold text-fg">
                        1028s
                      </div>
                      <div className="text-micro text-fg-secondary">
                        一键复制核算表
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-micro text-fg-muted">画布 Agent</div>
                      <div className="mt-1 text-title font-bold text-fg">
                        Auto
                      </div>
                      <div className="text-micro text-fg-secondary">
                        自然语言编排链路
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 04：真实踩坑与人机联合排障 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    04 {"//"} {stations[3].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[25px]">
                    {stations[3].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[3].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.62] text-fg-secondary">
                    {stations[3].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="font-mono text-fg-muted"
                        >
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 lg:col-span-7">
                  <div className="border border-border bg-surface p-4 font-mono text-micro">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-fg">
                      <span className="font-semibold">
                        长连接断连「结果找回」机制
                      </span>
                      <span className="text-fg-muted">超时拉长至 30 min</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex-1 border border-border bg-bg p-2.5 text-fg-secondary">
                        SQLite 持久化 request_id
                      </div>
                      <span className="hidden text-fg-muted sm:inline">→</span>
                      <div className="flex-1 border border-border bg-bg p-2.5 text-fg-secondary">
                        按请求指纹轮询历史接口
                      </div>
                      <span className="hidden text-fg-muted sm:inline">→</span>
                      <div className="flex-1 border border-fg bg-ink p-2.5 text-ink-fg">
                        ✓ 关页重启自动认领成片
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        label: "交叉编译白屏",
                        desc: "解决 Apple Silicon 打包 Windows 原生模块冲突",
                      },
                      {
                        label: "30+ 节点流畅拖动",
                        desc: "GPU 加速 + 按需懒加载 + 输入防抖消除掉帧",
                      },
                      {
                        label: "中文输入法修复",
                        desc: "处理 composition 周期，彻底解决拼音组词中断",
                      },
                    ].map((fix) => (
                      <div
                        key={fix.label}
                        className="border border-border bg-surface p-3"
                      >
                        <div className="text-caption font-semibold text-fg">
                          {fix.label}
                        </div>
                        <p className="mt-1 text-micro leading-relaxed text-fg-secondary">
                          {fix.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* 底部 1px 横向漫游进度标尺 */}
        <div className="mx-auto mt-5 hidden w-full max-w-[1120px] px-4 sm:px-6 md:px-10 lg:block lg:px-12">
          <div className="h-px w-full overflow-hidden bg-border-strong">
            <div
              className={`canvas-pan-bar h-full origin-left bg-fg ${
                isPinnedDesktop ? "scale-x-0" : "scale-x-100"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
