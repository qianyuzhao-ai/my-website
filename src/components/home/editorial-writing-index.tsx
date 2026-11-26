"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/home/icons";
import { formatDate, type Post } from "@/lib/post-shared";

export function EditorialWritingIndex({
  posts,
  totalCount,
}: {
  posts: Post[];
  totalCount: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const previewPost = posts[activeIndex] ?? posts[0];

  return (
    <section
      aria-labelledby="writing-index-heading"
      className="border-t border-border px-4 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* 栏头 */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-caption tracking-widest text-accent uppercase">
              ACT III {"//"} FIELD NOTES &amp; RETROSPECTIVES
            </p>
            <h2
              id="writing-index-heading"
              className="mt-2 font-serif text-section font-bold tracking-tight"
            >
              经验手记：一线实战与思考
            </h2>
          </div>

          <Link
            href="/writing"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border bg-surface px-4 text-label font-medium text-fg transition-colors hover:border-accent hover:text-accent sm:self-auto"
          >
            <span>全部文章 ({totalCount})</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-8 rounded-card-sm border border-border bg-surface p-6 text-fg-muted">
            文章即将上线。
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* 左侧杂志目录表 */}
            <ol className="divide-y divide-border border-b border-border lg:col-span-8">
              {posts.map((post, idx) => {
                const indexStr = String(idx + 1).padStart(2, "0");
                const isSelected = idx === activeIndex;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/writing/${post.slug}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onFocus={() => setActiveIndex(idx)}
                      className="group flex flex-col gap-2 py-5 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 md:py-6"
                    >
                      <div className="flex items-baseline gap-3.5 sm:gap-5">
                        <span
                          className={`font-mono text-caption transition-colors ${
                            isSelected
                              ? "font-semibold text-accent"
                              : "text-fg-muted group-hover:text-accent"
                          }`}
                        >
                          {indexStr}
                        </span>
                        <div>
                          <h3 className="font-serif text-title font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
                            {post.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-label text-fg-muted lg:hidden">
                            {post.summary}
                          </p>
                          {post.tags?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
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
                      </div>

                      <div className="flex shrink-0 items-center gap-3 pl-8 font-mono text-caption text-fg-muted sm:pl-0">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingMinutes} min</span>
                        <ArrowRightIcon className="size-4 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>

            {/* 右侧桌面端粘性摘要预览卡 */}
            {previewPost ? (
              <aside
                aria-label="当前指向文章导读"
                className="hidden rounded-card-sm border border-border bg-surface p-6 lg:sticky lg:top-24 lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:gap-6"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-micro tracking-widest text-fg-muted uppercase">
                    <span>ISSUE ABSTRACT</span>
                    <span className="text-accent">
                      NO.{String(activeIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-4 font-serif text-case-title font-bold text-fg">
                    {previewPost.title}
                  </p>
                  <p className="mt-3 text-label leading-relaxed text-fg-muted">
                    {previewPost.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 font-mono text-micro text-fg-muted">
                  <span>PUBLISHED {formatDate(previewPost.date)}</span>
                  <span>{previewPost.readingMinutes} MIN READ</span>
                </div>
              </aside>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
