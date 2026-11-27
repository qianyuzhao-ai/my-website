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
 * 第 2 幕：横向无限画布镜头漫游（Horizontal Infinite-Canvas Camera Pan）
 * 桌面端由 GSAP ScrollTrigger 将垂直滚动转化为横向穿行一整张 OpenFlow 无限画布：
 * 一条贯穿 4 座工作站的发光 SVG 数据电缆随滚动实时绘制点亮，
 * 并在第 2 站物理分叉为 6 条并行视频队列，在第 4 站把第 1 幕的 504 断线重新接通！
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
      className="relative overflow-x-clip border-y border-white/10 bg-[#0b101b] text-[#f8fafc]"
      style={{ colorScheme: "only dark" }}
    >
      {/* 无限画布点阵底纹 */}
      <div
        aria-hidden="true"
        className="lab-grid pointer-events-none absolute inset-0 opacity-45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56rem_30rem_at_22%_18%,rgb(79_148_255/0.14),transparent_65%),radial-gradient(48rem_28rem_at_82%_78%,rgb(52_211_153/0.12),transparent_65%)]"
      />

      <div
        ref={viewportRef}
        className="relative flex flex-col justify-between py-12 lg:min-h-[calc(100dvh-4rem)] lg:py-8"
      >
        {/* 顶栏固定画布坐标与标题 */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="build-heading"
                className="text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.06] font-bold tracking-[-0.04em] text-white"
              >
                我是怎么做的：穿行 OpenFlow 画布
              </h2>
              <p className="mt-2.5 max-w-2xl text-balance text-body text-[#cbd5e1]">
                需求拆解驱动 Claude Code（Vibe
                Coding），把痛点逐一改造成桌面端节点流水线。
              </p>
            </div>
            <div className="font-mono text-caption tabular-nums text-[#34d399]">
              镜头坐标 · 站点 {String(activeStation + 1).padStart(2, "0")} /{" "}
              {String(stations.length).padStart(2, "0")}
            </div>
          </div>

          {/* 4 站快速跳点导航 */}
          <div
            role="tablist"
            aria-label="画布建造阶段"
            className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4"
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
                  className={`min-h-11 rounded-xl border px-3 py-2 text-left transition-colors ${
                    selected
                      ? "border-[#4f94ff]/70 bg-[#4f94ff]/16 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <div className="font-mono text-micro text-[#4f94ff]">
                    {station.version}
                  </div>
                  <div className="truncate text-caption font-semibold">
                    {station.tabLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 横向无限画布轨道（桌面端横向 4 屏连续漫游；移动端自然竖排） */}
        <div className="relative mt-7 overflow-hidden lg:my-auto lg:mt-6">
          <div
            ref={trackRef}
            className="canvas-horizontal-track relative flex flex-col gap-6 px-4 sm:px-6 md:px-8 lg:w-max lg:flex-row lg:items-stretch lg:gap-12 lg:px-[max(2rem,calc((100vw-72rem)/2))]"
          >
            {/* 桌面端贯穿全部 4 个站点的发光 SVG 电缆脊线 */}
            <svg
              aria-hidden="true"
              viewBox="0 0 3600 120"
              fill="none"
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-1/2 left-0 hidden h-28 w-full -translate-y-1/2 lg:block"
            >
              <path
                d="M 40 60 C 320 60, 420 20, 760 60 C 1120 100, 1320 20, 1740 60 C 2160 100, 2400 20, 2820 60 C 3150 90, 3360 60, 3560 60"
                stroke="rgba(148,163,184,0.18)"
                strokeWidth="3"
              />
              <path
                className="canvas-spine-glow"
                d="M 40 60 C 320 60, 420 20, 760 60 C 1120 100, 1320 20, 1740 60 C 2160 100, 2400 20, 2820 60 C 3150 90, 3360 60, 3560 60"
                stroke="url(#openflow-spine-grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="openflow-spine-grad"
                  x1="0"
                  y1="0"
                  x2="3600"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#4f94ff" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>

            {/* 站点 1：Electron 全栈桌面端与 12 人零门槛分发 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between rounded-[28px] border border-white/14 bg-[#111827]/92 p-6 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-6">
                  <div className="font-mono text-caption font-semibold text-[#4f94ff]">
                    01 · {stations[0].version}
                  </div>
                  <h3 className="text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight font-bold tracking-[-0.025em] text-white">
                    {stations[0].title}
                  </h3>
                  <p className="text-body leading-relaxed text-[#cbd5e1]">
                    {stations[0].summary}
                  </p>
                  <ul className="space-y-2 pt-2 text-label leading-relaxed text-white/75">
                    {stations[0].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#4f94ff]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 站点 1 视觉：Electron 架构与真实构建产物 */}
                <div className="space-y-3 lg:col-span-6">
                  <div className="rounded-2xl border border-[#4f94ff]/35 bg-[#4f94ff]/10 p-4">
                    <div className="font-mono text-micro text-[#4f94ff]">
                      ELECTRON 主进程内嵌全栈服务
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-micro text-white">
                      <div className="rounded-lg bg-black/40 p-2.5">
                        React 19 + React Flow
                      </div>
                      <div className="rounded-lg bg-black/40 p-2.5">
                        Hono + SQLite 本地库
                      </div>
                    </div>
                    <p className="mt-2.5 font-mono text-micro text-white/70">
                      内网安全调用 · req_from 署名 · 统一接入 6+ 多模态模型
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/12 bg-black/40 p-4 font-mono text-micro tabular-nums">
                    <div className="flex items-center justify-between text-white/60">
                      <span>GitHub Releases v1.4.0</span>
                      <span className="text-[#34d399]">
                        双击安装 · 自动更新
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      {openflowStory.releaseArtifacts.map((asset) => (
                        <div
                          key={asset.name}
                          className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-white/90"
                        >
                          <span className="truncate">{asset.name}</span>
                          <span className="shrink-0 text-white/55">
                            {asset.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 2：核心高潮——1 → N 并发分叉爆发舞台 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between rounded-[28px] border border-[#34d399]/35 bg-[#101926]/94 p-6 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7 lg:w-[min(86vw,60rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-caption font-semibold text-[#34d399]">
                    02 · {stations[1].version}
                  </div>
                  <h3 className="text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight font-bold tracking-[-0.025em] text-white">
                    {stations[1].title}
                  </h3>
                  <p className="text-body leading-relaxed text-[#cbd5e1]">
                    {stations[1].summary}
                  </p>
                  <ul className="space-y-2 pt-2 text-label leading-relaxed text-white/75">
                    {stations[1].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#34d399]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 站点 2 视觉：1 → 6 并行爆发可视化（GSAP Scrub 驱动 6 条齐头并进） */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="rounded-2xl border border-white/12 bg-black/45 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro">
                      <span className="text-white">
                        @ 资产直连 Prompt → 1 次 N 条并发入队
                      </span>
                      <span className="text-[#34d399]">6 路并发执行</span>
                    </div>
                    <p className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-micro leading-relaxed text-white/80">
                      参考{" "}
                      <span className="inline-block whitespace-nowrap rounded bg-[#4f94ff]/30 px-1.5 py-0.5 text-white">
                        @半拿铁双人全画面.jpg
                      </span>{" "}
                      与{" "}
                      <span className="inline-block whitespace-nowrap rounded bg-[#34d399]/30 px-1.5 py-0.5 text-white">
                        @刘飞.wav
                      </span>{" "}
                      框选批量连线直达下游节点
                    </p>

                    <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2 font-mono text-micro tabular-nums">
                      {[
                        {
                          seg: "Seg 01",
                          status: "可用",
                          tone: "bg-[#34d399]",
                          text: "text-[#34d399]",
                        },
                        {
                          seg: "Seg 02",
                          status: "可用",
                          tone: "bg-[#34d399]",
                          text: "text-[#34d399]",
                        },
                        {
                          seg: "Seg 03",
                          status: "待定·重绘",
                          tone: "bg-[#4f94ff]",
                          text: "text-[#4f94ff]",
                        },
                        {
                          seg: "Seg 04",
                          status: "可用",
                          tone: "bg-[#34d399]",
                          text: "text-[#34d399]",
                        },
                        {
                          seg: "Seg 05",
                          status: "废弃·留档",
                          tone: "bg-white/40",
                          text: "text-white/55",
                        },
                        {
                          seg: "Seg 06",
                          status: "可用",
                          tone: "bg-[#34d399]",
                          text: "text-[#34d399]",
                        },
                      ].map((lane) => (
                        <div
                          key={lane.seg}
                          className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white">{lane.seg}</span>
                            <span className={`whitespace-nowrap ${lane.text}`}>
                              {lane.status}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`parallel-surge-bar h-full origin-left rounded-full ${lane.tone}`}
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
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between rounded-[28px] border border-white/14 bg-[#111827]/92 p-6 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-caption font-semibold text-[#4f94ff]">
                    03 · {stations[2].version}
                  </div>
                  <h3 className="text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight font-bold tracking-[-0.025em] text-white">
                    {stations[2].title}
                  </h3>
                  <p className="text-body leading-relaxed text-[#cbd5e1]">
                    {stations[2].summary}
                  </p>
                  <ul className="space-y-2 pt-2 text-label leading-relaxed text-white/75">
                    {stations[2].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#4f94ff]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 站点 3 视觉：播客链路 + 真实生成统计面板 */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-micro">
                    <div className="rounded-xl border border-white/12 bg-white/[0.04] p-3">
                      <div className="text-[#4f94ff]">STEP 1</div>
                      <div className="mt-1 font-semibold text-white">
                        脚本切割
                      </div>
                      <div className="mt-0.5 text-white/60">4–15s 自动切片</div>
                    </div>
                    <div className="rounded-xl border border-[#4f94ff]/45 bg-[#4f94ff]/12 p-3">
                      <div className="text-[#4f94ff]">STEP 2</div>
                      <div className="mt-1 font-semibold text-white">
                        分镜表格
                      </div>
                      <div className="mt-0.5 text-white/60">TSV + 火山 TTS</div>
                    </div>
                    <div className="rounded-xl border border-[#34d399]/40 bg-[#34d399]/12 p-3">
                      <div className="text-[#34d399]">STEP 3</div>
                      <div className="mt-1 font-semibold text-white">
                        一键落成
                      </div>
                      <div className="mt-0.5 text-white/60">网格批量节点</div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/14 bg-black/45 p-4 font-mono tabular-nums">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-micro">
                      <span className="text-white">
                        v1.4.0 生成统计面板 · 真实画布快照
                      </span>
                      <span className="text-[#34d399]">一键复制开销汇报</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      <div className="rounded-xl bg-white/[0.05] p-3">
                        <div className="text-micro text-white/55">生成次数</div>
                        <div className="mt-1 text-title font-bold text-white">
                          106
                        </div>
                        <div className="text-micro text-[#34d399]">
                          成功 102 · 失败 4
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/[0.05] p-3">
                        <div className="text-micro text-white/55">视频秒数</div>
                        <div className="mt-1 text-title font-bold text-white">
                          1028s
                        </div>
                        <div className="text-micro text-white/60">
                          Seedance 1080p
                        </div>
                      </div>
                      <div className="rounded-xl bg-white/[0.05] p-3">
                        <div className="text-micro text-white/55">
                          画布 Agent
                        </div>
                        <div className="mt-1 text-title font-bold text-[#4f94ff]">
                          Auto
                        </div>
                        <div className="text-micro text-white/60">
                          自然语言编排
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 站点 4：视觉呼应第 1 幕——504 断线自愈找回与一线体验修复 */}
            <article className="canvas-station relative z-10 flex w-full shrink-0 flex-col justify-between rounded-[28px] border border-[#34d399]/35 bg-[#0f1824]/94 p-6 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7 lg:w-[min(86vw,58rem)]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
                <div className="space-y-3 lg:col-span-5">
                  <div className="font-mono text-caption font-semibold text-[#34d399]">
                    04 · {stations[3].version}
                  </div>
                  <h3 className="text-[clamp(1.45rem,2.4vw,1.95rem)] leading-tight font-bold tracking-[-0.025em] text-white">
                    {stations[3].title}
                  </h3>
                  <p className="text-body leading-relaxed text-[#cbd5e1]">
                    {stations[3].summary}
                  </p>
                  <ul className="space-y-2 pt-2 text-label leading-relaxed text-white/75">
                    {stations[3].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-[#34d399]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 站点 4 视觉：断线重连闭环 + 3 个真实一线卡点修复 */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="rounded-2xl border border-[#34d399]/45 bg-[#34d399]/10 p-4 font-mono text-micro">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-white">
                      <span>504 断连自愈闭环（呼应痛点 03）</span>
                      <span className="text-[#34d399]">超时拉长至 30 min</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex-1 rounded-lg bg-black/40 p-2.5 text-white/85">
                        SQLite 持久化 request_id
                      </div>
                      <span className="hidden text-[#34d399] sm:inline">→</span>
                      <div className="flex-1 rounded-lg bg-black/40 p-2.5 text-white/85">
                        按请求指纹轮询历史接口
                      </div>
                      <span className="hidden text-[#34d399] sm:inline">→</span>
                      <div className="flex-1 rounded-lg border border-[#34d399]/50 bg-[#34d399]/15 p-2.5 text-[#34d399]">
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
                        className="rounded-xl border border-white/12 bg-white/[0.04] p-3"
                      >
                        <div className="text-caption font-semibold text-white">
                          {fix.label}
                        </div>
                        <p className="mt-1 text-micro leading-relaxed text-white/65">
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

        {/* 底部横向进度标尺（桌面端提示横向漫游进度） */}
        <div className="mx-auto mt-6 hidden w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:block">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="canvas-pan-bar h-full origin-left rounded-full bg-gradient-to-r from-[#4f94ff] via-[#34d399] to-[#60a5fa]"
              style={{
                transform: isPinnedDesktop
                  ? "scaleX(0)"
                  : `scaleX(${(activeStation + 1) / stations.length})`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
