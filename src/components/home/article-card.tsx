import Link from "next/link";
import { BentoCard } from "@/components/home/bento-card";
import { ArrowIcon, ArrowRightIcon } from "@/components/home/icons";
import { formatDate, getPosts } from "@/lib/posts";

/**
 * 首页最新文章卡片。Read more 进入文章，All posts 进入列表；
 * 两个链接独立，卡片其余区域保留给拖拽。
 */
export async function ArticleCard() {
  const [latest] = await getPosts();

  return (
    <BentoCard className="flex flex-col justify-between gap-6 bg-surface p-6 lg:px-10 lg:pt-9 lg:pb-8">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 text-caption">
          <span className="font-medium text-accent">Latest</span>
          {latest ? (
            <>
              <span aria-hidden="true" className="text-fg-muted">
                ·
              </span>
              <time dateTime={latest.date} className="text-fg-muted">
                {formatDate(latest.date)}
              </time>
            </>
          ) : null}
        </p>
        <h2 className="line-clamp-2 font-serif text-post-heading font-bold">
          {latest?.title ?? "文章即将上线"}
        </h2>
        {latest ? (
          <p className="line-clamp-2 text-reading">{latest.summary}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-4">
        {latest ? (
          <Link
            href={`/writing/${latest.slug}`}
            draggable={false}
            data-no-drag
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface pr-[18px] pl-3.5 text-label font-medium transition-colors hover:border-fg-muted"
          >
            <ArrowIcon className="size-4" />
            Read more
            <span className="sr-only">：{latest.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/writing"
          draggable={false}
          data-no-drag
          className="inline-flex min-h-11 items-center gap-1.5 text-label font-medium underline-offset-4 hover:underline"
        >
          All posts
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </BentoCard>
  );
}
