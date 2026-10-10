"use client";

import Image from "next/image";
import { type AnimationEvent, useState } from "react";
import { RefreshIcon } from "@/components/home/icons";

type Phase = "idle" | "out" | "in";

/**
 * Intro 卡片头像与 Toggle Lockdown：在两张 Memoji 之间互换。
 * 显示哪张由互换状态与 .dark 类共同决定，首屏不依赖客户端主题状态。
 */
export function IntroAvatar() {
  const [swapped, setSwapped] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [pulseKey, setPulseKey] = useState(0);

  function toggle() {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSwapped((value) => !value);
      return;
    }
    setPhase("out");
  }

  function handleAnimationEnd(event: AnimationEvent) {
    if (event.target !== event.currentTarget) return;
    if (phase === "out") {
      setSwapped((value) => !value);
      setPulseKey((value) => value + 1);
      setPhase("in");
    } else if (phase === "in") {
      setPhase("idle");
    }
  }

  const animation = {
    idle: "",
    out: "animate-[avatar-out_150ms_ease-in_forwards]",
    in: "animate-[avatar-in_450ms_cubic-bezier(0.2,0,0,1)]",
  }[phase];
  const lightImage = swapped ? "hidden dark:block" : "dark:hidden";
  const darkImage = swapped ? "dark:hidden" : "hidden dark:block";

  return (
    <>
      <span className="relative -ml-4 block h-28 w-32 shrink-0">
        {pulseKey > 0 && (
          <span
            key={pulseKey}
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -mt-24 -ml-24 size-48 rounded-full bg-pulse opacity-0 animate-[avatar-pulse_700ms_ease-out]"
          />
        )}
        <span
          className={`absolute inset-0 ${animation}`}
          onAnimationEnd={handleAnimationEnd}
        >
          <Image
            src="/images/memoji-light.png"
            alt=""
            fill
            sizes="128px"
            draggable={false}
            className={`object-contain ${lightImage}`}
          />
          <Image
            src="/images/memoji-dark.png"
            alt=""
            fill
            sizes="128px"
            draggable={false}
            className={`object-contain ${darkImage}`}
          />
        </span>
      </span>
      <button
        type="button"
        data-no-drag
        aria-pressed={swapped}
        onClick={toggle}
        className="absolute top-[18px] right-[18px] inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-3 text-label font-medium transition-colors hover:border-fg-muted md:h-[38px]"
      >
        <RefreshIcon className="size-4" />
        <span>
          <span className="sr-only min-[375px]:not-sr-only">Toggle </span>
          Lockdown
        </span>
      </button>
      <p aria-live="polite" className="sr-only">
        {swapped ? "已切换为另一张头像" : ""}
      </p>
    </>
  );
}
