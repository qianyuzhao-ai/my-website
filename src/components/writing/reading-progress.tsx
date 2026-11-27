"use client";

import { useEffect, useRef } from "react";

/**
 * 文章页顶部极细黑白滚动进度条：
 * - 支持 scroll-driven animation 的现代浏览器直接走合成器 CSS；
 * - 旧版浏览器回退到轻量被动 scroll 监听更新 scaleX。
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (CSS.supports("animation-timeline", "scroll()")) return;

    const bar = barRef.current;
    if (!bar) return;

    let rafId = 0;
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="reading-progress-bar pointer-events-none fixed top-0 left-0 z-50 h-[2px] w-full bg-fg"
    />
  );
}
