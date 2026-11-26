import Link from "next/link";
import { ArrowRightIcon } from "@/components/home/icons";
import {
  formatDate,
  formatMonthDay,
  groupByYear,
  type Post,
} from "@/lib/post-shared";

export function WritingArchive({ posts }: { posts: Post[] }) {
  const years = groupByYear(posts);

  return (
    <div className="mt-2 flex flex-col gap-10 border-t border-border/80 pt-8 md:gap-14 md:pt-10">
      {posts.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-body text-fg-muted">
          暂无已发布的文章。
        </div>
      ) : null}

      {years.map(([year, items]) => (
        <section
          key={year}
          aria-labelledby={`year-${year}`}
          className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8"
        >
          <div className="lg:col-span-3">
            <div className="flex items-baseline justify-between border-b border-border/80 pb-2.5 lg:sticky lg:top-28 lg:flex-col lg:gap-2 lg:border-b-0 lg:pb-0">
              <h2
                id={`year-${year}`}
                className="text-display-sm leading-none font-bold tracking-[-0.03em] text-fg tabular-nums lg:text-[2.25rem]"
              >
                {year}
              </h2>
              <span className="inline-flex w-fit rounded-full bg-surface-recessed px-2.5 py-0.5 font-mono text-micro font-medium text-fg-muted tabular-nums">
                {items.length} 篇
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-3 lg:col-span-9">
            {items.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="glass-card group flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-solid/90 md:flex-row md:items-start md:justify-between md:gap-8 md:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro text-fg-muted tabular-nums md:hidden">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingMinutes} 分钟</span>
                    </div>

                    <h3 className="mt-1 text-case-title font-bold tracking-[-0.015em] text-fg transition-colors duration-200 group-hover:text-accent md:mt-0 md:text-title">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 max-w-[60ch] text-label leading-relaxed text-fg-secondary md:text-body">
                      {post.summary}
                    </p>

                    {post.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/75 bg-surface-solid/75 px-2.5 py-0.5 font-mono text-micro text-fg-muted"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="hidden shrink-0 items-center gap-3 pt-1 font-mono text-caption text-fg-muted tabular-nums md:flex">
                    <span>{post.readingMinutes} min</span>
                    <span aria-hidden="true" className="text-border-strong">
                      /
                    </span>
                    <time dateTime={post.date} className="w-12 text-right">
                      {formatMonthDay(post.date)}
                    </time>
                    <ArrowRightIcon className="size-4 text-fg-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
