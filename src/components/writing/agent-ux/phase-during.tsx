"use client";

import { useEffect, useId, useState } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { DemoStage } from "./demo-stage";

/* ───────────────────────────────────────────────────────────────────────────
 * 04 执行透明度（Execution Transparency）
 * ─────────────────────────────────────────────────────────────────────────── */

const TRACE_STEPS = [
  {
    id: "understand",
    zhTitle: "理解需求与约束",
    enTitle: "Understand constraints",
    zhSummary: "提取出发地深圳、5 天、中等预算",
    enSummary: "Extracted Shenzhen → Tokyo, 5 days, mid budget",
    zhDetail: "解析偏好：优先直飞、酒店近地铁站、避开早高峰排程。",
    enDetail:
      "Parsed preferences: direct flights, near subway, avoid peak-hour crowds.",
  },
  {
    id: "flights",
    zhTitle: "搜索往返航班",
    enTitle: "Search flights",
    zhSummary: "比对 4 个平台，筛出 3 班高性价比直飞",
    enSummary: "Checked 4 platforms, shortlisted 3 direct flights",
    zhDetail:
      "查询羽田 / 成田共 42 班航班，剔除红眼与中转，锁定 ANA 与日航直飞 ¥3,860 起。",
    enDetail:
      "Scanned 42 HND/NRT flights, filtered out layovers, shortlisted ANA & JAL from ¥3,860.",
  },
  {
    id: "hotels",
    zhTitle: "对比 3 家候选酒店",
    enTitle: "Compare 3 hotels",
    zhSummary: "核对评分、步行距离与免费取消政策",
    enSummary: "Checked ratings, walk times & cancellation policy",
    zhDetail:
      "对比新宿格拉斯丽、浅草里士满、上野三井花园，按通勤时间与每晚预算打分。",
    enDetail:
      "Scored Gracery Shinjuku, Richmond Asakusa, and Mitsui Garden Ueno on transit & rate.",
  },
  {
    id: "draft",
    zhTitle: "生成 5 日行程草稿",
    enTitle: "Draft 5-day itinerary",
    zhSummary: "按地理区域聚类，减少跨城折返",
    enSummary: "Clustered stops by neighborhood to cut transit",
    zhDetail:
      "按浅草上野 → 涩谷原宿 → 镰仓 → 银座台场编排，标注开放时间与交通换乘。",
    enDetail:
      "Grouped Asakusa/Ueno → Shibuya/Harajuku → Kamakura → Ginza with opening hours.",
  },
];

export function ExecutionTransparencyDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [completedCount, setCompletedCount] = useState(2);
  const [running, setRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (completedCount >= TRACE_STEPS.length) {
      setRunning(false);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 120 : 850;
    const timer = window.setTimeout(() => {
      setCompletedCount((c) => c + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [running, completedCount]);

  const startRun = () => {
    setCompletedCount(0);
    setRunning(true);
  };

  return (
    <DemoStage
      code="04"
      ariaLabel={{
        zh: "执行透明度与渐进式披露演示",
        en: "Execution transparency and progressive disclosure demo",
      }}
      hint={{
        zh: "点击「运行演示」看步骤推进，切换「展开细节」对比摘要层与核查层的信息量",
        en: "Run the trace and toggle details to compare summary vs. audit density",
      }}
      statusLabel={`${Math.min(completedCount, TRACE_STEPS.length)} / ${TRACE_STEPS.length}`}
      onReset={() => {
        setRunning(false);
        setCompletedCount(2);
        setShowDetails(false);
      }}
      caption={{
        zh: "默认只展示人话进度摘要，点击「展开细节」才披露检索平台与筛选明细，兼顾清爽与可核查。",
        en: "Plain-language progress by default, with tool and search details revealed only when expanded.",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startRun}
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 sm:min-h-9"
            >
              {running
                ? isEn
                  ? "Running…"
                  : "执行中…"
                : completedCount >= TRACE_STEPS.length
                  ? isEn
                    ? "Replay run"
                    : "重新运行"
                  : isEn
                    ? "Run demo"
                    : "运行演示"}
            </button>

            <button
              type="button"
              aria-expanded={showDetails}
              onClick={() => setShowDetails((prev) => !prev)}
              className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg transition-colors hover:bg-surface sm:min-h-9"
            >
              {showDetails
                ? isEn
                  ? "Hide details"
                  : "收起细节"
                : isEn
                  ? "Expand details"
                  : "展开细节"}
            </button>
          </div>

          <span className="font-mono text-micro text-fg-muted">
            {showDetails
              ? isEn
                ? "LEVEL 2 · AUDIT TRACE"
                : "层级 2 · 核查明细"
              : isEn
                ? "LEVEL 1 · SUMMARY"
                : "层级 1 · 简洁摘要"}
          </span>
        </div>

        <ol className="divide-y divide-border border border-border">
          {TRACE_STEPS.map((step, idx) => {
            const done = idx < completedCount;
            const active = running && idx === completedCount;
            return (
              <li
                key={step.id}
                className={`flex flex-col gap-1.5 px-3.5 py-3 transition-colors ${
                  active ? "bg-surface" : "bg-bg"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-5 shrink-0 items-center justify-center border font-mono text-micro ${
                        done
                          ? "border-fg bg-ink text-ink-fg"
                          : active
                            ? "border-fg text-fg"
                            : "border-border text-fg-muted"
                      }`}
                    >
                      {done ? "✓" : active ? "…" : idx + 1}
                    </span>
                    <span
                      className={`text-label font-medium ${
                        done || active ? "text-fg" : "text-fg-muted"
                      }`}
                    >
                      {isEn ? step.enTitle : step.zhTitle}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-micro text-fg-muted">
                    {done
                      ? isEn
                        ? "DONE"
                        : "完成"
                      : active
                        ? isEn
                          ? "ACTIVE"
                          : "进行中"
                        : isEn
                          ? "PENDING"
                          : "待执行"}
                  </span>
                </div>

                <p className="pl-7 text-caption text-fg-secondary">
                  {isEn ? step.enSummary : step.zhSummary}
                </p>

                {showDetails ? (
                  <p className="ml-7 mt-1 border-l-2 border-border-strong bg-surface px-3 py-2 font-mono text-micro leading-relaxed text-fg-secondary">
                    {isEn ? step.enDetail : step.zhDetail}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 05 人机协同与授权（Human-in-the-Loop）
 * ─────────────────────────────────────────────────────────────────────────── */

type AutonomyMode = "every" | "risky" | "auto";

const HITL_ACTIONS = [
  {
    id: "search",
    zh: "搜索往返航班",
    en: "Search round-trip flights",
    risk: "low" as const,
  },
  {
    id: "save",
    zh: "保存备选到行程清单",
    en: "Save options to shortlist",
    risk: "low" as const,
  },
  {
    id: "hotel",
    zh: "预订新宿酒店 · ¥2,380",
    en: "Book Shinjuku hotel · ¥2,380",
    risk: "high" as const,
  },
  {
    id: "pay",
    zh: "支付机票订单 · ¥4,100",
    en: "Pay for flight tickets · ¥4,100",
    risk: "high" as const,
  },
];

export function HumanInTheLoopDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const tabIdBase = useId();

  const [mode, setMode] = useState<AutonomyMode>("risky");
  const [takenOver, setTakenOver] = useState(false);

  const modes: { id: AutonomyMode; zh: string; en: string }[] = [
    { id: "every", zh: "每步都问", en: "Ask every step" },
    { id: "risky", zh: "有风险才问（推荐）", en: "Ask on risk (Recommended)" },
    { id: "auto", zh: "全自动", en: "Full auto" },
  ];

  const needsApproval = (risk: "low" | "high") => {
    if (mode === "every") return true;
    if (mode === "risky") return risk === "high";
    return false;
  };

  const confirmCount = HITL_ACTIONS.filter((a) => needsApproval(a.risk)).length;

  return (
    <DemoStage
      code="05"
      ariaLabel={{
        zh: "自主性分级与人机协同授权演示",
        en: "Levels of autonomy and human-in-the-loop authorization demo",
      }}
      hint={{
        zh: "切换三种自主模式，观察确认次数变化；点击右下角可体验随时暂停并接管",
        en: "Switch autonomy modes to see approval counts update, or click Pause & take over",
      }}
      statusLabel={
        takenOver
          ? isEn
            ? "HUMAN TAKEOVER"
            : "已由你接管"
          : isEn
            ? `${confirmCount} CONFIRMATIONS`
            : `需确认 ${confirmCount} 次`
      }
      onReset={() => {
        setMode("risky");
        setTakenOver(false);
      }}
      caption={{
        zh: "把确认用在不可逆的刀刃上（如预订与付款），避免确认疲劳，同时始终保留「暂停并接管」。",
        en: "Reserve approvals for irreversible actions like payments to prevent confirmation fatigue, while keeping a manual takeover exit.",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* 自主性模式切换 */}
        <div
          role="tablist"
          aria-label={isEn ? "Autonomy level" : "自主性模式"}
          className="demo-tablist gap-1"
        >
          {modes.map((item) => {
            const selected = mode === item.id;
            return (
              <button
                key={item.id}
                id={`${tabIdBase}-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setMode(item.id);
                  setTakenOver(false);
                }}
                className={`demo-tab min-h-11 px-3.5 text-caption font-medium transition-colors sm:min-h-9 ${
                  selected ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {isEn ? item.en : item.zh}
              </button>
            );
          })}
        </div>

        {/* 操作列表 */}
        <div
          role="tabpanel"
          aria-labelledby={`${tabIdBase}-${mode}`}
          className="flex flex-col gap-3"
        >
          <ul className="divide-y divide-border border border-border">
            {HITL_ACTIONS.map((action) => {
              const ask = needsApproval(action.risk);
              const isHigh = action.risk === "high";
              return (
                <li
                  key={action.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-label font-medium text-fg">
                      {isEn ? action.en : action.zh}
                    </span>
                    <span
                      className={`font-mono text-micro ${
                        isHigh ? "text-danger" : "text-fg-muted"
                      }`}
                    >
                      {isHigh
                        ? isEn
                          ? "HIGH RISK · IRREVERSIBLE / SPENDING"
                          : "高风险 · 涉及付款且不可撤回"
                        : isEn
                          ? "LOW RISK · READ-ONLY / REVERSIBLE"
                          : "低风险 · 可随时撤回"}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 border px-2.5 py-1 font-mono text-micro font-medium ${
                      ask
                        ? "border-fg bg-ink text-ink-fg"
                        : "border-border bg-surface text-fg-secondary"
                    }`}
                  >
                    {ask
                      ? isEn
                        ? "Ask first"
                        : "先问你"
                      : isEn
                        ? "Auto-run"
                        : "自动做"}
                  </span>
                </li>
              );
            })}
          </ul>

          {mode === "auto" ? (
            <p className="border border-danger/40 bg-surface px-3 py-2 text-caption text-danger">
              {isEn
                ? "Notice: In Full Auto, spending actions run without stopping. Most consumer products cap high-risk spending with an explicit spending limit."
                : "提示：全自动模式下付款不再停顿。实际产品中通常仍会对高风险资金动作设置额度上限。"}
            </p>
          ) : null}

          {takenOver ? (
            <div className="border-l-2 border-fg bg-surface px-3.5 py-3 text-caption text-fg">
              {isEn
                ? "Agent paused cleanly. State preserved — you can edit the hotel selection manually or hand control back."
                : "Agent 已立即暂停并保留当前状态。你可以亲自修改酒店选项，或随时交还给 Agent 继续。"}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="font-mono text-caption text-fg-secondary tabular-nums">
              {isEn
                ? `You will be asked ${confirmCount} time${confirmCount === 1 ? "" : "s"}`
                : `本次任务你需要确认：${confirmCount} 次`}
            </span>

            <button
              type="button"
              onClick={() => setTakenOver((prev) => !prev)}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-caption font-medium transition-colors sm:min-h-9 ${
                takenOver
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border-strong bg-bg text-fg hover:bg-surface"
              }`}
            >
              {takenOver
                ? isEn
                  ? "Resume Agent"
                  : "交还给 Agent 继续"
                : isEn
                  ? "Pause & take over"
                  : "暂停并接管"}
            </button>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 06 异步与长任务（Async & Long-running Tasks）
 * ─────────────────────────────────────────────────────────────────────────── */

type AsyncPhase = "foreground" | "background" | "notified" | "opened";

export function AsyncLongTaskDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [phase, setPhase] = useState<AsyncPhase>("foreground");
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    if (phase !== "background") return;
    const t1 = window.setTimeout(() => setProgress(72), 850);
    const t2 = window.setTimeout(() => {
      setProgress(100);
      setPhase("notified");
    }, 1850);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [phase]);

  const sendToBackground = () => {
    setProgress(35);
    setPhase("background");
  };

  return (
    <DemoStage
      code="06"
      ariaLabel={{
        zh: "异步长任务转入后台与完成通知演示",
        en: "Async long-running task background handoff and notification demo",
      }}
      hint={{
        zh: "点击「转到后台」收起长任务，等待 2 秒体验完成后主动召回通知",
        en: "Send the 20-min research task to the background and wait ~2s for the completion alert",
      }}
      statusLabel={
        phase === "foreground"
          ? "35% · ACTIVE"
          : phase === "background"
            ? `${progress}% · BG`
            : "100% · READY"
      }
      onReset={() => {
        setProgress(35);
        setPhase("foreground");
      }}
      caption={{
        zh: "按钮文案同时给出两个承诺：现在可以放心离开，做完了系统会主动叫你回来。",
        en: "The action makes two promises at once: you are free to leave, and the system will call you back when ready.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        {phase === "foreground" ? (
          <div className="flex flex-col gap-4 border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-label font-semibold text-fg">
                  {isEn
                    ? "Deep Research: Tokyo Accommodation"
                    : "深度调研：东京住宿对比"}
                </p>
                <p className="mt-0.5 font-mono text-caption text-fg-muted tabular-nums">
                  {isEn
                    ? "~20 min remaining · 35% completed"
                    : "预计还需约 20 分钟 · 已完成 35%"}
                </p>
              </div>
              <span className="border border-border bg-surface px-2 py-0.5 font-mono text-micro text-fg-secondary">
                {isEn ? "LONG TASK" : "长任务"}
              </span>
            </div>

            <div
              aria-hidden="true"
              className="h-1.5 w-full overflow-hidden bg-surface-recessed"
            >
              <div className="h-full w-[35%] bg-fg" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-caption text-fg-secondary">
                {isEn
                  ? "Checking 28 hotels across 4 neighborhoods…"
                  : "正在交叉比对 4 个商圈共 28 家酒店评价与交通…"}
              </span>
              <button
                type="button"
                onClick={sendToBackground}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 sm:min-h-9"
              >
                {isEn
                  ? "Run in background & notify me"
                  : "转到后台，完成后通知我"}
              </button>
            </div>
          </div>
        ) : null}

        {phase === "background" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 border border-border bg-surface px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="signal-dot size-2 rounded-full bg-fg"
                />
                <span className="text-caption font-medium text-fg">
                  {isEn
                    ? "Task Center · 1 task running in background"
                    : "任务中心 · 1 个任务正在后台运行"}
                </span>
              </div>
              <span className="font-mono text-micro text-fg-muted tabular-nums">
                {progress}%
              </span>
            </div>
            <p className="py-4 text-center text-caption text-fg-muted">
              {isEn
                ? "You switched to other work… (fast-forwarding 20 min to 2s)"
                : "你已切去处理其他工作…（演示加速：2 秒后完成）"}
            </p>
          </div>
        ) : null}

        {phase === "notified" ? (
          <div className="flex flex-col gap-3 border-2 border-fg bg-surface p-4">
            <div className="flex items-center justify-between gap-2 font-mono text-micro text-fg">
              <span>
                {isEn ? "NOTIFICATION · COMPLETED" : "完成通知 · 可立即接续"}
              </span>
              <span>100%</span>
            </div>
            <p className="text-label font-semibold text-fg">
              {isEn
                ? "Tokyo accommodation report is ready (3 top picks shortlisted)."
                : "「深度调研：东京住宿对比」已完成，已整理出 3 家高匹配度酒店。"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPhase("opened")}
                className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 sm:min-h-9"
              >
                {isEn ? "Open result" : "查看调研结果"}
              </button>
            </div>
          </div>
        ) : null}

        {phase === "opened" ? (
          <div className="flex flex-col gap-3 border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-semibold text-fg">
                {isEn ? "Shortlisted Tokyo Hotels" : "东京住宿优选清单"}
              </p>
              <span className="font-mono text-micro text-fg-muted">
                {isEn ? "28 SCANNED → 3 PICKED" : "28 选 3"}
              </span>
            </div>
            <ul className="divide-y divide-border border-t border-border text-caption">
              <li className="flex justify-between gap-3 py-2.5">
                <span className="font-medium text-fg">
                  {isEn ? "1. Richmond Hotel Asakusa" : "1. 浅草里士满酒店"}
                </span>
                <span className="font-mono text-fg-secondary tabular-nums">
                  ¥1,180 / {isEn ? "night" : "晚"}
                </span>
              </li>
              <li className="flex justify-between gap-3 py-2.5">
                <span className="font-medium text-fg">
                  {isEn ? "2. Mitsui Garden Ueno" : "2. 上野三井花园酒店"}
                </span>
                <span className="font-mono text-fg-secondary tabular-nums">
                  ¥1,320 / {isEn ? "night" : "晚"}
                </span>
              </li>
              <li className="flex justify-between gap-3 py-2.5">
                <span className="font-medium text-fg">
                  {isEn ? "3. Hotel Gracery Shinjuku" : "3. 新宿格拉斯丽酒店"}
                </span>
                <span className="font-mono text-fg-secondary tabular-nums">
                  ¥1,490 / {isEn ? "night" : "晚"}
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 07 容错与恢复（Error Handling & Recovery）
 * ─────────────────────────────────────────────────────────────────────────── */

type RecoveryResolution =
  | "error"
  | "retrying"
  | "retried"
  | "switched"
  | "skipped";

export function ErrorRecoveryDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [resolution, setResolution] = useState<RecoveryResolution>("error");

  const handleAction = (next: "retried" | "switched" | "skipped") => {
    if (next === "skipped") {
      setResolution("skipped");
      return;
    }
    setResolution("retrying");
    window.setTimeout(() => {
      setResolution(next);
    }, 650);
  };

  const step3Status =
    resolution === "error"
      ? "error"
      : resolution === "retrying"
        ? "retrying"
        : resolution === "skipped"
          ? "skipped"
          : "done";

  const step4Done =
    resolution === "retried" ||
    resolution === "switched" ||
    resolution === "skipped";

  return (
    <DemoStage
      code="07"
      ariaLabel={{
        zh: "容错归因与断点续做演示",
        en: "Error attribution and checkpoint resume demo",
      }}
      hint={{
        zh: "前 2 步进度已保存，任选下方 3 个恢复按钮体验从第 3 步断点续做",
        en: "Steps 1–2 stay saved; try any of the 3 recovery actions to resume from step 3",
      }}
      statusLabel={
        resolution === "error"
          ? isEn
            ? "STEP 3 BLOCKED"
            : "卡在第 3 步"
          : resolution === "retrying"
            ? isEn
              ? "RESUMING…"
              : "续做中…"
            : isEn
              ? "RECOVERED"
              : "已恢复完成"
      }
      onReset={() => setResolution("error")}
      caption={{
        zh: "说清错误归因（非用户问题），并保留已完成步骤，让每条补救路径都不必从第 1 步重来。",
        en: "Explain what failed and why, preserve completed checkpoints, and offer recovery paths without restarting from step 1.",
      }}
    >
      <div className="flex flex-col gap-3" aria-live="polite">
        <ol className="divide-y divide-border border border-border">
          {/* 第 1、2 步：已保存断点 */}
          <li className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-label">
            <span className="flex items-center gap-2.5 text-fg">
              <span className="inline-flex size-5 items-center justify-center border border-fg bg-ink font-mono text-micro text-ink-fg">
                ✓
              </span>
              {isEn ? "1. Search round-trip flights" : "1. 搜索往返航班"}
            </span>
            <span className="font-mono text-micro text-fg-muted">
              {isEn ? "CHECKPOINT SAVED" : "断点已保存"}
            </span>
          </li>

          <li className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-label">
            <span className="flex items-center gap-2.5 text-fg">
              <span className="inline-flex size-5 items-center justify-center border border-fg bg-ink font-mono text-micro text-ink-fg">
                ✓
              </span>
              {isEn
                ? "2. Lock travel dates (May 12–17)"
                : "2. 锁定日期（5 月 12–17 日）"}
            </span>
            <span className="font-mono text-micro text-fg-muted">
              {isEn ? "CHECKPOINT SAVED" : "断点已保存"}
            </span>
          </li>

          {/* 第 3 步：异常与恢复区 */}
          <li className="flex flex-col gap-3 bg-surface px-3.5 py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2.5 text-label font-medium text-fg">
                <span
                  className={`inline-flex size-5 items-center justify-center border font-mono text-micro ${
                    step3Status === "error"
                      ? "border-danger text-danger"
                      : step3Status === "done"
                        ? "border-fg bg-ink text-ink-fg"
                        : "border-border-strong text-fg-secondary"
                  }`}
                >
                  {step3Status === "error"
                    ? "!"
                    : step3Status === "done"
                      ? "✓"
                      : step3Status === "skipped"
                        ? "→"
                        : "…"}
                </span>
                {isEn ? "3. Query Tokyo hotels" : "3. 查询东京酒店"}
              </span>

              <span
                className={`font-mono text-micro ${
                  step3Status === "error" ? "text-danger" : "text-fg-muted"
                }`}
              >
                {step3Status === "error"
                  ? isEn
                    ? "TIMEOUT"
                    : "来源无响应"
                  : step3Status === "retrying"
                    ? isEn
                      ? "RETRYING"
                      : "正在续做"
                    : step3Status === "skipped"
                      ? isEn
                        ? "SKIPPED"
                        : "已先跳过"
                      : isEn
                        ? "RESUMED"
                        : "续做成功"}
              </span>
            </div>

            {resolution === "error" ? (
              <>
                <div className="ml-7 border-l-2 border-danger pl-3 text-caption">
                  <p className="font-medium text-fg">
                    {isEn
                      ? "The hotel site did not respond — this is not your fault."
                      : "酒店网站暂时没有响应，这不是你的问题。"}
                  </p>
                  <p className="mt-0.5 text-fg-muted">
                    {isEn
                      ? "Steps 1–2 remain intact. Resume directly from step 3 without starting over:"
                      : "第 1、2 步结果已完整保留，将直接从第 3 步恢复，无需重来："}
                  </p>
                </div>

                <div className="ml-7 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction("retried")}
                    className="inline-flex min-h-11 items-center rounded-full bg-ink px-3.5 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
                  >
                    {isEn ? "Retry step 3" : "重试第 3 步"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("switched")}
                    className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg hover:bg-surface-recessed sm:min-h-9"
                  >
                    {isEn ? "Switch source" : "换一个来源"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("skipped")}
                    className="inline-flex min-h-11 items-center rounded-full border border-border bg-bg px-3.5 text-caption font-medium text-fg-secondary hover:border-border-strong hover:text-fg sm:min-h-9"
                  >
                    {isEn ? "Skip for now" : "先跳过"}
                  </button>
                </div>
              </>
            ) : null}

            {resolution === "retried" ? (
              <p className="ml-7 text-caption text-fg-secondary">
                {isEn
                  ? "Reconnected on retry from checkpoint 3 — fetched 3 hotel quotes without redoing flights."
                  : "从第 3 步重试成功，已拉取 3 家酒店报价，未重复跑前两步。"}
              </p>
            ) : null}

            {resolution === "switched" ? (
              <p className="ml-7 text-caption text-fg-secondary">
                {isEn
                  ? "Gracefully fell back to backup hotel source — fetched 3 options from checkpoint 3."
                  : "已自动降级切换至备用酒店数据源，直接从第 3 步补齐报价。"}
              </p>
            ) : null}

            {resolution === "skipped" ? (
              <p className="ml-7 text-caption text-fg-secondary">
                {isEn
                  ? "Hotel step parked as a to-do placeholder so your daily itinerary can still finish now."
                  : "已将酒店预订标记为稍后补填，先为你继续生成完整 5 日路线。"}
              </p>
            ) : null}
          </li>

          {/* 第 4 步 */}
          <li className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-label">
            <span
              className={`flex items-center gap-2.5 ${
                step4Done ? "text-fg" : "text-fg-muted"
              }`}
            >
              <span
                className={`inline-flex size-5 items-center justify-center border font-mono text-micro ${
                  step4Done
                    ? "border-fg bg-ink text-ink-fg"
                    : "border-border text-fg-muted"
                }`}
              >
                {step4Done ? "✓" : "4"}
              </span>
              {isEn ? "4. Assemble final itinerary" : "4. 汇总生成最终行程"}
            </span>
            <span className="font-mono text-micro text-fg-muted">
              {step4Done
                ? isEn
                  ? "DONE"
                  : "完成"
                : isEn
                  ? "WAITING"
                  : "等待中"}
            </span>
          </li>
        </ol>
      </div>
    </DemoStage>
  );
}
