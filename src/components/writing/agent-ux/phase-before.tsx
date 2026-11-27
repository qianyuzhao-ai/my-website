"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { DemoStage } from "./demo-stage";

/* ───────────────────────────────────────────────────────────────────────────
 * 01 能力发现与入口（Discoverability & Entry）
 * ─────────────────────────────────────────────────────────────────────────── */

type RouteKind =
  | "idle"
  | "simple"
  | "complex-prompt"
  | "complex-task"
  | "complex-chat";

export function DiscoverabilityDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const inputId = useId();

  const simpleExample = isEn
    ? "Weather in Shanghai tomorrow?"
    : "明天上海天气怎么样？";
  const complexExample = isEn
    ? "Plan a 5-day Tokyo trip with flights & hotel"
    : "规划 5 天东京行程，含机票和酒店";

  const [query, setQuery] = useState(simpleExample);
  const [routeState, setRouteState] = useState<RouteKind>("simple");
  const [selectedPreset, setSelectedPreset] = useState<
    "simple" | "complex" | "custom"
  >("simple");

  // 语言切换时同步示例文案（若用户未自定义输入）
  useEffect(() => {
    if (selectedPreset === "simple") setQuery(simpleExample);
    if (selectedPreset === "complex") setQuery(complexExample);
  }, [complexExample, selectedPreset, simpleExample]);

  const evaluateQuery = (
    text: string,
    preset: "simple" | "complex" | "custom",
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSelectedPreset(preset);
    setQuery(trimmed);

    const isComplex =
      preset === "complex" ||
      /行程|规划|机票|酒店|调研|对比|trip|plan|flight|hotel|research|compare/i.test(
        trimmed,
      ) ||
      trimmed.length > 26;

    setRouteState(isComplex ? "complex-prompt" : "simple");
  };

  return (
    <DemoStage
      code="01"
      ariaLabel={{
        zh: "能力发现与自动分流交互演示",
        en: "Discoverability and automatic routing interactive demo",
      }}
      hint={{
        zh: "点击不同示例或自行输入，观察同一输入框如何按复杂度自动分流",
        en: "Click either example or type your own prompt to see automatic routing",
      }}
      statusLabel={
        routeState === "simple" || routeState === "complex-chat"
          ? isEn
            ? "CHAT MODE"
            : "对话模式"
          : routeState === "complex-task"
            ? isEn
              ? "TASK MODE"
              : "任务模式"
            : isEn
              ? "ROUTING"
              : "等待分流"
      }
      onReset={() => {
        setSelectedPreset("simple");
        setQuery(simpleExample);
        setRouteState("simple");
      }}
      caption={{
        zh: "同一个输入框根据任务复杂度自动分流：简单查询直接回复，复杂多步任务再建议切入任务模式。",
        en: "A single input routes by complexity: quick answers stay in chat while multi-step goals offer Task Mode.",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          evaluateQuery(query, "custom");
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor={inputId} className="sr-only">
          {isEn ? "Ask anything" : "输入你想做的事"}
        </label>
        <div className="flex items-center gap-2 border border-border-strong bg-surface-solid p-1.5 pl-3.5 focus-within:border-fg">
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => {
              setSelectedPreset("custom");
              setQuery(e.target.value);
            }}
            placeholder={
              isEn
                ? "Try typing a simple or multi-step task..."
                : "输入一个简单问题或复杂任务..."
            }
            className="min-h-10 min-w-0 flex-1 bg-transparent text-body text-fg placeholder:text-fg-muted focus:outline-none sm:text-label"
          />
          <button
            type="submit"
            aria-label={isEn ? "Send" : "发送"}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-ink-fg transition-opacity hover:opacity-85 sm:size-9"
          >
            ↑
          </button>
        </div>

        {/* 两个对比示例胶囊 */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-micro text-fg-muted uppercase">
            {isEn ? "Tap one to compare" : "点选示例对比分流"}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => evaluateQuery(simpleExample, "simple")}
              aria-pressed={selectedPreset === "simple"}
              className={`min-h-11 rounded-full border px-3.5 text-left text-caption font-medium transition-colors sm:min-h-9 ${
                selectedPreset === "simple"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border bg-bg text-fg hover:border-border-strong hover:bg-surface"
              }`}
            >
              {simpleExample}
            </button>
            <button
              type="button"
              onClick={() => evaluateQuery(complexExample, "complex")}
              aria-pressed={selectedPreset === "complex"}
              className={`min-h-11 rounded-full border px-3.5 text-left text-caption font-medium transition-colors sm:min-h-9 ${
                selectedPreset === "complex"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border bg-bg text-fg hover:border-border-strong hover:bg-surface"
              }`}
            >
              {complexExample}
            </button>
          </div>
        </div>

        {/* 分流结果反馈区 */}
        <div
          aria-live="polite"
          className="mt-1 border border-border bg-surface p-3.5 sm:p-4"
        >
          {routeState === "simple" ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-micro text-fg-muted">
                <span className="size-1.5 bg-fg" aria-hidden="true" />
                <span>
                  {isEn
                    ? "CHAT · DIRECT ANSWER (~1s)"
                    : "普通对话 · 直接回答（约 1 秒）"}
                </span>
              </div>
              <p className="text-label text-fg">
                {isEn
                  ? "Tomorrow in Shanghai: partly cloudy, 22–28°C, light southeast breeze. No Task Mode overhead needed."
                  : "明天上海多云，22–28°C，东南风微风。无需启动耗时的任务模式。"}
              </p>
            </div>
          ) : null}

          {routeState === "complex-prompt" ? (
            <div className="flex flex-col gap-3 border-l-2 border-fg pl-3.5">
              <div>
                <p className="text-label font-semibold text-fg">
                  {isEn
                    ? "This is a multi-step task"
                    : "这件事步骤较多，建议切到任务模式"}
                </p>
                <p className="mt-1 text-caption text-fg-secondary">
                  {isEn
                    ? "Estimated ~3 min · I will search flights, compare 3 hotels, and map daily routes. You can review the plan before anything runs."
                    : "预计约 3 分钟 · 将依次搜索机票、对比 3 家酒店并排好每天路线。执行前会先给你确认计划。"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRouteState("complex-task")}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 sm:min-h-9"
                >
                  {isEn ? "Switch to Task Mode" : "切换到任务模式"}
                </button>
                <button
                  type="button"
                  onClick={() => setRouteState("complex-chat")}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg transition-colors hover:bg-surface-recessed sm:min-h-9"
                >
                  {isEn ? "Stay in Chat" : "仅普通对话回复"}
                </button>
              </div>
            </div>
          ) : null}

          {routeState === "complex-task" ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-micro font-medium text-fg">
                <span className="size-1.5 bg-fg" aria-hidden="true" />
                <span>
                  {isEn
                    ? "TASK MODE ACTIVE · 4 STEPS QUEUED"
                    : "已进入任务模式 · 已拆解 4 个执行步骤"}
                </span>
              </div>
              <p className="text-caption text-fg-secondary">
                {isEn
                  ? "Workspace initialized with flight search, hotel comparison, itinerary planner, and budget tracker."
                  : "已准备调用航班检索、酒店比价、每日路线规划与预算汇总，随时可暂停或修改计划。"}
              </p>
            </div>
          ) : null}

          {routeState === "complex-chat" ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-micro text-fg-muted">
                <span>
                  {isEn
                    ? "CHAT MODE · QUICK OUTLINE ONLY"
                    : "普通对话 · 仅生成文字大纲"}
                </span>
              </div>
              <p className="text-caption text-fg-secondary">
                {isEn
                  ? "Kept your choice: replying with a quick text-only 5-day Tokyo outline without live flight or hotel lookups."
                  : "尊重你的选择：仅快速给出 5 天东京文字参考大纲，不调用实时机票与酒店检索。"}
              </p>
            </div>
          ) : null}
        </div>
      </form>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 02 意图表达与上下文（Intent & Context）
 * ─────────────────────────────────────────────────────────────────────────── */

type PresetKey = "tokyo" | "weekend" | "business";
type BudgetKey = "low" | "mid" | "high";

const INTENT_PRESETS: Record<
  PresetKey,
  {
    title: { zh: string; en: string };
    subtitle: { zh: string; en: string };
    origin: { zh: string; en: string };
    destination: { zh: string; en: string };
    days: number;
    people: number;
    budget: BudgetKey;
  }
> = {
  tokyo: {
    title: { zh: "东京深度自由行", en: "Tokyo 5-day trip" },
    subtitle: {
      zh: "机票 + 酒店 + 每日路线",
      en: "Flights + hotel + daily routes",
    },
    origin: { zh: "深圳", en: "Shenzhen" },
    destination: { zh: "东京", en: "Tokyo" },
    days: 5,
    people: 1,
    budget: "mid",
  },
  weekend: {
    title: { zh: "周末短途放松", en: "Weekend getaway" },
    subtitle: { zh: "2 天 · 周边城市", en: "2 days · nearby city" },
    origin: { zh: "上海", en: "Shanghai" },
    destination: { zh: "杭州", en: "Hangzhou" },
    days: 2,
    people: 2,
    budget: "low",
  },
  business: {
    title: { zh: "高效商务出差", en: "Business trip" },
    subtitle: {
      zh: "航班 + 靠近会场酒店 + 日程",
      en: "Flight + venue hotel + schedule",
    },
    origin: { zh: "北京", en: "Beijing" },
    destination: { zh: "新加坡", en: "Singapore" },
    days: 3,
    people: 1,
    budget: "high",
  },
};

export function IntentContextDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [activePreset, setActivePreset] = useState<PresetKey>("tokyo");
  const [days, setDays] = useState(5);
  const [people, setPeople] = useState(1);
  const [budget, setBudget] = useState<BudgetKey>("mid");
  const [sources, setSources] = useState<string[]>(["calendar"]);

  const preset = INTENT_PRESETS[activePreset];

  const applyPreset = (key: PresetKey) => {
    const next = INTENT_PRESETS[key];
    setActivePreset(key);
    setDays(next.days);
    setPeople(next.people);
    setBudget(next.budget);
  };

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const sourceList = [
    {
      id: "calendar",
      label: isEn ? "Calendar (avoid conflicts)" : "连接日历（避开会议）",
    },
    { id: "email", label: isEn ? "Booking emails" : "历史预订邮件" },
    {
      id: "doc",
      label: isEn ? "Saved wishlist.pdf" : "附件：东京想去清单.pdf",
    },
  ];

  const budgetLabels: Record<BudgetKey, { zh: string; en: string }> = {
    low: { zh: "经济（低）", en: "Low" },
    mid: { zh: "舒适（中）", en: "Mid" },
    high: { zh: "品质（高）", en: "High" },
  };

  const attachedNames = sourceList
    .filter((s) => sources.includes(s.id))
    .map((s) => s.label);

  return (
    <DemoStage
      code="02"
      ariaLabel={{
        zh: "意图表达与结构化上下文输入演示",
        en: "Structured intent and context input demo",
      }}
      hint={{
        zh: "点选模板或修改格子与附件，观察底部 AI 收到的完整需求摘要",
        en: "Pick a template, tweak slots or sources, and watch the structured brief update",
      }}
      onReset={() => {
        applyPreset("tokyo");
        setSources(["calendar"]);
      }}
      caption={{
        zh: "把「写一段提示词」变成「选示例、填格子、挂来源」——一个字没打，AI 已拿到完整上下文。",
        en: "Replace blank-page prompt writing with presets, structured slots, and connected sources.",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* 示例任务快选 */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-micro text-fg-muted uppercase">
            {isEn ? "1 · Start from an example" : "1 · 从示例任务起步"}
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(INTENT_PRESETS) as PresetKey[]).map((key) => {
              const item = INTENT_PRESETS[key];
              const selected = activePreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  aria-pressed={selected}
                  className={`flex min-h-11 flex-col items-start justify-center border px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "border-fg bg-ink text-ink-fg"
                      : "border-border bg-surface-solid text-fg hover:border-border-strong hover:bg-surface"
                  }`}
                >
                  <span className="text-caption font-semibold">
                    {isEn ? item.title.en : item.title.zh}
                  </span>
                  <span
                    className={`mt-0.5 text-micro ${
                      selected ? "opacity-80" : "text-fg-muted"
                    }`}
                  >
                    {isEn ? item.subtitle.en : item.subtitle.zh}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 三个结构化格子 */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-micro text-fg-muted uppercase">
            {isEn ? "2 · Refine structured slots" : "2 · 微调关键信息格子"}
          </span>
          <div className="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex flex-col gap-1 p-3">
              <span className="font-mono text-micro text-fg-muted uppercase">
                {isEn ? "Route" : "出发 / 目的地"}
              </span>
              <span className="text-label font-semibold text-fg">
                {isEn
                  ? `${preset.origin.en} → ${preset.destination.en}`
                  : `${preset.origin.zh} → ${preset.destination.zh}`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-micro text-fg-muted uppercase">
                  {isEn ? "Duration" : "天数"}
                </span>
                <span className="font-mono text-label font-semibold text-fg tabular-nums">
                  {isEn ? `${days} days` : `${days} 天`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={isEn ? "Decrease days" : "减少天数"}
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-label text-fg hover:border-fg sm:size-7"
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label={isEn ? "Increase days" : "增加天数"}
                  onClick={() => setDays((d) => Math.min(14, d + 1))}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-label text-fg hover:border-fg sm:size-7"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-micro text-fg-muted uppercase">
                  {isEn ? "Travelers" : "人数"}
                </span>
                <span className="font-mono text-label font-semibold text-fg tabular-nums">
                  {isEn
                    ? `${people} ${people > 1 ? "people" : "person"}`
                    : `${people} 人`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={isEn ? "Decrease travelers" : "减少人数"}
                  onClick={() => setPeople((p) => Math.max(1, p - 1))}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-label text-fg hover:border-fg sm:size-7"
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label={isEn ? "Increase travelers" : "增加人数"}
                  onClick={() => setPeople((p) => Math.min(8, p + 1))}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-label text-fg hover:border-fg sm:size-7"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 预算三档 + 外部来源 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-micro text-fg-muted uppercase">
              {isEn ? "Budget tier" : "预算档位"}
            </span>
            <div className="flex flex-wrap gap-2">
              {(["low", "mid", "high"] as BudgetKey[]).map((tier) => {
                const selected = budget === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBudget(tier)}
                    aria-pressed={selected}
                    className={`min-h-11 rounded-full border px-3.5 text-caption font-medium transition-colors sm:min-h-8 ${
                      selected
                        ? "border-fg bg-ink text-ink-fg"
                        : "border-border bg-bg text-fg hover:border-border-strong"
                    }`}
                  >
                    {isEn ? budgetLabels[tier].en : budgetLabels[tier].zh}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-micro text-fg-muted uppercase">
              {isEn ? "Attach files or sources" : "添加文件或来源"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sourceList.map((src) => {
                const active = sources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => toggleSource(src.id)}
                    aria-pressed={active}
                    className={`min-h-10 border px-2.5 text-micro font-medium transition-colors sm:min-h-8 ${
                      active
                        ? "border-fg bg-surface text-fg"
                        : "border-dashed border-border-strong bg-transparent text-fg-muted hover:text-fg"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {src.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 实时结构化上下文输出 */}
        <div className="border-t border-border pt-3.5">
          <p className="font-mono text-micro text-fg-muted uppercase">
            {isEn
              ? "Structured context received by Agent (0 prompt words typed)"
              : "AI 实际收到的结构化需求（用户 0 字手写提示词）"}
          </p>
          <p className="mt-1.5 border border-border bg-surface px-3 py-2.5 font-mono text-caption leading-relaxed text-fg">
            {isEn
              ? `Goal: ${preset.origin.en} → ${preset.destination.en} · ${days}d · ${people}p · Budget: ${budgetLabels[budget].en} · Sources: ${attachedNames.length ? attachedNames.join(", ") : "None"}`
              : `目标：${preset.origin.zh} → ${preset.destination.zh} · ${days} 天 · ${people} 人 · 预算：${budgetLabels[budget].zh} · 挂载上下文：${attachedNames.length ? attachedNames.join("、") : "未挂载"}`}
          </p>
        </div>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 03 预期对齐（Expectation Alignment）
 * ─────────────────────────────────────────────────────────────────────────── */

type PlanStep = {
  id: string;
  zh: string;
  en: string;
  checked: boolean;
};

const INITIAL_PLAN: PlanStep[] = [
  {
    id: "flights",
    zh: "搜索深圳 ⇄ 东京往返机票",
    en: "Search round-trip flights",
    checked: true,
  },
  {
    id: "hotels",
    zh: "对比新宿 / 浅草 3 家酒店",
    en: "Compare 3 hotels",
    checked: true,
  },
  {
    id: "routes",
    zh: "编排 5 天每日交通与路线",
    en: "Plan daily routes",
    checked: true,
  },
  {
    id: "budget",
    zh: "生成分项预算表",
    en: "Build a budget sheet",
    checked: false,
  },
];

export function ExpectationAlignmentDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const containerRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<PlanStep[]>(INITIAL_PLAN);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [phase, setPhase] = useState<
    "idle" | "counting" | "paused" | "running"
  >("idle");

  // 首次滚入视口时自动开始 10 秒倒计时，避免屏外空跑
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase((prev) => (prev === "idle" ? "counting" : prev));
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "counting") return;
    if (secondsLeft <= 0) {
      setPhase("running");
      return;
    }
    const timer = window.setTimeout(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phase, secondsLeft]);

  const selectedCount = steps.filter((s) => s.checked).length;

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, checked: !step.checked } : step,
      ),
    );
    if (phase === "counting") {
      setPhase("paused");
    }
  };

  const replay = () => {
    setSteps(INITIAL_PLAN);
    setSecondsLeft(10);
    setPhase("counting");
  };

  const progressPct =
    phase === "running" ? 100 : ((10 - secondsLeft) / 10) * 100;

  return (
    <DemoStage
      code="03"
      ariaLabel={{
        zh: "计划预览与倒计时自动开始演示",
        en: "Editable plan preview with countdown auto-start demo",
      }}
      hint={{
        zh: "可勾选/取消任意步骤（编辑时自动暂停倒计时），或不操作等待自动执行",
        en: "Toggle any step (editing pauses the timer) or let the countdown auto-start",
      }}
      statusLabel={
        phase === "running"
          ? isEn
            ? "RUNNING"
            : "执行中"
          : phase === "paused"
            ? isEn
              ? "PAUSED"
              : "已暂停"
            : `${secondsLeft}s`
      }
      onReset={replay}
      resetLabel={{ zh: "重放倒计时", en: "Replay" }}
      caption={{
        zh: "倒计时把「确认计划」变成可选动作：想微调的人可以勾改，不想管的人 10 秒后自动往下走。",
        en: "A countdown makes alignment opt-in: detail-oriented users edit steps while busy users are never blocked.",
      }}
    >
      <div ref={containerRef} className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-label font-semibold text-fg">
            {isEn ? "Here’s the plan first" : "执行前先核对一下计划"}
          </p>
          <span className="font-mono text-micro text-fg-muted tabular-nums">
            {isEn
              ? `${selectedCount}/${steps.length} enabled`
              : `已选 ${selectedCount}/${steps.length} 步`}
          </span>
        </div>

        <ul className="divide-y divide-border border border-border">
          {steps.map((step) => (
            <li key={step.id}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-surface">
                <input
                  type="checkbox"
                  checked={step.checked}
                  disabled={phase === "running"}
                  onChange={() => toggleStep(step.id)}
                  className="size-4 shrink-0 accent-fg"
                />
                <span
                  className={`text-label transition-colors ${
                    step.checked ? "text-fg" : "text-fg-muted line-through"
                  }`}
                >
                  {isEn ? step.en : step.zh}
                </span>
              </label>
            </li>
          ))}
        </ul>

        {/* 进度条与状态提示 */}
        <div className="flex flex-col gap-2">
          <div
            aria-hidden="true"
            className="h-1.5 w-full overflow-hidden bg-surface-recessed"
          >
            <div
              className="h-full bg-fg transition-[width] duration-500 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div
            aria-live="polite"
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <span className="font-mono text-caption text-fg-secondary tabular-nums">
              {phase === "running"
                ? isEn
                  ? `Running ${selectedCount} selected steps…`
                  : `已按你的确认开始执行 ${selectedCount} 个步骤…`
                : phase === "paused"
                  ? isEn
                    ? "Timer paused while you edit the plan."
                    : "检测到你正在修改计划，已暂停倒计时。"
                  : isEn
                    ? `Auto-starting in ${secondsLeft}s if unchanged…`
                    : `${secondsLeft} 秒后自动开始执行（无需点击）…`}
            </span>

            <div className="flex items-center gap-2">
              {phase === "counting" ? (
                <button
                  type="button"
                  onClick={() => setPhase("paused")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg hover:bg-surface sm:min-h-9"
                >
                  {isEn ? "Pause" : "暂停"}
                </button>
              ) : null}

              {phase === "paused" ? (
                <button
                  type="button"
                  onClick={() => setPhase("counting")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg hover:bg-surface sm:min-h-9"
                >
                  {isEn ? "Resume timer" : "继续倒计时"}
                </button>
              ) : null}

              {phase !== "running" ? (
                <button
                  type="button"
                  disabled={selectedCount === 0}
                  onClick={() => setPhase("running")}
                  className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 disabled:opacity-40 sm:min-h-9"
                >
                  {isEn ? "Start now" : "立即开始"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </DemoStage>
  );
}
