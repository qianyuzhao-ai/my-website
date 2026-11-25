"use client";

import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/home/icons";

export function CodeBlock(props: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

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
    <div className="relative my-2 w-full overflow-hidden rounded-lg border border-border bg-surface-elevated">
      <div className="flex items-center justify-end border-b border-border px-3 py-1.5">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "代码已复制" : "复制代码"}
          className="inline-flex min-h-11 items-center gap-1.5 px-2.5 text-label font-medium text-fg-muted transition-colors duration-150 hover:text-fg sm:min-h-8"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-signal" />
              <span className="text-signal">已复制</span>
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
        className="overflow-x-auto px-5 py-4 font-mono text-code text-fg [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
        {...props}
      />
    </div>
  );
}
