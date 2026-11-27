"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * 页脚标志性 QIANYU.AI 双层图纸印刷视差错位字标：
 * - 表层：实线空心描边（跟随指针微距正向偏移，悬停时锐化为前景色）
 * - 中层：微距过渡细线（激活时浮现，强化三层套版纵深）
 * - 底层：虚线 CAD 骨架 + 单色点阵图纸纹理（反向偏移，呈现印刷套版错位感）
 * - 严格遵守 prefers-reduced-motion，纯视觉把玩，不触发跳转或滚动。
 */
export function EditorialWordmark() {
  const patternId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const [isActive, setIsActive] = useState(false);
  const [readout, setReadout] = useState({ dx: "00.0", dy: "00.0" });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedMotionRef.current = mq.matches;
      if (mq.matches && containerRef.current) {
        containerRef.current.style.setProperty("--wm-x", "0");
        containerRef.current.style.setProperty("--wm-y", "0");
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  function startLoop() {
    if (rafRef.current !== null || reducedMotionRef.current) return;

    const tick = () => {
      const curr = currentRef.current;
      const target = targetRef.current;
      const ease = activeRef.current ? 0.16 : 0.1;

      curr.x += (target.x - curr.x) * ease;
      curr.y += (target.y - curr.y) * ease;

      const settled =
        Math.abs(target.x - curr.x) < 0.002 &&
        Math.abs(target.y - curr.y) < 0.002;

      if (settled) {
        curr.x = target.x;
        curr.y = target.y;
      }

      const el = containerRef.current;
      if (el) {
        el.style.setProperty("--wm-x", curr.x.toFixed(4));
        el.style.setProperty("--wm-y", curr.y.toFixed(4));
      }

      if (activeRef.current || !settled) {
        const pxX = curr.x * 18;
        const pxY = curr.y * 12;
        setReadout({
          dx: `${pxX >= 0 ? "+" : "-"}${Math.abs(pxX).toFixed(1).padStart(4, "0")}`,
          dy: `${pxY >= 0 ? "+" : "-"}${Math.abs(pxY).toFixed(1).padStart(4, "0")}`,
        });
      }

      if (!settled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function updateFromPointer(clientX: number, clientY: number) {
    if (reducedMotionRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
    targetRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
    activeRef.current = true;
    setIsActive(true);
    startLoop();
  }

  function handleReset() {
    targetRef.current = { x: 0, y: 0 };
    activeRef.current = false;
    setIsActive(false);
    startLoop();
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-active={isActive ? "true" : "false"}
      onPointerEnter={(e) => updateFromPointer(e.clientX, e.clientY)}
      onPointerMove={(e) => updateFromPointer(e.clientX, e.clientY)}
      onPointerDown={(e) => updateFromPointer(e.clientX, e.clientY)}
      onPointerLeave={handleReset}
      onPointerCancel={handleReset}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") handleReset();
      }}
      className="editorial-wordmark-stage relative mt-8 cursor-crosshair touch-pan-y select-none pb-4"
    >
      {/* 建筑套版微坐标指示（仅交互时浮现） */}
      <div
        className={`pointer-events-none mb-2 flex items-center justify-between font-mono text-[10px] tracking-widest text-fg-muted uppercase transition-opacity duration-200 ${
          isActive ? "opacity-85" : "opacity-0"
        }`}
      >
        <span>REG {"//"} OFFSET PRINT LAYER</span>
        <span className="tabular-nums">
          ΔX {readout.dx} &nbsp; ΔY {readout.dy}
        </span>
      </div>

      {/* 双层图纸 × 实线空心描边 SVG（全视口像素级套版对齐） */}
      <svg
        viewBox="0 0 1120 192"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <pattern
            id={patternId}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="0.9" fill="var(--lineart-muted)" />
          </pattern>
        </defs>

        {/* 四角建筑套版十字准星 */}
        <g
          className={`transition-opacity duration-200 ${
            isActive ? "opacity-80" : "opacity-30"
          }`}
          stroke="var(--border-strong)"
          strokeWidth="1"
        >
          <path d="M6 14H18M12 8V20" />
          <path d="M1102 14H1114M1108 8V20" />
          <path d="M6 178H18M12 172V184" />
          <path d="M1102 178H1114M1108 172V184" />
        </g>

        {/* 底层：虚线 CAD 图纸骨架 + 点阵填充（反向微距错位） */}
        <text
          x="560"
          y="156"
          textAnchor="middle"
          fontSize="176"
          fontWeight="700"
          letterSpacing="-6"
          fill={`url(#${patternId})`}
          fillOpacity={isActive ? 0.55 : 0.22}
          stroke="var(--lineart-muted)"
          strokeWidth="1.25"
          strokeDasharray="6 5"
          className="wordmark-layer-back font-sans"
        >
          QIANYU.AI
        </text>

        {/* 中层：极细过渡套版重影（仅交互时显现） */}
        <text
          x="560"
          y="156"
          textAnchor="middle"
          fontSize="176"
          fontWeight="700"
          letterSpacing="-6"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="0.9"
          className={`wordmark-layer-mid font-sans transition-opacity duration-200 ${
            isActive ? "opacity-65" : "opacity-0"
          }`}
        >
          QIANYU.AI
        </text>

        {/* 表层：锐利实线空心描边（正向微距错位） */}
        <text
          x="560"
          y="156"
          textAnchor="middle"
          fontSize="176"
          fontWeight="700"
          letterSpacing="-6"
          fill="none"
          stroke={isActive ? "var(--lineart-primary)" : "var(--border-strong)"}
          strokeWidth="1.65"
          className="wordmark-layer-front font-sans transition-[stroke] duration-200"
        >
          QIANYU.AI
        </text>
      </svg>
    </div>
  );
}
