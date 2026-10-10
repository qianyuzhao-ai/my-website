// Content transcribed from Figma 31:418; project claims are supplied case-study copy.
export const caseLinks = { github: undefined as string | undefined };

export const sections = [
  {
    eyebrow: "BACKGROUND · 三代工作流",
    heading: "从五个平台来回倒腾，\n到一张画布批量生产",
  },
  {
    eyebrow: "WHY BUILD · 为什么自己做",
    heading: "没有一个现成方案，\n能直接接住团队每天的痛点",
  },
  {
    eyebrow: "PRODUCT FRAMEWORK · 产品框架",
    heading: "五个概念，\n撑起整个工作流",
  },
  {
    eyebrow: "CASE A · 连线交互",
    heading: "节点画布好不好用，\n八成取决于拉线",
  },
  {
    eyebrow: "CASE B · 提示词引用",
    heading: "让提示词直接\n点名画布上的素材",
  },
  {
    eyebrow: "CASE C · 分镜表节点",
    heading: "为双人播客\n收窄的分镜表",
  },
  {
    eyebrow: "CASE D · 桌面多项目标签",
    heading: "同时开多个项目，\n切走不是关闭",
  },
  {
    eyebrow: "POLISH · 打磨记录",
    heading: "用户不会说出口的问题",
  },
  {
    eyebrow: "BUILD · 落地",
    heading: "一个人，把它做成\n团队装上就能用的软件",
  },
  {
    eyebrow: "OUTCOMES · 结果",
    heading: "现在，团队的每一期内容\n都从这张画布上产出",
  },
] as const;

export const scenes = {
  framework: [
    {
      desc: "一期播客、一条剧情视频就是一个项目。首页只负责一件事：找到画布并打开它。",
      title: "一个项目，一张画布",
    },
    {
      desc: "素材、文本、图像生成、视频生成、分镜表，再加上用来整理的编组。",
      number: "02",
      title: "六种节点，各做一件事",
    },
    {
      desc: "把素材连到生成节点，就是把它作为参考图。谁参考了谁，在画布上一眼可见。",
      number: "03",
      title: "连线就是参考关系",
    },
    {
      desc: "生成结果留在画布上，标记为采用或废弃，之后按标记批量选中、下载。",
      number: "04",
      title: "结果在原地取舍",
    },
    {
      desc: "生成记录归属到项目。首页看全局，画布里看当前项目，可导出 XLSX 做成本核算。",
      number: "05",
      title: "每次生成都有记录",
    },
  ],
  connect: [
    {
      desc: "画布缩小到 40%，端点仍按 1/zoom 反向缩放，保持可点击的屏幕尺寸。输入端点平时隐藏，需要时才出现。",
      title: "端点永远抓得住",
    },
    {
      desc: "拖线经过合法目标时，目标节点播放“可放置”动画。类型不匹配的节点不响应，不用等松手才报错。",
      number: "02",
      title: "能不能连，拖的时候就知道",
    },
    {
      desc: "松手的位置没有节点时，弹出节点菜单，而不是丢掉这根线。拉线落空，往往说明用户想要的下一步还不存在。",
      number: "03",
      title: "拉到空白处不算失误",
    },
    {
      desc: "选一个类型，新节点出现在松手的位置并自动连好。从一张图出发，一个手势就进入下一步。",
      number: "04",
      title: "落点即创建",
    },
  ],
  prompt: [
    {
      desc: "输入 @ 选择已连入的图片、视频或音频，生成带序号、按种类配色的徽章。素材顺序变了，序号跟着变。",
      title: "用 @ 引用参考素材",
    },
    {
      desc: "场景、风格这类常用描述写成文本节点，像积木一样插进提示词。悬停徽章可以看到正文。",
      number: "02",
      title: "文本节点插进任意位置",
    },
    {
      desc: "修改文本节点，所有引用它的生成节点同步更新。一期播客换场景，只需要改一个地方。",
      number: "03",
      title: "改一处，全链路生效",
    },
  ],
  storyboard: [
    {
      desc: "分镜常常先在表格里写好。整行从 Excel 粘贴进来，按每列的类型校验后写入，也能反向复制回去。",
      title: "从 Excel 直接粘贴",
    },
    {
      desc: "双人播客的机位基本固定：A 单人、B 单人、双人全景。自由输入换成三选一，提示词模板也就能确定下来。",
      number: "02",
      title: "机位只有三种",
    },
    {
      desc: "这是图生视频单段的可用区间。超出范围在输入时就拦下，不用等到生成失败才发现。",
      number: "03",
      title: "时长卡在 4–30 秒",
    },
    {
      desc: "根据台词和表演描述，由 LLM 生成表演 Prompt。生成后仍可手改，最终决定权留给人。",
      number: "04",
      title: "LLM 写表演 Prompt",
    },
    {
      desc: "它由模板、表演 Prompt、台词和时长实时拼出。存一份就可能和源数据脱节，所以做成只读派生列。",
      number: "05",
      title: "完整 Prompt 不落盘",
    },
  ],
  tabs: [
    {
      desc: "每张画布保持挂载。切回来时，视角、选中、撤销记录和没写完的输入都还在。再次打开同一项目会切到已有标签。",
      title: "切回来，一切都在",
    },
    {
      desc: "隐藏的画布暂停音视频、停用快捷键，避免误删看不见的节点；生成任务照常完成并自动保存。",
      number: "02",
      title: "后台照常工作",
    },
    {
      desc: "关标签前先保存。失败时给出取消、重试、放弃三个选择；有生成任务在跑，会先确认。",
      number: "03",
      title: "关闭前一定保存",
    },
  ],
} as const;

export const polish = [
  {
    fix: "正确处理输入法组合态，确认上屏后再写入节点。",
    problem: "用中文输入法在文本节点打字，拼音会和汉字一起留在框里。",
    tag: "输入法",
    title: "拼音残留在文本框里",
  },
  {
    fix: "图片和视频加载前按比例预留高度，布局不再跳动。",
    problem: "结果图加载前高度为零，加载后撑开，框选范围和看到的不一致。",
    tag: "框选",
    title: "框选误选到远处节点",
  },
  {
    fix: "每个文件在独立的隐藏 iframe 里发起；桌面端直接写入目录。",
    problem: "浏览器拦截连续下载；桌面端则每个文件都弹一次“另存为”。",
    tag: "下载",
    title: "批量下载只下了第一张",
  },
  {
    fix: "区分“服务端出错”和“连不上”，TLS 握手失败归入建连失败。",
    problem: "服务端报错、网络不通、握手失败，过去都显示成同一句话。",
    tag: "报错",
    title: "“出错了”说不清是谁的错",
  },
  {
    fix: "整个配置菜单可以放大到全屏弹层，专心编辑。",
    problem: "浮动菜单里的输入框太小，长提示词要来回滚动。",
    tag: "编辑",
    title: "长提示词写不开",
  },
  {
    fix: "防抖后再做完整比较，节点按需订阅缩放，组件做缓存。",
    problem: "每次拖动都在比较整张画布，无关节点也跟着重渲染。",
    tag: "性能",
    title: "节点多了拖动发卡",
  },
  {
    fix: "高亮相连的线，节点本身不变色；编组用中性灰，不抢内容。",
    problem: "选中一个节点，不知道它参考了谁、被谁参考。",
    tag: "视觉",
    title: "选中后看不出关联",
  },
  {
    fix: "调整编组内的层级顺序，连线始终在素材下方。",
    problem: "节点编组以后，连线跑到了图片素材上方。",
    tag: "层级",
    title: "连线压住了图片",
  },
] as const;

export const keyMetrics = [
  {
    value: "11",
    unit: "人",
    label: "内测团队，使用率 100%",
  },
  {
    value: "18",
    unit: "期",
    label: "播客 Showcase 内容",
  },
  {
    value: "7",
    unit: "个",
    label: "剧情演绎类视频",
  },
  {
    value: "35",
    unit: "天",
    label: "从空仓库到 v0.2.0",
  },
] as const;

export const resultMetrics = [
  {
    value: "100",
    unit: "%",
    label: "11 人内测团队使用率",
  },
  {
    value: "18",
    unit: "期",
    label: "播客 Showcase 内容",
  },
  {
    value: "7",
    unit: "个",
    label: "剧情演绎类视频",
  },
  {
    value: "7",
    unit: "个",
    label: "接入的图像与视频模型",
  },
] as const;
