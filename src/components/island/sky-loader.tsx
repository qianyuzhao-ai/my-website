"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

const SESSION_KEY = "qianyu-sky-island-visited-v1";

export function SkyLoader({
  sceneReady,
  onComplete,
}: {
  sceneReady: boolean;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const completedRef = useRef(false);

  const finishLoading = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // 忽略隐私模式限制
    }
    setProgress(100);
    setDismissed(true);
    onComplete();
  }, [onComplete]);

  // 1. 推进进度条；同会话回访且场景就绪时直接拉幕放行
  useEffect(() => {
    if (dismissed) return;

    let alreadyVisited = false;
    try {
      alreadyVisited = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // 忽略隐私模式限制
    }

    if (alreadyVisited && sceneReady) {
      finishLoading();
      return;
    }

    const stepMs = 24;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const cap = sceneReady ? 100 : 88;
        if (prev >= cap) return prev;
        const delta = sceneReady
          ? 6
          : Math.max(1, Math.ceil((88 - prev) * 0.12));
        return Math.min(cap, prev + delta);
      });
    }, stepMs);

    return () => window.clearInterval(timer);
  }, [sceneReady, dismissed, finishLoading]);

  // 2. 进度满且场景就绪后拉起遮罩并立刻解锁空岛操控
  useEffect(() => {
    if (progress < 100 || !sceneReady || dismissed) return;
    const openTimer = window.setTimeout(() => {
      finishLoading();
    }, 180);
    return () => window.clearTimeout(openTimer);
  }, [progress, sceneReady, dismissed, finishLoading]);

  // 3. 遮罩淡出动画结束后卸载 DOM（独立副作用，避免被自身状态变更提前取消）
  useEffect(() => {
    if (!dismissed) return;
    const removeTimer = window.setTimeout(() => {
      setHidden(true);
    }, 540);
    return () => window.clearTimeout(removeTimer);
  }, [dismissed]);

  function handleSkip() {
    if (!sceneReady) return;
    finishLoading();
  }

  if (hidden) return null;

  return (
    <output
      aria-live="polite"
      aria-label="空岛世界加载进度"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0b0e13] px-6 py-10 text-[#f3f1ec] transition-opacity duration-500 ${
        dismissed ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* 顶部铭牌 */}
      <div className="flex w-full max-w-5xl items-center justify-between font-mono text-micro tracking-widest text-[#9499a6] uppercase">
        <span>{siteConfig.name} · SKY ARCHIPELAGO</span>
        <span>REALTIME WEBGL DIORAMA</span>
      </div>

      {/* 中央左纳乌几何符文阵 */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative flex size-36 items-center justify-center sm:size-44">
          <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className="size-full text-[#34f5a6] motion-safe:animate-[spin_18s_linear_infinite]"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.24"
              strokeWidth="1.2"
              strokeDasharray="6 6"
            />
            <circle
              cx="100"
              cy="100"
              r="74"
              fill="none"
              stroke="#e5b95c"
              strokeOpacity="0.45"
              strokeWidth="1.4"
            />
            <polygon
              points="100,26 164,137 36,137"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.4"
            />
            <polygon
              points="100,174 164,63 36,63"
              fill="none"
              stroke="#e5b95c"
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
          </svg>

          {/* 中心数字百分比 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-display-sm font-bold tracking-tight text-[#f3f1ec] tabular-nums">
              {progress}%
            </span>
            <span className="font-mono text-micro tracking-widest text-[#34f5a6]">
              ZONAI LINK
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-serif text-title font-semibold tracking-tight text-[#f3f1ec]">
            唤醒浮空群岛 · Awakening the Sky Island
          </p>
          <p className="font-mono text-caption text-[#9499a6]">
            {progress < 45 && "Generating Wind Grass & Floating Cliffs..."}
            {progress >= 45 &&
              progress < 90 &&
              "Lighting Ancient Shrines & Spirit Wisp..."}
            {progress >= 90 && "Ready · 披上斗篷，准备降落"}
          </p>
        </div>

        {/* 细线能量槽 */}
        <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10 sm:w-64">
          <div
            style={{ transform: `scaleX(${progress / 100})` }}
            className="h-full w-full origin-left bg-gradient-to-r from-[#34f5a6] via-[#e5b95c] to-[#ff6438] transition-transform duration-150"
          />
        </div>
      </div>

      {/* 底部操作提示 */}
      <div className="flex flex-col items-center gap-2 text-center font-mono text-micro text-[#9499a6]">
        <span>
          DESKTOP: WASD / 方向键 / 点击地面寻路 · MOBILE: 虚拟摇杆 + 符文动作键
        </span>
        {sceneReady ? (
          <button
            type="button"
            onClick={handleSkip}
            className="min-h-9 rounded-full border border-white/20 px-4 py-1 text-caption text-[#f3f1ec] transition-colors hover:border-[#34f5a6] hover:text-[#34f5a6]"
          >
            直接进入空岛 →
          </button>
        ) : null}
      </div>
    </output>
  );
}
