import type { Metadata } from "next";
import { MorePostsIndex } from "@/components/editorial/more-posts-index";
import { SearchPill } from "@/components/site/search-dialog";
import { SiteFooter } from "@/components/site/site-footer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";
import { getPosts } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.writingTitle,
    description: dict.meta.writingDescription,
  };
}

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function WritingPage({ searchParams }: Props) {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const [{ tag }, posts] = await Promise.all([searchParams, getPosts(locale)]);

  return (
    <>
      <main
        id="main"
        className="flex-1 px-4 pt-6 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1120px] flex-col gap-10 md:gap-12">
          <header className="flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                {dict.writing.eyebrow}
              </p>
              <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[42px] md:leading-[1.12]">
                {dict.writing.title}
              </h1>
              <p className="mt-1 max-w-[56ch] text-label leading-relaxed text-fg-secondary md:text-[15px]">
                {dict.writing.description}
              </p>
            </div>

            <SearchPill className="hidden lg:block" />
          </header>

          <MorePostsIndex
            key={`${locale}-${tag ?? "all"}`}
            posts={posts}
            heading={
              tag ? `${dict.archive.topicPrefix}${tag}` : dict.archive.allEssays
            }
            initialTag={tag}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
