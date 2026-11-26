import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowIcon,
  GitHubIcon,
  SparklesIcon,
  XIcon,
} from "@/components/home/icons";
import { ConnectTriggerButton } from "@/components/site/connect-trigger-button";
import { SiteFooter } from "@/components/site/site-footer";
import { type SocialChannel, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `关于 · ${siteConfig.name}`,
  description: siteConfig.about.story,
};

function ChannelIcon({ id }: { id: SocialChannel["id"] }) {
  if (id === "x") return <XIcon className="size-4" />;
  if (id === "github") return <GitHubIcon className="size-4.5" />;
  return <SparklesIcon className="size-4.5" />;
}

export default function AboutPage() {
  return (
    <div className="glass-ambient-bg min-h-dvh text-fg">
      <main
        id="main"
        className="px-4 pt-24 pb-16 sm:px-6 md:px-8 md:pt-28 md:pb-24"
      >
        <div className="mx-auto max-w-4xl">
          {/* 守岛人简介毛玻璃主卡 */}
          <section className="glass-panel rounded-[26px] p-6 sm:rounded-[32px] sm:p-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 font-mono text-micro font-semibold tracking-wider text-signal uppercase">
              <span className="size-1.5 rounded-full bg-signal-dot signal-dot" />
              <span>ABOUT &amp; NOW</span>
            </div>

            <h1 className="mt-4 text-[clamp(1.85rem,4.5vw,2.85rem)] leading-[1.12] font-bold tracking-[-0.03em] text-fg">
              {siteConfig.about.headline}
            </h1>

            <p className="mt-4 max-w-[60ch] text-body leading-[1.82] text-fg-secondary md:text-[17px]">
              {siteConfig.about.story}
            </p>

            {/* 状态胶囊条 */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-elevated/85 px-3.5 py-1.5 font-mono text-caption text-fg-secondary">
                <span className="size-1.5 rounded-full bg-signal-dot" />
                {siteConfig.location}
              </span>
              <span className="inline-flex items-center rounded-full border border-border/80 bg-surface-elevated/85 px-3.5 py-1.5 font-mono text-caption text-fg-secondary">
                {siteConfig.role}
              </span>
              <span className="inline-flex items-center rounded-full bg-accent-soft px-3.5 py-1.5 font-mono text-caption font-medium text-accent">
                Open to Collaborate
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border/80 pt-6">
              <ConnectTriggerButton label="发起信号连接" />
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface-solid/80 px-5 text-label font-medium text-fg transition-colors hover:border-accent/45 hover:text-accent"
              >
                返回 3D 云上庭园
              </Link>
            </div>
          </section>

          {/* NOW 与 ARSENAL 双栏毛玻璃卡片 */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <section className="glass-card rounded-[24px] p-6">
              <p className="font-mono text-micro font-semibold tracking-widest text-signal uppercase">
                NOW {"//"} 近期正在折腾
              </p>
              <ul className="mt-4 space-y-3 text-label text-fg">
                {siteConfig.about.nowItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal-dot" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="glass-card rounded-[24px] p-6">
              <p className="font-mono text-micro font-semibold tracking-widest text-accent uppercase">
                ARSENAL {"//"} 常用造物工具栈
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {siteConfig.about.arsenal.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border/85 bg-surface-solid/85 px-3.5 py-1.5 font-mono text-caption text-fg"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* 社交频段矩阵 */}
          <section className="glass-card mt-6 rounded-[24px] p-6">
            <p className="font-mono text-micro font-semibold tracking-widest text-fg-muted uppercase">
              SOCIAL FREQUENCIES {"//"} 在这里找到我
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {siteConfig.socials.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/80 bg-surface-solid/75 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-solid"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-recessed/70 text-fg transition-colors group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:text-accent">
                        <ChannelIcon id={item.id} />
                      </span>
                      <ArrowIcon className="size-4 text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                    </div>
                    <div>
                      <p className="text-label font-semibold text-fg transition-colors group-hover:text-accent">
                        {item.label}
                      </p>
                      <p className="mt-0.5 font-mono text-micro text-fg-muted">
                        {item.handle}
                      </p>
                      <p className="mt-1.5 text-caption leading-relaxed text-fg-secondary">
                        {item.description}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
