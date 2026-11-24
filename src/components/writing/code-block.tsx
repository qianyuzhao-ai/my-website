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
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated/75">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-micro text-fg-muted">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="ml-1.5 tracking-wider uppercase">SOURCE</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "代码已复制" : "复制代码"}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-micro font-medium text-fg transition-colors hover:border-border-strong"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5 text-signal" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        className="overflow-x-auto px-5 py-4 font-mono text-code text-fg [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
        {...props}
      />
    </div>
  );
}
