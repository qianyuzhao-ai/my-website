import type { Metadata } from "next";
import { MorePostsIndex } from "@/components/editorial/more-posts-index";
import { SearchPill } from "@/components/site/search-dialog";
import { SiteFooter } from "@/components/site/site-footer";
import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

const description =
  "关于 AI Agent 工程、全栈架构与 AIGC 视觉工作流的一线实战笔记与复盘。";

export const metadata: Metadata = {
  title: `Writing · ${siteConfig.name}`,
  description,
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function WritingPage({ searchParams }: Props) {
  const [{ tag }, posts] = await Promise.all([searchParams, getPosts()]);

  return (
    <>
      <main
        id="main"
        className="flex-1 px-4 pt-6 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1120px] flex-col gap-10 md:gap-12">
          {/* 编辑部刊头 */}
          <header className="flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                ESSAYS &amp; FIELD NOTES
              </p>
              <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[42px] md:leading-[1.12]">
                Writing
              </h1>
              <p className="mt-1 max-w-[56ch] text-label leading-relaxed text-fg-secondary md:text-[15px]">
                {description}
              </p>
            </div>

            <SearchPill className="hidden lg:block" />
          </header>

          {/* 细线归档索引（支持通过侧边栏 ?tag= 参数联动筛选） */}
          <MorePostsIndex
            key={tag ?? "all"}
            posts={posts}
            heading={tag ? `Topic · ${tag}` : "All essays"}
            initialTag={tag}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
