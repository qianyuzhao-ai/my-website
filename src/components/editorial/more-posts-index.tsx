"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryGlyph } from "@/components/editorial/wireframe-art";
import type { Post } from "@/lib/post-shared";

const TOPIC_PRESETS = [
  { id: "all", label: "All topics" },
  { id: "Agent", label: "Agent" },
  { id: "AIGC", label: "AIGC" },
  { id: "前端", label: "Frontend" },
] as const;

type SortMode = "newest" | "oldest";

export function MorePostsIndex({
  posts,
  heading = "More posts",
  initialTag,
}: {
  posts: Post[];
  heading?: string;
  initialTag?: string;
}) {
  const [activeTag, setActiveTag] = useState<string>(() => {
    if (!initialTag) return "all";
    return initialTag;
  });
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  // 合并预设主题与 URL 传入的自定义 tag（确保 sidebar 或详情页跳转任意标签都能高亮）
  const filterOptions = useMemo(() => {
    const presetIds = new Set<string>(TOPIC_PRESETS.map((t) => t.id));
    if (activeTag !== "all" && !presetIds.has(activeTag)) {
      return [...TOPIC_PRESETS, { id: activeTag, label: activeTag }];
    }
    return [...TOPIC_PRESETS];
  }, [activeTag]);

  const visiblePosts = useMemo(() => {
    const filtered =
      activeTag === "all"
        ? posts
        : posts.filter((post) =>
            (post.tags ?? []).some(
              (tag) => tag.toLowerCase() === activeTag.toLowerCase(),
            ),
          );
    return sortMode === "newest" ? filtered : [...filtered].reverse();
  }, [posts, activeTag, sortMode]);

  const years = useMemo(() => {
    if (posts.length === 0) return "";
    const latest = posts[0]?.date.slice(0, 4);
    const earliest = posts.at(-1)?.date.slice(0, 4);
    return earliest && latest && earliest !== latest
      ? `${earliest}–${latest}`
      : (latest ?? "");
  }, [posts]);

  return (
    <section
      aria-labelledby="more-posts-heading"
      className="flex flex-col gap-5"
    >
      {/* 标题与胶囊筛选条 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2
          id="more-posts-heading"
          className="text-[22px] leading-tight font-semibold tracking-[-0.02em] text-fg md:text-[26px]"
        >
          {heading}
        </h2>

        <div className="writing-tab-strip -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
          {filterOptions.map((item) => {
            const isSelected = activeTag === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTag(item.id)}
                aria-pressed={isSelected}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-caption font-medium transition-colors md:min-h-8 md:px-3.5 ${
                  isSelected
                    ? "bg-ink text-ink-fg"
                    : "border border-border bg-bg text-fg hover:border-border-strong hover:bg-surface"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() =>
              setSortMode((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            aria-label={
              sortMode === "newest"
                ? "当前按最新排序，点击切换最早优先"
                : "当前按最早排序，点击切换最新优先"
            }
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-border bg-bg px-4 text-caption font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface md:min-h-8 md:px-3.5"
          >
            <span>
              {sortMode === "newest" ? "Sort: Newest" : "Sort: Oldest"}
            </span>
            <span aria-hidden="true" className="text-fg-muted">
              ▾
            </span>
          </button>
        </div>
      </div>

      {/* 1px 细线分隔的编辑部归档表格（非卡片） */}
      <div className="border-t border-border">
        {visiblePosts.length === 0 ? (
          <div className="border-b border-border py-12 text-center text-label text-fg-muted">
            当前主题下暂无已发布文章。
          </div>
        ) : (
          <ul className="divide-y divide-border border-b border-border">
            {visiblePosts.map((post) => {
              const categoryLabel =
                post.tags && post.tags.length > 0
                  ? post.tags.slice(0, 2).join(" · ")
                  : "Essay";
              return (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group flex flex-col gap-1.5 py-4 transition-colors hover:bg-surface/70 md:flex-row md:items-center md:gap-6 md:px-2 md:py-5"
                  >
                    {/* 移动端元信息行 / 桌面端左侧分类列 */}
                    <div className="flex items-center justify-between gap-2 md:w-[200px] md:shrink-0 md:justify-start">
                      <span className="inline-flex items-center gap-2 text-caption text-fg-secondary">
                        <CategoryGlyph className="hidden size-3.5 shrink-0 text-fg-muted md:block" />
                        <span className="truncate">{categoryLabel}</span>
                      </span>
                      <time
                        dateTime={post.date}
                        className="font-mono text-caption text-fg-muted tabular-nums md:hidden"
                      >
                        {post.date}
                      </time>
                    </div>

                    {/* 标题主列 */}
                    <span className="min-w-0 flex-1 text-[15px] leading-snug font-medium text-fg underline-offset-4 group-hover:underline md:text-body">
                      {post.title}
                    </span>

                    {/* 桌面端右对齐日期 */}
                    <time
                      dateTime={post.date}
                      className="hidden w-[110px] shrink-0 text-right font-mono text-caption text-fg-muted tabular-nums md:block"
                    >
                      {post.date}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 底部页码统计条 */}
      <div className="flex items-center justify-between font-mono text-micro text-fg-muted tabular-nums">
        <span>‹ &nbsp; Page 1 of 1 &nbsp; ›</span>
        <span>
          {visiblePosts.length} archived essays
          {years ? ` · ${years}` : ""}
        </span>
      </div>
    </section>
  );
}
