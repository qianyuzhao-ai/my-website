"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/home/icons";
import { useLocale } from "@/components/site/locale-provider";
import type { Post } from "@/lib/post-shared";

const linkClass =
  "group flex flex-col justify-between gap-2.5 border border-border bg-bg p-5 transition-colors hover:bg-surface";

/** 上一篇（更早）在左，下一篇（更新）在右；移动端上下排列 */
export function PostPager({
  previous,
  next,
}: {
  previous: Post | null;
  next: Post | null;
}) {
  const { dict } = useLocale();

  return (
    <nav
      aria-label={`${dict.article.previous} / ${dict.article.next}`}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/writing/${previous.slug}`}
          rel="prev"
          className={linkClass}
        >
          <span className="flex items-center justify-between gap-2 font-mono text-micro text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeftIcon className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span>{dict.article.previous}</span>
            </span>
            <span className="tabular-nums">{previous.date}</span>
          </span>
          <span className="line-clamp-2 text-label font-semibold text-fg underline-offset-4 group-hover:underline">
            {previous.title}
          </span>
        </Link>
      ) : null}

      {next ? (
        <Link
          href={`/writing/${next.slug}`}
          rel="next"
          className={`${linkClass} md:col-start-2`}
        >
          <span className="flex items-center justify-between gap-2 font-mono text-micro text-fg-muted">
            <span className="tabular-nums">{next.date}</span>
            <span className="inline-flex items-center gap-1.5">
              <span>{dict.article.next}</span>
              <ArrowRightIcon className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </span>
          <span className="line-clamp-2 text-label font-semibold text-fg underline-offset-4 group-hover:underline md:text-right">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
