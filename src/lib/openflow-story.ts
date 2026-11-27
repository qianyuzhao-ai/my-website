// OpenFlow 叙事项目页结构化文案与数据（源自飞书项目实战复盘文档，后续可按需独立调整内容）

export type PainStoryStage = {
  id: "multi-platform" | "unified-loop";
  index: string;
  stageLabel: string;
  title: string;
  narrative: string;
  painSummary: string;
  highlights: string[];
};

export type PainPointItem = {
  id: "serial" | "transfer" | "timeout" | "manual";
  index: string;
  title: string;
  metricHighlight: string;
  summary: string;
  detail: string;
};

export type BuildChapterItem = {
  id: "architecture" | "canvas" | "pipeline" | "resilience";
  index: string;
  version: string;
  tabLabel: string;
  title: string;
  summary: string;
  bullets: string[];
};

export type ComparisonRow = {
  dimension: string;
  before: string;
  after: string;
};

export type ImpactMetric = {
  id: string;
  count?: number;
  prefix?: string;
  suffix?: string;
  staticValue?: string;
  label: string;
  detail: string;
};

export const openflowStory = {
  hero: {
    title: "OpenFlow",
    subtitle: "面向 12 人产运团队的 AIGC 无限画布生产工作流平台",
    lead: "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 4–5 分钟的串行等待重构为全员复用的并发工作流。",
    version: "v1.4.0 · macOS & Windows",
    role: {
      label: "我的角色",
      headline: "独立发起 · 产品拆解与全栈落地",
      detail:
        "不依赖研发排期，从一线业务卡点出发独立完成产品拆解，驱动 Claude Code（Vibe Coding）从原型迭代至 v1.4.0，并搭建双端自动打包流水线分发给 12 位同事日常使用。",
    },
    goal: {
      label: "项目目标",
      headline: "以无限画布与 1→N 并发重构视频生产",
      detail:
        "彻底消除原平台 4–5 分钟串行排队、素材反复下载上传、长连接断连丢片与手工拆镜统计痛点，稳定支撑多轮模型评测与 8 个合作 IP 共 14 期 AI 视频播客交付。",
    },
  },

  chapters: [
    { id: "origin", label: "缘起" },
    { id: "pain", label: "痛点" },
    { id: "build", label: "建造" },
    { id: "outcome", label: "成果" },
  ] as const,

  origin: {
    heading: "为什么做 OpenFlow",
    lead: "在负责 AI 视频播客全链路评测（单轮 20–40 组×3 机位出图、Seedance 与自研 R1 视频对比）以及 9 人协作的 Showcase 交付时，原有内部 API 平台让团队把大量时间消耗在排队、重复上传与手工拆镜上。",
    premise:
      "不等排期，直接从真实产运一线出发：把业务瓶颈拆解成清晰的产品模块，通过 Claude Code（Vibe Coding）从原型一路迭代至 v1.4.0 桌面端应用，分发给 12 位同事日常使用。",
  },

  painStory: {
    heading: "真实业务场景下的痛点",
    lead: "回到一条 AI 视频诞生的真实过程，看看一线产运每天是如何被工具割裂与单线程表单拖垮的。",
    platforms: [
      {
        id: "chatgpt",
        name: "ChatGPT",
        cost: "$20 / 月",
        role: "脚本与 Prompt 扩写",
        action: "写完分镜台词 → 手动复制 Prompt",
        artifact: "script_seg01.txt",
      },
      {
        id: "midjourney",
        name: "Midjourney",
        cost: "$30 / 月",
        role: "视觉参考与定调",
        action: "生成风格底图 → 手动下载到本地",
        artifact: "style_ref_v2.png",
      },
      {
        id: "gemini",
        name: "Gemini",
        cost: "$20 / 月",
        role: "多模态出图与改图",
        action: "上传参考图调整角色 → 再次下载",
        artifact: "host_portrait.png",
      },
      {
        id: "jimeng",
        name: "即梦",
        cost: "独立会员",
        role: "人像与场景融合",
        action: "重新上传人像与背景 → 下载融合图",
        artifact: "scene_mix_01.png",
      },
      {
        id: "keling",
        name: "可灵",
        cost: "独立会员",
        role: "图生视频成片",
        action: "第三次上传融合图 → 等待出片再下载",
        artifact: "clip_seg01.mp4",
      },
    ],
    loopSteps: [
      {
        step: "01",
        label: "选择模型",
        detail: "在下拉框切换图像 / 视频模型",
      },
      {
        step: "02",
        label: "选择参数",
        detail: "重填画幅、时长、清晰度与 Prompt",
      },
      {
        step: "03",
        label: "上传素材",
        detail: "从本地文件夹再次点选上一步刚下载的图",
      },
      {
        step: "04",
        label: "串行生成",
        detail: "单次仅支持 1 条任务，干等 4–5 分钟",
      },
      {
        step: "05",
        label: "下载素材",
        detail: "保存到本地文件夹，立刻回到第 ① 步重来",
      },
    ],
    stages: [
      {
        id: "multi-platform",
        index: "01",
        stageLabel: "第一幕 · 多平台会员割裂",
        title: "五个平台五份账单，在标签页间人肉搬运素材",
        narrative:
          "为了做一条完整的 AI 视频，你同时订阅了 ChatGPT、Gemini、Midjourney、即梦、可灵。每个平台都要单独交一份会员费，更重要的是，从脚本、出图、融图到视频生成，你不得不在 5 个浏览器标签页之间反复切换——上一步刚生成的图先下载到本地，切去下一个标签页再手动上传。",
        painSummary: "重复付费 × 跨标签页高频搬运 × 极易配错中间版本",
        highlights: [
          "5 个模型平台各自订阅付费，账单与额度分散管理",
          "中间资产全靠浏览器「下载 → 切标签 → 再上传」手工接力",
          "任意一步抽卡不满意，整条跨平台搬运链路就得重走一遍",
        ],
      },
      {
        id: "unified-loop",
        index: "02",
        stageLabel: "第二幕 · 统一 API 后的单线程死循环",
        title: "API 统一了，却被锁死在「选模型 → 生成 → 下载」循环里",
        narrative:
          "后来，公司统一采购了主流图像与视频模型的 API，并提供了一个内部统一使用网站。不用再交五份会员费了，但真正投入批量生产才发现：这个页面的逻辑依然是单表单串行操作——选择模型、选择参数、上传素材、等待生成、手动下载，然后再从头开始下一轮循环。",
        painSummary: "无法并发生成多资产 × 资产仍需不停下载再上传",
        highlights: [
          "单表单严格串行：没有办法同时提交多个资产并发生成",
          "上下游资产依然断链：刚生完的图必须先下载到本地，再手动上传给视频模型",
          "批量评测与播客交付动辄几十个镜头，全天时间耗在机械重复循环里",
        ],
      },
    ] satisfies PainStoryStage[],
  },

  painPoints: [
    {
      id: "serial",
      index: "01",
      title: "严格串行，等待耗时极长",
      metricHighlight: "4–5 分钟 / 条",
      summary: "原平台不支持并发请求，必须等上一条完全生成才能提交下一条。",
      detail:
        "单条视频生成耗时 4–5 分钟，批量出片与跨模型效果对比全卡在排队上，人的精力被切得支离破碎。",
    },
    {
      id: "transfer",
      index: "02",
      title: "素材反复下载与重新上传",
      metricHighlight: "多环节手动搬运",
      summary: "图生人像、场景融合、视频生成各自孤立，中间产物无法直连复用。",
      detail:
        "每推进一个环节都需要先下载到本地文件夹，再重新点选上传到下一个界面，动作机械且极易配错角色或机位素材。",
    },
    {
      id: "timeout",
      index: "03",
      title: "抽卡返工低效，长连接易丢结果",
      metricHighlight: "后端已成片 · 前端报失败",
      summary: "视频生成需高频抽卡，重绘既要重传排队，又常被网关超时掐断。",
      detail:
        "不满意的片段重绘必须重新走一遍上传与串行排队；更棘手的是长视频常因中间网关超时断连，导致后端其实已产出成片，前端却直接报错丢失。",
    },
    {
      id: "manual",
      index: "04",
      title: "脚本拆镜与消耗统计全靠手工",
      metricHighlight: "逐条复制粘贴",
      summary: "长脚本切片、配角色参考图与音色、核算模型消耗全部依赖人工。",
      detail:
        "播客长脚本切分 4–15 秒片段、对应挂载双人参考图与音色、以及事后统计各模型调用次数与生成总秒数，全靠人工复制粘贴到表格里逐项核对。",
    },
  ] satisfies PainPointItem[],

  decisionStory: {
    heading: "我是怎么做的：自己动手，选定无限画布",
    triggerTitle: "等研发排期太久，我有这个能力，就自己做",
    triggerBody:
      "业务里的真实需求已经非常明确——但走常规研发排期往往需要等待很久。既然自己既懂一线业务场景、又具备产品拆解与 AI Coding 落地能力，我决定不等排期，直接亲手把工具做出来给团队用。",
    researchHeading: "市面 AIGC 创作工具调研",
    researchLead:
      "在写第一行代码前，先系统调研了市面上体验领先的 AIGC 创作平台，拆解它们在多模态生产中的交互形态与效率边界：",
    competitors: [
      {
        index: "01",
        name: "Lovart",
        angle: "AI 设计 Agent × 画布协同",
        takeaway:
          "验证了在开放画布中统筹多资产与多轮生成的空间效率，视觉资产一览无余。",
      },
      {
        index: "02",
        name: "LibTV",
        angle: "视频向无限画布工作流",
        takeaway:
          "以节点连线直连图、音、视频生成链路，最贴近播客视频批量生产的真实诉求。",
      },
      {
        index: "03",
        name: "小云雀",
        angle: "轻量线性创作体验",
        takeaway:
          "上手门槛低、单点出片快，但面对多镜头复用与高频抽卡时仍偏线性操作。",
      },
    ],
    verdictLabel: "形态收敛结论",
    verdictTitle: "最终确定的产品形态：无限画布（Infinite Canvas）",
    comparisonHeading: "关键产品取舍：对话框 vs 无限画布",
    comparisonLead:
      "做工具不是追求“看起来最简单”，而是能否真正打掉业务里最痛的重复劳动。",
    chatOption: {
      tag: "方案 A · 对话框形态",
      title: "上手难度最低，但解决不了核心痛点",
      pros: "打开即聊、零学习成本，适合单次问答或偶尔生成 1–2 张灵感图。",
      cons: "依然是线性对话流——多步骤串联时，上一步生成的图还是得先下载、再在下一轮手动上传，无法并行铺开几十个镜头。",
      verdict: "未采纳 · 无法消除反复下载与上传",
    },
    canvasOption: {
      tag: "方案 B · 无限画布形态（最终选择）",
      title: "有一定上手门槛，但完美击中业务诉求",
      pros: "拖拽素材即成节点，连线与 @ 引用直接贯通上下游；支持 1 次 N 条并发铺开与全局对比抽卡，彻底告别本地来回搬运。",
      cons: "初次接触需要几分钟理解节点与连线逻辑，但对每天高频出片的 12 人产运团队而言，一次学习即可天天提效。",
      verdict: "最终采纳 · 完美解决资产直连与并发诉求",
    },
    tradeoffs: [
      {
        metric: "上手难度",
        chat: "最低（零门槛直接对话）",
        canvas: "中等（需理解节点与连线）",
      },
      {
        metric: "素材反复下载 / 上传",
        chat: "无法解决（仍靠人工下载重传）",
        canvas: "彻底解决（节点直连 + @ 引用复用）",
      },
      {
        metric: "多资产并发与抽卡对比",
        chat: "线性串行，历史记录分散难比对",
        canvas: "全局画布并发铺开，版本标记一目了然",
      },
    ],
  },

  buildChapters: [
    {
      id: "architecture",
      index: "01",
      version: "v1.0 架构底座",
      tabLabel: "跨平台桌面端分发",
      title: "跨平台桌面端与 12 人零门槛分发",
      summary:
        "以 pnpm Monorepo 搭建前后端一体工程，把服务内嵌进 Electron 主进程，让非研发同事双击安装包就能开箱即用。",
      bullets: [
        "前端采用 React 19 + React Flow + shadcn/ui，后端采用 Hono + SQLite，统一接入 Image 2、Nano Banana、Seedance 2.0/2.5、可灵、MiniMax 等多模态模型。",
        "搭建 GitHub Actions 自动打包流水线，产出 macOS（Apple Silicon / Intel）与 Windows 安装包并支持客户端检查更新。",
        "应用内提供接口配置与调用方署名（req_from）管理，所有生成调用严格运行在内网安全环境下，避免凭证与合规风险。",
      ],
    },
    {
      id: "canvas",
      index: "02",
      version: "v1.1 并发画布",
      tabLabel: "无限画布与并发队列",
      title: "无限画布、直连资产与 1 次 N 条并发队列",
      summary:
        "对标 LibTV 的无限画布交互逻辑，把线性的表单提交升级为可视化的并发编排空间。",
      bullets: [
        "预填充 + 1 次 N 条并发入队：成员认领任务后一次性填好所有分镜 Prompt 与参考资产，并发提交队列，彻底消除串行阻塞。",
        "拖拽图片与音频到画布自动生成素材节点，支持框选批量连线，以及在 Prompt 中用 @ 直接引用下游资产并悬停预览。",
        "不满意片段直接在画布内原地重绘，配合「可用 / 待定 / 废弃」颜色标记与生成历史面板高效管理抽卡版本。",
      ],
    },
    {
      id: "pipeline",
      index: "03",
      version: "v1.2 – v1.4 业务闭环",
      tabLabel: "播客流水线与统计",
      title: "播客脚本流水线、画布 Agent 与统计面板",
      summary:
        "顺着团队真实播客交付与汇报需求持续迭代，打通从文本脚本到批量出片、再到成本统计的完整闭环。",
      bullets: [
        "脚本切割节点按 4–8 字/秒自动切分 4–15 秒片段，串联 Excel 式分镜表格（TSV 双向互通、镜头号命名、LLM 批量扩写 Prompt、按角色挂接参考图与音色），并补齐火山播客 TTS 合成节点。",
        "分镜确认后一键网格落成批量并发生成节点，单张画布即可统筹整期播客数十个分镜与分支版本。",
        "v1.4.0 新增画布 Agent 自然语言编排链路与顶栏「生成统计面板」，按模型与规格自动汇总调用次数、出图张数与视频总秒数，一键复制完成汇报。",
      ],
    },
    {
      id: "resilience",
      index: "04",
      version: "工程踩坑与打磨",
      tabLabel: "断连找回与体验打磨",
      title: "长连接断连找回与真实体验修复",
      summary:
        "工具发给 12 位同事高频实战后，真正的挑战来自长任务稳定性与不同设备上的日常细节。",
      bullets: [
        "结果找回机制：针对长视频被网关掐断返回空 URL 的问题，将超时拉长至 30 分钟，并由后端按 request_id 与请求指纹自动轮询历史接口认领成片；异步任务持久化存 SQLite，关页或重启服务也不丢结果。",
        "跨平台构建修复：定位并解决 Apple Silicon 交叉编译 Windows 安装包时的原生模块冲突白屏问题。",
        "高频交互优化：针对低配机器 30+ 节点拖动掉帧引入 GPU 加速、按需懒加载与输入防抖，同时修复中文输入法组词被意外中断的卡点。",
      ],
    },
  ] satisfies BuildChapterItem[],

  releaseArtifacts: [
    {
      name: "OpenFlow-1.4.0-mac-arm64.dmg",
      size: "98.3 MB",
      target: "Apple Silicon",
    },
    {
      name: "OpenFlow-1.4.0-mac-x64.dmg",
      size: "103 MB",
      target: "macOS Intel",
    },
    {
      name: "OpenFlow-1.4.0-win-x64-setup.exe",
      size: "80 MB",
      target: "Windows x64",
    },
  ],

  impactMetrics: [
    {
      id: "team",
      count: 12,
      suffix: " 人",
      label: "产运团队全员日常使用",
      detail:
        "通过 macOS 与 Windows 安装包零门槛分发，覆盖团队全部日常评测与制片成员。",
    },
    {
      id: "concurrency",
      staticValue: "1 → N",
      label: "并发队列取代串行阻塞",
      detail: "告别单条 4–5 分钟排队等待，预填充后一次提交全部镜次异步落盘。",
    },
    {
      id: "episodes",
      count: 14,
      suffix: " 期",
      label: "支撑 8 个合作 IP 视频播客",
      detail:
        "保障 9 人协作团队稳定交付，标杆 Showcase 入选公司开发者大会与世界大会展示。",
    },
    {
      id: "evals",
      count: 240,
      suffix: " 条",
      label: "多轮全链路评测高效推进",
      detail:
        "完成 6 轮 240 条脚本、3 轮 60–120 组×3 机位出图与 2 轮 Seedance vs 自研 R1 对比。",
    },
  ] satisfies ImpactMetric[],

  comparisons: [
    {
      dimension: "生成模式",
      before: "1 次 1 条串行（单条 4–5 分钟排队等待）",
      after: "预填充后 1 次 N 条并发入队，异步持久化不丢结果",
    },
    {
      dimension: "素材流转",
      before: "多步骤反复手动下载、本地整理再重新上传",
      after: "画布内拖拽上传 + 节点连线 / @ 引用直连复用",
    },
    {
      dimension: "抽卡返工",
      before: "不满意片段重新上传并再次排队，旧结果难找回",
      after: "不满意片段画布内直接重入队 + 颜色标记 + 历史面板找回",
    },
    {
      dimension: "播客生产与统计",
      before: "手工切脚本、逐条填参数、人工统计模型消耗",
      after: "脚本切割 → 分镜表一键落成 + 生成统计面板一键汇总",
    },
    {
      dimension: "团队复用度",
      before: "个人低效手工操作，经验与流程难以沉淀",
      after: "跨平台安装包分发至 12 人团队全员日常使用",
    },
  ] satisfies ComparisonRow[],

  showcaseLinks: [
    {
      title: "IP 合作视频案例 1",
      subtitle: "AI 视频播客成片展示（小红书）",
      href: "https://xhslink.cn/o/3Fps9vthWms",
    },
    {
      title: "IP 合作视频案例 2",
      subtitle: "AI 视频播客成片展示（小红书）",
      href: "https://xhslink.cn/o/AtMXd0SOR69",
    },
  ],
};
