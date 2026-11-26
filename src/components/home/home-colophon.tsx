"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";
import { ArrowIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { siteConfig } from "@/lib/site-config";

export function HomeColophon() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.18;
    const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.22;
    btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  }

  function handlePointerLeave() {
    const btn = buttonRef.current;
    if (!btn) return;
    btn.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <section
      aria-labelledby="colophon-heading"
      className="border-t border-border px-4 py-20 sm:px-6 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-6xl rounded-card-sm border border-border bg-surface p-7 sm:p-12 md:rounded-card lg:p-16">
        <p className="font-mono text-caption tracking-widest text-accent uppercase">
          ACT IV {"//"} OPEN FOR DIALOGUE &amp; CO-CREATION
        </p>

        <h2
          id="colophon-heading"
          className="mt-4 max-w-3xl font-serif text-section font-bold tracking-tight text-fg"
        >
          正在探索下一代 AI 产品形态，或想交流{" "}
          <em className="font-normal text-accent italic">Coding × AIGC</em>{" "}
          的造物经验？
        </h2>

        <p className="mt-4 max-w-xl text-body text-fg-muted">
          无论是 Agent
          工具链切磋、生成式视觉工作流探讨，还是新奇想法碰撞，随时向{" "}
          {siteConfig.name} 发起信号。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            ref={buttonRef}
            type="button"
            onClick={openConnectDialog}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            aria-haspopup="dialog"
            className="inline-flex min-h-13 items-center gap-3 rounded-full bg-fg px-7 text-body font-medium text-bg transition-transform duration-200 ease-out hover:bg-accent hover:text-white"
          >
            <span>发起连接 · Connect Now</span>
            <ArrowIcon className="size-4.5" />
          </button>

          <span className="font-mono text-caption text-fg-muted">
            或直接致信 {siteConfig.email}
          </span>
        </div>
      </div>
    </section>
  );
}
