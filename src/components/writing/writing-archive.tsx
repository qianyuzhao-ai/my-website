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
    if (nextTag === selectedTag) return;
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

  const leadPost =
    selectedTag === "ALL" && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const archivePosts = leadPost ? filteredPosts.slice(1) : filteredPosts;
  const years = useMemo(() => groupByYear(archivePosts), [archivePosts]);

  return (
    <div>
      {/* 水平底线分段筛选栏（非胶囊按钮堆叠，移动端支持顺滑横滑） */}
      {tags.length > 0 ? (
        <div
          role="tablist"
          aria-label="按主题筛选文章"
          className="writing-tab-strip -mx-4 flex items-center gap-1 overflow-x-auto border-y border-border px-4 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:gap-2 md:overflow-visible md:px-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTag === "ALL"}
            onClick={() => switchTag("ALL")}
            className={`writing-tab relative -mb-px inline-flex min-h-12 shrink-0 items-center gap-1.5 border-b-2 px-3 text-label transition-[color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              selectedTag === "ALL"
                ? "border-accent font-semibold text-fg"
                : "border-transparent font-normal text-fg-muted hover:text-fg"
            }`}
          >
            <span>全部</span>
            <span className="tabular-nums text-fg-muted">{posts.length}</span>
          </button>

          {tags.map(({ tag, count }) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchTag(tag)}
                className={`writing-tab relative -mb-px inline-flex min-h-12 shrink-0 items-center gap-1.5 border-b-2 px-3 text-label transition-[color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? "border-accent font-semibold text-fg"
                    : "border-transparent font-normal text-fg-muted hover:text-fg"
                }`}
              >
                <span>{tag}</span>
                <span className="tabular-nums text-fg-muted">{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {selectedTag === "ALL"
          ? `当前显示全部 ${filteredPosts.length} 篇文章`
          : `已筛选主题 ${selectedTag}，共 ${filteredPosts.length} 篇文章`}
      </p>

      {/* 头版焦点条：展示最新文章（仅在「全部」视图出现） */}
      {leadPost ? (
        <section aria-label="最新文章" className="mt-8 md:mt-10">
          <Link
            href={`/writing/${leadPost.slug}`}
            className="group grid grid-cols-1 gap-5 border-y border-border bg-surface-elevated px-5 py-7 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-border-strong sm:px-7 md:py-9 lg:grid-cols-12 lg:gap-8 lg:px-8"
          >
            <div className="flex flex-col justify-between gap-4 lg:col-span-4">
              <div className="flex flex-col gap-2">
                <span
                  aria-hidden="true"
                  className="block h-0.5 w-8 bg-accent"
                />
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-label tabular-nums text-fg-muted">
                  <time dateTime={leadPost.date}>
                    {formatDate(leadPost.date)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{leadPost.readingMinutes} 分钟阅读</span>
                </div>
              </div>

              {leadPost.tags?.length ? (
                <p className="text-label text-fg-muted">
                  {leadPost.tags.join(" · ")}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col justify-between gap-4 lg:col-span-8">
              <div>
                <h2 className="font-serif text-title font-bold tracking-[-0.02em] text-fg transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent md:text-[2rem] md:leading-[1.2]">
                  {leadPost.title}
                </h2>
                <p className="mt-3 max-w-[60ch] text-body leading-relaxed text-fg-muted">
                  {leadPost.summary}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-label font-medium text-accent">
                <span>阅读全文</span>
                <ArrowRightIcon className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      {/* 按年份分组的瑞士索引目录 */}
      <div className="mt-10 flex flex-col gap-12 md:mt-14 md:gap-16">
        {filteredPosts.length === 0 ? (
          <p className="border-y border-border py-10 text-body text-fg-muted">
            当前主题下暂无文章。
          </p>
        ) : null}

        {years.map(([year, items]) => (
          <section
            key={year}
            aria-labelledby={`year-${year}`}
            className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8"
          >
            <div className="lg:col-span-3">
              <div className="flex items-baseline justify-between border-b border-fg/15 pb-2.5 lg:sticky lg:top-28 lg:flex-col lg:gap-1.5 lg:border-b-0 lg:pb-0">
                <h2
                  id={`year-${year}`}
                  className="font-serif text-title font-bold leading-none tracking-[-0.03em] tabular-nums text-fg lg:text-[2.25rem]"
                >
                  {year}
                </h2>
                <span className="text-label tabular-nums text-fg-muted">
                  {items.length} 篇
                </span>
              </div>
            </div>

            <ul className="divide-y divide-border border-b border-border lg:col-span-9 lg:border-t">
              {items.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group relative flex flex-col gap-2.5 py-5 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:inset-y-0 before:-left-3 before:w-0.5 before:bg-accent before:opacity-0 before:transition-opacity before:duration-200 hover:bg-surface-elevated/60 hover:before:opacity-100 md:flex-row md:items-start md:justify-between md:gap-8 md:px-4 md:py-6 md:before:left-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-label tabular-nums text-fg-muted md:hidden">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingMinutes} 分钟</span>
                      </div>

                      <h3 className="font-serif text-title font-bold tracking-[-0.015em] text-fg transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 max-w-[60ch] text-body leading-relaxed text-fg-muted">
                        {post.summary}
                      </p>

                      {post.tags?.length ? (
                        <p className="mt-2.5 text-label text-fg-muted">
                          {post.tags.join(" · ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="hidden shrink-0 items-center gap-3.5 pt-1 text-label tabular-nums text-fg-muted md:flex">
                      <span>{post.readingMinutes} 分钟</span>
                      <span aria-hidden="true" className="text-border-strong">
                        /
                      </span>
                      <time dateTime={post.date} className="w-12 text-right">
                        {formatMonthDay(post.date)}
                      </time>
                      <ArrowRightIcon className="size-4 text-fg-muted transition-[transform,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-accent" />
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
