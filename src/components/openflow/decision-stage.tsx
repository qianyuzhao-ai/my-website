"use client";

import { useState } from "react";
import { openflowStory } from "@/lib/openflow-story";

/**
 * 板块 03 上篇：产品决策与形态取舍（为什么自己做 → 竞品调研 → 对话框 vs 无限画布）
 * 严格遵循全站 Monochrome Architectural Editorial 视觉规范（0px 锐利直角容器 × 9999px 胶囊控件 × 单色图纸线框）。
 */
export function DecisionStage() {
  const { decisionStory } = openflowStory;
  const [focusMode, setFocusMode] = useState<"both" | "chat" | "canvas">(
    "both",
  );

  return (
    <section
      id="openflow-decision"
      aria-labelledby="decision-heading"
      className="border-b border-border bg-bg text-fg"
    >
      <div className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:px-10 md:py-24 lg:px-12">
        {/* 1. 决策起点：不等研发排期，自己做 */}
        <div
          data-reveal
          className="grid grid-cols-1 gap-6 border-b border-border pb-12 lg:grid-cols-12 lg:items-start lg:gap-10"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
              03 {"//"} HOW I BUILT IT
            </p>
            <h2
              id="decision-heading"
              className="mt-2.5 text-[24px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[32px]"
            >
              {decisionStory.heading}
            </h2>
          </div>

          <div className="space-y-3 border-l border-border pl-5 lg:col-span-7 lg:pl-7">
            <h3 className="text-[19px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[22px]">
              {decisionStory.triggerTitle}
            </h3>
            <p className="max-w-[60ch] text-label leading-[1.75] text-fg-secondary md:text-[15px]">
              {decisionStory.triggerBody}
            </p>
          </div>
        </div>

        {/* 2. 竞品调研：Lovart / LibTV / 小云雀 → 收敛到无限画布 */}
        <div data-reveal className="py-12 border-b border-border">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                RESEARCH {"//"} MARKET BENCHMARK
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-fg md:text-[24px]">
                {decisionStory.researchHeading}
              </h3>
            </div>
            <p className="max-w-[46ch] text-caption leading-relaxed text-fg-secondary">
              {decisionStory.researchLead}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 divide-y divide-border border border-border bg-bg md:grid-cols-3 md:divide-x md:divide-y-0">
            {decisionStory.competitors.map((item) => (
              <article
                key={item.name}
                className="flex flex-col justify-between p-5 sm:p-6"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
                    <span>{item.index}</span>
                    <span>{item.angle}</span>
                  </div>
                  <h4 className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-fg">
                    {item.name}
                  </h4>
                  <p className="mt-2 text-label leading-[1.68] text-fg-secondary">
                    {item.takeaway}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* 调研收敛结论条 */}
          <div className="mt-4 flex flex-col gap-2 border border-fg bg-ink px-5 py-4 text-ink-fg sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-micro tracking-widest text-ink-fg/70 uppercase">
              {decisionStory.verdictLabel}
            </span>
            <p className="text-label font-semibold tracking-[-0.01em] md:text-[15px]">
              {decisionStory.verdictTitle}
            </p>
          </div>
        </div>

        {/* 3. 核心产品取舍对比：对话框形态 vs 无限画布形态 */}
        <div data-reveal className="pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                TRADE-OFF {"//"} FORM FACTOR DECISION
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-fg md:text-[24px]">
                {decisionStory.comparisonHeading}
              </h3>
              <p className="mt-1.5 max-w-[54ch] text-label text-fg-secondary">
                {decisionStory.comparisonLead}
              </p>
            </div>

            {/* 胶囊视角切换器（支持聚焦对比，桌面默认双栏同屏） */}
            <fieldset className="flex flex-wrap gap-1.5 border-0 p-0">
              <legend className="sr-only">形态对比聚焦切换</legend>
              {(
                [
                  { id: "both", label: "双栏对比" },
                  { id: "chat", label: "看对话框局限" },
                  { id: "canvas", label: "看无限画布解法" },
                ] as const
              ).map((btn) => {
                const active = focusMode === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFocusMode(btn.id)}
                    className={`inline-flex min-h-9 items-center rounded-full border px-3.5 text-caption font-medium transition-colors ${
                      active
                        ? "border-ink bg-ink text-ink-fg"
                        : "border-border-strong bg-bg text-fg-secondary hover:border-fg hover:text-fg"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </fieldset>
          </div>

          {/* 左右双形态建筑线框实景对比 */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* 左：对话框形态 */}
            <article
              className={`flex flex-col justify-between border border-border bg-surface p-5 transition-opacity duration-200 sm:p-6 ${
                focusMode === "canvas" ? "opacity-45" : "opacity-100"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-micro">
                  <span className="text-fg-muted">
                    {decisionStory.chatOption.tag}
                  </span>
                  <span className="font-semibold text-danger">
                    无法解决反复上传下载
                  </span>
                </div>

                <h4 className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-fg md:text-[21px]">
                  {decisionStory.chatOption.title}
                </h4>

                {/* 极简线性对话框线框图：直观呈现「每一步仍要下载再上传」 */}
                <div className="mt-4 border border-border bg-bg p-4 font-mono text-micro">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border border-border px-3 py-2 text-fg-secondary">
                      <span>[对话 1] 上传人像图 → 生成融合图</span>
                      <span className="text-danger">↓ 下载到本地</span>
                    </div>
                    <div className="flex justify-center text-danger">
                      ↓ 人工翻找本地文件，重新上传 ↓
                    </div>
                    <div className="flex items-center justify-between border border-border px-3 py-2 text-fg-secondary">
                      <span>[对话 2] 再传融合图 → 生成视频</span>
                      <span className="text-danger">↓ 再次下载</span>
                    </div>
                    <div className="flex items-center justify-between border border-dashed border-border-strong px-3 py-2 text-fg-muted">
                      <span>[对话 3] 换一个镜头？</span>
                      <span>只能从头再来</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-label leading-[1.68] text-fg-secondary">
                  <p>
                    <strong className="font-semibold text-fg">优势：</strong>
                    {decisionStory.chatOption.pros}
                  </p>
                  <p>
                    <strong className="font-semibold text-fg">
                      致命短板：
                    </strong>
                    {decisionStory.chatOption.cons}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-3 font-mono text-micro font-medium text-danger">
                ✕ {decisionStory.chatOption.verdict}
              </div>
            </article>

            {/* 右：无限画布形态（最终选择，含 GSAP 自动绘线 SVG 拓扑图） */}
            <article
              className={`flex flex-col justify-between border-2 border-fg bg-bg p-5 transition-opacity duration-200 sm:p-6 ${
                focusMode === "chat" ? "opacity-45" : "opacity-100"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-micro">
                  <span className="font-semibold text-fg">
                    {decisionStory.canvasOption.tag}
                  </span>
                  <span className="font-semibold text-fg">
                    ✓ 资产直连 · 并发编排
                  </span>
                </div>

                <h4 className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-fg md:text-[21px]">
                  {decisionStory.canvasOption.title}
                </h4>

                {/* 极简单色无限画布拓扑图（GSAP 进入视口时沿贝塞尔连线绘出数据流） */}
                <div className="lab-grid mt-4 border border-border bg-surface p-3 sm:p-4">
                  <svg
                    viewBox="0 0 480 156"
                    fill="none"
                    role="img"
                    aria-label="无限画布节点直连与并发分叉示意图"
                    className="h-auto w-full"
                  >
                    {/* 静态虚线底轨 */}
                    <path
                      d="M 118 44 C 156 44, 156 78, 192 78 M 118 112 C 156 112, 156 78, 192 78"
                      stroke="var(--border-strong)"
                      strokeWidth="1.25"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M 294 78 C 330 78, 330 34, 362 34 M 294 78 L 362 78 M 294 78 C 330 78, 330 122, 362 122"
                      stroke="var(--border-strong)"
                      strokeWidth="1.25"
                      strokeDasharray="3 3"
                    />

                    {/* GSAP 动态绘制的单色建筑实线 */}
                    <path
                      className="decision-canvas-wire"
                      d="M 118 44 C 156 44, 156 78, 192 78"
                      stroke="var(--lineart-primary)"
                      strokeWidth="2"
                    />
                    <path
                      className="decision-canvas-wire"
                      d="M 118 112 C 156 112, 156 78, 192 78"
                      stroke="var(--lineart-primary)"
                      strokeWidth="2"
                    />
                    <path
                      className="decision-canvas-wire"
                      d="M 294 78 C 330 78, 330 34, 362 34"
                      stroke="var(--lineart-primary)"
                      strokeWidth="2"
                    />
                    <path
                      className="decision-canvas-wire"
                      d="M 294 78 L 362 78"
                      stroke="var(--lineart-primary)"
                      strokeWidth="2"
                    />
                    <path
                      className="decision-canvas-wire"
                      d="M 294 78 C 330 78, 330 122, 362 122"
                      stroke="var(--lineart-primary)"
                      strokeWidth="2"
                    />

                    {/* 左侧输入素材节点 */}
                    <rect
                      x="10"
                      y="24"
                      width="108"
                      height="40"
                      fill="var(--bg)"
                      stroke="var(--lineart-primary)"
                      strokeWidth="1.25"
                    />
                    <text
                      x="64"
                      y="48"
                      textAnchor="middle"
                      fill="var(--fg)"
                      fontSize="11"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      @人像参考图
                    </text>

                    <rect
                      x="10"
                      y="92"
                      width="108"
                      height="40"
                      fill="var(--bg)"
                      stroke="var(--lineart-primary)"
                      strokeWidth="1.25"
                    />
                    <text
                      x="64"
                      y="116"
                      textAnchor="middle"
                      fill="var(--fg)"
                      fontSize="11"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      @角色音色
                    </text>

                    {/* 中间核心编排节点 */}
                    <rect
                      x="192"
                      y="52"
                      width="102"
                      height="52"
                      fill="var(--ink)"
                      stroke="var(--ink)"
                      strokeWidth="1.5"
                    />
                    <text
                      x="243"
                      y="75"
                      textAnchor="middle"
                      fill="var(--ink-fg)"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="var(--font-geist-sans), sans-serif"
                    >
                      资产直连复用
                    </text>
                    <text
                      x="243"
                      y="92"
                      textAnchor="middle"
                      fill="var(--ink-fg)"
                      fillOpacity="0.72"
                      fontSize="10"
                      fontFamily="var(--font-geist-mono), monospace"
                    >
                      零下载 / 零重传
                    </text>

                    {/* 右侧 3 路并发输出节点 */}
                    {[
                      { y: 16, label: "并发镜头 01" },
                      { y: 60, label: "并发镜头 02" },
                      { y: 104, label: "并发镜头 03" },
                    ].map((out) => (
                      <g key={out.label}>
                        <rect
                          x="362"
                          y={out.y}
                          width="108"
                          height="36"
                          fill="var(--bg)"
                          stroke="var(--lineart-primary)"
                          strokeWidth="1.25"
                        />
                        <text
                          x="416"
                          y={out.y + 22}
                          textAnchor="middle"
                          fill="var(--fg)"
                          fontSize="11"
                          fontFamily="var(--font-geist-mono), monospace"
                        >
                          {out.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="mt-4 space-y-2 text-label leading-[1.68] text-fg-secondary">
                  <p>
                    <strong className="font-semibold text-fg">
                      核心价值：
                    </strong>
                    {decisionStory.canvasOption.pros}
                  </p>
                  <p>
                    <strong className="font-semibold text-fg">
                      权衡考量：
                    </strong>
                    {decisionStory.canvasOption.cons}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-3 font-mono text-micro font-semibold text-fg">
                ✓ {decisionStory.canvasOption.verdict}
              </div>
            </article>
          </div>

          {/* 3 行精炼取舍对照表 */}
          <div className="mt-5 border border-border bg-bg">
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {decisionStory.tradeoffs.map((row) => (
                <div key={row.metric} className="p-4 sm:p-5">
                  <div className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    {row.metric}
                  </div>
                  <div className="mt-2.5 space-y-1.5 text-caption">
                    <p className="text-fg-muted">
                      <span className="font-mono">对话框：</span>
                      {row.chat}
                    </p>
                    <p className="font-medium text-fg">
                      <span className="font-mono">无限画布：</span>
                      {row.canvas}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
