# my-website

个人网站基础项目，后续用于文章、履历与作品展示。当前首页按 Figma「My Website」稿与交互录屏实现 Bento 卡片布局，含拖拽排序、分类筛选、Toggle Lockdown 与浅深主题。AIGC-FLOW 项目案例页位于 `/projects/aigc-flow`。

## 技术栈

- Next.js 16.4 App Router、React 19.3、TypeScript strict
- Tailwind CSS v4，使用 `globals.css` 中的语义 token
- Biome：代码检查、格式化和 import 排序；不使用 ESLint 或 Prettier
- 原生 HTML / React 基础组件，不依赖组件库
- react-grid-layout：首页 Bento 卡片拖拽排序（md 及以上）
- GSAP / ScrollTrigger：AIGC-FLOW 案例页的滚动演示
- next/font 自托管 Poppins（正文）与 Fraunces（标题），运行时不请求外部字体服务
- 使用 next-themes 管理主题初始化、持久化、系统主题监听与跨标签页同步
- pnpm 11.24，Node.js 22.17 或更高版本

## 开发

```sh
pnpm install
pnpm dev
```

打开 http://localhost:3000。

| 命令 | 用途 |
| --- | --- |
| `pnpm check` | Biome 检查与 TypeScript 类型检查 |
| `pnpm lint` | 检查格式、代码规范和 import 顺序 |
| `pnpm lint:fix` | 应用 Biome 安全修复 |
| `pnpm format` | 格式化代码 |
| `pnpm typecheck` | 生成 Next.js 路由类型并检查 TypeScript |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产构建 |

## 目录

```text
src/
  app/                  页面、根布局和全局样式
    globals.css         设计 token、Tailwind 映射和组件基础样式
  components/
    ui/                 Button、Input
    home/               首页头部、Bento 网格（bento-grid.tsx 负责拖拽）与各卡片
    aigc-flow/          项目案例内容、画布示意、滚动步骤与横向卡片
  lib/
    home-cards.ts       卡片分类、预设布局、拖拽布局存储与待提供链接
    aigc-flow.ts        Figma 案例文案、步骤、指标与项目链接
public/images/          头像与卡片图片（-light / -dark 两套）
  aigc-flow/            Figma 原始 SVG，按原始尺寸使用
```

## UI 规范

- 颜色使用 `bg-bg`、`bg-surface`、`text-fg`、`text-fg-muted`、`bg-card-blue` 等语义 token，不在业务组件中硬编码色值；浅深色值来自 Figma 3:35 / 3:36。
- 字号使用 `text-logo`、`text-name`、`text-title`（Fraunces 24/30）、`text-body`（16/26）、`text-label`（14/20）、`text-caption`（12/18）；标题加 `font-serif`。
- 间距以 4px 为基准；卡片圆角移动端 `rounded-card-sm`（24px）、平板起 `rounded-card`（32px）。
- 布局移动端优先：单列 → `md` 两列 → `lg`（1152px 起）四列，1168px 内容宽、16px 间隔，单元格正方形。
- 主题通过 next-themes 管理，默认跟随系统，手动选择记录在 `starter-ui-theme`。浅深两套图片用 `dark:hidden` / `hidden dark:block` 切换。
- 移动端输入框为 16px，触控目标至少 44px；项目卡片通过左下角按钮跳转。

## 交互

- **拖拽排序**（md 及以上）：拖动卡片时显示占位，其余卡片让位并向上压实，松手吸附网格。All 分类下的排列存于 localStorage（`home-layout-v1`），其他分类使用预设布局。自定义过排列后，网格下方出现「Reset layout」按钮，一键恢复默认布局。拖拽结束后的点击会被忽略，避免误触主题开关和链接。
- **分类筛选**：相关卡片移到前面，其余卡片淡化到 22%；导航选中块滑动。md 以下用 View Transitions 过渡顺序变化。
- 首页项目仅展示 AIGC-FLOW；Vouch 与 Wrap.so 已移除。卡片数量变化后，旧的自定义排列自动回退到新的默认布局。
- **Toggle Lockdown**：Intro 头像在两张 Memoji 之间互换，伴随缩放与光晕动画。
- **主题卡**：点击切换浅色 / 深色，旋钮滑动。
- 所有动画在 `prefers-reduced-motion` 下关闭。

## 待补充

- AIGC-FLOW 案例页按 Figma `31:418` 实现，路径 `/projects/aigc-flow`。GitHub 地址在 `src/lib/aigc-flow.ts` 的 `caseLinks.github` 配置；Contact 沿用 `home-cards.ts` 的配置。链接未提供时显示带说明的占位。首页入口按 Figma `4:617` / `4:1210` 实现，左下角按钮在当前标签页跳转，沿用 `skip` 布局 ID。
- 案例页宽度达到 900px 且视口高度至少 700px 时启用滚动固定；短视口、窄屏和减少动态效果模式展示完整说明。步骤支持点击和键盘选择；打磨记录支持触控滑动与前后按钮；重试保存为本地交互演示，不调用真实生成服务。
- 案例页画布示意在深色主题仍保持浅色，遵循 Figma。原始 SVG 保持不变，无障碍说明由使用处的 `alt`、`figcaption` 和正文提供；Biome 仅对这些 SVG 关闭 `noSvgWithoutTitle`。

- 地图图片为录屏裁切的占位素材，需替换为原始素材（同名覆盖 `public/images/map-light.png` / `map-dark.png`）。
- Contact、文章、X 与各项目链接在 `src/lib/home-cards.ts` 的 `links` 中填写，未填写时渲染为不可点击的占位；X 目前指向 `https://x.com/`，需替换为个人主页。
- 项目卡片只通过左下角按钮跳转，整张卡片不可点击，便于拖拽。
- Media 分类突出显示 Social 卡片。
