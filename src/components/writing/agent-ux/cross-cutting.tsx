"use client";

import { useId, useState } from "react";
import { useLocale } from "@/components/site/locale-provider";
import { DemoStage, MonochromeSwitch } from "./demo-stage";

/* ───────────────────────────────────────────────────────────────────────────
 * A 安全与隐私边界（Safety & Privacy）
 * ─────────────────────────────────────────────────────────────────────────── */

export function SafetyPrivacyDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const baseId = useId();

  const [calendar, setCalendar] = useState(true);
  const [email, setEmail] = useState(true);
  const [directPay, setDirectPay] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <DemoStage
      code="A"
      ariaLabel={{
        zh: "细粒度权限授权与敏感操作二次确认演示",
        en: "Scoped permissions and irreversible action confirmation demo",
      }}
      hint={{
        zh: "每项权限均写明具体用途；点击「清除行程数据」体验不可逆操作的二次确认",
        en: "Inspect per-purpose permissions and click Clear trip data for two-step confirmation",
      }}
      statusLabel={
        cleared
          ? isEn
            ? "DATA CLEARED"
            : "数据已清除"
          : directPay
            ? isEn
              ? "PAY GUARD ACTIVE"
              : "付款仍二次确认"
            : isEn
              ? "LEAST PRIVILEGE"
              : "最小权限原则"
      }
      onReset={() => {
        setCalendar(true);
        setEmail(true);
        setDirectPay(false);
        setConfirmClear(false);
        setCleared(false);
      }}
      caption={{
        zh: "权限按用途拆细并说明去向，付款默认关闭，清除数据等不可逆动作必须二次确认。",
        en: "Permissions are scoped with explicit purposes, direct payment defaults to off, and data deletion requires confirmation.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="divide-y divide-border border border-border px-3.5 py-2">
          <MonochromeSwitch
            id={`${baseId}-cal`}
            checked={calendar}
            onChange={setCalendar}
            label={isEn ? "Read calendar" : "读取日历"}
            description={
              isEn
                ? "Used only to avoid scheduling conflicts during May 12–17."
                : "仅用于检查 5 月 12–17 日是否与已有会议冲突，不会修改日程。"
            }
          />
          <MonochromeSwitch
            id={`${baseId}-mail`}
            checked={email}
            onChange={setEmail}
            label={isEn ? "Read booking emails" : "读取预订邮件"}
            description={
              isEn
                ? "Used only to detect existing flight or hotel confirmations."
                : "仅用于提取已有航班或酒店确认单，不扫描私人通信。"
            }
          />
          <MonochromeSwitch
            id={`${baseId}-pay`}
            checked={directPay}
            onChange={setDirectPay}
            label={isEn ? "Direct payment" : "直接付款"}
            description={
              isEn
                ? "Off by default. Even if enabled, every charge still prompts before paying."
                : "默认关闭。即使开启，每次扣款前仍会弹窗二次确认金额。"
            }
          />
        </div>

        {/* 清除数据 + 二次确认 */}
        <div className="border-t border-border pt-3.5">
          {cleared ? (
            <p className="border border-border bg-surface px-3.5 py-2.5 text-caption text-fg">
              ✓{" "}
              {isEn
                ? "All cached Tokyo trip files and synced calendar snapshots have been erased."
                : "本次东京行程缓存的日历快照与邮件摘录已彻底清除。"}
            </p>
          ) : confirmClear ? (
            <div className="flex flex-col gap-3 border border-danger bg-surface p-3.5">
              <p className="text-caption font-medium text-fg">
                {isEn
                  ? "Confirm permanent deletion? This removes cached Tokyo trip records and cannot be undone."
                  : "确认清除全部行程数据吗？此操作不可撤回，将移除已读取的日历与订单缓存。"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCleared(true);
                    setConfirmClear(false);
                  }}
                  className="inline-flex min-h-11 items-center rounded-full border border-danger bg-danger px-4 text-caption font-medium text-white hover:opacity-90 sm:min-h-9"
                >
                  {isEn ? "Confirm erase" : "确认彻底清除"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg hover:bg-surface-recessed sm:min-h-9"
                >
                  {isEn ? "Cancel" : "取消"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-caption text-fg-muted">
                {isEn
                  ? "You can view or wipe trip context at any time."
                  : "你可以随时查看并清除本次任务读取的个人数据。"}
              </span>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex min-h-11 items-center rounded-full border border-danger/60 bg-bg px-4 text-caption font-medium text-danger transition-colors hover:border-danger hover:bg-surface sm:min-h-9"
              >
                {isEn ? "Clear trip data" : "清除行程数据"}
              </button>
            </div>
          )}
        </div>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * B 多 Agent 与生态（Multi-Agent & Ecosystem）
 * ─────────────────────────────────────────────────────────────────────────── */

export function MultiAgentHandoffDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [handedOff, setHandedOff] = useState(false);

  return (
    <DemoStage
      code="B"
      ariaLabel={{
        zh: "多智能体任务交接与上下文继承演示",
        en: "Multi-agent handoff with carried-over context demo",
      }}
      hint={{
        zh: "点击「交给酒店助手」，观察交接提示与酒店助手如何无须重复提问直接接话",
        en: "Click Hand off to Hotel Expert to see transparent context carry-over",
      }}
      statusLabel={
        handedOff
          ? isEn
            ? "HOTEL EXPERT ACTIVE"
            : "酒店助手接手中"
          : isEn
            ? "PRIMARY ASSISTANT"
            : "主助手服务中"
      }
      onReset={() => setHandedOff(false)}
      caption={{
        zh: "交接时明示换了谁、带过去了哪些信息，新助手开口就知道前面聊过什么，用户不必重复交代。",
        en: "Handoffs declare who took over and exactly what context carried over—zero repetition for the user.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        {/* 主助手消息 */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center border border-fg bg-ink font-mono text-micro font-semibold text-ink-fg"
          >
            A1
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-micro font-medium text-fg">
              {isEn ? "Primary Assistant" : "主助手"}
            </p>
            <div className="mt-1 border border-border bg-surface px-3.5 py-2.5 text-label text-fg">
              {isEn
                ? "Your 5-day Tokyo plan is ready. Want me to pass your dates and budget to our Hotel Expert to book a room?"
                : "东京 5 日行程已经排好了，需要我把日期和预算交给酒店助手帮你订房吗？"}
            </div>
          </div>
        </div>

        {!handedOff ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setHandedOff(true)}
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
            >
              {isEn ? "Hand off to Hotel Expert →" : "交给酒店助手 →"}
            </button>
          </div>
        ) : (
          <>
            {/* 显式 Handoff 分割线 */}
            <div className="flex flex-col items-center gap-1 border-y border-dashed border-border-strong bg-surface/60 px-3 py-2.5 text-center">
              <span className="font-mono text-micro font-semibold text-fg uppercase">
                {isEn ? "HANDED OFF TO HOTEL EXPERT" : "已交接至：酒店助手"}
              </span>
              <span className="font-mono text-micro text-fg-muted">
                {isEn
                  ? "Carried over: Tokyo · May 12–17 · 2 travelers · Mid budget"
                  : "已自动带入上下文：东京 · 5 月 12–17 日 · 2 人 · 中等预算"}
              </span>
            </div>

            {/* 第三方专职助手接话 */}
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="inline-flex size-8 shrink-0 items-center justify-center border border-border-strong bg-surface font-mono text-micro font-semibold text-fg"
              >
                H2
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-micro font-medium text-fg">
                    {isEn ? "Hotel Expert" : "酒店助手"}
                  </span>
                  <span className="border border-border bg-surface px-1.5 py-0.5 font-mono text-micro text-fg-muted">
                    {isEn ? "3rd-party Agent" : "第三方生态助手"}
                  </span>
                </div>
                <div className="mt-1 border border-fg bg-bg px-3.5 py-2.5 text-label text-fg">
                  {isEn
                    ? "Hi, I’m the Hotel Expert. No need to repeat anything — based on Tokyo (May 12–17, 2 guests, mid budget), I’ve shortlisted 3 hotels near Asakusa & Shinjuku."
                    : "你好，我是酒店助手，不用再重复一遍——已收到你的东京 5 月 12–17 日、2 人、中等预算需求，直接为你挑好了浅草和新宿的 3 家高评分酒店。"}
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setHandedOff(false)}
                className="inline-flex min-h-10 items-center text-caption font-medium text-fg underline underline-offset-4 hover:opacity-75 sm:min-h-8"
              >
                ← {isEn ? "Back to Primary Assistant" : "返回主助手"}
              </button>
            </div>
          </>
        )}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * C 人设与语气（Persona & Tone）
 * ─────────────────────────────────────────────────────────────────────────── */

type ToneKey = "robotic" | "overhuman" | "balanced";

const TONE_SAMPLES: Record<
  ToneKey,
  {
    tabZh: string;
    tabEn: string;
    messageZh: string;
    messageEn: string;
    checks: { what: boolean; doing: boolean; options: boolean };
    verdictZh: string;
    verdictEn: string;
  }
> = {
  robotic: {
    tabZh: "机械版",
    tabEn: "Robotic",
    messageZh:
      "ERROR 504: Gateway timeout on upstream provider_flights_jp. Task aborted.",
    messageEn:
      "ERROR 504: Gateway timeout on upstream provider_flights_jp. Task aborted.",
    checks: { what: false, doing: false, options: false },
    verdictZh: "只甩技术报错代码，用户既看不懂，也不知道接下来该怎么办。",
    verdictEn:
      "Dumps raw error codes with zero clarity on recovery or next steps.",
  },
  overhuman: {
    tabZh: "过度拟人版",
    tabEn: "Overly human",
    messageZh:
      "呜呜呜对不起呀！订票网站今天脾气好差打不开呢 T_T 我真的超级努力了，人家也很难过，待会儿再试试好不好嘛～",
    messageEn:
      "Oh nooo I’m SO sorry!! The booking site is being super mean today T_T I tried my absolute best, please don’t be mad at me~",
    checks: { what: true, doing: false, options: false },
    verdictZh:
      "出问题时堆砌情绪甚至卖萌，拖慢阅读节奏，反而更容易激怒焦虑中的用户。",
    verdictEn:
      "Excessive emotion during failures wastes time and erodes trust when users want answers.",
  },
  balanced: {
    tabZh: "平衡版（推荐）",
    tabEn: "Balanced (Recommended)",
    messageZh:
      "订票网站暂时打不开，我会在 1 分钟后自动重试一次；你也可以现在先看看其他 2 家航司的直飞方案。",
    messageEn:
      "The booking site isn’t responding right now. I’ll retry automatically in 1 minute, or you can compare 2 other airlines in the meantime.",
    checks: { what: true, doing: true, options: true },
    verdictZh:
      "冷静、简洁、有交代：说清「发生了什么」「AI 在做什么」「用户还能怎么选」。",
    verdictEn:
      "Calm and actionable: covers what happened, what the agent is doing, and what the user can do next.",
  },
};

export function PersonaToneDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const tabBase = useId();

  const [tone, setTone] = useState<ToneKey>("balanced");
  const sample = TONE_SAMPLES[tone];

  const criteria = [
    {
      key: "what",
      pass: sample.checks.what,
      zh: "说清发生了什么",
      en: "States what happened",
    },
    {
      key: "doing",
      pass: sample.checks.doing,
      zh: "说明 AI 正在做什么",
      en: "States what AI is doing",
    },
    {
      key: "options",
      pass: sample.checks.options,
      zh: "给出用户的备选路径",
      en: "Gives user clear options",
    },
  ];

  return (
    <DemoStage
      code="C"
      ariaLabel={{
        zh: "出错场景三种语气对比演示",
        en: "Error message persona and tone comparison demo",
      }}
      hint={{
        zh: "切换同一报错的三种语气，对比下方三要素检查项的满足情况",
        en: "Switch between three tones for the same outage and inspect the 3-point checklist",
      }}
      onReset={() => setTone("balanced")}
      caption={{
        zh: "把同一句报错写成三种语气并排对比：平衡版完整包含「发生了什么、它在做什么、用户怎么选」。",
        en: "Comparing three error tones side-by-side highlights why calm specificity outperforms both jargon and cuteness.",
      }}
    >
      <div className="flex flex-col gap-4">
        <div
          role="tablist"
          aria-label={isEn ? "Tone variants" : "语气对比"}
          className="demo-tablist gap-1"
        >
          {(["robotic", "overhuman", "balanced"] as ToneKey[]).map((key) => {
            const selected = tone === key;
            return (
              <button
                key={key}
                id={`${tabBase}-${key}`}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTone(key)}
                className={`demo-tab min-h-11 px-3.5 text-caption font-medium transition-colors sm:min-h-9 ${
                  selected ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {isEn ? TONE_SAMPLES[key].tabEn : TONE_SAMPLES[key].tabZh}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          aria-labelledby={`${tabBase}-${tone}`}
          className="flex flex-col gap-3.5"
        >
          <div className="border-l-2 border-fg bg-surface p-4">
            <p
              className={`text-label leading-relaxed text-fg ${
                tone === "robotic" ? "font-mono text-caption" : ""
              }`}
            >
              {isEn ? sample.messageEn : sample.messageZh}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {criteria.map((c) => (
              <div
                key={c.key}
                className={`flex items-center gap-2 border px-3 py-2 text-caption ${
                  c.pass
                    ? "border-fg bg-bg text-fg"
                    : "border-border bg-surface text-fg-muted"
                }`}
              >
                <span className="font-mono text-micro font-semibold">
                  {c.pass ? "✓" : "✕"}
                </span>
                <span>{isEn ? c.en : c.zh}</span>
              </div>
            ))}
          </div>

          <p className="text-caption text-fg-secondary">
            {isEn ? sample.verdictEn : sample.verdictZh}
          </p>
        </div>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * D 多模态与多端（Multimodal & Cross-device）
 * ─────────────────────────────────────────────────────────────────────────── */

type DeviceKey = "phone" | "desktop" | "voice";

export function MultimodalCrossDeviceDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const tabBase = useId();

  const [device, setDevice] = useState<DeviceKey>("phone");
  const [navStarted, setNavStarted] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(true);

  const devices: { id: DeviceKey; zh: string; en: string }[] = [
    { id: "phone", zh: "手机端", en: "Phone" },
    { id: "desktop", zh: "电脑端", en: "Desktop" },
    { id: "voice", zh: "语音模式", en: "Voice" },
  ];

  return (
    <DemoStage
      code="D"
      ariaLabel={{
        zh: "同一行程在手机、电脑与语音三端形态切换演示",
        en: "Same task adapted across phone, desktop and voice demo",
      }}
      hint={{
        zh: "在手机、电脑、语音三种形态间切换，观察同一行程节点的信息密度变化",
        en: "Switch between Phone, Desktop, and Voice to compare information density for the same stop",
      }}
      onReset={() => {
        setDevice("phone");
        setNavStarted(false);
        setVoicePlaying(true);
      }}
      caption={{
        zh: "同一份数据「第 2 天去明治神宫」随设备切换形态：手机是行动卡片，电脑是全景视图，语音只说一句重点。",
        en: "One synced state (“Day 2: Meiji Shrine”) reshapes per device: action card on phone, split schedule on desktop, one sentence on voice.",
      }}
    >
      <div className="flex flex-col gap-4">
        <div
          role="tablist"
          aria-label={isEn ? "Device form factor" : "终端形态"}
          className="demo-tablist gap-1"
        >
          {devices.map((item) => {
            const selected = device === item.id;
            return (
              <button
                key={item.id}
                id={`${tabBase}-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setDevice(item.id)}
                className={`demo-tab min-h-11 px-4 text-caption font-medium transition-colors sm:min-h-9 ${
                  selected ? "text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {isEn ? item.en : item.zh}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          aria-labelledby={`${tabBase}-${device}`}
          className="min-h-[196px] flex flex-col justify-center"
        >
          {device === "phone" ? (
            <div className="mx-auto flex w-full max-w-[270px] flex-col gap-3 border-2 border-fg bg-bg p-4">
              <div className="flex items-center justify-between font-mono text-micro text-fg-muted">
                <span>{isEn ? "DAY 2 · NEXT STOP" : "第 2 天 · 下一站"}</span>
                <span>14:00</span>
              </div>
              <div>
                <p className="text-case-title font-bold text-fg">
                  {isEn ? "Meiji Shrine" : "明治神宫"}
                </p>
                <p className="mt-0.5 text-caption text-fg-secondary">
                  {isEn
                    ? "12 min walk · South Torii Gate"
                    : "步行约 12 分钟 · 南参道入口"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNavStarted((v) => !v)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-4 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
              >
                {navStarted
                  ? isEn
                    ? "Navigating · 850m ahead"
                    : "步行导航中 · 距入口 850 米"
                  : isEn
                    ? "Start navigation"
                    : "开始步行导航"}
              </button>
            </div>
          ) : null}

          {device === "desktop" ? (
            <div className="grid grid-cols-1 border border-border sm:grid-cols-12">
              <div className="divide-y divide-border border-b border-border sm:col-span-5 sm:border-r sm:border-b-0">
                <div className="px-3 py-2.5 text-caption text-fg-muted">
                  {isEn ? "Day 1 · Asakusa & Ueno" : "第 1 天 · 浅草与上野"}
                </div>
                <div className="bg-surface px-3 py-2.5 text-caption font-semibold text-fg">
                  →{" "}
                  {isEn
                    ? "Day 2 · Meiji Shrine & Harajuku"
                    : "第 2 天 · 明治神宫与原宿"}
                  <p className="mt-1 font-mono text-micro font-normal text-fg-secondary">
                    10:00 {isEn ? "Yoyogi" : "代代木"} · 14:00{" "}
                    {isEn ? "Meiji Shrine" : "明治神宫"} · 17:30{" "}
                    {isEn ? "Shibuya" : "涩谷"}
                  </p>
                </div>
                <div className="px-3 py-2.5 text-caption text-fg-muted">
                  {isEn ? "Day 3 · Kamakura Coast" : "第 3 天 · 镰仓一日游"}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-surface/60 p-4 sm:col-span-7">
                <svg
                  viewBox="0 0 220 100"
                  fill="none"
                  aria-hidden="true"
                  className="h-auto w-full max-w-[210px]"
                >
                  <path
                    d="M20 76L76 58L132 34L198 24"
                    stroke="var(--lineart-primary)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <circle cx="20" cy="76" r="3.5" fill="var(--lineart-muted)" />
                  <circle cx="76" cy="58" r="3.5" fill="var(--lineart-muted)" />
                  <circle
                    cx="132"
                    cy="34"
                    r="5"
                    fill="var(--lineart-primary)"
                  />
                  <circle
                    cx="132"
                    cy="34"
                    r="10"
                    stroke="var(--lineart-primary)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="198"
                    cy="24"
                    r="3.5"
                    fill="var(--lineart-muted)"
                  />
                </svg>
                <span className="font-mono text-micro text-fg-muted">
                  {isEn
                    ? "MAP VIEW · FULL TIMELINE + ROUTE"
                    : "桌面全景 · 完整时间表 + 路线图"}
                </span>
              </div>
            </div>
          ) : null}

          {device === "voice" ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <button
                type="button"
                onClick={() => setVoicePlaying((v) => !v)}
                aria-pressed={voicePlaying}
                className="inline-flex size-14 items-center justify-center rounded-full border-2 border-fg bg-ink font-mono text-micro font-semibold text-ink-fg transition-opacity hover:opacity-85"
              >
                {voicePlaying
                  ? isEn
                    ? "LIVE"
                    : "播报中"
                  : isEn
                    ? "PLAY"
                    : "重播"}
              </button>
              <p className="max-w-[36ch] text-label font-medium text-fg">
                {isEn
                  ? "“Next stop is Meiji Shrine, about 12 minutes on foot. Ready to head out?”"
                  : "「下一站明治神宫，走路约 12 分钟，现在出发吗？」"}
              </p>
              <span className="font-mono text-micro text-fg-muted">
                {isEn
                  ? "VOICE · 1 SENTENCE ONLY (NO SCREEN NEEDED)"
                  : "语音形态 · 只念一句核心重点"}
              </span>
            </div>
          ) : null}
        </div>

        {/* 底部跨端同步提示 */}
        <div className="flex items-center justify-center gap-2 border-t border-border pt-3 font-mono text-micro text-fg-muted">
          <span aria-hidden="true" className="size-1.5 bg-fg" />
          <span>
            {isEn
              ? "Synced across all devices · Day 2, 14:00"
              : "各设备状态已实时同步 · 第 2 天 14:00"}
          </span>
        </div>
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * E 成本与配额（Cost & Quota）
 * ─────────────────────────────────────────────────────────────────────────── */

type QuotaMode = "quick" | "deep";

export function CostQuotaDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const MAX_QUOTA = 5;
  const [used, setUsed] = useState(3);
  const [mode, setMode] = useState<QuotaMode>("deep");
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);
  const [fallbackChoice, setFallbackChoice] = useState<string | null>(null);

  const exhausted = used >= MAX_QUOTA;

  const handleStart = () => {
    setFallbackChoice(null);
    if (mode === "quick") {
      setLastOutcome(
        isEn
          ? "Completed in Quick mode — 0 deep quota used."
          : "已用快速模式完成——本次未消耗深度额度。",
      );
      return;
    }
    if (used < MAX_QUOTA) {
      const next = used + 1;
      setUsed(next);
      setLastOutcome(
        isEn
          ? `Deep task finished (${next}/${MAX_QUOTA} used today).`
          : `深度任务执行完成（今日已用 ${next}/${MAX_QUOTA}）。`,
      );
    }
  };

  return (
    <DemoStage
      code="E"
      ariaLabel={{
        zh: "配额透明展示与用尽降级策略演示",
        en: "Visible task quota and exhaustion fallback demo",
      }}
      hint={{
        zh: "点击「开始执行」消耗剩余深度额度至 5/5，体验额度用尽时的三条明确出路",
        en: "Run Deep mode until 5/5 quota is reached to see the clear fallback paths",
      }}
      statusLabel={`${used} / ${MAX_QUOTA}`}
      onReset={() => {
        setUsed(3);
        setMode("deep");
        setLastOutcome(null);
        setFallbackChoice(null);
      }}
      caption={{
        zh: "额度数字直接放在开始按钮上方，简单问题自动走免费快速模式，用尽时给出排队、降级或升级三条出路。",
        en: "Quota sits right above Start, simple tasks stay free in Quick mode, and hitting the cap offers clear next options.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        {/* 顶部额度条 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-caption">
            <span className="font-medium text-fg">
              {isEn ? "Deep tasks today" : "今日深度任务额度"}
            </span>
            <span className="font-mono font-semibold text-fg tabular-nums">
              {used} / {MAX_QUOTA}
            </span>
          </div>
          <div
            aria-hidden="true"
            className="h-1.5 w-full overflow-hidden bg-surface-recessed"
          >
            <div
              className="h-full bg-fg transition-[width] duration-300"
              style={{ width: `${(used / MAX_QUOTA) * 100}%` }}
            />
          </div>
        </div>

        {/* 快速 / 深度二选一 */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={mode === "quick"}
            onClick={() => setMode("quick")}
            className={`flex min-h-16 flex-col items-start justify-center border p-3.5 text-left transition-colors ${
              mode === "quick"
                ? "border-fg bg-surface"
                : "border-border bg-bg hover:border-border-strong"
            }`}
          >
            <span className="text-label font-semibold text-fg">
              {isEn ? "Quick" : "快速模式"}
            </span>
            <span className="mt-0.5 text-caption text-fg-muted">
              {isEn
                ? "Simple asks · Free · Instant"
                : "简单问题够用 · 不扣额度"}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={mode === "deep"}
            onClick={() => setMode("deep")}
            className={`flex min-h-16 flex-col items-start justify-center border p-3.5 text-left transition-colors ${
              mode === "deep"
                ? "border-fg bg-surface"
                : "border-border bg-bg hover:border-border-strong"
            }`}
          >
            <span className="text-label font-semibold text-fg">
              {isEn ? "Deep Agent" : "深度模式"}
            </span>
            <span className="mt-0.5 text-caption text-fg-muted">
              {isEn
                ? "Multi-step · Uses 1 quota"
                : "多步调研比价 · 消耗 1 次额度"}
            </span>
          </button>
        </div>

        <button
          type="button"
          disabled={mode === "deep" && exhausted}
          onClick={handleStart}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-5 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 disabled:opacity-40 sm:min-h-10"
        >
          {mode === "quick"
            ? isEn
              ? "Start in Quick mode (0 quota)"
              : "以快速模式开始（不消耗额度）"
            : exhausted
              ? isEn
                ? "Deep quota exhausted (5/5)"
                : "今日深度额度已用完（5/5）"
              : isEn
                ? `Start Deep task (uses 1 · ${MAX_QUOTA - used} left)`
                : `开始深度任务（消耗 1 次 · 剩余 ${MAX_QUOTA - used} 次）`}
        </button>

        {/* 用尽兜底方案 */}
        {mode === "deep" && exhausted ? (
          <div className="flex flex-col gap-3 border border-fg bg-surface p-4">
            <p className="text-label font-semibold text-fg">
              {isEn
                ? "Out of deep tasks today. You can:"
                : "今日深度任务额度已用完，你可以选择："}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setFallbackChoice(
                    isEn
                      ? "Queued for 00:00 reset — we’ll run it and notify you in the morning."
                      : "已加入明日零点队列，完成后会自动通知你。",
                  )
                }
                className="min-h-11 rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg hover:bg-surface-recessed sm:min-h-9"
              >
                {isEn ? "Queue till tomorrow" : "加入队列明天跑"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("quick");
                  setFallbackChoice(
                    isEn
                      ? "Switched to Quick mode — ready to run for free."
                      : "已切换至快速模式，可直接免费运行。",
                  );
                }}
                className="min-h-11 rounded-full bg-ink px-3.5 text-caption font-medium text-ink-fg hover:opacity-85 sm:min-h-9"
              >
                {isEn ? "Use Quick instead" : "改用快速模式"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setFallbackChoice(
                    isEn
                      ? "Upgrade flow opened: Pro plan includes 50 deep tasks/day."
                      : "已展开升级说明：Pro 方案每日提供 50 次深度任务。",
                  )
                }
                className="min-h-11 rounded-full border border-border-strong bg-bg px-3.5 text-caption font-medium text-fg hover:bg-surface-recessed sm:min-h-9"
              >
                {isEn ? "Upgrade" : "升级配额"}
              </button>
            </div>
          </div>
        ) : null}

        {fallbackChoice ? (
          <p className="font-mono text-micro text-fg">✓ {fallbackChoice}</p>
        ) : lastOutcome ? (
          <p className="font-mono text-micro text-fg-secondary">
            ✓ {lastOutcome}
          </p>
        ) : null}
      </div>
    </DemoStage>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
 * F 体验度量（Experience Metrics）
 * ─────────────────────────────────────────────────────────────────────────── */

type UserVerdict = "none" | "yes" | "partial" | "no";

export function ExperienceMetricsDemo() {
  const { locale } = useLocale();
  const isEn = locale === "en";

  const [verdict, setVerdict] = useState<UserVerdict>("none");

  const metrics = [
    {
      id: "outcome",
      zhName: "结果 · 任务办成率",
      enName: "Outcome · Completion",
      value: verdict === "yes" ? "84%" : verdict === "no" ? "80%" : "82%",
      noteZh: "产出是否直接可用",
      noteEn: "Usable output delivered",
    },
    {
      id: "process",
      zhName: "过程 · 确认疲劳度",
      enName: "Process · Confirmations",
      value: "2.1x",
      noteZh: "平均每任务中断次数",
      noteEn: "Avg interrupts per task",
    },
    {
      id: "trust",
      zhName: "信任 · 采纳与核验比",
      enName: "Trust · Calibration",
      value: verdict === "yes" ? "91%" : verdict === "no" ? "76%" : "88%",
      noteZh: "信任度与准确率匹配",
      noteEn: "Trust matches accuracy",
    },
    {
      id: "recovery",
      zhName: "恢复 · 断点续做率",
      enName: "Recovery · Resume rate",
      value: "94%",
      noteZh: "报错后无需重来比例",
      noteEn: "Recovered without restart",
    },
    {
      id: "value",
      zhName: "价值 · 技能复用率",
      enName: "Value · Skill reuse",
      value: verdict === "yes" ? "39%" : "36%",
      noteZh: "7 日内再次复用模板",
      noteEn: "Reused within 7 days",
    },
  ];

  return (
    <DemoStage
      code="F"
      ariaLabel={{
        zh: "五层体验度量指标与用户主观反馈联动演示",
        en: "Five-layer experience metrics paired with user verdict demo",
      }}
      hint={{
        zh: "点击底部「这次办成了吗」不同选项，观察行为指标与主观评价如何配合解读",
        en: "Answer “Did this get the job done?” below to see subjective feedback pair with telemetry",
      }}
      onReset={() => setVerdict("none")}
      caption={{
        zh: "把五层行为指标和用户的直接回答并排放在一起：既量行为，也量结果本身好不好、用户信不信。",
        en: "Pairing five telemetry layers with direct user verdicts measures not just clicks, but real task quality and trust.",
      }}
    >
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between gap-2 border border-border bg-surface p-3"
            >
              <span className="text-micro leading-snug font-medium text-fg-secondary">
                {isEn ? m.enName : m.zhName}
              </span>
              <div>
                <p className="font-mono text-[20px] leading-none font-bold text-fg tabular-nums">
                  {m.value}
                </p>
                <p className="mt-1 text-micro leading-tight text-fg-muted">
                  {isEn ? m.noteEn : m.noteZh}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 行为数据 × 用户主观回答联动 */}
        <div className="flex flex-col gap-3 border border-border p-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label font-semibold text-fg">
              {isEn ? "Did this get the job done?" : "这次办成了吗？"}
            </p>
            <p className="text-caption text-fg-muted">
              {isEn
                ? "Combines with behavioral telemetry & fixed eval benchmarks."
                : "用户直接回答，将与上方行为数据及固定评测集交叉核对。"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "yes", zh: "办成了", en: "Yes" },
                { id: "partial", zh: "部分可用", en: "Partly" },
                { id: "no", zh: "没办成", en: "No" },
              ] as const
            ).map((opt) => {
              const selected = verdict === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setVerdict(opt.id)}
                  className={`min-h-11 rounded-full border px-3.5 text-caption font-medium transition-colors sm:min-h-8 ${
                    selected
                      ? "border-fg bg-ink text-ink-fg"
                      : "border-border bg-bg text-fg hover:border-border-strong"
                  }`}
                >
                  {isEn ? opt.en : opt.zh}
                </button>
              );
            })}
          </div>
        </div>

        {verdict !== "none" ? (
          <p className="border-l-2 border-fg bg-surface px-3.5 py-2.5 text-caption text-fg-secondary">
            {verdict === "yes"
              ? isEn
                ? "Logged positive outcome: behavioral completion aligns with user satisfaction. Added to golden benchmark."
                : "记录为有效完成：行为完结率与用户主观认可一致，可沉淀进正例评测集。"
              : verdict === "partial"
                ? isEn
                  ? "Flagged partial success: click-through looked fine, yet user still edited manually — triggers friction review."
                  : "标记为部分可用：虽然任务跑完了，但用户仍需手工补救——这类样本最容易暴露隐藏体验断点。"
                : isEn
                  ? "Routed to weekly failure review: categorized by root cause (intent / tool / output) and turned into a regression eval."
                  : "已进入坏例复盘池：按「理解错 / 工具挂 / 质量差」归因修复后，转为固定回归评测题。"}
          </p>
        ) : null}
      </div>
    </DemoStage>
  );
}
