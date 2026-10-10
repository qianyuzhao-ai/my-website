# My Website

Next.js 个人网站基础，当前首页展示 Starter UI v1 设计规范。

## 命令

- `pnpm dev`：启动开发服务。
- `pnpm check`：Biome 与 TypeScript 检查。
- `pnpm lint:fix`：安全修复格式与代码问题。
- `pnpm format`：格式化。
- `pnpm build`：生产构建；`pnpm start`：启动生产服务。

## 目录与约定

- `src/app`：App Router 页面、根布局、全局 CSS。
- `src/components/ui`：手写 Button、Input、Card、Badge。
- `src/components`：交互示例与主题切换。
- `src/lib`：设计规范预览数据。
- 使用 pnpm、TypeScript strict、Tailwind v4、Biome；不要添加组件库、ESLint 或 Prettier。
- 默认使用 Server Components，仅交互边界添加 `"use client"`。
- 文件名使用 kebab-case，组件使用 PascalCase，导入别名为 `@/*`。
- 优先使用语义颜色与字号；颜色 token 变更必须同步浅深主题和预览数据。
- 使用系统字体；移动端输入框至少 16px，触控高度至少 44px。
- 主题使用 next-themes 的 ThemeProvider / useTheme，默认跟随系统；使用 `class` 与 `starter-ui-theme` 存储键。不要另写主题初始化脚本或同步逻辑。
- 保留标签、键盘焦点和状态文本，不只依赖颜色传达信息。
- 最终代码修改后运行 `pnpm check` 与 `pnpm build`。
- 遵守 AGENTS.md；禁止批量删除，删除只能逐个明确文件路径执行。
