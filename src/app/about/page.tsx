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
  title: `About · ${siteConfig.name}`,
  description: siteConfig.about.story,
};

function ChannelIcon({ id }: { id: SocialChannel["id"] }) {
  if (id === "x") return <XIcon className="size-4" />;
  if (id === "github") return <GitHubIcon className="size-4" />;
  return <SparklesIcon className="size-4" />;
}

export default function AboutPage() {
  return (
    <>
      <main
        id="main"
        className="flex-1 px-4 pt-6 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[920px] flex-col gap-12">
          {/* 顶部简介刊头 */}
          <header className="flex flex-col gap-5 border-b border-border pb-8">
            <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
              ABOUT &amp; NOW · {siteConfig.location}
            </p>
            <h1 className="text-[30px] leading-[1.18] font-bold tracking-[-0.025em] text-fg md:text-[40px]">
              {siteConfig.about.headline}
            </h1>
            <p className="max-w-[60ch] text-body leading-[1.82] text-fg-secondary md:text-[17px]">
              {siteConfig.about.story}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 font-mono text-caption text-fg-muted">
              <span className="font-medium text-fg">{siteConfig.role}</span>
              <span aria-hidden="true">/</span>
              <span>{siteConfig.location}</span>
              <span aria-hidden="true">/</span>
              <span>Open to Collaborate</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ConnectTriggerButton label="Connect" />
              <Link
                href="/island"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong bg-bg px-5 text-caption font-medium text-fg transition-colors hover:bg-surface md:min-h-9"
              >
                Visit Sky Island 3D
              </Link>
            </div>
          </header>

          {/* NOW 与 ARSENAL 双栏平面块（0px 直角） */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="bg-surface p-6 sm:p-7">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                NOW {"//"} 近期正在折腾
              </p>
              <ul className="mt-4 flex flex-col gap-3.5 text-label text-fg">
                {siteConfig.about.nowItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="font-mono text-fg-muted"
                    >
                      —
                    </span>
                    <span className="leading-relaxed text-fg-secondary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-surface p-6 sm:p-7">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                ARSENAL {"//"} 常用造物工具栈
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {siteConfig.about.arsenal.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border bg-bg px-3.5 py-1.5 font-mono text-caption text-fg"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* 社交频段细线列表 */}
          <section className="flex flex-col gap-4">
            <h2 className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
              SOCIAL CHANNELS {"//"} 在这里找到我
            </h2>
            <ul className="divide-y divide-border border-y border-border">
              {siteConfig.socials.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 py-4 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:py-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-fg">
                        <ChannelIcon id={item.id} />
                      </span>
                      <div>
                        <p className="text-label font-semibold text-fg">
                          {item.label}
                        </p>
                        <p className="font-mono text-micro text-fg-muted">
                          {item.handle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="text-caption text-fg-secondary">
                        {item.description}
                      </p>
                      <ArrowIcon className="size-4 shrink-0 text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
