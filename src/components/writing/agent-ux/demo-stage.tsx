"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/components/site/locale-provider";
import type { Locale } from "@/lib/i18n/config";

export type BilingualText = {
  zh: string;
  en: string;
};

export function pickText(text: BilingualText, locale: Locale): string {
  return locale === "en" ? text.en : text.zh;
}

type DemoStageProps = {
  /** 图号，例如 "01" / "A" */
  code: string;
  /** 简短交互说明（显示在底部图注栏） */
  caption: BilingualText;
  /** 可选顶部操作提示 */
  hint?: BilingualText;
  /** 可选右上角状态徽章 */
  statusLabel?: string;
  /** 可选重置 / 重放回调 */
  onReset?: () => void;
  resetLabel?: BilingualText;
  /** 无障碍区域名称 */
  ariaLabel: BilingualText;
  children: ReactNode;
};

/**
 * 统一的交互示例画框：严格延续全站 Monochrome Architectural Editorial 视觉体系
 * - 0px 直角平面画框 + 1px 细线边框 + 浅灰 / OLED 深灰台面
 * - 9999px 胶囊操作控件，移动端触控高度 >= 44px
 */
export function DemoStage({
  code,
  caption,
  hint,
  statusLabel,
  onReset,
  resetLabel,
  ariaLabel,
  children,
}: DemoStageProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";

  return (
    <figure
      aria-label={pickText(ariaLabel, locale)}
      className="my-4 w-full border border-border bg-surface"
    >
      {/* 顶部微标栏 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-solid px-3.5 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-fg" />
          <span className="font-mono text-micro font-medium tracking-wider text-fg uppercase">
            {isEn ? `DEMO ${code}` : `交互演示 ${code}`}
          </span>
          {hint ? (
            <span className="hidden truncate text-micro text-fg-muted sm:inline">
              · {pickText(hint, locale)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {statusLabel ? (
            <span className="border border-border bg-surface px-2 py-0.5 font-mono text-micro text-fg-secondary tabular-nums">
              {statusLabel}
            </span>
          ) : null}
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-9 items-center rounded-full border border-border bg-bg px-3 font-mono text-micro font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface sm:min-h-7"
            >
              {resetLabel
                ? pickText(resetLabel, locale)
                : isEn
                  ? "Reset"
                  : "重置"}
            </button>
          ) : null}
        </div>
      </div>

      {/* 移动端显示操作提示 */}
      {hint ? (
        <p className="border-b border-border bg-surface px-3.5 py-2 text-micro text-fg-muted sm:hidden">
          {pickText(hint, locale)}
        </p>
      ) : null}

      {/* 交互主体舞台 */}
      <div className="lab-grid p-3.5 sm:p-5 md:p-6">
        <div className="mx-auto w-full max-w-[640px] border border-border bg-bg p-4 sm:p-5">
          {children}
        </div>
      </div>

      {/* 底部 FIG 等宽图注栏（对齐现有 Figure 组件） */}
      <figcaption className="flex items-center justify-between gap-4 border-t border-border bg-surface px-3.5 py-3 text-micro text-fg-muted sm:px-5">
        <span>{pickText(caption, locale)}</span>
        <span className="shrink-0 font-mono tracking-wider uppercase">
          FIG {code}
        </span>
      </figcaption>
    </figure>
  );
}

/** 通用极简黑白切换开关（不依赖颜色单独传达状态，附带 ON/OFF 文本与清晰焦点框） */
export function MonochromeSwitch({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="block cursor-pointer text-label font-medium text-fg"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-caption leading-relaxed text-fg-muted">
            {description}
          </p>
        ) : null}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="group inline-flex min-h-11 shrink-0 items-center gap-2 sm:min-h-9"
      >
        <span className="font-mono text-micro text-fg-muted tabular-nums">
          {checked ? "ON" : "OFF"}
        </span>
        <span
          aria-hidden="true"
          className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
            checked
              ? "border-fg bg-ink"
              : "border-border-strong bg-surface-recessed"
          }`}
        >
          <span
            className={`size-4 rounded-full transition-transform ${
              checked
                ? "translate-x-[22px] bg-ink-fg"
                : "translate-x-[3px] bg-fg-muted"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
