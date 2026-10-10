# 项目约定

Next.js 个人网站，当前首页按 Figma「My Website」稿实现 Bento 卡片布局（v1，仅首页）。

## 文件操作

- 禁止批量删除文件或目录，不使用 `del /s`、`rd /s`、`rmdir /s`、`Remove-Item -Recurse`、`rm -rf`。
- 删除文件时，只能一次删除一个明确路径的文件；需要批量删除时停止操作，请用户手动处理。

## 命令

- `pnpm dev`：启动开发服务。
- `pnpm check`：Biome 与 TypeScript 检查。
- `pnpm lint:fix`：安全修复格式与代码问题。
- `pnpm format`：格式化。
- `pnpm build`：生产构建；`pnpm start`：启动生产服务。

## 目录

- `src/app`：App Router 页面、根布局、全局 CSS。
- `src/components/ui`：手写 Button、Input。
- `src/components/home`：首页头部、Bento 网格与卡片。
- `src/lib/home-cards.ts`：卡片分类、网格位置与待提供链接。

## 技术与编码约定

- 使用 Next.js App Router、pnpm、TypeScript strict、Tailwind CSS v4 和 Biome；不引入组件库、ESLint 或 Prettier。
- 默认使用 Server Components，仅交互边界添加 `"use client"`。
- 文件名使用 kebab-case，组件使用 PascalCase，导入别名为 `@/*`。
- UI 遵循 `src/app/globals.css` 中的语义颜色、字号、间距和圆角 token（来源 Figma fileKey `fmqIh2bjvp1EX59h0hXpMF`）。
- 优先使用语义颜色与字号；颜色 token 变更必须同时修改浅深两套值。
- 字体使用 next/font 自托管的 Poppins 与 Fraunces（`font-serif`），中文回退到系统字体；移动端输入框至少 16px，触控高度至少 44px。
- 主题使用 next-themes 的 ThemeProvider / useTheme，默认跟随系统；使用 `class` 与 `starter-ui-theme` 存储键。不要另写主题初始化脚本或同步逻辑。
- 保留标签、键盘焦点和状态文本，不只依赖颜色传达信息。
- 最终代码修改后运行 `pnpm check` 与 `pnpm build`。
- 项目使用说明见 `README.md`。

## 移动端优先

- 制作新功能、页面及其组件时，先设计并实现移动端的信息层级、布局和交互，再逐步扩展到平板与桌面端。
- 默认样式面向小屏幕；使用 Tailwind 的 `sm:`、`md:`、`lg:` 等断点逐级增强布局，自定义媒体查询优先采用 `min-width`。不要先写桌面布局再补移动端覆盖样式。
- 优先使用单列、流式宽度和可换行布局；随可用空间增加，再引入多列、侧栏和更宽的内容区域，避免固定宽度导致页面横向溢出。
- 核心功能和操作在移动端必须完整可用。优先考虑触控、软键盘及表单体验，不依赖 hover 或仅在桌面端显示的入口完成关键操作。
- 验证顺序为移动端 → 平板 → 桌面端；至少检查 320px、390px、768px 和 1280px 视口下的布局与关键交互，确认文字可读、控件可操作、内容不被遮挡且页面无意外横向滚动。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
