import { ComponentPreview } from "@/components/component-preview";
import { ThemeSwitch } from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/design-tokens";

const sections = [
  ["principles", "原则"],
  ["color", "颜色"],
  ["type", "字体"],
  ["space", "间距与圆角"],
  ["components", "组件"],
] as const;

const typography = [
  [
    "display",
    "36 / 44 · 700",
    "实验项目首页",
    "text-display font-bold tracking-[-0.02em]",
  ],
  [
    "h1",
    "28 / 36 · 600",
    "项目设置",
    "text-h1 font-semibold tracking-[-0.01em]",
  ],
  ["h2", "22 / 30 · 600", "成员与权限", "text-h2 font-semibold"],
  ["h3", "18 / 26 · 600", "邀请新成员", "text-h3 font-semibold"],
  ["body-lg", "16 / 26 · 400", "长段落阅读与移动端正文。", "text-body-lg"],
  ["body", "14 / 22 · 400", "默认正文，用于界面、表单和表格。", "text-body"],
  ["label", "14 / 20 · 500", "保存更改", "text-label font-medium"],
  ["caption", "12 / 18 · 400", "3 分钟前更新", "text-caption"],
  ["code", "13 / 20 · 400", "pnpm dev", "font-mono text-code"],
] as const;

const spacing = [4, 8, 12, 16, 24, 32, 48, 64];
const radii = [
  ["sm", "4px", "Badge、复选框", "rounded-sm"],
  ["md", "8px", "按钮、输入框", "rounded-md"],
  ["lg", "12px", "卡片、弹窗", "rounded-lg"],
  ["full", "9999px", "头像、开关", "rounded-full"],
] as const;

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        跳转到主要内容
      </a>
      <div className="mx-auto grid max-w-[1120px] gap-0 px-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-12 md:px-6">
        <nav
          aria-label="目录"
          className="flex flex-wrap items-center gap-1 pt-6 md:sticky md:top-0 md:flex-col md:items-stretch md:self-start md:py-12"
        >
          <a
            href="#main"
            className="mb-1 w-full px-2 text-body-lg font-bold tracking-[-0.01em] md:mb-4"
          >
            Starter UI
            <span className="ml-2 text-caption font-normal text-fg-subtle">
              v1
            </span>
          </a>
          {sections.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex min-h-11 items-center rounded-md px-2 text-body text-fg-muted transition-colors hover:bg-surface hover:text-fg md:min-h-8"
            >
              {label}
            </a>
          ))}
          <div className="mt-8 hidden border-t border-border px-2 pt-4 text-caption text-fg-subtle md:block">
            My Website
            <br />
            设计基础
          </div>
        </nav>

        <main
          id="main"
          className="flex min-w-0 flex-col gap-12 pt-6 pb-16 md:gap-16 md:pt-12 md:pb-24"
        >
          <header className="flex flex-col gap-4 border-b border-border pb-8">
            <div className="flex items-center gap-2">
              <span className="text-caption tracking-wide text-fg-subtle">
                设计规范 · v1
              </span>
              <Badge variant="primary">项目基础</Badge>
            </div>
            <h1 className="text-h1 font-bold tracking-[-0.02em] text-balance sm:text-display">
              Starter UI
            </h1>
            <p className="max-w-[62ch] text-body-lg text-fg-muted">
              从第一天开始，保持一致。将颜色、字体和间距统一为设计
              token，用少量基础组件，搭建清晰、轻量的界面。
            </p>
            <ThemeSwitch />
          </header>

          <section id="principles" className="flex flex-col gap-6">
            <h2 className="section-heading">三条原则</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [
                  "01",
                  "只用语义 token",
                  "颜色按用途命名。品牌、文字、背景各司其职，调整主题只需修改 token。",
                ],
                [
                  "02",
                  "少即是多",
                  "1 个品牌色、3 级文字色。先复用已有规范，再为必要的场景增加样式。",
                ],
                [
                  "03",
                  "两个主题同时设计",
                  "每个颜色同时定义 Light 与 Dark。组件随主题自然切换，层级始终清晰。",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4"
                >
                  <span className="font-mono text-caption text-fg-subtle">
                    {number}
                  </span>
                  <h3 className="text-body font-semibold">{title}</h3>
                  <p className="text-body text-fg-muted">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="color" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-heading">颜色</h2>
              <p className="text-fg-muted">
                17 个语义色。色块左侧为 Light，右侧为 Dark。
              </p>
            </div>
            <section
              aria-label="颜色 token 表格，可横向滚动"
              // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users must be able to scroll the overflowing table.
              tabIndex={0}
              className="overflow-x-auto rounded-lg border border-border"
            >
              <table className="w-full text-left text-body">
                <caption className="sr-only">
                  Starter UI 浅色与深色主题颜色规范
                </caption>
                <thead className="bg-surface text-caption text-fg-subtle">
                  <tr>
                    {["Token", "色块", "Light", "Dark", "用途"].map((label) => (
                      <th
                        key={label}
                        scope="col"
                        className="border-b border-border px-4 py-3 font-medium whitespace-nowrap"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colors.map((color) => (
                    <tr
                      key={color.name}
                      className="border-b border-border last:border-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-mono text-code font-normal whitespace-nowrap"
                      >
                        {color.name}
                      </th>
                      <td className="px-4 py-3">
                        <span className="flex h-6 w-12 overflow-hidden rounded-sm border border-border">
                          <span
                            className="w-1/2"
                            style={{ background: color.light }}
                          />
                          <span
                            className="w-1/2"
                            style={{ background: color.dark }}
                          />
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-caption text-fg-muted">
                        {color.light}
                      </td>
                      <td className="px-4 py-3 font-mono text-caption text-fg-muted">
                        {color.dark}
                      </td>
                      <td className="min-w-44 px-4 py-3 text-caption text-fg-muted">
                        {color.usage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <p className="text-caption text-fg-muted">
              使用 <code className="inline-code">bg-surface</code>、
              <code className="inline-code">text-fg-muted</code>{" "}
              等语义样式。状态色始终配合文字，不单独传达信息。
            </p>
          </section>

          <section id="type" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-heading">字体</h2>
              <p className="text-fg-muted">
                系统字体栈，9 个字号样式。字号 / 行高单位为 px。
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              {typography.map(([name, meta, sample, className]) => (
                <div
                  key={name}
                  className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-baseline sm:gap-4"
                >
                  <div>
                    <code className="font-mono text-code text-primary">
                      {name}
                    </code>
                    <div className="text-caption text-fg-subtle">{meta}</div>
                  </div>
                  <div className={`${className} wrap-anywhere`}>{sample}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="space" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-heading">间距与圆角</h2>
              <p className="text-fg-muted">
                以 4px 为基准。组件内部紧凑，区块之间留白。
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                {spacing.map((value) => (
                  <div
                    key={value}
                    className="grid grid-cols-[80px_40px_minmax(0,1fr)] items-center gap-3"
                  >
                    <code className="font-mono text-code text-fg-muted">
                      space-{value / 4}
                    </code>
                    <span className="text-caption text-fg-subtle">
                      {value}px
                    </span>
                    <div
                      className="h-3 max-w-full rounded-sm bg-primary"
                      style={{ width: value * 3 }}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                {radii.map(([name, value, usage, className]) => (
                  <div key={name} className="flex flex-col gap-2">
                    <div
                      className={`h-16 border border-border-strong bg-surface ${className}`}
                    />
                    <code className="font-mono text-code">radius-{name}</code>
                    <span className="text-caption text-fg-muted">
                      {value} · {usage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="components" className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="section-heading">基础组件</h2>
              <p className="text-fg-muted">
                四个基础组件，统一的交互和视觉语言。切换主题，查看不同状态。
              </p>
            </div>
            <ComponentPreview />
          </section>
          <footer className="flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-caption text-fg-subtle">
            <span>Starter UI v1 · My Website</span>
            <span>17 个语义色 · 9 个字号 · 4 个基础组件</span>
          </footer>
        </main>
      </div>
    </>
  );
}
