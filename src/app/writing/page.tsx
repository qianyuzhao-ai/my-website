import type { Metadata } from "next";
import Link from "next/link";
import { HomeFooter } from "@/components/home/home-footer";
import { SkipLink } from "@/components/site/skip-link";
import { WritingHeader } from "@/components/writing/writing-header";
import { formatDate, formatMonthDay, getPosts, groupByYear } from "@/lib/posts";

const description = "关于产品设计、前端开发与 AIGC 的笔记和复盘。";

export const metadata: Metadata = {
  title: "Writing · QianYu",
  description,
};

export default async function WritingPage() {
  const posts = await getPosts();
  const years = groupByYear(posts);
  const since = years.at(-1)?.[0];

  return (
    <>
      <SkipLink />
      <WritingHeader />
      <main id="main" className="px-4 pb-10 md:px-6 xl:px-0">
        <div className="mx-auto flex max-w-[1168px] flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
          <section className="rounded-card-sm bg-surface p-6 md:rounded-card lg:sticky lg:top-6 lg:w-[280px] lg:shrink-0 lg:px-8 lg:pt-9 lg:pb-8 dark:border-[1.5px] dark:border-border">
            <h1 className="font-serif text-display-sm font-bold lg:text-display">
              Writing
            </h1>
            <p className="mt-3 text-reading lg:mt-4">{description}</p>
            <p className="mt-3 text-caption text-fg-muted lg:mt-4">
              {posts.length} posts{since ? ` · since ${since}` : ""}
            </p>
          </section>

          <div className="flex min-w-0 flex-1 flex-col gap-3 lg:gap-4">
            {years.length === 0 ? (
              <p className="rounded-card-sm bg-surface p-6 text-fg-muted md:rounded-card">
                文章即将上线。
              </p>
            ) : null}
            {years.map(([year, items]) => (
              <section
                key={year}
                aria-labelledby={`year-${year}`}
                className="rounded-card-sm bg-surface px-5 pt-6 pb-1.5 md:rounded-card md:px-10 md:pt-8 md:pb-4 dark:border-[1.5px] dark:border-border"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id={`year-${year}`}
                    className="font-serif text-title font-bold"
                  >
                    {year}
                  </h2>
                  <span className="text-caption text-fg-muted">
                    {items.length} posts
                  </span>
                </div>
                <ul className="mt-2 md:mt-3">
                  {items.map((post) => (
                    <li key={post.slug} className="border-t border-border">
                      <Link
                        href={`/writing/${post.slug}`}
                        className="group flex flex-col gap-1.5 rounded-lg py-[18px] md:flex-row md:items-start md:gap-8 md:py-[22px]"
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-1">
                          <span className="line-clamp-2 font-serif text-case-title font-semibold transition-colors group-hover:text-accent md:line-clamp-1">
                            {post.title}
                          </span>
                          <span className="line-clamp-2 text-case-small text-fg-muted md:line-clamp-1">
                            {post.summary}
                          </span>
                        </span>
                        <time
                          dateTime={post.date}
                          className="order-first text-caption text-fg-muted md:order-last md:w-16 md:shrink-0 md:text-right md:text-label md:leading-[30px]"
                        >
                          <span className="md:hidden">
                            {formatDate(post.date)}
                          </span>
                          <span className="hidden md:inline">
                            {formatMonthDay(post.date)}
                          </span>
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <HomeFooter />
    </>
  );
}
