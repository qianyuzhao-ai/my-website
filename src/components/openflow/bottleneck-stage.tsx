import type { RefObject } from "react";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  sectionRef: RefObject<HTMLDivElement | null>;
  activeIndex: number;
  isPinnedDesktop: boolean;
  onSelect: (index: number) => void;
};

/**
 * 第 1 幕：暗房痛点剧场（Full-Bleed Dark Studio Takeover）
 * 整块深邃暗色沉浸舞台：桌面端由 GSAP ScrollTrigger 连续 scrub 4 个物理化瓶颈动画——
 * 1) 串行计时器与逐条锁死进度条
 * 2) 三座孤岛间的手动下载/上传往返断链
 * 3) 96% 处突然炸裂的 504 网关超时断线与右侧失联成片
 * 4) 失控散落的手工拆镜与表格碎片
 */
export function BottleneckStage({
  sectionRef,
  activeIndex,
  isPinnedDesktop,
  onSelect,
}: Props) {
  const activePain = openflowStory.painPoints[activeIndex];

  return (
    <section
      id="openflow-pain"
      aria-labelledby="pain-heading"
      className="relative overflow-x-clip bg-[#070a11] text-[#f8fafc]"
      style={{ colorScheme: "only dark" }}
    >
      {/* 暗房警示微光晕 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_32rem_at_75%_30%,rgb(248_113_113/0.11),transparent_64%),radial-gradient(40rem_28rem_at_15%_80%,rgb(79_148_255/0.09),transparent_62%)]"
      />

      <div
        ref={sectionRef}
        className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-between px-4 py-16 sm:px-6 md:px-8 lg:pt-24 lg:pb-12"
      >
        {/* 顶部标题 + 实时推进条 */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="pain-heading"
              className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.06] font-bold tracking-[-0.04em] text-white"
            >
              一线业务卡在哪里
            </h2>
            <p className="font-mono text-caption tabular-nums text-white/60">
              痛点 {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(openflowStory.painPoints.length).padStart(2, "0")}
            </p>
          </div>

          <div className="h-px w-full overflow-hidden bg-white/12">
            <div
              className="pain-scrub-bar h-full origin-left bg-gradient-to-r from-[#f87171] via-[#fb923c] to-[#4f94ff]"
              style={{
                transform: isPinnedDesktop
                  ? "scaleX(0)"
                  : `scaleX(${(activeIndex + 1) / openflowStory.painPoints.length})`,
              }}
            />
          </div>
        </div>

        {/* 中央电影感物理舞台：左侧超大数字与大字叙事，右侧实时 GSAP 驱动图形 */}
        <div className="my-auto grid grid-cols-1 gap-8 py-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* 左侧：大字号沉浸叙事（非卡片列表） */}
          <div className="space-y-5 lg:col-span-5">
            <div className="font-mono text-[clamp(3.2rem,6vw,5rem)] leading-none font-bold tracking-[-0.05em] text-[#f87171] tabular-nums">
              {activePain.index}
            </div>
            <h3 className="text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.2] font-bold tracking-[-0.03em] text-white">
              {activePain.title}
            </h3>
            <p className="font-mono text-body font-semibold text-[#fb923c]">
              {activePain.metricHighlight}
            </p>
            <p className="max-w-[44ch] text-body leading-relaxed text-[#cbd5e1]">
              {activePain.detail}
            </p>
          </div>

          {/* 右侧：4 幕物理动态图形容器 */}
          <div className="relative min-h-[340px] overflow-hidden rounded-[28px] border border-white/12 bg-[#0d1320]/90 p-5 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.75)] sm:min-h-[390px] sm:p-7 lg:col-span-7">
            <div
              aria-hidden="true"
              className="lab-grid pointer-events-none absolute inset-0 opacity-35"
            />

            {/* 场景 1：严格串行排队计时器 */}
            <div
              className={`pain-scene-0 relative transition-opacity duration-300 ${
                activeIndex === 0 ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
                <span className="font-mono text-caption text-white/65">
                  旧平台串行任务队列
                </span>
                <div className="font-mono text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-[#f87171] tabular-nums">
                  <span className="pain-clock">19:48</span>
                  <span className="ml-2 text-caption font-normal text-white/55">
                    累计等待
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3.5 font-mono text-caption tabular-nums">
                {[
                  {
                    id: "Seg 01 · Seedance",
                    time: "04:52",
                    state: "生成中",
                    barClass: "pain-serial-bar-1 bg-[#4f94ff]",
                    width: "w-full",
                  },
                  {
                    id: "Seg 02 · Seedance",
                    time: "09:44",
                    state: "锁定排队",
                    barClass: "pain-serial-bar-2 bg-[#fb923c]/70",
                    width: "w-[55%]",
                  },
                  {
                    id: "Seg 03 · 自研 R1 对比",
                    time: "14:36",
                    state: "阻塞",
                    barClass: "pain-serial-bar-3 bg-[#f87171]/60",
                    width: "w-[22%]",
                  },
                  {
                    id: "Seg 04 · 自研 R1 对比",
                    time: "19:48",
                    state: "阻塞",
                    barClass: "pain-serial-bar-4 bg-[#f87171]/40",
                    width: "w-[12%]",
                  },
                ].map((row) => (
                  <div key={row.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-white/85">
                      <span>{row.id}</span>
                      <span className="text-white/55">
                        {row.state} · {row.time}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/8">
                      <div
                        className={`${row.barClass} ${row.width} h-full origin-left rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 font-mono text-micro text-[#f87171]/90">
                ! 必须等前一条完全落盘，才能手工点下一条提交
              </p>
            </div>

            {/* 场景 2：孤岛式下载与重新上传 */}
            <div
              className={`pain-scene-1 relative transition-opacity duration-300 ${
                activeIndex === 1 ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-caption">
                <span className="text-white/65">跨环节孤岛搬运路径</span>
                <span className="text-[#fb923c]">4 次手动下载 / 上传</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { step: "01", name: "图生人像", file: "host_v3.png" },
                  { step: "02", name: "场景融合", file: "studio_mix_2.png" },
                  { step: "03", name: "视频生成", file: "seg04_final.mp4" },
                ].map((island) => (
                  <div
                    key={island.step}
                    className="rounded-2xl border border-white/14 bg-white/[0.04] p-4"
                  >
                    <div className="font-mono text-micro text-white/50">
                      独立页面 {island.step}
                    </div>
                    <div className="mt-1 text-body font-semibold text-white">
                      {island.name}
                    </div>
                    <div className="mt-3 rounded-lg bg-black/45 px-2.5 py-1.5 font-mono text-micro text-[#fb923c]">
                      ⬇ 保存 {island.file}
                    </div>
                  </div>
                ))}
              </div>

              {/* 本地文件夹中转陷阱 */}
              <div className="mt-5 rounded-2xl border border-dashed border-[#f87171]/55 bg-[#f87171]/8 p-4 font-mono text-caption">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[#f87171]">
                  <span>~/Downloads/播客素材_最终版_改2_真的最终/</span>
                  <span>极易传错机位图与角色音色</span>
                </div>
                <p className="mt-2 text-micro text-white/70">
                  每次跨工具流转都要离开工作流 → 翻找本地文件 →
                  手动重新上传，链路完全断裂。
                </p>
              </div>
            </div>

            {/* 场景 3：504 网关超时断线可视化 */}
            <div
              className={`pain-scene-2 relative transition-opacity duration-300 ${
                activeIndex === 2 ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-caption">
                <span className="text-white/65">长视频请求连接监测</span>
                <span className="text-[#f87171]">504 GATEWAY TIMEOUT</span>
              </div>

              <div className="mt-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-12">
                <div className="rounded-2xl border border-[#f87171]/50 bg-[#f87171]/10 p-4 sm:col-span-5">
                  <div className="font-mono text-micro text-[#f87171]">
                    前端页面状态
                  </div>
                  <div className="mt-1.5 text-title font-bold text-white">
                    请求失败
                  </div>
                  <p className="mt-1.5 font-mono text-micro text-white/75">
                    返回空 URL · 需重新上传并再次排队 5 分钟
                  </p>
                </div>

                {/* 中央断裂连线 */}
                <div className="flex flex-col items-center justify-center py-2 sm:col-span-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 48"
                    className="h-10 w-24"
                    fill="none"
                  >
                    <path
                      d="M 4 24 L 46 24"
                      stroke="#f87171"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 74 24 L 116 24"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 52 10 L 68 38 M 68 10 L 52 38"
                      stroke="#f87171"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="font-mono text-micro text-[#f87171]">
                    网关掐断
                  </span>
                </div>

                <div className="rounded-2xl border border-[#34d399]/40 bg-[#34d399]/10 p-4 sm:col-span-5">
                  <div className="font-mono text-micro text-[#34d399]">
                    模型后端实际状态
                  </div>
                  <div className="mt-1.5 text-title font-bold text-white">
                    成片已生成
                  </div>
                  <p className="mt-1.5 font-mono text-micro text-white/75">
                    30s 后渲染结束，但前端已丢失引用，算力白白浪费
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-black/45 px-4 py-3 font-mono text-micro text-white/70">
                高频抽卡 × 长连接超时 =
                重复消耗时间与预算，却拿不回已经算好的视频。
              </div>
            </div>

            {/* 场景 4：手工拆镜与消耗核算碎片 */}
            <div
              className={`pain-scene-3 relative transition-opacity duration-300 ${
                activeIndex === 3 ? "block opacity-100" : "hidden opacity-0"
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-caption">
                <span className="text-white/65">播客制作前后端手工消耗</span>
                <span className="text-[#fb923c]">240 条脚本全靠粘贴</span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    code: "SCRIPT_SPLIT",
                    title: "人工数字切 4–15s 片段",
                    note: "上千字播客逐行拆台词，超长即生成失败",
                  },
                  {
                    code: "ROLE_BINDING",
                    title: "逐条核对机位图与音色",
                    note: "刘飞 / 潇磊双人切镜与参考音频反复配对",
                  },
                  {
                    code: "PROMPT_COPY",
                    title: "20+ 镜头手动贴 Prompt",
                    note: "镜头号、运镜词与口播风格难以保持一致",
                  },
                  {
                    code: "COST_AUDIT",
                    title: "翻历史记录人工算秒数",
                    note: "Image 2 / Nano Banana / Seedance 各自计费",
                  },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="rounded-xl border border-white/12 bg-white/[0.04] p-3.5"
                  >
                    <div className="font-mono text-micro text-[#fb923c]">
                      {item.code}
                    </div>
                    <div className="mt-1 text-label font-semibold text-white">
                      {item.title}
                    </div>
                    <p className="mt-1 text-micro leading-relaxed text-white/65">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部交互式章节跳点条：桌面端可点击直达对应滚动进度，移动端点击即切换 */}
        <div
          role="tablist"
          aria-label="切换痛点幕次"
          className="grid grid-cols-2 gap-2 border-t border-white/12 pt-5 md:grid-cols-4"
        >
          {openflowStory.painPoints.map((item, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelect(idx)}
                className={`min-h-12 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  selected
                    ? "border-[#f87171]/65 bg-[#f87171]/14 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="font-mono text-micro text-[#f87171]">
                  {item.index}
                </span>
                <span className="mt-0.5 block truncate text-caption font-medium">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
