import type { RefObject } from "react";
import { openflowStory } from "@/lib/openflow-story";

type Props = {
  sectionRef: RefObject<HTMLDivElement | null>;
  activeStageIndex: number;
  activePlatformIndex: number;
  activeLoopIndex: number;
  loopCycleCount: number;
  isPinnedDesktop: boolean;
  onSelectStage: (index: number) => void;
};

/**
 * 板块 02：真实业务场景下的痛点（两幕情景剧模拟器）
 * 第一幕：模拟你在 ChatGPT / Midjourney / Gemini / 即梦 / 可灵 5 个会员标签页之间反复下载上传搬运素材。
 * 第二幕：镜头一转，公司统一采购 API 上线内部网站，5 个标签页坍缩为 1 个单任务表单——却被锁死在
 * 「选模型 → 选参数 → 上传素材 → 串行生成 → 下载 → 循环」的单线程死循环里。
 */
export function BottleneckStage({
  sectionRef,
  activeStageIndex,
  activePlatformIndex,
  activeLoopIndex,
  loopCycleCount,
  isPinnedDesktop,
  onSelectStage,
}: Props) {
  const { painStory } = openflowStory;
  const stage = painStory.stages[activeStageIndex];
  const currentPlatform =
    painStory.platforms[activePlatformIndex] ?? painStory.platforms[0];
  const currentLoopStep =
    painStory.loopSteps[activeLoopIndex] ?? painStory.loopSteps[0];

  const isStageOne = activeStageIndex === 0;

  return (
    <section
      id="openflow-pain"
      aria-labelledby="pain-heading"
      className="relative overflow-x-clip bg-[#070a11] text-[#f8fafc]"
      style={{ colorScheme: "only dark" }}
    >
      {/* 暗房情景氛围光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_32rem_at_76%_28%,rgb(248_113_113/0.12),transparent_64%),radial-gradient(42rem_28rem_at_14%_78%,rgb(79_148_255/0.1),transparent_62%)]"
      />

      <div
        ref={sectionRef}
        className="relative mx-auto flex max-w-6xl flex-col justify-between px-4 py-12 sm:px-6 md:px-8 lg:min-h-[calc(100dvh-4rem)] lg:py-8"
      >
        {/* 顶栏：板块标题 + 两幕进度条 */}
        <div className="space-y-3.5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="pain-heading"
                className="text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] font-bold tracking-[-0.04em] text-white"
              >
                {painStory.heading}
              </h2>
              <p className="mt-1.5 max-w-2xl text-body text-[#cbd5e1]">
                {painStory.lead}
              </p>
            </div>
            <p className="font-mono text-caption tabular-nums text-white/60">
              情景 {String(activeStageIndex + 1).padStart(2, "0")} / 02
            </p>
          </div>

          <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/12">
            <div
              className="pain-scrub-bar h-full origin-left rounded-full bg-gradient-to-r from-[#fb923c] via-[#f87171] to-[#4f94ff]"
              style={{
                transform: isPinnedDesktop
                  ? "scaleX(0)"
                  : `scaleX(${(activeStageIndex + 1) / painStory.stages.length})`,
              }}
            />
          </div>
        </div>

        {/* 主体剧场：左栏第一/第二人称故事叙述，右栏浏览器真实场景模拟器 */}
        <div className="my-auto grid grid-cols-1 gap-7 py-6 lg:grid-cols-12 lg:items-center lg:gap-9">
          {/* 左栏：故事叙述 */}
          <div className="space-y-4 lg:col-span-5">
            <div className="font-mono text-caption font-semibold text-[#fb923c]">
              {stage.stageLabel}
            </div>
            <h3 className="text-[clamp(1.5rem,2.7vw,2.1rem)] leading-[1.22] font-bold tracking-[-0.03em] text-white">
              {stage.title}
            </h3>
            <p className="max-w-[46ch] text-body leading-relaxed text-[#cbd5e1]">
              {stage.narrative}
            </p>

            <ul className="space-y-2 border-t border-white/12 pt-4">
              {stage.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-label leading-relaxed text-white/85"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-[#f87171]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 右栏：真实浏览器工作流模拟器 */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[26px] border border-white/14 bg-[#0d1320]/95 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)]">
              {/* 浏览器顶部标签栏：第 1 幕 5 个外部付费平台标签页；第 2 幕坍缩为 1 个公司统一平台标签页 */}
              <div className="border-b border-white/10 bg-black/45 px-3.5 pt-3 pb-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-[#f87171]/70" />
                    <span className="size-2.5 rounded-full bg-[#fb923c]/70" />
                    <span className="size-2.5 rounded-full bg-[#34d399]/60" />
                  </div>
                  <span className="font-mono text-micro tabular-nums text-white/55">
                    {isStageOne
                      ? `已订阅 ${activePlatformIndex + 1} / 5 个独立平台`
                      : `已重复执行第 ${loopCycleCount} 轮单线程循环`}
                  </span>
                </div>

                {isStageOne ? (
                  <div className="mt-2.5 grid grid-cols-5 gap-1.5 font-mono text-micro">
                    {painStory.platforms.map((platform, idx) => {
                      const active = idx === activePlatformIndex;
                      const visited = idx < activePlatformIndex;
                      return (
                        <div
                          key={platform.id}
                          className={`truncate rounded-lg border px-2 py-1.5 text-center transition-colors ${
                            active
                              ? "border-[#fb923c]/70 bg-[#fb923c]/20 font-semibold text-white"
                              : visited
                                ? "border-white/15 bg-white/[0.06] text-white/75"
                                : "border-white/8 bg-white/[0.02] text-white/40"
                          }`}
                        >
                          {platform.name}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-[#4f94ff]/45 bg-[#4f94ff]/15 px-3 py-1.5 font-mono text-micro text-white">
                    <span>公司内部模型统一调用平台（Unified API Portal）</span>
                    <span className="text-[#f87171]">仅支持单任务串行</span>
                  </div>
                )}
              </div>

              {/* 浏览器内部动态画布 */}
              <div className="relative min-h-[320px] p-4 sm:min-h-[350px] sm:p-6">
                <div
                  aria-hidden="true"
                  className="lab-grid pointer-events-none absolute inset-0 opacity-30"
                />

                {isStageOne ? (
                  /* 情景 01：5 个平台逐一付费 + 下载/上传搬运接力 */
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    {/* 当前停留平台窗口 */}
                    <div className="rounded-2xl border border-[#fb923c]/45 bg-[#fb923c]/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-caption">
                        <span className="font-semibold text-white">
                          当前标签页：{currentPlatform.name} ·{" "}
                          {currentPlatform.role}
                        </span>
                        <span className="rounded-md bg-[#f87171]/20 px-2 py-0.5 text-micro font-semibold text-[#f87171]">
                          会员账单：{currentPlatform.cost}
                        </span>
                      </div>
                      <p className="mt-2.5 text-label text-white/85">
                        {currentPlatform.action}
                      </p>
                    </div>

                    {/* 5 步接力流：清晰呈现每两步之间的「下载 ⬇ / 再上传 ⬆」断点 */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                      {painStory.platforms.map((platform, idx) => {
                        const isCurrent = idx === activePlatformIndex;
                        const isDone = idx < activePlatformIndex;
                        return (
                          <div
                            key={platform.id}
                            className={`rounded-xl border p-2.5 font-mono text-micro transition-colors ${
                              isCurrent
                                ? "border-[#fb923c] bg-[#fb923c]/18 text-white"
                                : isDone
                                  ? "border-white/18 bg-white/[0.06] text-white/80"
                                  : "border-white/8 bg-white/[0.02] text-white/40"
                            }`}
                          >
                            <div className="font-semibold">{platform.name}</div>
                            <div className="mt-1 text-[10px] text-[#f87171]">
                              {platform.cost}
                            </div>
                            <div className="mt-2 truncate text-[10px] text-white/65">
                              {idx === 0 ? "复制 Prompt" : "上传 → 下载"}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 本地下载文件夹堆积条 */}
                    <div className="rounded-xl border border-dashed border-[#f87171]/50 bg-black/45 p-3 font-mono text-micro">
                      <div className="flex items-center justify-between text-[#f87171]">
                        <span>~/Downloads 本地搬运中转站</span>
                        <span className="tabular-nums">
                          已中转 {activePlatformIndex + 1} 个中间文件
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {painStory.platforms
                          .slice(0, activePlatformIndex + 1)
                          .map((p) => (
                            <span
                              key={p.artifact}
                              className="rounded bg-white/10 px-2 py-0.5 text-white/85"
                            >
                              ⬇ {p.artifact}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 情景 02：公司统一 API 平台单线程死循环 */
                  <div className="relative flex h-full flex-col justify-between gap-4">
                    {/* 5 步死循环高亮链条 */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                      {painStory.loopSteps.map((step, idx) => {
                        const active = idx === activeLoopIndex;
                        return (
                          <div
                            key={step.step}
                            className={`rounded-xl border p-2.5 transition-colors ${
                              active
                                ? "border-[#f87171] bg-[#f87171]/20 text-white"
                                : "border-white/10 bg-white/[0.03] text-white/55"
                            }`}
                          >
                            <div className="font-mono text-[10px] text-[#fb923c]">
                              STEP {step.step}
                            </div>
                            <div className="mt-1 text-caption font-semibold">
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 当前卡点表单透视 */}
                    <div className="rounded-2xl border border-white/14 bg-black/45 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-caption">
                        <span className="font-semibold text-white">
                          当前停留在：STEP {currentLoopStep.step} ·{" "}
                          {currentLoopStep.label}
                        </span>
                        <span className="text-[#f87171] tabular-nums">
                          ↺ 循环第 {loopCycleCount} 遍
                        </span>
                      </div>
                      <p className="mt-2 text-label text-white/80">
                        {currentLoopStep.detail}
                      </p>

                      {/* 单通道锁死进度与阻塞资产提示 */}
                      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 font-mono text-micro tabular-nums">
                        <div className="rounded-xl border border-[#f87171]/40 bg-[#f87171]/10 p-3">
                          <div className="text-[#f87171]">并发能力：0</div>
                          <div className="mt-1 text-white/80">
                            只能 1 次生 1 条，其余镜头全部排队干等
                          </div>
                        </div>
                        <div className="rounded-xl border border-[#fb923c]/40 bg-[#fb923c]/10 p-3">
                          <div className="text-[#fb923c]">
                            资产流转：手工下载 ⬇ → 再上传 ⬆
                          </div>
                          <div className="mt-1 text-white/80">
                            生成结果无法直连下一步，被迫重复循环
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 循环提示底栏 */}
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 font-mono text-micro text-white/75">
                      <span>
                        选模型 → 选参数 → 上传素材 → 生成 → 下载 ↺ 无限循环
                      </span>
                      <span className="text-[#f87171]">急需工作流重构</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部两幕故事切换控制条（支持直接点击跳幕或查看当前进度） */}
        <div
          role="tablist"
          aria-label="切换痛点情景幕次"
          className="grid grid-cols-1 gap-2.5 border-t border-white/12 pt-4 sm:grid-cols-2"
        >
          {painStory.stages.map((item, idx) => {
            const selected = idx === activeStageIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelectStage(idx)}
                className={`min-h-12 rounded-xl border px-4 py-2.5 text-left transition-colors ${
                  selected
                    ? "border-[#fb923c]/70 bg-[#fb923c]/14 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-micro text-[#fb923c]">
                    {item.stageLabel}
                  </span>
                  <span className="font-mono text-micro text-white/50">
                    {item.index} / 02
                  </span>
                </div>
                <span className="mt-0.5 block truncate text-caption font-semibold">
                  {item.painSummary}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
