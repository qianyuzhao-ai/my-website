"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/home/icons";
import {
  formatDate,
  formatMonthDay,
  groupByYear,
  type Post,
} from "@/lib/post-shared";

export function WritingArchive({
  posts,
  tags,
}: {
  posts: Post[];
  tags: { tag: string; count: number }[];
}) {
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  function switchTag(nextTag: string) {
    const canTransition =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canTransition) {
      (
        document as Document & {
          startViewTransition: (cb: () => void) => unknown;
        }
      ).startViewTransition(() => setSelectedTag(nextTag));
    } else {
      setSelectedTag(nextTag);
    }
  }

  const filteredPosts = useMemo(() => {
    if (selectedTag === "ALL") return posts;
    return posts.filter((post) => post.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  const years = useMemo(() => groupByYear(filteredPosts), [filteredPosts]);

  return (
    <div>
      {/* 标签过滤栏 */}
      {tags.length > 0 ? (
        <fieldset
          aria-label="按主题标签筛选"
          className="flex flex-wrap items-center gap-2 border-x-0 border-t-0 border-b border-border p-0 pb-6"
        >
          <button
            type="button"
            onClick={() => switchTag("ALL")}
            aria-pressed={selectedTag === "ALL"}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 font-mono text-caption transition-colors sm:min-h-9 ${
              selectedTag === "ALL"
                ? "border-fg bg-fg font-medium text-bg"
                : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
            }`}
          >
            <span>All</span>
            <span className="opacity-70">({posts.length})</span>
          </button>

          {tags.map(({ tag, count }) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => switchTag(tag)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 font-mono text-caption transition-colors sm:min-h-9 ${
                  active
                    ? "border-accent bg-accent font-medium text-white"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
                }`}
              >
                <span>#{tag}</span>
                <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </fieldset>
      ) : null}

      {/* 按年份分组目录 */}
      <div className="mt-8 flex flex-col gap-10 md:mt-12 md:gap-14">
        {years.length === 0 ? (
          <p className="rounded-card-sm border border-border bg-surface p-6 text-fg-muted">
            当前标签下暂无文章。
          </p>
        ) : null}

        {years.map(([year, items]) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8"
          >
            <div className="lg:col-span-3">
              <div className="flex items-baseline justify-between border-b border-border pb-2 lg:sticky lg:top-24 lg:flex-col lg:border-b-0 lg:pb-0">
                <h2
                  id={`year-${year}`}
                  className="font-serif text-display-sm font-bold tracking-tight text-fg lg:text-display"
                >
                  {year}
                </h2>
                <span className="font-mono text-caption text-fg-muted lg:mt-1">
                  {items.length} {items.length === 1 ? "ESSAY" : "ESSAYS"}
                </span>
              </div>
            </div>

            <ul className="divide-y divide-border border-b border-border lg:col-span-9 lg:border-t">
              {items.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group flex flex-col gap-2 py-5 transition-colors md:flex-row md:items-start md:justify-between md:gap-8 md:py-6"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-micro text-fg-muted md:hidden">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span>·</span>
                        <span>{post.readingMinutes} min read</span>
                      </div>

                      <h3 className="mt-1 font-serif text-title font-bold tracking-tight text-fg transition-colors group-hover:text-accent md:mt-0">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-label text-fg-muted">
                        {post.summary}
                      </p>

                      {post.tags?.length ? (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-surface-elevated px-2.5 py-0.5 font-mono text-micro text-fg-muted"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="hidden shrink-0 items-center gap-3 pt-1 font-mono text-caption text-fg-muted md:flex">
                      <span>{post.readingMinutes} min</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={post.date} className="w-12 text-right">
                        {formatMonthDay(post.date)}
                      </time>
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
