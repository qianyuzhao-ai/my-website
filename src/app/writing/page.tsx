import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { WritingArchive } from "@/components/writing/writing-archive";
import { getAllTags, getPosts, groupByYear } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

const description =
  "关于 AI Agent 工程、全栈架构与 AIGC 视觉工作流的一线实战笔记与复盘。";

export const metadata: Metadata = {
  title: `Writing · ${siteConfig.name}`,
  description,
};

export default async function WritingPage() {
  const posts = await getPosts();
  const tags = getAllTags(posts);
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
        className="px-4 pt-10 pb-20 sm:px-6 md:px-8 md:pt-28 md:pb-28"
      >
        <div className="mx-auto max-w-6xl">
          {/* 瑞士国际主义刊头：直接以主标题切入内容，无冗余眉标 */}
          <header className="grid grid-cols-1 gap-5 pb-8 md:pb-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="font-serif text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.035em] text-fg">
                Writing
              </h1>
            </div>

            <div className="flex flex-col gap-2 lg:col-span-5 lg:pb-1">
              <p className="max-w-[48ch] text-body leading-relaxed text-fg-muted">
                {description}
              </p>
              <p className="text-label tabular-nums text-fg-muted">
                共 {posts.length} 篇归档
                {yearRange ? ` · ${yearRange}` : ""}
              </p>
            </div>
          </header>

          <WritingArchive posts={posts} tags={tags} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
