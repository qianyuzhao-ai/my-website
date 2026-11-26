"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/home/icons";
import { siteConfig } from "@/lib/site-config";

const SESSION_KEY = "qianyu-sky-island-visited-v1";

type Vec3 = readonly [number, number, number];
type Projected = { x: number; y: number; z: number };

const RING_SEGMENTS = 8;
const ORBIT_SEGMENTS = 64;

// 预计算三维浮岛静态骨架顶点，避免每帧分配多余几何数组
const ISLAND_GEOMETRY = (() => {
  const topRing: Vec3[] = [];
  const midRing: Vec3[] = [];
  const underRing: Vec3[] = [];
  const highSanctum: Vec3[] = [];
  const sanctumBase: Vec3[] = [];
  const apex: Vec3 = [0, -0.82, 0];

  for (let i = 0; i < RING_SEGMENTS; i++) {
    const a = (i / RING_SEGMENTS) * Math.PI * 2 + Math.PI / 8;
    const rMod = 1 + (i % 2 === 0 ? 0.06 : -0.04);
    topRing.push([Math.cos(a) * 0.94 * rMod, 0.06, Math.sin(a) * 0.94 * rMod]);
    midRing.push([Math.cos(a) * 0.86 * rMod, -0.14, Math.sin(a) * 0.86 * rMod]);
    underRing.push([
      Math.cos(a + 0.22) * 0.48 * rMod,
      -0.46,
      Math.sin(a + 0.22) * 0.48 * rMod,
    ]);
    const sx = 0.16 + Math.cos(a) * 0.36;
    const sz = -0.12 + Math.sin(a) * 0.36;
    highSanctum.push([sx, 0.34, sz]);
    sanctumBase.push([sx, 0.06, sz]);
  }

  const spireBase: Vec3 = [0.16, 0.42, -0.12];
  const spireTop: Vec3 = [0.16, 0.92, -0.12];
  const spireMid: Vec3[] = [
    [0.16 + 0.13, 0.64, -0.12],
    [0.16, 0.64, -0.12 + 0.13],
    [0.16 - 0.13, 0.64, -0.12],
    [0.16, 0.64, -0.12 - 0.13],
  ];

  // 左侧悬空彩蛋飞岛线框轮廓
  const satCenter: Vec3 = [-1.14, 0.16, 0.34];
  const satRing: Vec3[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    satRing.push([
      satCenter[0] + Math.cos(a) * 0.24,
      satCenter[1],
      satCenter[2] + Math.sin(a) * 0.24,
    ]);
  }
  const satApex: Vec3 = [satCenter[0], satCenter[1] - 0.26, satCenter[2]];

  return {
    topRing,
    midRing,
    underRing,
    highSanctum,
    sanctumBase,
    apex,
    spireBase,
    spireTop,
    spireMid,
    satRing,
    satApex,
  };
})();

function rotateEuler(v: Vec3, rx: number, ry: number, rz: number): Vec3 {
  // 绕 Y 轴
  const x1 = v[0] * Math.cos(ry) + v[2] * Math.sin(ry);
  const z1 = -v[0] * Math.sin(ry) + v[2] * Math.cos(ry);
  // 绕 X 轴
  const y2 = v[1] * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = v[1] * Math.sin(rx) + z1 * Math.cos(rx);
  // 绕 Z 轴
  const x3 = x1 * Math.cos(rz) - y2 * Math.sin(rz);
  const y3 = x1 * Math.sin(rz) + y2 * Math.cos(rz);
  return [x3, y3, z2];
}

function renderWireframeFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: {
    isDark: boolean;
    progress: number;
    timeSec: number;
    pointerX: number;
    pointerY: number;
    reducedMotion: boolean;
  },
) {
  ctx.clearRect(0, 0, w, h);

  const { isDark, progress, timeSec, pointerX, pointerY, reducedMotion } = opts;
  const cx = w * 0.5;
  const cy = h * 0.52;
  const scale = Math.min(w, h) * 0.35;
  const fov = 4.8;

  const sky = isDark ? "#4f94ff" : "#1d6cf6";
  const mint = isDark ? "#34d399" : "#0ea572";
  const ink = isDark ? "#e2e8f0" : "#0f172a";
  const muted = isDark ? "#64748b" : "#94a3b8";

  const yaw = reducedMotion ? -0.48 : -0.48 + timeSec * 0.34 + pointerX * 0.22;
  const pitch = reducedMotion
    ? 0.4
    : 0.4 + Math.sin(timeSec * 0.7) * 0.03 + pointerY * 0.14;
  const bobY = reducedMotion ? 0 : Math.sin(timeSec * 1.45) * 0.035;

  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);

  const project = (v: Vec3, applyBob = true): Projected => {
    const yIn = applyBob ? v[1] + bobY : v[1];
    const x1 = v[0] * cosY + v[2] * sinY;
    const z1 = -v[0] * sinY + v[2] * cosY;
    const y2 = yIn * cosX - z1 * sinX;
    const z2 = yIn * sinX + z1 * cosX;
    const p = fov / (fov - z2);
    return { x: cx + x1 * scale * p, y: cy - y2 * scale * p, z: z2 };
  };

  // Stage 01 扫描线生长进度（0%→38% 从底部锥尖自下而上显露线框）
  const revealRatio = Math.min(1, Math.max(0.18, progress / 38));
  const revealCutY = -0.95 + revealRatio * 2.05;

  // 1. 底部 3D 透视参考坐标网格
  ctx.save();
  ctx.strokeStyle = muted;
  ctx.lineWidth = 0.75;
  ctx.globalAlpha = isDark ? 0.13 : 0.17;
  const gridY = -0.94;
  for (let i = -3; i <= 3; i++) {
    const t = i * 0.48;
    const a1 = project([t, gridY, -1.44], false);
    const b1 = project([t, gridY, 1.44], false);
    const a2 = project([-1.44, gridY, t], false);
    const b2 = project([1.44, gridY, t], false);
    ctx.beginPath();
    ctx.moveTo(a1.x, a1.y);
    ctx.lineTo(b1.x, b1.y);
    ctx.moveTo(a2.x, a2.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. 双倾角三维陀螺仪经纬轨道环
  const drawOrbitRing = (params: {
    radius: number;
    rx: number;
    ry: number;
    rz: number;
    color: string;
    lineWidth: number;
    frontAlpha: number;
    backAlpha: number;
    dashed?: boolean;
    sweepPct: number;
    showTip?: boolean;
  }) => {
    const pts: Projected[] = [];
    for (let i = 0; i <= ORBIT_SEGMENTS; i++) {
      const a = (i / ORBIT_SEGMENTS) * Math.PI * 2;
      const v = rotateEuler(
        [Math.cos(a) * params.radius, 0, Math.sin(a) * params.radius],
        params.rx,
        params.ry,
        params.rz,
      );
      pts.push(project(v, false));
    }

    const maxSeg = Math.max(
      2,
      Math.round(ORBIT_SEGMENTS * (params.sweepPct / 100)),
    );
    ctx.save();
    ctx.strokeStyle = params.color;
    ctx.lineWidth = params.lineWidth;
    ctx.lineCap = "round";
    if (params.dashed) ctx.setLineDash([3, 4]);

    for (let i = 0; i < maxSeg; i++) {
      const p1 = pts[i];
      const p2 = pts[i + 1];
      ctx.globalAlpha =
        (p1.z + p2.z) * 0.5 >= 0 ? params.frontAlpha : params.backAlpha;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    if (params.showTip) {
      const tip = pts[maxSeg % ORBIT_SEGMENTS];
      ctx.setLineDash([]);
      ctx.fillStyle = params.color;
      ctx.globalAlpha = 0.24;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.96;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const spinA = reducedMotion ? 0 : timeSec * 0.42;
  const spinB = reducedMotion ? 0 : -timeSec * 0.31;

  // 外围极淡虚线经纬圈
  drawOrbitRing({
    radius: 1.56,
    rx: 0.24,
    ry: spinB * 0.4,
    rz: -0.28,
    color: muted,
    lineWidth: 0.9,
    frontAlpha: 0.38,
    backAlpha: 0.12,
    dashed: true,
    sweepPct: 100,
  });
  // 晴空蓝主进度轨道环
  drawOrbitRing({
    radius: 1.38,
    rx: -0.38,
    ry: spinA,
    rz: 0.31,
    color: sky,
    lineWidth: 1.65,
    frontAlpha: 0.92,
    backAlpha: 0.28,
    sweepPct: Math.max(8, progress),
    showTip: true,
  });
  // 薄荷青副倾角轨道环
  drawOrbitRing({
    radius: 1.24,
    rx: 0.48,
    ry: spinB,
    rz: -0.42,
    color: mint,
    lineWidth: 1.25,
    frontAlpha: 0.82,
    backAlpha: 0.2,
    sweepPct: Math.min(100, progress + 18),
    showTip: true,
  });

  // 3. 浮岛顶面半透明玻璃面片（就绪接近 100% 时薄荷青轻盈凝实）
  const {
    topRing,
    midRing,
    underRing,
    highSanctum,
    sanctumBase,
    apex,
    spireBase,
    spireTop,
    spireMid,
    satRing,
    satApex,
  } = ISLAND_GEOMETRY;

  const readyBlend = Math.min(1, Math.max(0, (progress - 75) / 25));
  if (revealCutY > 0.05) {
    const drawFacet = (ring: Vec3[], color: string, alpha: number) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ring.forEach((v, idx) => {
        const p = project(v);
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    drawFacet(
      topRing,
      readyBlend > 0.5 ? mint : sky,
      (isDark ? 0.07 : 0.055) + readyBlend * 0.06,
    );
    drawFacet(highSanctum, mint, (isDark ? 0.1 : 0.075) + readyBlend * 0.065);
  }

  // 4. 按 Z 深度排序绘制三维浮岛骨架边线
  type EdgeItem = {
    p1: Projected;
    p2: Projected;
    z: number;
    color: string;
    width: number;
    alpha: number;
    dashed: boolean;
  };
  const edges: EdgeItem[] = [];

  const pushEdge = (
    a: Vec3,
    b: Vec3,
    color: string,
    wFront: number,
    opFront: number,
    opBack: number,
    backDashed = false,
  ) => {
    const minY = Math.min(a[1], b[1]);
    if (minY > revealCutY) return;
    const p1 = project(a);
    const p2 = project(b);
    const z = (p1.z + p2.z) * 0.5;
    const isFront = z >= -0.12;
    edges.push({
      p1,
      p2,
      z,
      color,
      width: isFront ? wFront : Math.max(0.75, wFront * 0.72),
      alpha: isFront ? opFront : opBack,
      dashed: !isFront && backDashed,
    });
  };

  const primaryRimColor = progress >= 100 ? mint : sky;

  for (let i = 0; i < RING_SEGMENTS; i++) {
    const j = (i + 1) % RING_SEGMENTS;
    pushEdge(topRing[i], topRing[j], primaryRimColor, 1.55, 0.92, 0.34);
    pushEdge(midRing[i], midRing[j], ink, 1.15, 0.6, 0.18);
    pushEdge(topRing[i], midRing[i], ink, 1.05, 0.56, 0.18);
    pushEdge(midRing[i], underRing[i], ink, 1.0, 0.54, 0.16, true);
    pushEdge(
      midRing[i],
      underRing[(i + RING_SEGMENTS - 1) % RING_SEGMENTS],
      ink,
      0.85,
      0.34,
      0.12,
      true,
    );
    pushEdge(underRing[i], underRing[j], sky, 1.05, 0.6, 0.2, true);
    pushEdge(underRing[i], apex, sky, 1.15, 0.74, 0.24, true);
    pushEdge(highSanctum[i], highSanctum[j], mint, 1.35, 0.9, 0.35);
    if (i % 2 === 0) {
      pushEdge(sanctumBase[i], highSanctum[i], mint, 1.05, 0.64, 0.24);
    }
  }

  // 上层高台晶锥信标
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    pushEdge(spireBase, spireMid[i], mint, 1.25, 0.9, 0.45);
    pushEdge(spireTop, spireMid[i], sky, 1.35, 0.95, 0.5);
    pushEdge(spireMid[i], spireMid[j], mint, 1.1, 0.8, 0.35);
  }
  pushEdge([0, -1.04, 0], [0, 0.14, 0], sky, 0.9, 0.32, 0.32, true);

  // 左侧悬空彩蛋飞岛 + 虚线连接桥
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    pushEdge(satRing[i], satRing[j], mint, 1.2, 0.86, 0.34);
    if (i % 2 === 0) {
      pushEdge(satRing[i], satApex, mint, 1.0, 0.65, 0.24);
    }
  }
  pushEdge(topRing[4], satRing[0], mint, 1.0, 0.52, 0.35, true);

  edges.sort((a, b) => a.z - b.z);

  ctx.save();
  ctx.lineCap = "round";
  for (const e of edges) {
    ctx.strokeStyle = e.color;
    ctx.lineWidth = e.width;
    ctx.globalAlpha = e.alpha;
    ctx.setLineDash(e.dashed ? [3, 3] : []);
    ctx.beginPath();
    ctx.moveTo(e.p1.x, e.p1.y);
    ctx.lineTo(e.p2.x, e.p2.y);
    ctx.stroke();
  }
  ctx.restore();

  // Stage 01 激光扫描线（0→38% 期间自下而上掠过）
  if (progress < 42) {
    const scanP = project([0, revealCutY, 0]);
    ctx.save();
    ctx.strokeStyle = sky;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.65 * (1 - progress / 42);
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx - scale * 1.15, scanP.y);
    ctx.lineTo(cx + scale * 1.15, scanP.y);
    ctx.stroke();
    ctx.restore();
  }

  // 5. 关键三维节点微光光点
  const pulse = reducedMotion ? 1 : 0.85 + Math.sin(timeSec * 3.1) * 0.15;
  const keyVerts: { pt: Vec3; col: string; r: number }[] = [
    { pt: apex, col: sky, r: 2.8 },
    { pt: spireTop, col: mint, r: 3.3 },
    { pt: topRing[0], col: sky, r: 2.3 },
    { pt: topRing[2], col: sky, r: 2.3 },
    { pt: topRing[5], col: sky, r: 2.1 },
    { pt: highSanctum[1], col: mint, r: 2.2 },
    { pt: satApex, col: mint, r: 2.1 },
  ];

  ctx.save();
  for (const v of keyVerts) {
    if (v.pt[1] > revealCutY) continue;
    const p = project(v.pt);
    ctx.fillStyle = v.col;
    ctx.globalAlpha = 0.2 * pulse;
    ctx.beginPath();
    ctx.arc(p.x, p.y, v.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.96;
    ctx.beginPath();
    ctx.arc(p.x, p.y, v.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 6. 四角建筑微标定位十字
  const margin = 16;
  const arm = 6;
  const corners = [
    [margin, margin],
    [w - margin, margin],
    [margin, h - margin],
    [w - margin, h - margin],
  ];
  ctx.save();
  ctx.strokeStyle = muted;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.42;
  for (const [x, y] of corners) {
    ctx.beginPath();
    ctx.moveTo(x - arm, y);
    ctx.lineTo(x + arm, y);
    ctx.moveTo(x, y - arm);
    ctx.lineTo(x, y + arm);
    ctx.stroke();
  }
  ctx.restore();
}

export function SkyLoader({
  sceneReady,
  onComplete,
}: {
  sceneReady: boolean;
  onComplete: () => void;
}) {
  const { resolvedTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const completedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const themeDarkRef = useRef(false);

  progressRef.current = progress;

  useEffect(() => {
    if (resolvedTheme) {
      themeDarkRef.current = resolvedTheme === "dark";
    } else if (typeof document !== "undefined") {
      themeDarkRef.current =
        document.documentElement.classList.contains("dark");
    }
  }, [resolvedTheme]);

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

  // 2. 进度满且场景就绪后短暂定格薄荷青锁定态，随后推入消融进入空岛
  useEffect(() => {
    if (progress < 100 || !sceneReady || dismissed) return;
    const openTimer = window.setTimeout(() => {
      finishLoading();
    }, 240);
    return () => window.clearTimeout(openTimer);
  }, [progress, sceneReady, dismissed, finishLoading]);

  // 3. 推入淡出动效结束后卸载 DOM
  useEffect(() => {
    if (!dismissed) return;
    const removeTimer = window.setTimeout(() => {
      setHidden(true);
    }, 580);
    return () => window.clearTimeout(removeTimer);
  }, [dismissed]);

  // 4. 60fps 实时三维透视线框 Canvas 循环（含 HiDPI 适配、鼠标微倾视差与减弱动画回退）
  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mq.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    mq.addEventListener("change", onMotionChange);

    let cssW = 460;
    let cssH = 340;
    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      cssW = rect.width;
      cssH = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion || e.pointerType !== "mouse") return;
      pointerRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    const startMs = performance.now();
    const tick = (now: number) => {
      const isDark =
        themeDarkRef.current ||
        document.documentElement.classList.contains("dark");
      pointerRef.current.x +=
        (pointerRef.current.targetX - pointerRef.current.x) * 0.08;
      pointerRef.current.y +=
        (pointerRef.current.targetY - pointerRef.current.y) * 0.08;

      renderWireframeFrame(ctx, cssW, cssH, {
        isDark,
        progress: progressRef.current,
        timeSec: (now - startMs) / 1000,
        pointerX: pointerRef.current.x,
        pointerY: pointerRef.current.y,
        reducedMotion,
      });
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      mq.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [hidden]);

  function handleSkip() {
    if (!sceneReady) return;
    finishLoading();
  }

  if (hidden) return null;

  const isReady = progress >= 100 && sceneReady;
  const stageText =
    progress < 38
      ? "STAGE 01 · 线框扫描塑形浮岛骨架…"
      : progress < 92
        ? "STAGE 02 · 光影与云海线框同步中…"
        : "WIREFRAME LOCKED · 场景就绪";

  return (
    <section
      aria-label="云上庭园三维世界加载界面"
      className={`glass-ambient-bg fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-5 py-6 text-fg transition-[opacity,transform] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-10 sm:py-9 ${
        dismissed
          ? "pointer-events-none opacity-0 motion-safe:scale-[1.12]"
          : "scale-100 opacity-100"
      }`}
    >
      {/* 建筑极细定位外框（呼应 Figma 09a / 09b / 09c） */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[22px] border border-border/70 sm:inset-6 sm:rounded-[28px]"
      />

      {/* 1. 顶部工程遥测栏 */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-center sm:justify-between">
        <div className="inline-flex items-center gap-2 font-mono text-micro font-bold tracking-[0.1em] text-fg uppercase">
          <span
            aria-hidden="true"
            className={`size-2 rounded-full signal-dot ${
              isReady ? "bg-signal-dot" : "bg-accent"
            }`}
          />
          <span>
            {siteConfig.name} {"//"} SKY ISLAND 3D
          </span>
        </div>

        <span className="hidden font-mono text-micro tracking-[0.08em] text-fg-muted uppercase sm:inline">
          MESH 582 · ELEV +2.85M · WEBGL 2.0
        </span>
      </div>

      {/* 2. 中央实时 60fps 三维透视线框浮岛 + 建筑细线进度轴 */}
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-4 text-center sm:gap-5">
        <canvas
          ref={canvasRef}
          className="aspect-[480/356] w-[min(86vw,460px)] max-w-full"
        />

        <div className="flex w-full max-w-[360px] flex-col items-center gap-3.5 px-2">
          {/* 标题 + 等宽百分比胶囊 */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            <h1 className="text-[1.15rem] font-bold tracking-[-0.02em] text-fg sm:text-title">
              云上庭园 · Autumn Sky Island
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-caption font-bold tabular-nums transition-colors ${
                isReady
                  ? "bg-signal-soft text-signal"
                  : "bg-accent-soft text-accent"
              }`}
            >
              {progress}%
            </span>
          </div>

          {/* 原生 <progress> 3px 建筑细线进度轴 */}
          <div className="flex w-full flex-col gap-2">
            <progress
              value={progress}
              max={100}
              aria-label="三维空岛加载进度"
              className="wireframe-progress h-[3px] w-full"
            />
            <div className="flex items-center justify-between gap-2 text-micro">
              <p
                role="status"
                aria-live="polite"
                className={`truncate font-medium transition-colors ${
                  isReady ? "text-signal" : "text-fg-secondary"
                }`}
              >
                {stageText}
              </p>
              <span className="shrink-0 font-mono text-fg-muted tabular-nums">
                {progress} / 100
              </span>
            </div>
          </div>

          {/* 场景就绪后浮现主按钮 */}
          <div className="flex min-h-11 items-center justify-center">
            {sceneReady ? (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-label font-medium text-ink-fg shadow-xs transition-all hover:opacity-90 dark:bg-accent dark:text-white dark:hover:bg-accent-hover"
              >
                <span>进入云上庭园</span>
                <ArrowRightIcon className="size-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. 底部极简坐标与操作提示 */}
      <div className="relative z-10 flex w-full max-w-6xl items-center justify-center text-micro text-fg-muted sm:justify-between">
        <span className="hidden font-mono tracking-[0.06em] uppercase sm:inline">
          39.90°N · AUTUMN GARDEN DIORAMA
        </span>
        <span className="sm:hidden">拖动左下角摇杆漫游 · 点击气泡交互</span>
        <span className="hidden text-caption text-fg-secondary sm:inline">
          WASD / 方向键 / 点击地面寻路
        </span>
      </div>
    </section>
  );
}
