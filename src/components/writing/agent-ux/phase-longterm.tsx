"use client";

import { useId, useState } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { DemoStage, MonochromeSwitch } from "./demo-stage";

/* ───────────────────────────────────────────────────────────────────────────
 * 11 记忆与个性化（Memory & Personalization）
 * ─────────────────────────────────────────────────────────────────────────── */

type MemoryItem = {
  id: string;
  zh: string;
  en: string;
  sourceZh: string;
  sourceEn: string;
};

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: "diet",
    zh: "饮食偏好：吃素",
    en: "Dietary preference: Vegetarian",
    sourceZh: "来自上次餐厅推荐",
    sourceEn: "From past dining picks",
  },
  {
    id: "budget",
    zh: "住宿预算：中等舒适档",
    en: "Hotel budget: Mid-range",
    sourceZh: "来自东京行程规划",
    sourceEn: "From Tokyo itinerary",
  },
  {
    id: "seat",
    zh: "航班选座：偏好靠窗座位",
    en: "Flight seating: Prefers window seat",
    sourceZh: "来自值机记录",
    sourceEn: "From past check-in",
  },
  {
    id: "city",
    zh: "常住城市：上海",
    en: "Home city: Shanghai",
    sourceZh: "来自常用出发地",
    sourceEn: "From default departure",
  },
];

export function MemoryPersonalizationDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const switchId = useId();

  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);

  const removeMemory = (id: string) => {
    setMemories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DemoStage
      code="11"
      ariaLabel={{
        zh: "透明记忆清单与个性化控制演示",
        en: "Transparent memory list and personalization toggle demo",
      }}
      hint={{
        zh: "可逐条删除记忆条目，或通过右上角总开关一键停用长期记忆",
        en: "Delete individual memories or toggle the master switch off to pause recall",
      }}
      statusLabel={
        enabled
          ? isEn
            ? `${memories.length} ACTIVE`
            : `已启用 · ${memories.length} 条`
          : isEn
            ? "MEMORY OFF"
            : "记忆已关闭"
      }
      onReset={() => {
        setEnabled(true);
        setMemories(INITIAL_MEMORIES);
      }}
      caption={{
        zh: "把记住的内容摆在明面上，每条能删、总开关能关，个性化才会让人觉得贴心而非被监视。",
        en: "Visible, deletable memories with a master switch make personalization feel helpful instead of intrusive.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="border-b border-border pb-3">
          <MonochromeSwitch
            id={switchId}
            checked={enabled}
            onChange={setEnabled}
            label={
              isEn ? "It remembered these about you" : "它记住了你的这些偏好"
            }
            description={
              enabled
                ? isEn
                  ? "Automatically applied to future trips. Remove any item anytime."
                  : "下次规划时自动带入，不需要重复交代；你可以随时删除任意一条。"
                : isEn
                  ? "Memory is paused — new tasks will run without personal preferences."
                  : "长期记忆已关闭——新任务不会读取或新增你的任何个人偏好。"
            }
          />
        </div>

        {memories.length === 0 ? (
          <div className="border border-dashed border-border-strong p-5 text-center text-caption text-fg-muted">
            {isEn
              ? "All memory entries cleared. Click Reset above to restore the sample list."
              : "已清空全部记忆条目。点击右上角「重置」可恢复示例清单。"}
          </div>
        ) : (
          <ul
            className={`divide-y divide-border border border-border transition-opacity ${
              enabled ? "opacity-100" : "opacity-45"
            }`}
          >
            {memories.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-label font-medium text-fg">
                    {isEn ? item.en : item.zh}
                  </p>
                  <p className="font-mono text-micro text-fg-muted">
                    {isEn ? item.sourceEn : item.sourceZh}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMemory(item.id)}
                  aria-label={isEn ? `Delete ${item.en}` : `删除「${item.zh}」`}
                  className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-border bg-bg px-3 text-micro font-medium text-fg-secondary transition-colors hover:border-danger hover:text-danger sm:min-h-8"
                >
                  {isEn ? "Delete" : "删除"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * 12 主动服务（Proactive Assistance）
 * ─────────────────────────────────────────────────────────────────────────── */

type FrequencyTier = "normal" | "important" | "dnd";
type SuggestionDecision = "pending" | "accepted" | "declined";

export function ProactiveAssistanceDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [decision, setDecision] = useState<SuggestionDecision>("pending");
  const [frequency, setFrequency] = useState<FrequencyTier>("normal");

  const tiers: {
    id: FrequencyTier;
    zh: string;
    en: string;
    noteZh: string;
    noteEn: string;
  }[] = [
    {
      id: "normal",
      zh: "正常提醒",
      en: "Normal",
      noteZh: "包含值机开放、天气突变、餐厅预约与行程优化建议。",
      noteEn:
        "Covers check-in windows, weather shifts, reservations & route tips.",
    },
    {
      id: "important",
      zh: "只要重要的",
      en: "Important only",
      noteZh: "仅保留值机、延误、退改截止等错过有损失的关键节点。",
      noteEn:
        "Only time-critical alerts like check-in, delays, or cancellation deadlines.",
    },
    {
      id: "dnd",
      zh: "勿扰",
      en: "Do not disturb",
      noteZh: "已静默所有主动推送，只有你主动开口提问时才会响应。",
      noteEn: "All proactive nudges silenced; the agent waits until you ask.",
    },
  ];

  const activeTier = tiers.find((t) => t.id === frequency) ?? tiers[0];

  return (
    <DemoStage
      code="12"
      ariaLabel={{
        zh: "主动服务时机与提醒频率控制演示",
        en: "Proactive assistance timing and notification frequency demo",
      }}
      hint={{
        zh: "可一键接受或拒绝值机建议，并在下方调节主动提醒的三档频率",
        en: "Accept or decline the check-in nudge and adjust proactive frequency below",
      }}
      statusLabel={
        frequency === "dnd"
          ? isEn
            ? "SILENCED"
            : "勿扰中"
          : decision === "accepted"
            ? isEn
              ? "SCHEDULED"
              : "已安排代办"
            : decision === "declined"
              ? isEn
                ? "DISMISSED"
                : "已跳过"
              : isEn
                ? "T-24H TRIGGER"
                : "值机前 1 天"
      }
      onReset={() => {
        setDecision("pending");
        setFrequency("normal");
      }}
      caption={{
        zh: "在值机开放前一天精准出现、支持一键接受或拒绝，同时把频率开关交到用户手里。",
        en: "Appears at the right moment (24h before check-in), takes one tap to accept or dismiss, and puts frequency in user hands.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        {/* 主动建议卡片 */}
        {frequency === "dnd" ? (
          <div className="border border-dashed border-border-strong bg-surface p-4 text-caption text-fg-secondary">
            {isEn
              ? "Do Not Disturb is active — proactive check-in suggestions are muted until you re-enable reminders."
              : "已切换至「勿扰」模式——主动值机提醒已收起，不会打扰你。"}
          </div>
        ) : (
          <div className="flex flex-col gap-3 border border-fg bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-micro text-fg-muted">
              <span className="font-medium text-fg">
                {isEn
                  ? "PROACTIVE · 24H BEFORE CHECK-IN"
                  : "主动建议 · 值机开放前一天"}
              </span>
              <span>{isEn ? "TUE 09:00" : "周二 09:00"}</span>
            </div>

            <p className="text-label leading-relaxed text-fg">
              {isEn
                ? "You fly to Tokyo on Wednesday. Online check-in opens tomorrow at 10:00 AM — want me to grab a window seat for you right when it opens?"
                : "你周三飞东京，明天上午 10:00 开放线上值机。要我到点自动帮你选个靠窗座位吗？"}
            </p>

            {decision === "pending" ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDecision("accepted")}
                  className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
                >
                  {isEn ? "Yes, handle it" : "好的，到点帮我办"}
                </button>
                <button
                  type="button"
                  onClick={() => setDecision("declined")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg hover:bg-surface-recessed sm:min-h-9"
                >
                  {isEn ? "No thanks" : "不用"}
                </button>
              </div>
            ) : decision === "accepted" ? (
              <p className="border-t border-border pt-2.5 text-caption text-fg-secondary">
                ✓{" "}
                {isEn
                  ? "Scheduled for tomorrow 10:00 AM. I’ll send your boarding pass once done."
                  : "已预约明天上午 10:00 自动值机（优先靠窗），办妥后把登机牌发给你。"}
              </p>
            ) : (
              <p className="border-t border-border pt-2.5 text-caption text-fg-muted">
                {isEn
                  ? "Got it — won’t check you in automatically."
                  : "好的，已取消本次代办，需要时随时叫我。"}
              </p>
            )}
          </div>
        )}

        {/* 提醒频率三档调节 */}
        <div className="flex flex-col gap-2 border-t border-border pt-3.5">
          <span className="font-mono text-micro text-fg-muted uppercase">
            {isEn ? "Reminder frequency" : "提醒频率控制"}
          </span>
          <div className="flex flex-wrap gap-2">
            {tiers.map((tier) => {
              const selected = frequency === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFrequency(tier.id)}
                  className={`min-h-11 rounded-full border px-3.5 text-caption font-medium transition-colors sm:min-h-8 ${
                    selected
                      ? "border-fg bg-ink text-ink-fg"
                      : "border-border bg-bg text-fg hover:border-border-strong"
                  }`}
                >
                  {isEn ? tier.en : tier.zh}
                </button>
              );
            })}
          </div>
          <p className="text-caption text-fg-muted">
            {isEn ? activeTier.noteEn : activeTier.noteZh}
          </p>
        </div>
      </div>
    </DemoStage>
  );
}
