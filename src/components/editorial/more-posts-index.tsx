"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryGlyph } from "@/components/editorial/wireframe-art";
import { useLocale } from "@/components/site/locale-provider";
import type { Post } from "@/lib/post-shared";

type SortMode = "newest" | "oldest";

/** 将前端 / Frontend 等中英同义标签映射到同一筛选组，避免切换语言后筛空 */
function matchesTagFilter(postTags: string[] | undefined, filterId: string) {
  if (filterId === "all") return true;
  const tags = (postTags ?? []).map((t) => t.toLowerCase());
  const normalized = filterId.toLowerCase();
  if (normalized === "frontend" || normalized === "前端") {
    return tags.includes("frontend") || tags.includes("前端");
  }
  return tags.includes(normalized);
}

export function MorePostsIndex({
  posts,
  heading,
  initialTag,
}: {
  posts: Post[];
  heading?: string;
  initialTag?: string;
}) {
  const { locale, dict } = useLocale();
  const [activeTag, setActiveTag] = useState<string>(() => initialTag || "all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const filterOptions = useMemo(() => {
    const presets = [
      { id: "all", label: dict.archive.allTopics },
      { id: "Agent", label: dict.archive.filterAgent },
      { id: "AIGC", label: dict.archive.filterAigc },
      {
        id: locale === "zh" ? "前端" : "Frontend",
        label: dict.archive.filterFrontend,
      },
    ];
    const presetIds = new Set(presets.map((p) => p.id.toLowerCase()));
    if (
      activeTag !== "all" &&
      !presetIds.has(activeTag.toLowerCase()) &&
      !(
        (activeTag === "前端" || activeTag.toLowerCase() === "frontend") &&
        (presetIds.has("前端") || presetIds.has("frontend"))
      )
    ) {
      return [...presets, { id: activeTag, label: activeTag }];
    }
    return presets;
  }, [activeTag, dict, locale]);

  const visiblePosts = useMemo(() => {
    const filtered = posts.filter((post) =>
      matchesTagFilter(post.tags, activeTag),
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

  const resolvedHeading = heading ?? dict.archive.morePosts;

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
          {resolvedHeading}
        </h2>

        <div className="writing-tab-strip -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:overflow-visible md:px-0">
          {filterOptions.map((item) => {
            const isSelected =
              activeTag.toLowerCase() === item.id.toLowerCase() ||
              ((activeTag === "前端" ||
                activeTag.toLowerCase() === "frontend") &&
                (item.id === "前端" || item.id.toLowerCase() === "frontend"));
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
                ? dict.archive.sortToggleToOldest
                : dict.archive.sortToggleToNewest
            }
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full border border-border bg-bg px-4 text-caption font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface md:min-h-8 md:px-3.5"
          >
            <span>
              {sortMode === "newest"
                ? dict.archive.sortNewest
                : dict.archive.sortOldest}
            </span>
            <span aria-hidden="true" className="text-fg-muted">
              ▾
            </span>
          </button>
        </div>
      </div>

      {/* 1px 细线分隔的编辑部归档表格 */}
      <div className="border-t border-border">
        {visiblePosts.length === 0 ? (
          <div className="border-b border-border py-12 text-center text-label text-fg-muted">
            {dict.archive.empty}
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

                    <span className="min-w-0 flex-1 text-[15px] leading-snug font-medium text-fg underline-offset-4 group-hover:underline md:text-body">
                      {post.title}
                    </span>

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
        <span>‹ &nbsp; {dict.archive.pageLabel} &nbsp; ›</span>
        <span>
          {visiblePosts.length} {dict.archive.archivedEssays}
          {years ? ` · ${years}` : ""}
        </span>
      </div>
    </section>
  );
}
