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

const PLATFORM_SLABS = [
  {
    id: "chatgpt",
    index: "01",
    name: "ChatGPT",
    cost: "$20 / 月",
    task: "脚本与 Prompt 扩写",
    drop: "↓ script_seg01.txt",
  },
  {
    id: "midjourney",
    index: "02",
    name: "Midjourney",
    cost: "$30 / 月",
    task: "视觉参考与定调",
    drop: "↓ style_ref_v2.png",
  },
  {
    id: "gemini",
    index: "03",
    name: "Gemini",
    cost: "$20 / 月",
    task: "多模态出图与改图",
    drop: "↓ host_portrait.png",
  },
  {
    id: "jimeng",
    index: "04",
    name: "即梦",
    cost: "独立会员",
    task: "人像与场景融合",
    drop: "↓ scene_mix_01.png",
  },
  {
    id: "keling",
    index: "05",
    name: "可灵",
    cost: "独立会员",
    task: "图生视频成片",
    drop: "↓ clip_seg01.mp4",
  },
] as const;

const FORM_STEPS = [
  {
    step: "01",
    label: "选择模型",
    value: "Seedance 2.0 · 视频生成",
  },
  {
    step: "02",
    label: "选择参数",
    value: "16:9 · 1080p · 10s",
  },
  {
    step: "03",
    label: "上传素材",
    value: "↑ 从本地再次上传刚下载的中间图",
  },
  {
    step: "04",
    label: "串行生成",
    value: "04:52 · 单通道独占，其余任务锁定",
  },
  {
    step: "05",
    label: "下载素材",
    value: "↓ 保存到本地 → 清空表单重来",
  },
] as const;

const WAITING_TASKS = [
  "TASK #04 · 排队中",
  "TASK #05 · 排队中",
  "TASK #06 · 排队中",
  "TASK #07 · 排队中",
] as const;

/**
 * 板块 02 · 黑白建筑剧场：3D 等距层炸裂 → 全屏黑白反色切幕 → 720° 机械死循环表盘
 * 100% 遵循全站 Monochrome Architectural Editorial 系统（0px 锐利直角 × 9999px 胶囊 × 黑白反色张力）：
 * - 第一幕（亮底纸墨）：5 块等距 3D 平台建筑板随滚动在 Z 轴物理炸裂拆开，背景巨型空心字标双向剪切移动，
 *   每层垂下本地硬盘下载断点；
 * - 中段转场（震撼视觉高潮）：5 块 3D 层瞬间拍扁坍缩，同时全屏通过 clip-path 扫过纯黑反色幕布（bg-ink）；
 * - 第二幕（反色机械密室）：400px 精密单色机械表盘随滚动物理旋转 720°，左侧 6 条待生成资产被死死挡在
 *   红色「1 TASK MAX」限流闸门外，表盘中央实时跳动 ×01 → ×04 循环印章。
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
  const isStageOne = activeStageIndex === 0;

  return (
    <section
      id="openflow-pain"
      aria-labelledby="pain-heading"
      className="relative overflow-x-clip border-b border-border bg-bg text-fg"
    >
      <div
        ref={sectionRef}
        className="relative flex flex-col justify-between lg:h-[calc(100dvh-4rem)] lg:overflow-hidden"
      >
        {/* ===================== 图层 A：第一幕 · 纸墨 3D 等距平台炸裂 ===================== */}
        <div
          className={`pain-layer-one relative flex flex-1 flex-col justify-between bg-bg text-fg ${
            !isPinnedDesktop && !isStageOne ? "hidden" : "flex"
          }`}
        >
          {/* 背景：两行巨型建筑空心字标（随滚动反向水平剪切滑行，复用全站 .editorial-wordmark） */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 select-none flex-col gap-3 overflow-hidden opacity-60 lg:flex"
          >
            <div className="pain-marquee-left whitespace-nowrap text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.045em] editorial-wordmark">
              CHATGPT · MIDJOURNEY · GEMINI · 即梦 · 可灵 · 5 SUBSCRIPTIONS ·
            </div>
            <div className="pain-marquee-right -translate-x-24 whitespace-nowrap text-[clamp(4.5rem,11vw,8.5rem)] leading-[0.88] font-bold tracking-[-0.045em] editorial-wordmark">
              DOWNLOAD · SWITCH TAB · RE-UPLOAD · REPEAT · DOWNLOAD · SWITCH TAB
              ·
            </div>
          </div>

          {/* 建筑点阵底纹 */}
          <div
            aria-hidden="true"
            className="lab-grid pointer-events-none absolute inset-0 opacity-30"
          />

          <div className="relative z-10 mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-between px-4 pt-8 pb-20 sm:px-6 md:px-10 lg:px-12 lg:pt-7 lg:pb-20">
            {/* 顶栏标题 */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-3">
              <h2
                id="pain-heading"
                className="text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[30px]"
              >
                {painStory.heading}
              </h2>
              <div className="flex items-center gap-3 font-mono text-micro tracking-wider uppercase tabular-nums">
                <span className="font-semibold text-fg">
                  ACT 01 · 五平台会员与跨标签搬运
                </span>
                <span aria-hidden="true" className="text-fg-muted">
                  /
                </span>
                <span className="text-danger">
                  已激活 {activePlatformIndex + 1} / 5 份订阅
                </span>
              </div>
            </div>

            {/* 中央舞台：左栏极简编辑部叙事 + 右栏真实 3D 等距炸裂建筑板 */}
            <div className="my-auto grid grid-cols-1 gap-8 py-5 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* 左栏叙事 */}
              <div className="space-y-4 lg:col-span-5">
                <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                  SCENARIO 01 {"//"} FRAGMENTED TOOLS
                </p>
                <h3 className="text-[24px] leading-[1.22] font-semibold tracking-[-0.025em] text-fg md:text-[30px]">
                  {painStory.stages[0].title}
                </h3>
                <p className="max-w-[44ch] text-label leading-[1.75] text-fg-secondary md:text-[15px]">
                  {painStory.stages[0].narrative}
                </p>

                {/* 底部本地下载中转条 */}
                <div className="border border-border bg-surface p-3.5 font-mono text-micro">
                  <div className="flex items-center justify-between text-fg-muted">
                    <span>LOCAL DISK · 下载再上传中转站</span>
                    <span className="font-semibold text-danger tabular-nums">
                      {activePlatformIndex + 1} FILES
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PLATFORM_SLABS.slice(0, activePlatformIndex + 1).map(
                      (p) => (
                        <span
                          key={p.id}
                          className="border border-border bg-bg px-2 py-0.5 text-fg"
                        >
                          {p.drop}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* 右栏：5 层真实 CSS 3D 等距平台建筑板（随滚动沿 Z/Y 轴物理炸裂展开，中段拍扁坍缩） */}
              <div className="relative flex min-h-[320px] items-center justify-center lg:col-span-7 lg:min-h-[380px]">
                <div
                  className="pain-iso-stage relative w-full max-w-[520px]"
                  style={{ perspective: "1200px" }}
                >
                  {/* 垂直贯穿 5 层的红色「下载→上传」中轴垂线 */}
                  <div
                    aria-hidden="true"
                    className="pain-plumb-line pointer-events-none absolute top-4 bottom-4 left-1/2 hidden w-px -translate-x-1/2 border-l border-dashed border-danger/60 lg:block"
                  />

                  <div
                    className="pain-iso-stack relative flex flex-col gap-2.5 lg:block lg:h-[340px]"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {PLATFORM_SLABS.map((slab, idx) => {
                      const active = idx === activePlatformIndex;
                      const reached = idx <= activePlatformIndex;
                      return (
                        <div
                          key={slab.id}
                          data-iso-slab={idx}
                          className={`pain-iso-slab border px-4 py-3 transition-colors lg:absolute lg:inset-x-6 lg:top-1/2 lg:-mt-8 ${
                            active
                              ? "border-fg bg-ink text-ink-fg"
                              : reached
                                ? "border-border-strong bg-bg text-fg"
                                : "border-border bg-surface text-fg-secondary"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-mono text-micro tabular-nums ${
                                  active ? "text-ink-fg/70" : "text-fg-muted"
                                }`}
                              >
                                {slab.index}
                              </span>
                              <span className="text-[16px] font-semibold tracking-[-0.015em]">
                                {slab.name}
                              </span>
                              <span
                                className={`hidden text-caption sm:inline ${
                                  active
                                    ? "text-ink-fg/80"
                                    : "text-fg-secondary"
                                }`}
                              >
                                · {slab.task}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 font-mono text-micro tabular-nums">
                              <span
                                className={
                                  active ? "text-ink-fg" : "text-danger"
                                }
                              >
                                {slab.cost}
                              </span>
                              <span
                                className={`hidden sm:inline ${
                                  active ? "text-ink-fg/75" : "text-fg-muted"
                                }`}
                              >
                                {slab.drop}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 图层 B：全屏黑白反色切幕（clip-path 向上横扫） + 单表单无限叠层 ===================== */}
        <div
          className={`pain-inversion-curtain flex-1 flex-col justify-between bg-ink text-ink-fg lg:absolute lg:inset-0 lg:z-20 ${
            isPinnedDesktop
              ? "flex [clip-path:inset(100%_0%_0%_0%)]"
              : isStageOne
                ? "hidden"
                : "flex [clip-path:inset(0%_0%_0%_0%)]"
          }`}
        >
          <div className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-between px-4 pt-8 pb-20 sm:px-6 md:px-10 lg:px-12 lg:pt-7 lg:pb-20">
            {/* 反色顶栏 */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink-fg/15 pb-3">
              <p className="text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-ink-fg md:text-[30px]">
                {painStory.heading}
              </p>
              <div className="flex items-center gap-3 font-mono text-micro tracking-wider uppercase tabular-nums">
                <span className="font-semibold text-ink-fg">
                  ACT 02 · 公司统一 API 后的单线程死循环
                </span>
                <span aria-hidden="true" className="text-ink-fg/45">
                  /
                </span>
                <span className="text-danger">
                  CYCLE ×{String(loopCycleCount).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* 反色中央剧场：左栏叙事 + 右栏「无限撕页式」单任务表单叠层传送带 */}
            <div className="my-auto grid grid-cols-1 gap-8 py-4 lg:grid-cols-12 lg:items-center lg:gap-10">
              {/* 左栏：故事反转 + 核心双痛点 */}
              <div className="space-y-5 lg:col-span-5">
                <p className="font-mono text-micro font-medium tracking-widest text-ink-fg/60 uppercase">
                  SCENARIO 02 {"//"} SINGLE-THREAD LOOP
                </p>
                <h3 className="text-[24px] leading-[1.22] font-semibold tracking-[-0.025em] text-ink-fg md:text-[28px]">
                  {painStory.stages[1].title}
                </h3>
                <p className="max-w-[44ch] text-label leading-[1.72] text-ink-fg/75 md:text-[15px]">
                  {painStory.stages[1].narrative}
                </p>

                {/* 极简建筑级循环计数与双卡点指标 */}
                <div className="grid grid-cols-2 divide-x divide-ink-fg/15 border border-ink-fg/20">
                  <div className="p-3.5">
                    <div className="font-mono text-micro text-ink-fg/55">
                      当前执行轮次
                    </div>
                    <div className="mt-1 font-mono text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink-fg tabular-nums">
                      #{String(loopCycleCount).padStart(2, "0")}
                    </div>
                    <div className="mt-1.5 font-mono text-micro text-danger">
                      无限重复同一表单
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="font-mono text-micro text-ink-fg/55">
                      同时可生成资产
                    </div>
                    <div className="mt-1 font-mono text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink-fg tabular-nums">
                      1 条
                    </div>
                    <div className="mt-1.5 font-mono text-micro text-ink-fg/65">
                      下载后再手动上传
                    </div>
                  </div>
                </div>
              </div>

              {/* 右栏：2.5D 无限叠层单表单传送带（每跑完 01→05，当前表单整张剥离飞走，下一张一模一样的空表单顶上来！） */}
              <div className="relative flex flex-col gap-3.5 lg:col-span-7">
                <div className="relative pt-2 pb-7">
                  {/* 第 3 层底卡（深景排队表单） */}
                  <div
                    aria-hidden="true"
                    className="pain-sheet-back pointer-events-none absolute inset-x-6 top-6 bottom-0 border border-ink-fg/18 bg-ink"
                  />

                  {/* 第 2 层中卡（下一轮即将顶上的同款空表单） */}
                  <div
                    aria-hidden="true"
                    className="pain-sheet-mid pointer-events-none absolute inset-x-3 top-4 bottom-3 flex flex-col justify-between border border-ink-fg/30 bg-ink p-5"
                  >
                    <div className="flex items-center justify-between font-mono text-micro text-ink-fg/45">
                      <span>
                        NEXT · TASK #
                        {String(loopCycleCount + 1).padStart(2, "0")}
                      </span>
                      <span>WAITING IN QUEUE</span>
                    </div>
                    <div className="font-mono text-micro text-ink-fg/35">
                      选模型 → 选参数 → 上传素材 → 串行生成 → 下载本地
                    </div>
                  </div>

                  {/* 第 1 层主卡（当前正在执行的公司统一 API 单任务表单） */}
                  <div className="pain-sheet-front relative z-10 border border-ink-fg/55 bg-ink p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-fg/18 pb-3 font-mono text-micro tabular-nums">
                      <span className="font-semibold text-ink-fg">
                        公司统一 API 平台 · TASK #
                        {String(loopCycleCount).padStart(2, "0")}
                      </span>
                      <span className="text-danger">
                        STEP {String(activeLoopIndex + 1).padStart(2, "0")} / 05
                      </span>
                    </div>

                    {/* 5 步单线程机械操作行 */}
                    <div className="mt-3 divide-y divide-ink-fg/12 border border-ink-fg/18">
                      {FORM_STEPS.map((row, idx) => {
                        const isActive = idx === activeLoopIndex;
                        const isDone = idx < activeLoopIndex;
                        return (
                          <div
                            key={row.step}
                            className={`flex flex-col gap-1 px-3.5 py-2.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                              isActive
                                ? "bg-ink-fg text-ink"
                                : isDone
                                  ? "text-ink-fg/75"
                                  : "text-ink-fg/45"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-mono text-micro tabular-nums ${
                                  isActive
                                    ? "font-bold text-danger"
                                    : "opacity-70"
                                }`}
                              >
                                {row.step}
                              </span>
                              <span className="text-caption font-semibold">
                                {row.label}
                              </span>
                            </div>

                            <span
                              className={`font-mono text-micro ${
                                isActive ? "text-ink/80" : "opacity-75"
                              }`}
                            >
                              {row.value}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* 第 4 步专属：单通道串行进度条（GSAP 1:1 随滚动填充） */}
                    <div className="mt-3 flex items-center gap-3 font-mono text-micro">
                      <span className="shrink-0 text-ink-fg/60">
                        单条耗时进度
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden bg-ink-fg/15">
                        <div
                          className={`pain-form-progress h-full origin-left bg-danger ${
                            isPinnedDesktop
                              ? "scale-x-[0.06]"
                              : activeLoopIndex >= 3
                                ? "scale-x-100"
                                : "scale-x-25"
                          }`}
                        />
                      </div>
                      <span className="shrink-0 text-danger tabular-nums">
                        {activeLoopIndex === 4
                          ? "下载完毕 ↺ 重来"
                          : activeLoopIndex === 3
                            ? "04:52 阻塞中"
                            : "排队待提交"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 底部被锁在门外的排队资产条 */}
                <div className="border border-ink-fg/18 px-3.5 py-2.5 font-mono text-micro">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-ink-fg/65">
                      门外阻塞队列（无法同时生成）：
                    </span>
                    <span className="text-danger">LOCKED · 1 TASK MAX</span>
                  </div>
                  <div className="pain-blocked-queue mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    {WAITING_TASKS.map((task) => (
                      <div
                        key={task}
                        className="truncate border border-ink-fg/15 px-2 py-1 text-center text-ink-fg/65"
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 常驻底层控制条（永不被 clip-path 裁切，保障键盘焦点与自由跳幕） ===================== */}
        <div
          className={`relative z-30 border-t transition-colors lg:absolute lg:inset-x-0 lg:bottom-0 ${
            isStageOne
              ? "border-border bg-bg/95 text-fg"
              : "border-ink-fg/15 bg-ink/95 text-ink-fg"
          }`}
        >
          {/* 1px 全局进度细线 */}
          <div
            className={`h-px w-full overflow-hidden ${
              isStageOne ? "bg-border" : "bg-ink-fg/15"
            }`}
          >
            <div
              className={`pain-scrub-bar h-full origin-left ${
                isStageOne ? "bg-fg" : "bg-ink-fg"
              } ${
                isPinnedDesktop
                  ? "scale-x-0"
                  : isStageOne
                    ? "scale-x-50"
                    : "scale-x-100"
              }`}
            />
          </div>

          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 md:px-10 lg:px-12">
            <p
              className={`font-mono text-micro tabular-nums ${
                isStageOne ? "text-fg-muted" : "text-ink-fg/65"
              }`}
            >
              {isStageOne
                ? "01 / 02 · 继续向下滚动，看 5 个平台如何坍缩成单线程死循环 ↓"
                : "02 / 02 · 继续向下滚动，进入 OpenFlow 横向无限画布破局 ↓"}
            </p>

            <div
              role="tablist"
              aria-label="切换痛点情景幕次"
              className="flex items-center gap-2"
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
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-caption font-medium transition-colors ${
                      selected
                        ? isStageOne
                          ? "border-ink bg-ink text-ink-fg"
                          : "border-ink-fg bg-ink-fg text-ink"
                        : isStageOne
                          ? "border-border-strong bg-bg text-fg-secondary hover:border-fg hover:text-fg"
                          : "border-ink-fg/30 bg-transparent text-ink-fg/75 hover:border-ink-fg hover:text-ink-fg"
                    }`}
                  >
                    <span className="font-mono text-micro opacity-75">
                      {item.index}
                    </span>
                    <span>
                      {idx === 0 ? "多平台会员割裂" : "统一 API 单线程循环"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
