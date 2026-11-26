import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/home/icons";
import { formatDate, type Post } from "@/lib/post-shared";

const cardClass =
  "glass-card group flex flex-col justify-between gap-3 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-solid/90";
const labelClass =
  "flex items-center gap-1.5 font-mono text-micro font-medium text-fg-muted transition-colors duration-150 group-hover:text-accent";
const titleClass =
  "line-clamp-2 text-case-title font-bold tracking-[-0.015em] text-fg transition-colors duration-150 group-hover:text-accent";

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
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/writing/${previous.slug}`}
          rel="prev"
          className={cardClass}
        >
          <span className={labelClass}>
            <ArrowLeftIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>更早一篇</span>
            <span className="ml-auto tabular-nums text-fg-muted">
              {formatDate(previous.date)}
            </span>
          </span>
          <div>
            <span className={titleClass}>{previous.title}</span>
            <p className="mt-1.5 line-clamp-1 text-caption text-fg-secondary">
              {previous.summary}
            </p>
          </div>
        </Link>
      ) : null}

      {next ? (
        <Link
          href={`/writing/${next.slug}`}
          rel="next"
          className={`${cardClass} md:col-start-2`}
        >
          <span className={`${labelClass} justify-between`}>
            <span className="tabular-nums text-fg-muted">
              {formatDate(next.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span>更新一篇</span>
              <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </span>
          <div className="md:text-right">
            <span className={titleClass}>{next.title}</span>
            <p className="mt-1.5 line-clamp-1 text-caption text-fg-secondary">
              {next.summary}
            </p>
          </div>
        </Link>
      ) : null}
    </nav>
  );
}
