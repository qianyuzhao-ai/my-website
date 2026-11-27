// 首页「造物展廊」精选作品数据：支持 Coding 工程项目与 AIGC 视觉/工作流作品两种形态。

export type WorkKind = "coding" | "aigc";

export type WorkItem = {
  id: string;
  index: string;
  kind: WorkKind;
  categoryLabel: string;
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  /** 站内复盘文章或外部链接 */
  href?: string;
  ctaLabel?: string;
  isExternal?: boolean;
  /** AIGC 作品专属：Prompt 蓝图与渲染成片对比参数 */
  aigcSpec?: {
    promptExcerpt: string;
    pipeline: string;
    blueprintCaption: string;
    renderCaption: string;
    palette: "amber-obsidian" | "emerald-ink";
  };
  /** Coding 作品专属：架构终端预览行 */
  codeSpec?: {
    command: string;
    stages: { step: string; detail: string; latency: string }[];
  };
};

export const featuredWorks: WorkItem[] = [
  {
    id: "aigc-storyboard-studio",
    index: "01",
    kind: "aigc",
    categoryLabel: "AIGC WORKFLOW · GENERATIVE FILM",
    year: "2026",
    title: "Latent Storyboard Engine",
    subtitle: "从结构化分镜脚本到高一致性胶片成片的生成式管线",
    summary:
      "告别抽卡式随机生成：通过分镜锚点控制构图骨架、光影色温与角色连续性，将单次灵感稳定放大为叙事级视觉序列。",
    metrics: [
      { label: "角色一致性", value: "94.2%" },
      { label: "单镜迭代耗时", value: "18s" },
      { label: "管线阶段", value: "3-Stage" },
    ],
    stack: ["ControlNet Depth", "Flux LoRA", "Structured Prompt", "FFmpeg"],
    aigcSpec: {
      promptExcerpt:
        "35mm editorial medium shot, warm tungsten rim light cutting through darkroom mist, brutalist concrete desk with glowingCRT waveform, tactile grain --ar 16:10 --cfg 3.5",
      pipeline: "Pose Rig → Depth Pass → Relight Synthesis",
      blueprintCaption: "RAW // 结构控制网与分镜景深锚点",
      renderCaption: "RENDER // 35mm 胶片质感最终合成帧",
      palette: "amber-obsidian",
    },
  },
  {
    id: "agentic-design-compiler",
    index: "02",
    kind: "coding",
    categoryLabel: "AGENTIC CODING · FULL-STACK TOOLING",
    year: "2026",
    title: "Agentic UI Compiler",
    subtitle: "连接设计语义 Token 与生产级 React Server Components 的多步代理",
    summary:
      "把「生成骨架」交给确定性工具链，把「交互审美与边界判断」留给创作者。自动完成响应式断点拆解、无障碍焦点审计与流式组件拼装。",
    metrics: [
      { label: "移动端还原率", value: "100%" },
      { label: "RSC 零客户端包体", value: "Default" },
      { label: "自动走查项", value: "24 Rules" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript AST", "Agent Tool-Use"],
    codeSpec: {
      command: "agy compile --spec editorial-lab.tokens.json --target rsc",
      stages: [
        {
          step: "01. Token Semantic Graph",
          detail: "解析浅/深双主题对比度 ≥ 4.5:1 约束",
          latency: "42ms",
        },
        {
          step: "02. Mobile-First Layout AST",
          detail: "生成 320px → 1280px 渐进增强栅格",
          latency: "180ms",
        },
        {
          step: "03. Client Island Pruner",
          detail: "剥离静态节点，仅保留交互边界 'use client'",
          latency: "65ms",
        },
      ],
    },
  },
  {
    id: "kinetic-shader-zine",
    index: "03",
    kind: "aigc",
    categoryLabel: "CREATIVE CODING × AIGC ZINE",
    year: "2026",
    title: "Chromatic Latent Zine",
    subtitle: "当先锋平面排版遇上实时扩散纹理与程序化微动效",
    summary:
      "将 AIGC 生成的高精度材质切片注入 Web 排版系统，让静态海报成为可随视口滚动呼吸、交互折射的数字独立出版物。",
    metrics: [
      { label: "首屏帧率", value: "60 FPS" },
      { label: "纹理切片体积", value: "< 48KB" },
      { label: "交互模式", value: "Touch + Pointer" },
    ],
    stack: ["GSAP ScrollTrigger", "SVG Noise Filter", "MDX", "Tailwind v4"],
    aigcSpec: {
      promptExcerpt:
        "Swiss editorial typography specimen fused with iridescent emerald liquid glass, macro paper fibers, high-contrast ink bleed, studio strobe --stylize 250",
      pipeline: "Vector Mask → Latent Texture → Compositor Layer",
      blueprintCaption: "WIRE // 瑞士网格排版骨架与遮罩层",
      renderCaption: "PRESS // 纸墨纤维与折射高光成片",
      palette: "emerald-ink",
    },
  },
];
