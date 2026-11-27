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
 * 板块 03 · 横向无限画布镜头漫游（Monochrome Architectural Editorial 统一风格）
 * 去掉深蓝霓虹，用纯白/纯黑建筑图纸 + 0px 锐利直角工程站 + 9999px 胶囊导航，
 * 桌面端垂直滚动驱动横向平推 4 座工作站，一条单色 SVG 数据脊线随滚动 1:1 绘制贯穿全轨。
 */
export function InfiniteCanvasTrack({
  viewportRef,
  trackRef,
  activeStation,
  isPinnedDesktop,
  onSelectStation,
}: Props) {
  const stations = openflowStory.buildChapters;

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
              <h2
                id="build-heading"
                className="text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[32px]"
              >
                确定形态之后：穿行 OpenFlow 无限画布
              </h2>
              <p className="mt-2 max-w-2xl text-balance text-label leading-relaxed text-fg-secondary md:text-[15px]">
                需求拆解驱动 Claude Code（Vibe
                Coding），把痛点逐一改造成桌面端节点流水线。
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
            aria-label="画布建造阶段"
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

            {/* 站点 1：Electron 全栈桌面端与 12 人零门槛分发 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,56rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-6">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    01 {"//"} {stations[0].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[26px]">
                    {stations[0].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[0].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.65] text-fg-secondary">
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

                <div className="space-y-3 lg:col-span-6">
                  <div className="border border-border bg-surface p-4">
                    <div className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                      ELECTRON 主进程内嵌全栈服务
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 font-mono text-micro text-fg">
                      <div className="border border-border bg-bg p-2.5">
                        React 19 + React Flow
                      </div>
                      <div className="border border-border bg-bg p-2.5">
                        Hono + SQLite 本地库
                      </div>
                    </div>
                    <p className="mt-2.5 font-mono text-micro text-fg-secondary">
                      内网安全调用 · req_from 署名 · 统一接入 6+ 多模态模型
                    </p>
                  </div>

                  <div className="border border-border bg-surface p-4 font-mono text-micro tabular-nums">
                    <div className="flex items-center justify-between text-fg-muted">
                      <span>GITHUB RELEASES v1.4.0</span>
                      <span className="text-fg">双击安装 · 自动更新</span>
                    </div>
                    <div className="mt-2.5 divide-y divide-border border-t border-border">
                      {openflowStory.releaseArtifacts.map((asset) => (
                        <div
                          key={asset.name}
                          className="flex items-center justify-between gap-2 py-2 text-fg"
                        >
                          <span className="truncate">{asset.name}</span>
                          <span className="shrink-0 text-fg-muted">
                            {asset.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 2：核心破局——1 → N 并发分叉爆发 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border-strong bg-bg p-6 sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    02 {"//"} {stations[1].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[26px]">
                    {stations[1].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[1].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.65] text-fg-secondary">
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

                <div className="lg:col-span-7">
                  <div className="border border-border bg-surface p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro">
                      <span className="font-semibold text-fg">
                        @ 资产直连 Prompt → 1 次 N 条并发入队
                      </span>
                      <span className="text-fg-muted">6 路并发执行</span>
                    </div>
                    <p className="mt-2.5 border border-border bg-bg px-3 py-2.5 font-mono text-micro leading-relaxed text-fg-secondary">
                      参考{" "}
                      <span className="inline-block whitespace-nowrap border border-border-strong bg-surface px-1.5 py-0.5 text-fg">
                        @半拿铁双人全画面.jpg
                      </span>{" "}
                      与{" "}
                      <span className="inline-block whitespace-nowrap border border-border-strong bg-surface px-1.5 py-0.5 text-fg">
                        @刘飞.wav
                      </span>{" "}
                      框选批量连线直达下游节点
                    </p>

                    <div className="mt-3.5 grid grid-cols-1 gap-2 font-mono text-micro tabular-nums sm:grid-cols-2">
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
                          className="border border-border bg-bg p-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-fg">
                              {lane.seg}
                            </span>
                            <span className="whitespace-nowrap text-fg-muted">
                              {lane.status}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden bg-surface-recessed">
                            <div
                              className={`parallel-surge-bar h-full origin-left ${lane.tone}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 3：播客脚本流水线、画布 Agent 与生成统计 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,56rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    03 {"//"} {stations[2].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[26px]">
                    {stations[2].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[2].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.65] text-fg-secondary">
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
                  <div className="grid grid-cols-3 divide-x divide-border border border-border bg-surface text-center font-mono text-micro">
                    <div className="p-3">
                      <div className="text-fg-muted">STEP 01</div>
                      <div className="mt-1 font-semibold text-fg">脚本切割</div>
                      <div className="mt-0.5 text-fg-secondary">
                        4–15s 自动切片
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-fg-muted">STEP 02</div>
                      <div className="mt-1 font-semibold text-fg">分镜表格</div>
                      <div className="mt-0.5 text-fg-secondary">
                        TSV + 火山 TTS
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-fg-muted">STEP 03</div>
                      <div className="mt-1 font-semibold text-fg">一键落成</div>
                      <div className="mt-0.5 text-fg-secondary">
                        网格批量节点
                      </div>
                    </div>
                  </div>

                  <div className="border border-border bg-surface p-4 font-mono tabular-nums">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-micro">
                      <span className="font-semibold text-fg">
                        v1.4.0 生成统计面板 · 真实画布快照
                      </span>
                      <span className="text-fg-muted">一键复制开销汇报</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 divide-x divide-border border border-border bg-bg">
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
                        <div className="text-micro text-fg-muted">视频秒数</div>
                        <div className="mt-1 text-title font-bold text-fg">
                          1028s
                        </div>
                        <div className="text-micro text-fg-secondary">
                          Seedance 1080p
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-micro text-fg-muted">
                          画布 Agent
                        </div>
                        <div className="mt-1 text-title font-bold text-fg">
                          Auto
                        </div>
                        <div className="text-micro text-fg-secondary">
                          自然语言编排
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 4：504 断线自愈找回与一线体验修复 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between border border-border bg-bg p-6 sm:p-7 lg:w-[min(86vw,56rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                    04 {"//"} {stations[3].version}
                  </div>
                  <h3 className="text-[22px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[26px]">
                    {stations[3].title}
                  </h3>
                  <p className="text-label leading-[1.7] text-fg-secondary">
                    {stations[3].summary}
                  </p>
                  <ul className="space-y-2 border-t border-border pt-3 text-label leading-[1.65] text-fg-secondary">
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
                        长连接断连「结果找回」闭环
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
