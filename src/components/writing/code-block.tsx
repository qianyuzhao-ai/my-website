"use client";

import type { ComponentProps, ReactElement } from "react";
import { isValidElement, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/home/icons";

function extractLanguage(children: ComponentProps<"pre">["children"]): string {
  if (!isValidElement(children)) return "";
  const el = children as ReactElement<{ className?: string }>;
  const match = el.props.className?.match(/language-([a-z0-9+-]+)/i);
  return match ? match[1] : "";
}

/** 极简黑白平面代码块（0px 直角、1px 细线顶栏与复制胶囊，对齐 Figma 设计稿） */
export function CodeBlock(props: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = extractLanguage(props.children);

  async function handleCopy() {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text.trimEnd());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用时静默降级
    }
  }

  return (
    <div className="my-2 w-full overflow-hidden border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-micro font-medium tracking-wider text-fg uppercase">
          {lang || "code"}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "代码已复制" : "复制代码"}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-bg px-3 text-micro font-medium text-fg-secondary transition-colors hover:border-border-strong hover:text-fg sm:min-h-7"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-fg" />
              <span className="text-fg">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "代码已复制到剪贴板" : ""}
      </p>

      <pre
        ref={preRef}
        className="overflow-x-auto px-4 py-4 font-mono text-code text-fg [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit] [&_code]:text-inherit"
        {...props}
      />
    </div>
  );
}
