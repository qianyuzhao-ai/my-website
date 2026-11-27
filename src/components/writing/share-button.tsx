"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/home/icons";
import { useLocale } from "@/components/site/locale-provider";

export function ShareButton({
  title,
  fullWidth = false,
}: {
  title: string;
  fullWidth?: boolean;
}) {
  const { dict } = useLocale();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // 用户取消系统分享或剪贴板不可用时静默忽略
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-surface-recessed px-4 text-caption font-medium text-fg transition-opacity hover:opacity-80 xl:min-h-8 ${
          fullWidth ? "w-full" : "w-fit"
        }`}
      >
        {copied ? (
          <>
            <CheckIcon className="size-3.5" />
            <span>{dict.article.linkCopied}</span>
          </>
        ) : (
          <>
            <span>{dict.article.share}</span>
            <ArrowIcon className="size-3.5" />
          </>
        )}
      </button>
      <p aria-live="polite" className="sr-only">
        {copied ? dict.article.linkCopiedSr : ""}
      </p>
    </>
  );
}
