"use client";

import { useState } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { DemoStage } from "./demo-stage";

/* ───────────────────────────────────────────────────────────────────────────
 * 08 结果交付与可验证（Delivery & Verifiability）
 * ─────────────────────────────────────────────────────────────────────────── */

type CitationId = "1" | "2";

const CITATIONS: Record<
  CitationId,
  {
    source: { zh: string; en: string };
    quote: { zh: string; en: string };
    checked: { zh: string; en: string };
  }
> = {
  "1": {
    source: {
      zh: "浅草观光联盟 · 客流时段统计",
      en: "Asakusa Tourism Federation · Crowd Index",
    },
    quote: {
      zh: "「仲见世商店街 09:30 后团体游客集中抵达；09:00 前参拜排队时间通常低于 5 分钟。」",
      en: "“Tour groups peak after 09:30 along Nakamise; arriving before 09:00 typically keeps waits under 5 minutes.”",
    },
    checked: { zh: "核验于 2 分钟前", en: "Verified 2m ago" },
  },
  "2": {
    source: {
      zh: "Tokyo Skytree 官网票价表",
      en: "Tokyo Skytree Official Ticket Guide",
    },
    quote: {
      zh: "「天望甲板（350m）工作日预售票成人 ¥2,100，现场当日票 ¥2,400。」",
      en: "“Tembo Deck (350m) weekday advance adult ticket: ¥2,100; same-day counter: ¥2,400.”",
    },
    checked: { zh: "核验于 2 分钟前", en: "Verified 2m ago" },
  },
};

export function DeliveryVerifiabilityDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [activeCitation, setActiveCitation] = useState<CitationId | null>("1");
  const [showDiff, setShowDiff] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const toggleCitation = (id: CitationId) => {
    setActiveCitation((prev) => (prev === id ? null : id));
  };

  return (
    <DemoStage
      code="08"
      ariaLabel={{
        zh: "结果交付、行内引用溯源与改动标示演示",
        en: "Artifact delivery, inline citations and diff highlight demo",
      }}
      hint={{
        zh: "点击结论后的 [1] [2] 角标就地核验来源，或尝试导出、分享与改动标记",
        en: "Click inline [1] / [2] badges to inspect sources, or toggle diff & export",
      }}
      onReset={() => {
        setActiveCitation("1");
        setShowDiff(false);
        setActionFeedback(null);
      }}
      caption={{
        zh: "出处紧跟在关键结论后面，读到哪就能查到哪；成果区直接支持导出、分享与改动对比。",
        en: "Citations sit right beside each claim for instant verification, paired with direct export and diff markers.",
      }}
    >
      <div className="flex flex-col gap-4">
        {/* 产物区顶栏 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <p className="text-label font-semibold text-fg">
              {isEn
                ? "Tokyo 5-Day Itinerary · Artifact"
                : "东京 5 日行程 · 交付产物"}
            </p>
            <p className="font-mono text-micro text-fg-muted">
              {isEn ? "2 VERIFIED CITATIONS" : "含 2 处已核验引用"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              aria-pressed={showDiff}
              onClick={() => setShowDiff((v) => !v)}
              className={`min-h-10 rounded-full border px-3 text-micro font-medium transition-colors sm:min-h-8 ${
                showDiff
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border bg-bg text-fg hover:border-border-strong"
              }`}
            >
              {isEn ? "Highlight edits" : "标出 AI 改动"}
            </button>
            <button
              type="button"
              onClick={() =>
                setActionFeedback(
                  isEn ? "Exported to tokyo-5day.md" : "已导出 tokyo-5day.md",
                )
              }
              className="min-h-10 rounded-full border border-border bg-bg px-3 text-micro font-medium text-fg hover:border-border-strong sm:min-h-8"
            >
              {isEn ? "Export" : "导出"}
            </button>
            <button
              type="button"
              onClick={() =>
                setActionFeedback(
                  isEn ? "Read-only share link copied" : "只读分享链接已复制",
                )
              }
              className="min-h-10 rounded-full bg-ink px-3.5 text-micro font-medium text-ink-fg hover:opacity-85 sm:min-h-8"
            >
              {isEn ? "Share" : "分享"}
            </button>
          </div>
        </div>

        {/* 正文 + 行内角标 */}
        <div className="flex flex-col gap-3 text-label leading-[1.75] text-fg-secondary">
          <p>
            <strong className="font-semibold text-fg">
              {isEn ? "Day 1 · Morning: " : "第 1 天 · 上午："}
            </strong>
            {isEn
              ? "Arrive at Senso-ji before 9:00 AM to avoid tour-bus crowds"
              : "上午 9 点前到浅草寺可避开团队人流"}
            <button
              type="button"
              onClick={() => toggleCitation("1")}
              aria-expanded={activeCitation === "1"}
              className={`mx-1 inline-flex h-6 min-w-6 items-center justify-center border px-1 font-mono text-micro font-semibold align-baseline transition-colors ${
                activeCitation === "1"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border-strong bg-surface text-fg hover:border-fg"
              }`}
            >
              1
            </button>
            {isEn
              ? ", then walk across Sumida River for coffee."
              : "，随后步行跨过隅田川喝咖啡。"}
          </p>

          <p>
            <strong className="font-semibold text-fg">
              {isEn ? "Day 1 · Afternoon: " : "第 1 天 · 下午："}
            </strong>
            {showDiff ? (
              <span className="mr-1.5 text-fg-muted line-through">
                {isEn ? "Tokyo Tower (¥1,500)" : "东京塔（¥1,500）"}
              </span>
            ) : null}
            <span
              className={
                showDiff
                  ? "border-b border-fg bg-surface px-1 font-medium text-fg"
                  : undefined
              }
            >
              {isEn
                ? "Tokyo Skytree weekday advance ticket is ~¥2,100"
                : "晴空塔工作日预售门票约 2,100 日元"}
            </span>
            <button
              type="button"
              onClick={() => toggleCitation("2")}
              aria-expanded={activeCitation === "2"}
              className={`mx-1 inline-flex h-6 min-w-6 items-center justify-center border px-1 font-mono text-micro font-semibold align-baseline transition-colors ${
                activeCitation === "2"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border-strong bg-surface text-fg hover:border-fg"
              }`}
            >
              2
            </button>
            {isEn
              ? " — closer to Asakusa and saves 35 minutes of transit."
              : "——紧邻浅草，比去东京塔少折返 35 分钟。"}
          </p>
        </div>

        {/* 行内展开的来源溯源卡 */}
        {activeCitation ? (
          <div
            aria-live="polite"
            className="border-l-2 border-fg bg-surface p-3.5 text-caption"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro text-fg-muted">
              <span className="font-semibold text-fg">
                [{activeCitation}]{" "}
                {isEn
                  ? CITATIONS[activeCitation].source.en
                  : CITATIONS[activeCitation].source.zh}
              </span>
              <span>
                {isEn
                  ? CITATIONS[activeCitation].checked.en
                  : CITATIONS[activeCitation].checked.zh}
              </span>
            </div>
            <p className="mt-1.5 leading-relaxed text-fg-secondary">
              {isEn
                ? CITATIONS[activeCitation].quote.en
                : CITATIONS[activeCitation].quote.zh}
            </p>
          </div>
        ) : null}

        {actionFeedback ? (
          <p
            aria-live="polite"
            className="font-mono text-micro text-fg-secondary"
          >
            ✓ {actionFeedback}
          </p>
        ) : null}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 09 迭代编辑（Iterative Refinement）
 * ─────────────────────────────────────────────────────────────────────────── */

type DayVersion = 1 | 2;

const DAY_ITINERARIES = [
  {
    id: "day1",
    label: { zh: "第 1 天", en: "Day 1" },
    v1: {
      title: { zh: "浅草与上野", en: "Asakusa & Ueno" },
      desc: {
        zh: "浅草寺晨逛 → 隅田公园 → 国立西洋美术馆",
        en: "Morning Senso-ji → Sumida Park → National Museum of Western Art",
      },
    },
    v2: {
      title: { zh: "浅草与藏前手冲街区", en: "Asakusa & Kuramae Craft Walk" },
      desc: {
        zh: "浅草寺早逛 → 藏前咖啡烘培店 → 河畔文具杂货铺",
        en: "Early Senso-ji → Kuramae coffee roasters → riverside stationery shops",
      },
    },
  },
  {
    id: "day2",
    label: { zh: "第 2 天", en: "Day 2" },
    v1: {
      title: { zh: "涩谷与原宿", en: "Shibuya & Harajuku" },
      desc: {
        zh: "明治神宫 → 竹下通 → 涩谷 Sky 夜景（步行较多）",
        en: "Meiji Shrine → Takeshita St → Shibuya Sky sunset (heavy walking)",
      },
    },
    v2: {
      title: {
        zh: "明治神宫与代官山慢逛",
        en: "Meiji Shrine & Daikanyama Slow Walk",
      },
      desc: {
        zh: "明治神宫 → 鸢屋书店午后阅读 → 中目黑运河晚餐（轻松节奏）",
        en: "Meiji Shrine → Tsutaya Books afternoon → Nakameguro canal dinner (relaxed pace)",
      },
    },
  },
  {
    id: "day3",
    label: { zh: "第 3 天", en: "Day 3" },
    v1: {
      title: { zh: "镰仓一日游", en: "Kamakura Day Trip" },
      desc: {
        zh: "江之电沿海线 → 镰仓高校前 → 长谷寺看海",
        en: "Enoden coastal train → Kamakurakoko-mae → Hasedera ocean view",
      },
    },
    v2: {
      title: { zh: "镰仓与江之岛日落", en: "Kamakura & Enoshima Sunset" },
      desc: {
        zh: "北镰仓竹林古寺 → 七里滨海边咖啡 → 江之岛观景日落",
        en: "Kita-Kamakura temples → Shichirigahama cafe → Enoshima sunset",
      },
    },
  },
];

export function IterativeRefinementDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [versions, setVersions] = useState<Record<string, DayVersion>>({
    day1: 1,
    day2: 1,
    day3: 1,
  });
  const [lastEdited, setLastEdited] = useState<string | null>(null);

  const toggleDayVersion = (id: string) => {
    setVersions((prev) => ({
      ...prev,
      [id]: prev[id] === 1 ? 2 : 1,
    }));
    setLastEdited(id);
  };

  return (
    <DemoStage
      code="09"
      ariaLabel={{
        zh: "局部编辑与历史版本保留演示",
        en: "Targeted edit and version rollback demo",
      }}
      hint={{
        zh: "点击任意一天的「只改这天」（推荐先试第 2 天），观察其余两天如何原样保留",
        en: "Click “Edit only this day” (try Day 2) and notice the untouched days remain intact",
      }}
      onReset={() => {
        setVersions({ day1: 1, day2: 1, day3: 1 });
        setLastEdited(null);
      }}
      caption={{
        zh: "只改被选中的第 2 天并标出「第 2 版」，另外两天纹丝不动，随时可回退历史版本。",
        en: "Only the targeted day updates to v2 with instant rollback; every other day stays untouched.",
      }}
    >
      <div className="flex flex-col gap-2.5" aria-live="polite">
        {DAY_ITINERARIES.map((day) => {
          const ver = versions[day.id] ?? 1;
          const content = ver === 2 ? day.v2 : day.v1;
          const isEdited = lastEdited === day.id;
          const isUntouched = lastEdited !== null && lastEdited !== day.id;

          return (
            <div
              key={day.id}
              className={`flex flex-col gap-2 border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                isEdited ? "border-fg bg-surface" : "border-border bg-bg"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-micro font-medium text-fg-muted uppercase">
                    {isEn ? day.label.en : day.label.zh}
                  </span>
                  <span
                    className={`border px-1.5 py-0.5 font-mono text-micro ${
                      ver === 2
                        ? "border-fg bg-ink text-ink-fg"
                        : "border-border bg-surface text-fg-muted"
                    }`}
                  >
                    {ver === 2
                      ? isEn
                        ? "v2 · UPDATED"
                        : "第 2 版"
                      : isEn
                        ? "v1"
                        : "第 1 版"}
                  </span>
                  {isUntouched ? (
                    <span className="font-mono text-micro text-fg-muted">
                      · {isEn ? "UNCHANGED" : "原样保留"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-label font-semibold text-fg">
                  {isEn ? content.title.en : content.title.zh}
                </p>
                <p className="mt-0.5 text-caption text-fg-secondary">
                  {isEn ? content.desc.en : content.desc.zh}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleDayVersion(day.id)}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-3.5 text-caption font-medium transition-colors sm:min-h-9 ${
                  ver === 2
                    ? "border-border-strong bg-bg text-fg hover:bg-surface-recessed"
                    : "border-fg bg-ink text-ink-fg hover:opacity-85"
                }`}
              >
                {ver === 2
                  ? isEn
                    ? "Revert to v1"
                    : "退回第 1 版"
                  : isEn
                    ? "Edit only this day"
                    : "只改这天"}
              </button>
            </div>
          );
        })}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 10 反馈与沉淀（Feedback & Reuse）
 * ─────────────────────────────────────────────────────────────────────────── */

const DISLIKE_REASONS = [
  { id: "rushed", zh: "行程太赶", en: "Too rushed" },
  { id: "budget", zh: "超出预算", en: "Over budget" },
  { id: "accuracy", zh: "信息不准", en: "Inaccurate details" },
];

export function FeedbackReuseDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [vote, setVote] = useState<"none" | "up" | "down">("none");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [skillSaved, setSkillSaved] = useState(false);

  const toggleReason = (id: string) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <DemoStage
      code="10"
      ariaLabel={{
        zh: "反馈追问与沉淀为技能演示",
        en: "Structured feedback and save-as-skill demo",
      }}
      hint={{
        zh: "分别点击「有用」和「不满意」，观察两个按钮后面各自的下一步设计",
        en: "Try both Helpful and Not satisfied to see the follow-up flow behind each",
      }}
      onReset={() => {
        setVote("none");
        setSelectedReasons([]);
        setFeedbackSent(false);
        setSkillSaved(false);
      }}
      caption={{
        zh: "两个反馈按钮后面各多走一步：踩完追问具体原因，赞完顺手沉淀为可复用的技能（Skill）。",
        en: "Both buttons go one step further: dislikes capture specific causes, while likes save reusable skills.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-label font-semibold text-fg">
              {isEn ? "Tokyo 5-Day Trip Completed" : "东京 5 日行程规划已完成"}
            </p>
            <p className="text-caption text-fg-muted">
              {isEn ? "How did this run turn out?" : "这次结果对你有帮助吗？"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={vote === "up"}
              onClick={() => {
                setVote("up");
                setFeedbackSent(false);
              }}
              className={`min-h-11 rounded-full border px-4 text-caption font-medium transition-colors sm:min-h-9 ${
                vote === "up"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border-strong bg-bg text-fg hover:bg-surface-recessed"
              }`}
            >
              {isEn ? "Helpful" : "有用"}
            </button>
            <button
              type="button"
              aria-pressed={vote === "down"}
              onClick={() => {
                setVote("down");
                setSkillSaved(false);
              }}
              className={`min-h-11 rounded-full border px-4 text-caption font-medium transition-colors sm:min-h-9 ${
                vote === "down"
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border-strong bg-bg text-fg hover:bg-surface-recessed"
              }`}
            >
              {isEn ? "Not satisfied" : "不满意"}
            </button>
          </div>
        </div>

        {/* 点「有用」→ 沉淀为 Skill */}
        {vote === "up" ? (
          <div className="flex flex-col gap-3 border border-fg p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-semibold text-fg">
                {isEn
                  ? "Save this workflow as a reusable Skill?"
                  : "要把这套流程存为技能（Skill），下次一句话复用吗？"}
              </p>
              <span className="font-mono text-micro text-fg-muted">SKILL</span>
            </div>
            <p className="text-caption text-fg-secondary">
              {isEn
                ? "Captures: direct-flight preference + neighborhood clustering + 3-hotel comparison + inline citations."
                : "自动沉淀：直飞优先 + 按商圈聚类路线 + 3 家酒店比价 + 行内出处核验。"}
            </p>
            {skillSaved ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border border-border bg-surface px-3 py-2 text-caption text-fg">
                <span>
                  ✓{" "}
                  {isEn
                    ? "Saved as /city-5day-planner — ready for Osaka, Kyoto, or Seoul next time."
                    : "已存为「城市 5 日自由行规划」技能——下次去大阪或首尔可直接调用。"}
                </span>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setSkillSaved(true)}
                  className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
                >
                  {isEn ? "Save as Skill" : "存为可复用技能"}
                </button>
              </div>
            )}
          </div>
        ) : null}

        {/* 点「不满意」→ 追问原因 */}
        {vote === "down" ? (
          <div className="flex flex-col gap-3 border border-border-strong p-4">
            <p className="text-label font-semibold text-fg">
              {isEn
                ? "What went wrong? (Select all that apply)"
                : "具体是哪里不满意？（可多选）"}
            </p>
            <div className="flex flex-wrap gap-2">
              {DISLIKE_REASONS.map((r) => {
                const active = selectedReasons.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleReason(r.id)}
                    className={`min-h-11 rounded-full border px-3.5 text-caption font-medium transition-colors sm:min-h-9 ${
                      active
                        ? "border-fg bg-ink text-ink-fg"
                        : "border-border bg-bg text-fg hover:border-border-strong"
                    }`}
                  >
                    {active ? "✓ " : ""}
                    {isEn ? r.en : r.zh}
                  </button>
                );
              })}
            </div>
            {feedbackSent ? (
              <p className="border border-border bg-surface px-3 py-2 text-caption text-fg">
                ✓{" "}
                {isEn
                  ? "Reason logged to evaluation dataset & immediate re-plan offered."
                  : "具体原因已回流评测集，并可直接按所选问题重新微调行程。"}
              </p>
            ) : (
              <div>
                <button
                  type="button"
                  disabled={selectedReasons.length === 0}
                  onClick={() => setFeedbackSent(true)}
                  className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg hover:opacity-85 disabled:opacity-40 sm:min-h-9"
                >
                  {isEn ? "Submit reason" : "提交原因"}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </DemoStage>
  );
}
