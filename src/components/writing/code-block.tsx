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
    <div className="glass-dark-surface relative my-2 w-full overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-white/18" />
            <span className="size-2.5 rounded-full bg-white/18" />
            <span className="size-2.5 rounded-full bg-white/18" />
          </span>
          <span className="font-mono text-micro tracking-wider text-[#94a3b8] uppercase">
            {lang || "code"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "代码已复制" : "复制代码"}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 text-caption font-medium text-[#cbd5e1] transition-colors duration-150 hover:bg-white/15 hover:text-white sm:min-h-8"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-[#34d399]" />
              <span className="text-[#34d399]">已复制</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {copied ? "代码已复制到剪贴板" : ""}
      </p>

      <pre
        ref={preRef}
        className="overflow-x-auto px-5 py-4 font-mono text-code text-[#e2e8f0] [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit] [&_code]:text-inherit"
        {...props}
      />
    </div>
  );
}
