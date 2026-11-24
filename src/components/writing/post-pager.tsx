import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/home/icons";
import type { Post } from "@/lib/post-shared";

const cardClass =
  "group flex flex-col justify-between gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent";
const labelClass =
  "flex items-center gap-1.5 font-mono text-micro tracking-widest text-fg-muted uppercase transition-colors group-hover:text-accent";
const titleClass =
  "line-clamp-2 font-serif text-case-title font-bold text-fg transition-colors group-hover:text-accent";

/** 上一篇（更早）在左，下一篇（更新）在右；移动端上下排列 */
export function PostPager({
  previous,
  next,
}: {
  previous: Post | null;
  next: Post | null;
}) {
  return (
    <nav
      aria-label="上一篇与下一篇"
      className="grid gap-3 md:grid-cols-2 md:gap-4"
    >
      {previous ? (
        <Link
          href={`/writing/${previous.slug}`}
          rel="prev"
          className={cardClass}
        >
          <span className={labelClass}>
            <ArrowLeftIcon className="size-3.5" />
            <span>Older Essay</span>
          </span>
          <span className={titleClass}>{previous.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`/writing/${next.slug}`}
          rel="next"
          className={`${cardClass} items-end text-right md:col-start-2`}
        >
          <span className={labelClass}>
            <span>Newer Essay</span>
            <ArrowRightIcon className="size-3.5" />
          </span>
          <span className={titleClass}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
