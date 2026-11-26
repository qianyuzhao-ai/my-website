"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { SparklesIcon, TerminalIcon } from "@/components/home/icons";

type ConsoleMode = "code" | "aigc";

type Scenario = {
  id: string;
  label: string;
  code: {
    file: string;
    metricLabel: string;
    metricValue: string;
    lines: { num: string; text: string; highlight?: boolean }[];
    outputTitle: string;
    outputStatus: string;
    nodes: { name: string; role: string; state: string }[];
  };
  aigc: {
    model: string;
    seed: string;
    prompt: string;
    negative: string;
    moodTitle: string;
    palette: "sky" | "mint" | "indigo";
    specs: { k: string; v: string }[];
  };
};

const SCENARIOS: Scenario[] = [
  {
    id: "storyboard",
    label: "01 · 分镜合成",
    code: {
      file: "pipeline/storyboard-agent.ts",
      metricLabel: "LATENCY",
      metricValue: "148ms · STREAM",
      lines: [
        { num: "01", text: "const shot = await planShot(script.scene[2]);" },
        {
          num: "02",
          text: "const rig = bindControlNet(shot, { depth: 0.82 });",
          highlight: true,
        },
        { num: "03", text: "return synthesizeFrame({ rig, seed: 40921 });" },
        { num: "04", text: "// ✓ Keyframe locked · Continuity 94.2%" },
      ],
      outputTitle: "Agent Execution Graph",
      outputStatus: "3 NODES CONVERGED",
      nodes: [
        { name: "SceneParser", role: "拆解镜头景别与光源方向", state: "DONE" },
        {
          name: "DepthAnchor",
          role: "锁定角色空间几何一致性",
          state: "LOCKED",
        },
        {
          name: "FilmLookLUT",
          role: "注入 35mm 清透光学色调映射",
          state: "READY",
        },
      ],
    },
    aigc: {
      model: "FLUX.1-Dev + GlassOptics-LoRA",
      seed: "SEED #40921",
      prompt:
        "35mm cinema still, translucent frosted acrylic console in daylight studio, crisp sky-blue rim refraction, calm architectural shadows",
      negative: "flat lighting, plastic skin, oversaturated neon, harsh noise",
      moodTitle: "FROSTED OPTICS // 35MM",
      palette: "sky",
      specs: [
        { k: "CFG", v: "3.5" },
        { k: "DEPTH", v: "0.82" },
        { k: "ASPECT", v: "16:10" },
      ],
    },
  },
  {
    id: "ui-synth",
    label: "02 · 界面造物",
    code: {
      file: "compiler/token-to-rsc.ts",
      metricLabel: "BUNDLE",
      metricValue: "0 KB CLIENT JS",
      lines: [
        { num: "01", text: "const tokens = auditContrast(designSpec, 4.5);" },
        {
          num: "02",
          text: "const tree = partitionIslands(tokens.ast);",
          highlight: true,
        },
        {
          num: "03",
          text: "export default compileRSC(tree, { mobileFirst });",
        },
        { num: "04", text: "// ✓ 320px → 1280px breakpoints verified" },
      ],
      outputTitle: "RSC Island Partition",
      outputStatus: "AA CONTRAST PASS",
      nodes: [
        {
          name: "TokenGraph",
          role: "清昼/霜夜双主题对比度校验",
          state: "4.5:1+",
        },
        { name: "ServerShell", role: "静态排版骨架零水合直出", state: "RSC" },
        {
          name: "MotionIsland",
          role: "精细隔离客户端手势与动效",
          state: "60FPS",
        },
      ],
    },
    aigc: {
      model: "SDXL-Control + LiquidGlass-v2",
      seed: "SEED #88204",
      prompt:
        "Tactile anodized aluminum synthesizer with frosted liquid glass bezel, mint phosphor oscilloscope glow, soft daylight laboratory backdrop",
      negative: "blurry text, crooked gridlines, low contrast",
      moodTitle: "LIQUID INSTRUMENT // LAB",
      palette: "mint",
      specs: [
        { k: "CFG", v: "4.0" },
        { k: "CANNY", v: "0.90" },
        { k: "ASPECT", v: "4:3" },
      ],
    },
  },
  {
    id: "kinetic-zine",
    label: "03 · 动态视觉",
    code: {
      file: "shaders/liquid-refraction.glsl.ts",
      metricLabel: "FRAME",
      metricValue: "16.6ms · GPU",
      lines: [
        { num: "01", text: "const field = curlNoise(uv * 2.4, uTime * 0.2);" },
        {
          num: "02",
          text: "const tint = mix(frostedGlass, skyAccent, field);",
          highlight: true,
        },
        { num: "03", text: "compositor.commit({ transform, opacity: 1 });" },
        { num: "04", text: "// ✓ Compositor-only motion · Reduced-safe" },
      ],
      outputTitle: "Compositor Telemetry",
      outputStatus: "ZERO LAYOUT THRASH",
      nodes: [
        { name: "NoiseField", role: "生成液态玻璃折射与光晕场", state: "GPU" },
        { name: "MaskReveal", role: "裁切路径驱动界面入场节奏", state: "SYNC" },
        { name: "A11yGuard", role: "自动响应系统减弱动态偏好", state: "SAFE" },
      ],
    },
    aigc: {
      model: "Krea-Realtime + Prism-Shader",
      seed: "SEED #19073",
      prompt:
        "Refracted cobalt glass prism suspended over soft silver mist, crisp specular edge highlight, minimal studio typography",
      negative: "watermark, banding artifacts, clipped highlights",
      moodTitle: "SKY PRISM // EDITION",
      palette: "indigo",
      specs: [
        { k: "CFG", v: "3.2" },
        { k: "DENOISE", v: "0.68" },
        { k: "ASPECT", v: "1:1" },
      ],
    },
  },
];

const DENOISE_STEPS = [
  { step: 8, label: "STEP 08 · 潜空间构图" },
  { step: 20, label: "STEP 20 · 光影体块" },
  { step: 32, label: "STEP 32 · 成片输出" },
] as const;

export function DualModeConsole() {
  const [mode, setMode] = useState<ConsoleMode>("code");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [denoiseStep, setDenoiseStep] = useState<8 | 20 | 32>(32);
  const stageRef = useRef<HTMLDivElement>(null);

  const active = SCENARIOS[scenarioIndex];

  // 模式或预设切换时执行轻量合成器过渡（尊重减弱动画设置）
  // biome-ignore lint/correctness/useExhaustiveDependencies: mode 与 scenarioIndex 变化时触发面板微过渡
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { opacity: 0.45, y: 6 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [mode, scenarioIndex]);

  return (
    <section
      aria-label="双模造物实验台"
      className="glass-card rounded-2xl p-4 sm:rounded-3xl sm:p-5"
    >
      {/* 顶部拨杆栏：Code 工程态 ↔ AIGC 生成态 */}
      <div className="flex flex-col gap-3 border-b border-border/80 pb-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="工作台模式切换"
          className="grid grid-cols-2 gap-1 rounded-full border border-border/80 bg-surface-recessed p-1 sm:inline-flex"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "code"}
            onClick={() => setMode("code")}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-mono text-caption font-medium transition-all sm:min-h-9 ${
              mode === "code"
                ? "bg-ink text-ink-fg shadow-xs"
                : "text-fg-secondary hover:text-fg"
            }`}
          >
            <TerminalIcon className="size-4" />
            <span>01 / CODE 工程态</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "aigc"}
            onClick={() => setMode("aigc")}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-mono text-caption font-medium transition-all sm:min-h-9 ${
              mode === "aigc"
                ? "bg-accent text-white shadow-xs"
                : "text-fg-secondary hover:text-fg"
            }`}
          >
            <SparklesIcon className="size-4" />
            <span>02 / AIGC 生成态</span>
          </button>
        </div>

        {/* 创作场景预设胶囊 */}
        <fieldset
          aria-label="实验场景预设"
          className="flex flex-wrap items-center gap-1.5 border-0 p-0"
        >
          {SCENARIOS.map((item, idx) => {
            const selected = idx === scenarioIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setScenarioIndex(idx)}
                aria-pressed={selected}
                className={`min-h-11 rounded-full border px-3 font-mono text-micro transition-all sm:min-h-9 ${
                  selected
                    ? "border-accent/45 bg-accent-soft font-semibold text-accent"
                    : "border-border bg-surface-solid/60 text-fg-secondary hover:border-border-strong hover:text-fg"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </fieldset>
      </div>

      {/* 主舞台区 */}
      <div
        ref={stageRef}
        className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-12"
      >
        {mode === "code" ? (
          <>
            {/* 左侧：深色液态玻璃代码终端 */}
            <div className="glass-dark-surface flex flex-col justify-between rounded-2xl p-4 lg:col-span-7">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 font-mono text-micro">
                <span className="truncate text-[#f8fafc]">
                  {active.code.file}
                </span>
                <span className="shrink-0 rounded-full bg-[#34d399]/18 px-2.5 py-0.5 text-[#34d399]">
                  {active.code.metricValue}
                </span>
              </div>

              <div className="my-4 space-y-2 overflow-x-auto font-mono text-caption">
                {active.code.lines.map((line) => (
                  <div
                    key={line.num}
                    className={`flex items-start gap-3 rounded-lg px-2.5 py-1.5 ${
                      line.highlight
                        ? "border-l-2 border-[#4f94ff] bg-[#4f94ff]/16 text-[#f8fafc]"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    <span className="select-none text-micro text-[#64748b]">
                      {line.num}
                    </span>
                    <code className="whitespace-pre">{line.text}</code>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5 font-mono text-micro text-[#94a3b8]">
                <span>MODE {"//"} DETERMINISTIC ENGINEERING</span>
                <button
                  type="button"
                  onClick={() => setMode("aigc")}
                  className="font-medium text-[#7dd3fc] underline underline-offset-4 hover:text-white"
                >
                  切换查看同一场景的 AIGC 潜空间态 →
                </button>
              </div>
            </div>

            {/* 右侧：实时执行拓扑节点 */}
            <div className="lab-grid flex flex-col justify-between rounded-2xl border border-border/80 bg-surface-solid/65 p-4 lg:col-span-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                  {active.code.outputTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-micro font-medium text-signal">
                  <span className="size-1.5 rounded-full bg-signal-dot signal-dot" />
                  {active.code.outputStatus}
                </span>
              </div>

              <ol className="my-4 space-y-2.5">
                {active.code.nodes.map((node, index) => (
                  <li
                    key={node.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/85 bg-surface-solid/90 px-3.5 py-2.5 shadow-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-caption font-semibold text-fg">
                        0{index + 1}. {node.name}
                      </p>
                      <p className="truncate text-caption text-fg-secondary">
                        {node.role}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-micro font-medium text-accent">
                      {node.state}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="font-mono text-micro text-fg-muted">
                PIPELINE TELEMETRY · TYPESCRIPT STRICT + AGENT TOOLING
              </p>
            </div>
          </>
        ) : (
          <>
            {/* 左侧：结构化 Prompt 配方与采样控制 */}
            <div className="flex flex-col justify-between rounded-2xl border border-border/85 bg-surface-solid/70 p-4 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2.5 font-mono text-micro">
                <span className="font-medium text-fg">{active.aigc.model}</span>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-medium text-accent">
                  {active.aigc.seed}
                </span>
              </div>

              <div className="my-3.5 space-y-3">
                <div>
                  <p className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    Positive Conditioning
                  </p>
                  <p className="mt-1.5 rounded-xl border border-border/80 bg-surface-recessed/70 p-3 font-mono text-caption leading-relaxed text-fg">
                    {active.aigc.prompt}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    Denoise Progression（点击切换采样步数）
                  </p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {DENOISE_STEPS.map((item) => (
                      <button
                        key={item.step}
                        type="button"
                        onClick={() => setDenoiseStep(item.step)}
                        aria-pressed={denoiseStep === item.step}
                        className={`min-h-11 rounded-xl border px-2 py-1.5 font-mono text-micro transition-all ${
                          denoiseStep === item.step
                            ? "border-accent bg-accent-soft font-semibold text-accent"
                            : "border-border bg-surface-solid/80 text-fg-secondary hover:text-fg"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-2.5 font-mono text-micro text-fg-muted">
                <div className="flex gap-3">
                  {active.aigc.specs.map((spec) => (
                    <span key={spec.k}>
                      {spec.k}: <strong className="text-fg">{spec.v}</strong>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setMode("code")}
                  className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
                >
                  查看底层工程代码 →
                </button>
              </div>
            </div>

            {/* 右侧：深色光学折射实时视觉画布 */}
            <div className="glass-dark-surface relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl p-4 text-white lg:col-span-6">
              <svg
                viewBox="0 0 480 280"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              >
                <defs>
                  <radialGradient id="orb-primary" cx="62%" cy="42%" r="58%">
                    <stop
                      offset="0%"
                      stopColor={
                        active.aigc.palette === "sky"
                          ? "#4f94ff"
                          : active.aigc.palette === "mint"
                            ? "#34d399"
                            : "#818cf8"
                      }
                      stopOpacity={
                        denoiseStep === 8
                          ? "0.34"
                          : denoiseStep === 20
                            ? "0.62"
                            : "0.86"
                      }
                    />
                    <stop offset="55%" stopColor="#162238" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#0b0e14" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <rect width="480" height="280" fill="url(#orb-primary)" />

                <g
                  stroke="#ffffff"
                  strokeOpacity={
                    denoiseStep === 8
                      ? "0.35"
                      : denoiseStep === 20
                        ? "0.18"
                        : "0.09"
                  }
                  strokeDasharray={denoiseStep === 32 ? "none" : "4 4"}
                >
                  <line x1="0" y1="93" x2="480" y2="93" />
                  <line x1="0" y1="186" x2="480" y2="186" />
                  <line x1="160" y1="0" x2="160" y2="280" />
                  <line x1="320" y1="0" x2="320" y2="280" />
                </g>

                <circle
                  cx="292"
                  cy="128"
                  r={denoiseStep === 8 ? 48 : denoiseStep === 20 ? 64 : 74}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={denoiseStep === 32 ? "1.6" : "1"}
                  strokeOpacity={denoiseStep === 32 ? "0.75" : "0.4"}
                />
                <circle
                  cx="260"
                  cy="144"
                  r={denoiseStep === 8 ? 26 : 42}
                  fill="#ffffff"
                  fillOpacity={
                    denoiseStep === 8
                      ? "0.06"
                      : denoiseStep === 20
                        ? "0.14"
                        : "0.22"
                  }
                />
                <path
                  d="M68 228 L188 116 L276 178 L412 74"
                  fill="none"
                  stroke={
                    active.aigc.palette === "mint" ? "#34d399" : "#7dd3fc"
                  }
                  strokeWidth={denoiseStep === 32 ? "2.2" : "1.2"}
                  strokeOpacity={denoiseStep === 8 ? "0.45" : "0.9"}
                />
              </svg>

              <div className="relative z-10 flex items-center justify-between font-mono text-micro tracking-widest uppercase">
                <span className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 backdrop-blur-xs">
                  {active.aigc.moodTitle}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1">
                  STEP {denoiseStep} / 32
                </span>
              </div>

              <div className="relative z-10 mt-24 border-t border-white/15 pt-3">
                <p className="text-title font-semibold tracking-tight">
                  {denoiseStep === 8 && "Latent Noise · 骨架锚定阶段"}
                  {denoiseStep === 20 && "Volumetric Pass · 折射光影成型"}
                  {denoiseStep === 32 && "Final Master · 清透光学高一致输出"}
                </p>
                <p className="mt-0.5 font-mono text-micro text-white/75">
                  NEGATIVE {"//"} {active.aigc.negative}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
