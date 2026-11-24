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
    palette: "vermilion" | "emerald" | "cobalt";
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
          role: "注入 35mm 钨丝灯颗粒映射",
          state: "READY",
        },
      ],
    },
    aigc: {
      model: "FLUX.1-Dev + Editorial-LoRA",
      seed: "SEED #40921",
      prompt:
        "35mm cinema still, lone architect at brutalist concrete console, warm vermilion rim light piercing darkroom haze, tactile film grain",
      negative: "flat lighting, plastic skin, oversaturated neon, CGI gloss",
      moodTitle: "SOLARIS DARKROOM // 35MM",
      palette: "vermilion",
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
        { name: "TokenGraph", role: "双主题语义色对比度校验", state: "4.5:1+" },
        { name: "ServerShell", role: "静态杂志排版零水合直出", state: "RSC" },
        {
          name: "MotionIsland",
          role: "精细隔离客户端手势与动效",
          state: "60FPS",
        },
      ],
    },
    aigc: {
      model: "SDXL-Control + SwissGrid-v2",
      seed: "SEED #88204",
      prompt:
        " Editorial tactile hardware synthesizer, anodized obsidian aluminum, emerald phosphor oscilloscope, macro paper specimen backdrop",
      negative: "blurry text, crooked gridlines, low contrast",
      moodTitle: "MODULAR INSTRUMENT // LAB",
      palette: "emerald",
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
      file: "shaders/latent-grain.glsl.ts",
      metricLabel: "FRAME",
      metricValue: "16.6ms · GPU",
      lines: [
        { num: "01", text: "const field = curlNoise(uv * 2.4, uTime * 0.2);" },
        {
          num: "02",
          text: "const ink = mix(paperTone, accentInk, field);",
          highlight: true,
        },
        { num: "03", text: "compositor.commit({ transform, opacity: 1 });" },
        { num: "04", text: "// ✓ Compositor-only motion · Reduced-safe" },
      ],
      outputTitle: "Compositor Telemetry",
      outputStatus: "ZERO LAYOUT THRASH",
      nodes: [
        { name: "NoiseField", role: "生成纸墨纤维与光斑折射场", state: "GPU" },
        { name: "MaskReveal", role: "裁切路径驱动文字入场节奏", state: "SYNC" },
        { name: "A11yGuard", role: "自动响应系统减弱动态偏好", state: "SAFE" },
      ],
    },
    aigc: {
      model: "Krea-Realtime + Halide-Film",
      seed: "SEED #19073",
      prompt:
        "Kinetic typography poster, refracted cobalt prism over archival warm cotton paper, ink bleed edges, studio strobe shadow",
      negative: "watermark, banding artifacts, clipped highlights",
      moodTitle: "PRISM OVER INK // EDITION",
      palette: "cobalt",
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
  { step: 32, label: "STEP 32 · 胶片成片" },
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
        { opacity: 0.4, y: 6 },
        { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [mode, scenarioIndex]);

  return (
    <section
      aria-label="双模造物实验台"
      className="rounded-card-sm border border-border bg-surface p-3.5 shadow-lg sm:p-5 md:rounded-card"
    >
      {/* 顶部拨杆栏：Code 工程态 ↔ AIGC 生成态 */}
      <div className="flex flex-col gap-3 border-b border-border pb-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="工作台模式切换"
          className="grid grid-cols-2 gap-1 rounded-full border border-border bg-surface-elevated p-1 sm:inline-flex"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "code"}
            onClick={() => setMode("code")}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-mono text-caption font-medium transition-colors ${
              mode === "code" ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
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
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-mono text-caption font-medium transition-colors ${
              mode === "aigc"
                ? "bg-accent text-white"
                : "text-fg-muted hover:text-fg"
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
                className={`min-h-11 rounded-full border px-3 font-mono text-micro transition-colors sm:min-h-9 ${
                  selected
                    ? "border-fg bg-fg/8 font-semibold text-fg"
                    : "border-border bg-transparent text-fg-muted hover:border-border-strong hover:text-fg"
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
            {/* 左侧：代码管线切片 */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-elevated/55 p-4 lg:col-span-7">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5 font-mono text-micro text-fg-muted">
                <span className="truncate text-fg">{active.code.file}</span>
                <span className="shrink-0 rounded-full bg-signal-soft px-2.5 py-0.5 text-signal">
                  {active.code.metricValue}
                </span>
              </div>

              <div className="my-4 space-y-2 overflow-x-auto font-mono text-caption">
                {active.code.lines.map((line) => (
                  <div
                    key={line.num}
                    className={`flex items-start gap-3 rounded-md px-2.5 py-1.5 ${
                      line.highlight
                        ? "border-l-2 border-accent bg-accent-soft text-fg"
                        : "text-fg-muted"
                    }`}
                  >
                    <span className="select-none text-micro opacity-65">
                      {line.num}
                    </span>
                    <code className="whitespace-pre">{line.text}</code>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-micro text-fg-muted">
                <span>MODE {"//"} DETERMINISTIC ENGINEERING</span>
                <button
                  type="button"
                  onClick={() => setMode("aigc")}
                  className="font-medium text-accent underline underline-offset-4 hover:opacity-80"
                >
                  切换查看同一场景的 AIGC 潜空间态 →
                </button>
              </div>
            </div>

            {/* 右侧：实时执行拓扑节点 */}
            <div className="lab-grid flex flex-col justify-between rounded-xl border border-border bg-surface p-4 lg:col-span-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                  {active.code.outputTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-micro font-medium text-signal">
                  <span className="size-1.5 rounded-full bg-signal signal-dot" />
                  {active.code.outputStatus}
                </span>
              </div>

              <ol className="my-4 space-y-2.5">
                {active.code.nodes.map((node, index) => (
                  <li
                    key={node.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/95 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-caption font-semibold text-fg">
                        0{index + 1}. {node.name}
                      </p>
                      <p className="truncate text-caption text-fg-muted">
                        {node.role}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-sm border border-border bg-surface-elevated px-2 py-0.5 font-mono text-micro text-fg">
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
            <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-elevated/55 p-4 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5 font-mono text-micro">
                <span className="text-fg">{active.aigc.model}</span>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-accent">
                  {active.aigc.seed}
                </span>
              </div>

              <div className="my-3.5 space-y-3">
                <div>
                  <p className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    Positive Conditioning
                  </p>
                  <p className="mt-1 rounded-lg border border-border bg-surface p-3 font-mono text-caption text-fg">
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
                        className={`min-h-11 rounded-lg border px-2 py-1.5 font-mono text-micro transition-colors ${
                          denoiseStep === item.step
                            ? "border-accent bg-accent-soft font-semibold text-fg"
                            : "border-border bg-surface text-fg-muted hover:text-fg"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-micro text-fg-muted">
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
                  className="font-medium text-fg underline underline-offset-4 hover:text-accent"
                >
                  查看底层工程代码 →
                </button>
              </div>
            </div>

            {/* 右侧：潜空间实时视觉画布（随采样步数与场景演化） */}
            <div className="relative flex min-h-64 flex-col justify-between overflow-hidden rounded-xl border border-border bg-ink p-4 text-white lg:col-span-6">
              {/* 程序化光影层 */}
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
                        active.aigc.palette === "vermilion"
                          ? "#ff6438"
                          : active.aigc.palette === "emerald"
                            ? "#34f5a6"
                            : "#6b9eff"
                      }
                      stopOpacity={
                        denoiseStep === 8
                          ? "0.32"
                          : denoiseStep === 20
                            ? "0.62"
                            : "0.88"
                      }
                    />
                    <stop offset="55%" stopColor="#1b1924" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#090a0d" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <rect width="480" height="280" fill="url(#orb-primary)" />

                {/* 构图参考网格：低步数明显，高步数收敛为成片几何 */}
                <g
                  stroke="#ffffff"
                  strokeOpacity={
                    denoiseStep === 8
                      ? "0.38"
                      : denoiseStep === 20
                        ? "0.2"
                        : "0.09"
                  }
                  strokeDasharray={denoiseStep === 32 ? "none" : "4 4"}
                >
                  <line x1="0" y1="93" x2="480" y2="93" />
                  <line x1="0" y1="186" x2="480" y2="186" />
                  <line x1="160" y1="0" x2="160" y2="280" />
                  <line x1="320" y1="0" x2="320" y2="280" />
                </g>

                {/* 主体几何雕塑层 */}
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
                    active.aigc.palette === "emerald" ? "#34f5a6" : "#ff8d6b"
                  }
                  strokeWidth={denoiseStep === 32 ? "2.2" : "1.2"}
                  strokeOpacity={denoiseStep === 8 ? "0.45" : "0.9"}
                />
              </svg>

              <div className="relative z-10 flex items-center justify-between font-mono text-micro tracking-widest uppercase">
                <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-xs">
                  {active.aigc.moodTitle}
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1">
                  STEP {denoiseStep} / 32
                </span>
              </div>

              <div className="relative z-10 mt-24 border-t border-white/15 pt-3">
                <p className="font-serif text-title font-semibold tracking-tight">
                  {denoiseStep === 8 && "Latent Noise · 骨架锚定阶段"}
                  {denoiseStep === 20 && "Volumetric Pass · 光影体块成型"}
                  {denoiseStep === 32 && "Final Master · 胶片级高一致输出"}
                </p>
                <p className="mt-0.5 font-mono text-micro text-white/70">
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
