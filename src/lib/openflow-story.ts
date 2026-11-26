// OpenFlow 叙事项目页结构化文案与数据（源自飞书项目实战复盘文档，后续可按需独立调整内容）

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
    subtitle: "用 AI Agent 从 0 到 1，打造 12 人团队的 AIGC 无限画布生产平台",
    lead: "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 4–5 分钟的串行等待重构为全员复用的并发工作流。",
    version: "v1.4.0 · macOS & Windows",
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
