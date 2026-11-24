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
