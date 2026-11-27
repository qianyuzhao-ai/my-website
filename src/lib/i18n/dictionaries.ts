import type { Locale } from "@/lib/i18n/config";

export type StoryCardEntry = {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  art: "agent" | "storyboard" | "architecture";
};

export type WorkCardEntry = {
  id: string;
  index: string;
  kind: "coding" | "aigc";
  year: string;
  title: string;
  subtitle: string;
  summary: string;
  href?: string;
  metrics: { label: string; value: string }[];
};

export type Dictionary = {
  htmlLang: "zh-CN" | "en";
  meta: {
    siteTitle: string;
    siteDescription: string;
    worksTitle: string;
    worksDescription: string;
    writingTitle: string;
    writingDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    islandTitle: string;
    islandDescription: string;
  };
  nav: {
    home: string;
    works: string;
    writing: string;
    about: string;
    island: string;
    connect: string;
    menu: string;
    closeMenu: string;
    backToSite: string;
    expandSearch: string;
    collapseSearch: string;
    toggleTheme: string;
    muteAudio: string;
    unmuteAudio: string;
    switchLangAria: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
    resultsHeading: string;
    quickHeading: string;
    emptyPrefix: string;
    emptySuffix: string;
    clearLabel: string;
    staticEntries: {
      id: string;
      title: string;
      excerpt: string;
      href: string;
      keywords: string;
    }[];
  };
  home: {
    title: string;
    featuredWorksHeading: string;
    allWorksLink: string;
    heroBadge: string;
    heroMobileBadge: string;
    heroTitle: string;
    heroDesc: string;
    heroSpecs: [string, string];
    heroCta: string;
    featuredWritingHeading: string;
    allWritingLink: string;
    readArticleCta: string;
    storiesHeading: string;
    storiesSubtitle: string;
    stories: StoryCardEntry[];
    topicEyebrow: string;
    topicHeading: string;
    topicCta: string;
    topicLinks: { label: string; href: string; active: boolean }[];
  };
  archive: {
    morePosts: string;
    allEssays: string;
    topicPrefix: string;
    allTopics: string;
    filterAgent: string;
    filterAigc: string;
    filterFrontend: string;
    sortNewest: string;
    sortOldest: string;
    sortToggleToOldest: string;
    sortToggleToNewest: string;
    empty: string;
    archivedEssays: string;
    pageLabel: string;
  };
  writing: {
    eyebrow: string;
    title: string;
    description: string;
  };
  article: {
    breadcrumbRoot: string;
    backToList: string;
    by: string;
    roleLocation: string;
    onThisPage: string;
    sectionsUnit: string;
    author: string;
    date: string;
    tags: string;
    minRead: string;
    share: string;
    linkCopied: string;
    linkCopiedSr: string;
    previous: string;
    next: string;
    fallbackNotice: string;
    copyCode: string;
    copiedCode: string;
    copyCodeAria: string;
    copiedCodeAria: string;
  };
  works: {
    eyebrow: string;
    title: string;
    description: string;
    featuredEyebrow: string;
    featuredType: string;
    openflowSubtitle: string;
    openflowLead: string;
    featuredCta: string;
    selectedHeading: string;
    itemsUnit: string;
    items: WorkCardEntry[];
    islandEyebrow: string;
    islandTitle: string;
    islandDesc: string;
    islandCta: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    story: string;
    role: string;
    location: string;
    availability: string;
    connectCta: string;
    islandCta: string;
    nowEyebrow: string;
    nowItems: string[];
    arsenalEyebrow: string;
    socialEyebrow: string;
    socialDescriptions: Record<"x" | "github" | "xiaohongshu", string>;
  };
  connect: {
    eyebrow: string;
    title: string;
    lead: string;
    closeAria: string;
    emailLabel: string;
    copyEmail: string;
    copiedEmail: string;
    copiedEmailSr: string;
    mailToAria: string;
    channelsLabel: string;
  };
  footer: {
    explore: string;
    topics: string;
    projects: string;
    connect: string;
    copyright: string;
    themeLegend: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
  };
};

const zh: Dictionary = {
  htmlLang: "zh-CN",
  meta: {
    siteTitle: "QianYu — AI Builder",
    siteDescription:
      "QianYu 的个人网站：以工程骨架驱动生成式想象力，在代码与潜空间之间造物。",
    worksTitle: "项目 · QianYu",
    worksDescription: "围绕 AI Agent 产品、AIGC 工作流与交互原型的实践记录。",
    writingTitle: "写作 · QianYu",
    writingDescription:
      "关于 AI Agent 工程、全栈架构与 AIGC 视觉工作流的一线实战笔记与复盘。",
    aboutTitle: "关于 · QianYu",
    aboutDescription:
      "我是 QianYu，常驻北京的 AI Builder。专注 Agentic 工作流、全栈交互工程与 AIGC 视觉创作。",
    islandTitle: "3D岛 · QianYu",
    islandDescription: "云上庭园：可漫游的 3D 空岛交互实验。",
  },
  nav: {
    home: "首页",
    works: "项目",
    writing: "写作",
    about: "关于",
    island: "3D岛",
    connect: "联系",
    menu: "菜单",
    closeMenu: "关闭导航菜单",
    backToSite: "返回 QianYu",
    expandSearch: "展开搜索栏",
    collapseSearch: "收起搜索栏",
    toggleTheme: "切换昼夜主题",
    muteAudio: "静音空岛音效",
    unmuteAudio: "开启空岛音效",
    switchLangAria: "切换中英文显示",
  },
  search: {
    placeholder: "搜索文章与项目…",
    ariaLabel: "搜索文章与项目",
    resultsHeading: "搜索结果",
    quickHeading: "快捷导航",
    emptyPrefix: "未找到与「",
    emptySuffix: "」相关的内容",
    clearLabel: "清空搜索词",
    staticEntries: [
      {
        id: "work-openflow",
        title: "OpenFlow：面向 12 人团队的 AIGC 无限画布生产平台",
        excerpt:
          "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 5 分钟串行等待重构为并发工作流。",
        href: "/works/openflow",
        keywords: "openflow electron react flow aigc 项目 work 作品 并发画布",
      },
      {
        id: "page-island",
        title: "3D岛 · Sky Island 云上庭园",
        excerpt:
          "基于 Three.js 构建的可漫游 3D 空岛交互实验——包含昼夜日晷、机关解谜与彩蛋飞岛。",
        href: "/island",
        keywords: "3d 3d岛 sky island game 空岛 three webgl 交互游戏",
      },
      {
        id: "page-about",
        title: "守岛人手记 · About & Now",
        excerpt:
          "QianYu，常驻北京的 AI Builder。专注 Agentic 工作流、全栈交互工程与 AIGC 视觉创作。",
        href: "/about",
        keywords: "about 关于 个人简介 now arsenal contact",
      },
    ],
  },
  home: {
    title: "QianYu 的造物与写作",
    featuredWorksHeading: "精选案例",
    allWorksLink: "全部项目 →",
    heroBadge: "精选案例",
    heroMobileBadge: "精选项目 · 2026",
    heroTitle: "OpenFlow：面向 12 人团队的 AIGC 无限画布生产平台",
    heroDesc:
      "面向 AI 视频播客与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 5 分钟串行等待重构为并发工作流。",
    heroSpecs: ["MACOS & WINDOWS", "ELECTRON + REACT FLOW"],
    heroCta: "阅读项目复盘",
    featuredWritingHeading: "精选文章",
    allWritingLink: "全部文章 →",
    readArticleCta: "阅读文章",
    storiesHeading: "精选阅读与项目",
    storiesSubtitle: "来自 QianYu 工作室的工程实践、设计思考与 AIGC 笔记",
    stories: [],
    topicEyebrow: "按主题探索",
    topicHeading: "深入 Agent 工程与 AIGC 生产系统",
    topicCta: "浏览全部项目 →",
    topicLinks: [
      { label: "Agent 工程", href: "/writing?tag=Agent", active: true },
      { label: "AIGC 工作流", href: "/writing?tag=AIGC", active: false },
      {
        label: "前端架构",
        href: "/writing?tag=%E5%89%8D%E7%AB%AF",
        active: false,
      },
      {
        label: "设计流程",
        href: "/writing?tag=%E8%AE%BE%E8%AE%A1%E6%B5%81%E7%A8%8B",
        active: false,
      },
      { label: "3D岛实验", href: "/island", active: false },
    ],
  },
  archive: {
    morePosts: "更多文章",
    allEssays: "全部文章",
    topicPrefix: "主题 · ",
    allTopics: "全部主题",
    filterAgent: "Agent",
    filterAigc: "AIGC",
    filterFrontend: "前端",
    sortNewest: "排序：最新",
    sortOldest: "排序：最早",
    sortToggleToOldest: "当前按最新排序，点击切换最早优先",
    sortToggleToNewest: "当前按最早排序，点击切换最新优先",
    empty: "当前主题下暂无已发布文章。",
    archivedEssays: "篇归档文章",
    pageLabel: "第 1 页 / 共 1 页",
  },
  writing: {
    eyebrow: "写作与复盘",
    title: "写作",
    description:
      "关于 AI Agent 工程、全栈架构与 AIGC 视觉工作流的一线实战笔记与复盘。",
  },
  article: {
    breadcrumbRoot: "写作",
    backToList: "返回文章列表",
    by: "作者",
    roleLocation: "AI Builder · 北京",
    onThisPage: "章节目录",
    sectionsUnit: "节",
    author: "作者",
    date: "发布日期",
    tags: "标签",
    minRead: "分钟阅读",
    share: "分享本文",
    linkCopied: "已复制链接",
    linkCopiedSr: "文章链接已复制到剪贴板",
    previous: "更早一篇",
    next: "更新一篇",
    fallbackNotice: "本文暂未提供英文版本，当前展示中文原文。",
    copyCode: "复制",
    copiedCode: "已复制",
    copyCodeAria: "复制代码",
    copiedCodeAria: "代码已复制",
  },
  works: {
    eyebrow: "项目与实验台",
    title: "项目",
    description: "围绕 AI Agent 产品、AIGC 工作流与交互原型的实践记录。",
    featuredEyebrow: "精选深度案例",
    featuredType: "桌面端生产平台",
    openflowSubtitle:
      "用 AI Agent 从 0 到 1，打造 12 人团队的 AIGC 无限画布生产平台",
    openflowLead:
      "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 4–5 分钟的串行等待重构为全员复用的并发工作流。",
    featuredCta: "阅读完整复盘 →",
    selectedHeading: "精选系统与原型",
    itemsUnit: "个项目",
    items: [
      {
        id: "openflow",
        index: "01",
        kind: "coding",
        year: "2026",
        title: "OpenFlow",
        subtitle:
          "用 AI Agent 从 0 到 1，打造 12 人团队的 AIGC 无限画布生产平台",
        summary:
          "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 4–5 分钟的串行等待重构为全员复用的并发工作流。",
        href: "/works/openflow",
        metrics: [
          { label: "版本", value: "v1.4.0" },
          { label: "平台", value: "macOS & Windows" },
        ],
      },
      {
        id: "aigc-storyboard-studio",
        index: "02",
        kind: "aigc",
        year: "2026",
        title: "Latent Storyboard Engine",
        subtitle: "从结构化分镜脚本到高一致性胶片成片的生成式管线",
        summary:
          "告别抽卡式随机生成：通过分镜锚点控制构图骨架、光影色温与角色连续性，将单次灵感稳定放大为叙事级视觉序列。",
        metrics: [
          { label: "角色一致性", value: "94.2%" },
          { label: "单镜迭代", value: "18s" },
        ],
      },
      {
        id: "agentic-design-compiler",
        index: "03",
        kind: "coding",
        year: "2026",
        title: "Agentic UI Compiler",
        subtitle:
          "连接设计语义 Token 与生产级 React Server Components 的多步代理",
        summary:
          "把「生成骨架」交给确定性工具链，把「交互审美与边界判断」留给创作者。自动完成响应式断点拆解与无障碍焦点审计。",
        metrics: [
          { label: "移动端还原", value: "100%" },
          { label: "自动走查", value: "24 项" },
        ],
      },
      {
        id: "kinetic-shader-zine",
        index: "04",
        kind: "aigc",
        year: "2026",
        title: "Chromatic Latent Zine",
        subtitle: "当先锋平面排版遇上实时扩散纹理与程序化微动效",
        summary:
          "将 AIGC 生成的高精度材质切片注入 Web 排版系统，让静态海报成为可随视口滚动呼吸、交互折射的数字独立出版物。",
        metrics: [
          { label: "首屏帧率", value: "60 FPS" },
          { label: "纹理体积", value: "< 48KB" },
        ],
      },
    ],
    islandEyebrow: "3D 交互实验场",
    islandTitle: "3D岛 · 云上庭园",
    islandDesc:
      "基于 Three.js 构建的可漫游 3D 空岛交互实验——包含昼夜日晷、机关解谜与彩蛋飞岛，现已独立收录为侧边栏子页面。",
    islandCta: "进入 3D 岛 →",
  },
  about: {
    eyebrow: "关于与近况",
    headline: "守岛人手记 · About & Now",
    story:
      "我是 QianYu，常驻北京的 AI Builder。相比只停留在概念演示，我更痴迷把大模型推理、确定性工程架构与高审美视觉设计拧成真正好用的产品与创作流。",
    role: "AI Builder",
    location: "北京 · 39.90°N",
    availability: "开放合作交流",
    connectCta: "发起联系",
    islandCta: "探索 3D 岛",
    nowEyebrow: "近期正在折腾",
    nowItems: [
      "正在打磨多 Agent 协同的前端与设计自动化工具链",
      "探索可控性更高的 AIGC 连续分镜与 3D 空间叙事管线",
      "把踩过的工程坑与创作心得持续沉淀进写作归档",
    ],
    arsenalEyebrow: "常用造物工具栈",
    socialEyebrow: "在这里找到我",
    socialDescriptions: {
      x: "日常 AI 造物动态、灵感切片与海外技术讨论",
      github: "开源实验仓库、Agent 工具链与前端交互源码",
      xiaohongshu: "AIGC 视觉成片、工作流拆解与创作幕后图文",
    },
  },
  connect: {
    eyebrow: "直连通道 · 北京",
    title: "与 QianYu 建立联系",
    lead: "欢迎交流 AI Agent 工程架构、AIGC 工作流共创、独立产品想法或合作机会。",
    closeAria: "关闭联系面板",
    emailLabel: "电子邮箱",
    copyEmail: "复制邮箱",
    copiedEmail: "已复制地址",
    copiedEmailSr: "已将邮箱复制到剪贴板",
    mailToAria: "发送邮件",
    channelsLabel: "社交渠道",
  },
  footer: {
    explore: "导航",
    topics: "主题",
    projects: "项目",
    connect: "联系",
    copyright: "北京 39.90°N · 基于 Next.js 构建",
    themeLegend: "主题模式",
    themeSystem: "跟随系统",
    themeLight: "浅色",
    themeDark: "深色",
  },
};

const en: Dictionary = {
  htmlLang: "en",
  meta: {
    siteTitle: "QianYu — AI Builder",
    siteDescription:
      "QianYu's personal studio: pairing deterministic engineering with generative imagination across code and latent space.",
    worksTitle: "Works · QianYu",
    worksDescription:
      "Hands-on builds across AI Agent products, AIGC workflows, and interactive prototypes.",
    writingTitle: "Writing · QianYu",
    writingDescription:
      "Field notes and engineering retrospectives on AI Agent workflows, full-stack architecture, and AIGC production.",
    aboutTitle: "About · QianYu",
    aboutDescription:
      "QianYu is an AI Builder based in Beijing, focused on agentic workflows, full-stack engineering, and AIGC visual pipelines.",
    islandTitle: "3D Island · QianYu",
    islandDescription:
      "Sky Island: an explorable Three.js 3D interactive sandbox.",
  },
  nav: {
    home: "Home",
    works: "Works",
    writing: "Writing",
    about: "About",
    island: "3D Island",
    connect: "Connect",
    menu: "Menu",
    closeMenu: "Close navigation menu",
    backToSite: "Back to QianYu",
    expandSearch: "Open search bar",
    collapseSearch: "Close search bar",
    toggleTheme: "Toggle color theme",
    muteAudio: "Mute island audio",
    unmuteAudio: "Unmute island audio",
    switchLangAria: "Switch language between Chinese and English",
  },
  search: {
    placeholder: "Search",
    ariaLabel: "Search articles and works",
    resultsHeading: "Search results",
    quickHeading: "Quick navigation",
    emptyPrefix: 'No results matching "',
    emptySuffix: '"',
    clearLabel: "Clear search query",
    staticEntries: [
      {
        id: "work-openflow",
        title:
          "OpenFlow — Infinite-Canvas AIGC Production Platform for a 12-Person Team",
        excerpt:
          "Built from 0 to 1 with coding agents for AI video podcast production and multimodal evaluation, replacing 5-minute serial queues with concurrent pipelines.",
        href: "/works/openflow",
        keywords: "openflow electron react flow aigc work project canvas",
      },
      {
        id: "page-island",
        title: "3D Island · Sky Island Sandbox",
        excerpt:
          "An explorable Three.js 3D floating island featuring day/night sundial lighting, puzzle shrines, and a hidden sky islet.",
        href: "/island",
        keywords: "3d island sky game three webgl interactive sandbox",
      },
      {
        id: "page-about",
        title: "About & Now · QianYu",
        excerpt:
          "AI Builder based in Beijing focused on agentic workflows, full-stack interactive systems, and controllable AIGC production.",
        href: "/about",
        keywords: "about profile bio now arsenal contact",
      },
    ],
  },
  home: {
    title: "Insights & Works from QianYu",
    featuredWorksHeading: "Featured Case Study",
    allWorksLink: "All works →",
    heroBadge: "FEATURED CASE STUDY",
    heroMobileBadge: "FEATURED WORK · 2026",
    heroTitle:
      "OpenFlow: Infinite-Canvas AIGC Production Platform for a 12-Person Team",
    heroDesc:
      "Built for AI video podcast production and multimodal evaluation, turning 5-minute serial waits into a shared concurrent desktop workflow powered by coding agents.",
    heroSpecs: ["MACOS & WINDOWS", "ELECTRON + REACT FLOW"],
    heroCta: "Read Case Study",
    featuredWritingHeading: "Featured Writing",
    allWritingLink: "All essays →",
    readArticleCta: "Read essay",
    storiesHeading: "Stories worth your time",
    storiesSubtitle: "picks from QianYu's studio — engineering, design & AIGC",
    stories: [],
    topicEyebrow: "EXPLORE BY TOPIC",
    topicHeading: "Insights on Agent Engineering & AIGC Systems",
    topicCta: "Explore Works →",
    topicLinks: [
      { label: "Agent Engineering", href: "/writing?tag=Agent", active: true },
      { label: "AIGC Workflow", href: "/writing?tag=AIGC", active: false },
      { label: "Full-Stack UI", href: "/writing?tag=Frontend", active: false },
      {
        label: "Design Systems",
        href: "/writing?tag=Design+Workflow",
        active: false,
      },
      { label: "3D Island", href: "/island", active: false },
    ],
  },
  archive: {
    morePosts: "More posts",
    allEssays: "All essays",
    topicPrefix: "Topic · ",
    allTopics: "All topics",
    filterAgent: "Agent",
    filterAigc: "AIGC",
    filterFrontend: "Frontend",
    sortNewest: "Sort: Newest",
    sortOldest: "Sort: Oldest",
    sortToggleToOldest: "Sorted newest first, click to sort oldest first",
    sortToggleToNewest: "Sorted oldest first, click to sort newest first",
    empty: "No published essays under this topic yet.",
    archivedEssays: "archived essays",
    pageLabel: "Page 1 of 1",
  },
  writing: {
    eyebrow: "ESSAYS & FIELD NOTES",
    title: "Writing",
    description:
      "Hands-on engineering notes and retrospectives on AI Agent systems, full-stack architecture, and AIGC visual workflows.",
  },
  article: {
    breadcrumbRoot: "Writing",
    backToList: "Back to Writing",
    by: "By",
    roleLocation: "AI Builder · Beijing",
    onThisPage: "ON THIS PAGE",
    sectionsUnit: "sections",
    author: "Author",
    date: "Date",
    tags: "Tags",
    minRead: "min read",
    share: "Share this post",
    linkCopied: "Link copied",
    linkCopiedSr: "Article link copied to clipboard",
    previous: "PREVIOUS",
    next: "NEXT",
    fallbackNotice:
      "This essay is currently available in Chinese only. Showing the original version below.",
    copyCode: "Copy",
    copiedCode: "Copied",
    copyCodeAria: "Copy code",
    copiedCodeAria: "Code copied",
  },
  works: {
    eyebrow: "WORKS & INTERACTIVE LAB",
    title: "Works",
    description:
      "Hands-on builds across AI Agent products, AIGC workflows, and interactive prototypes.",
    featuredEyebrow: "FEATURED CASE STUDY",
    featuredType: "DESKTOP PLATFORM",
    openflowSubtitle:
      "Building an infinite-canvas AIGC production platform for a 12-person team from 0 to 1 with AI agents",
    openflowLead:
      "Designed for real-world AI video podcast production and multimodal evaluation—replacing 4–5 minute serial bottlenecks with a shared concurrent workflow.",
    featuredCta: "Read Full Story →",
    selectedHeading: "Selected systems & prototypes",
    itemsUnit: "ITEMS",
    items: [
      {
        id: "openflow",
        index: "01",
        kind: "coding",
        year: "2026",
        title: "OpenFlow",
        subtitle:
          "Building an infinite-canvas AIGC production platform for a 12-person team from 0 to 1 with AI agents",
        summary:
          "Designed for real-world AI video podcast production and multimodal evaluation—replacing 4–5 minute serial bottlenecks with a shared concurrent workflow.",
        href: "/works/openflow",
        metrics: [
          { label: "Release", value: "v1.4.0" },
          { label: "Platform", value: "macOS & Windows" },
        ],
      },
      {
        id: "aigc-storyboard-studio",
        index: "02",
        kind: "aigc",
        year: "2026",
        title: "Latent Storyboard Engine",
        subtitle:
          "Generative pipeline from structured scripts to consistent film sequences",
        summary:
          "Moves past random prompting by locking composition, lighting temperature, and character consistency through storyboard anchors.",
        metrics: [
          { label: "Consistency", value: "94.2%" },
          { label: "Iteration", value: "18s" },
        ],
      },
      {
        id: "agentic-design-compiler",
        index: "03",
        kind: "coding",
        year: "2026",
        title: "Agentic UI Compiler",
        subtitle:
          "Multi-step agent bridging semantic design tokens to React Server Components",
        summary:
          "Hands deterministic scaffolding to tooling while keeping layout taste and edge-case judgment with the creator.",
        metrics: [
          { label: "Mobile Fidelity", value: "100%" },
          { label: "Auto Audits", value: "24 Rules" },
        ],
      },
      {
        id: "kinetic-shader-zine",
        index: "04",
        kind: "aigc",
        year: "2026",
        title: "Chromatic Latent Zine",
        subtitle:
          "Editorial typography fused with procedural diffusion textures and micro-motion",
        summary:
          "Injects high-resolution generative material slices into responsive web typography for living digital publications.",
        metrics: [
          { label: "Frame Rate", value: "60 FPS" },
          { label: "Texture Size", value: "< 48KB" },
        ],
      },
    ],
    islandEyebrow: "INTERACTIVE 3D SANDBOX",
    islandTitle: "3D Island · Sky Courtyard",
    islandDesc:
      "An explorable Three.js floating island experiment with day/night sundial lighting, puzzle shrines, and a hidden sky islet—now hosted as a dedicated sidebar subpage.",
    islandCta: "Enter 3D Island →",
  },
  about: {
    eyebrow: "ABOUT & NOW",
    headline: "Field Notes from the Builder · About & Now",
    story:
      "I'm QianYu, an AI Builder based in Beijing. Beyond demos, I focus on combining LLM reasoning, deterministic full-stack engineering, and sharp editorial design into tools people rely on daily.",
    role: "AI Builder",
    location: "Beijing · 39.90°N",
    availability: "Open to Collaborate",
    connectCta: "Connect",
    islandCta: "Visit 3D Island",
    nowEyebrow: "WHAT I'M BUILDING NOW",
    nowItems: [
      "Refining multi-agent design-to-frontend automation workflows",
      "Exploring higher-controllability AIGC storyboarding and 3D spatial pipelines",
      "Documenting real-world engineering trade-offs in my writing archive",
    ],
    arsenalEyebrow: "CORE TOOLCHAIN",
    socialEyebrow: "FIND ME ONLINE",
    socialDescriptions: {
      x: "Daily AI building logs, visual experiments, and technical notes",
      github: "Open-source experiments, agent tooling, and frontend codebases",
      xiaohongshu:
        "AIGC visual reels, workflow breakdowns, and behind-the-scenes",
    },
  },
  connect: {
    eyebrow: "DIRECT LINE · BEIJING",
    title: "Connect with QianYu",
    lead: "Always happy to chat about AI Agent architecture, AIGC workflow co-creation, independent products, or collaborations.",
    closeAria: "Close connect dialog",
    emailLabel: "Electronic Mail",
    copyEmail: "Copy Email",
    copiedEmail: "Copied",
    copiedEmailSr: "Email address copied to clipboard",
    mailToAria: "Send email",
    channelsLabel: "Social Channels",
  },
  footer: {
    explore: "Explore",
    topics: "Topics",
    projects: "Projects",
    connect: "Connect",
    copyright: "Beijing 39.90°N · Built with Next.js",
    themeLegend: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { zh, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

const EN_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const ZH_WEEKDAYS = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
] as const;

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** 根据语言格式化文章详情页日期（英文：Monday, September 28, 2026；中文：2026年9月28日 · 星期一） */
export function formatLocalizedDate(date: string, locale: Locale) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return { lead: "", rest: date };
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (locale === "zh") {
    return {
      lead: `${y}年${m}月${d}日`,
      rest: `· ${ZH_WEEKDAYS[utc.getUTCDay()]}`,
    };
  }
  return {
    lead: `${EN_WEEKDAYS[utc.getUTCDay()]},`,
    rest: `${EN_MONTHS[utc.getUTCMonth()]} ${d}, ${y}`,
  };
}
