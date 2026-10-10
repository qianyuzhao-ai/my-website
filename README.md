# my-website

个人网站基础项目，后续用于文章、履历与作品展示。当前首页为 Starter UI v1 设计规范预览，包含颜色、字体、间距和基础组件。

## 技术栈

- Next.js 16.4 App Router、React 19.3、TypeScript strict
- Tailwind CSS v4，使用提供的 Starter UI 语义 token
- Biome：代码检查、格式化和 import 排序；不使用 ESLint 或 Prettier
- 原生 HTML / React 基础组件，不依赖组件库
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
    ui/                 Button、Input、Card、Badge
    theme-switch.tsx    跟随系统 / Light / Dark 切换
    component-preview.tsx 交互示例
  lib/
    design-tokens.ts    规范预览使用的颜色值与说明
    theme.ts            首次渲染的主题初始化脚本
```

## UI 规范

- 颜色使用 `bg-bg`、`bg-surface`、`text-fg`、`text-fg-muted` 等语义 token，不在业务组件中硬编码色值。
- 字号使用 `text-display`、`text-h1` 至 `text-h3`、`text-body-lg`、`text-body`、`text-label`、`text-caption`、`text-code`。
- 间距以 4px 为基准，优先使用 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px；圆角使用 `rounded-sm` / `md` / `lg` / `full`。
- 主题默认跟随系统，手动选择记录在 `starter-ui-theme`。系统模式响应系统主题变化；存储不可用时仍可切换。
- 使用系统字体，不请求外部字体服务。移动端输入框为 16px，按钮和输入框高度至少 44px。
- 更新颜色时，同时修改 `globals.css` 的浅深色值及 `lib/design-tokens.ts` 的预览数据。
- 示例表单仅演示本地校验，不保存数据或调用接口。

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

<Input id="name" label="名称" helpText="请输入项目名称" />
<Button variant="primary" size="md" type="submit">保存</Button>
```

`Button` 支持 `primary / secondary / ghost / danger` 与 `sm / md / lg`；`Input` 支持帮助文字与错误信息；`Card` 用 `raised` 切换浮层；`Badge` 支持品牌样式及状态圆点。
