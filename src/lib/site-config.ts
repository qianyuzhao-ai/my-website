// 全站个人信息与社交联系入口配置：修改此处即可同步更新导航坞、Connect 面板与页脚。

export type SocialChannel = {
  id: "x" | "github" | "xiaohongshu" | "jike";
  label: string;
  handle: string;
  href: string;
  description: string;
};

export const siteConfig = {
  name: "QianYu",
  role: "AI Builder",
  location: "Beijing · 39.90°N",
  issue: "VOL. 2026 // CODING × AIGC",
  tagline: "以工程骨架驱动生成式想象力，在代码与潜空间之间造物。",
  bio: "专注 Agentic 工作流、全栈交互工程与 AIGC 视觉创作。这里记录我亲手构建的数字实验与一线实战复盘。",
  email: "hello@qianyu.ai",
  statusText: "Exploring Agentic Workflows & Generative Systems",
  /** 悬空彩蛋飞岛「关于我 / Now」私房石碑内容 */
  about: {
    headline: "守岛人手记 · About & Now",
    story:
      "我是 QianYu，常驻北京的 AI Builder。相比只停留在概念演示，我更痴迷把大模型推理、确定性工程架构与高审美视觉设计拧成真正好用的产品与创作流。",
    nowItems: [
      "正在打磨多 Agent 协同的前端与设计自动化工具链",
      "探索可控性更高的 AIGC 连续分镜与 3D 空间叙事管线",
      "把踩过的工程坑与创作心得持续沉淀进岛上的手稿石碑",
    ],
    arsenal: [
      "Next.js / React 19",
      "TypeScript",
      "Three.js / WebGL",
      "Blender",
      "Claude / Gemini Agents",
      "Flux / ControlNet",
    ],
  },
  /** 出生台旁「塞尔达篝火烤肉架」随机冒出的趣味状态语 */
  potQuotes: [
    "🍖 滋滋冒油！正在慢烤：一份刚跑通的 Agent 工作流 + 两勺审美偏执",
    "🔥 蜜汁烤肉大成功！体力与灵感值全满，快去北侧银杏树下读手稿吧",
    "✨ 小提示：把东边的青绿左纳乌方块推进石板凹槽，能唤醒图腾方尖碑！",
    "🌬 听说踩上西崖边的金羽乘风阵，可以飞去云海深处的彩蛋飞岛！",
  ],
  socials: [
    {
      id: "x",
      label: "X / Twitter",
      handle: "@qianyu_ai",
      href: "https://x.com/qianyu_ai",
      description: "日常 AI 造物动态、灵感切片与海外技术讨论",
    },
    {
      id: "github",
      label: "GitHub",
      handle: "github.com/qianyu",
      href: "https://github.com",
      description: "开源实验仓库、Agent 工具链与前端交互源码",
    },
    {
      id: "xiaohongshu",
      label: "小红书 / RedNote",
      handle: "@QianYu.AI",
      href: "https://www.xiaohongshu.com",
      description: "AIGC 视觉成片、工作流拆解与创作幕后图文",
    },
  ] satisfies SocialChannel[],
} as const;
