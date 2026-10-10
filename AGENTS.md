# 项目约定

- 禁止批量删除文件或目录，不使用 `del /s`、`rd /s`、`rmdir /s`、`Remove-Item -Recurse`、`rm -rf`。
- 删除文件时，只能一次删除一个明确路径的文件；需要批量删除时停止操作，请用户手动处理。
- 使用 Next.js App Router、TypeScript、Tailwind CSS v4 和 Biome；不引入组件库或 ESLint。
- UI 遵循 Starter UI v1 的语义颜色、字号、间距和圆角规范，详见 `src/app/globals.css`。
- 命令、目录与编码约定见 `CLAUDE.md`、`README.md`。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
