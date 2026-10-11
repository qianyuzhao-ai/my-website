import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/home/icons";
import type { Post } from "@/lib/posts";

const cardClass =
  "flex flex-col gap-1.5 rounded-3xl border border-border px-5 py-[18px] transition-colors hover:border-fg-muted";
const labelClass = "flex items-center gap-1.5 text-caption text-fg-muted";
const titleClass = "line-clamp-2 font-serif text-case-title font-semibold";

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
            <ArrowLeftIcon className="size-4" />
            Previous
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
            Next
            <ArrowRightIcon className="size-4" />
          </span>
          <span className={titleClass}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
