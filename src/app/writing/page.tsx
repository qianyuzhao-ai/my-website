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
  const since = years.at(-1)?.[0];

  return (
    <>
      <main
        id="main"
        className="px-4 pt-6 pb-16 sm:px-6 md:px-8 md:pt-24 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          {/* 杂志刊头 */}
          <header className="border-b border-border pb-8 md:pb-12">
            <div className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-2.5 font-mono text-micro tracking-widest text-fg-muted uppercase">
              <span>EDITORIAL ARCHIVE {"//"} WRITING</span>
              <span>
                {posts.length} PUBLISHED{since ? ` · SINCE ${since}` : ""}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
              <h1 className="font-serif text-hero font-bold tracking-tight text-fg lg:col-span-7">
                Writing &amp;{" "}
                <em className="font-normal text-accent italic">Notes</em>.
              </h1>
              <p className="text-body text-fg-muted lg:col-span-5 lg:pb-2">
                {description}
              </p>
            </div>
          </header>

          <div className="mt-8">
            <WritingArchive posts={posts} tags={tags} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
