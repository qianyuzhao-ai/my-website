import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { WritingArchive } from "@/components/writing/writing-archive";
import { getPosts, groupByYear } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

const description =
  "关于 AI Agent 工程、全栈架构与 AIGC 视觉工作流的一线实战笔记与复盘。";

export const metadata: Metadata = {
  title: `Writing · ${siteConfig.name}`,
  description,
};

export default async function WritingPage() {
  const posts = await getPosts();
  const years = groupByYear(posts);
  const latestYear = years[0]?.[0];
  const earliestYear = years.at(-1)?.[0];
  const yearRange =
    earliestYear && latestYear && earliestYear !== latestYear
      ? `${earliestYear}–${latestYear}`
      : latestYear;

  return (
    <>
      <main
        id="main"
        className="px-4 pt-24 pb-16 sm:px-6 md:px-8 md:pt-28 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          {/* Liquid Glass 博客刊头 */}
          <header className="grid grid-cols-1 gap-5 pb-8 md:pb-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/85 px-3 py-1 font-mono text-micro font-medium tracking-wider text-accent uppercase backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-signal-dot" />
                <span>ESSAYS &amp; FIELD NOTES</span>
              </div>
              <h1 className="mt-3 text-[clamp(2.5rem,5.8vw,4rem)] leading-[1.02] font-bold tracking-[-0.035em] text-fg">
                Writing
              </h1>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end lg:pb-1 lg:text-right">
              <p className="max-w-[46ch] text-body leading-relaxed text-fg-secondary">
                {description}
              </p>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 font-mono text-caption text-fg-muted tabular-nums backdrop-blur-md">
                <span className="font-semibold text-fg">
                  {posts.length} 篇归档
                </span>
                {yearRange ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{yearRange}</span>
                  </>
                ) : null}
              </div>
            </div>
          </header>

          <WritingArchive posts={posts} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
