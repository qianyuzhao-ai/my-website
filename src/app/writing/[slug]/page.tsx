import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/home/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { PostPager } from "@/components/writing/post-pager";
import { PostToc } from "@/components/writing/post-toc";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { formatDate, getPost, getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost(slug);
  if (!result) return {};
  const { title, summary, date, tags } = result.post;
  return {
    title: `${title} · ${siteConfig.name}`,
    description: summary,
    openGraph: {
      type: "article",
      title,
      description: summary,
      publishedTime: date,
      tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPost(slug);
  if (!result) notFound();
  const { post, Content, headings, previous, next } = result;

  return (
    <>
      <ReadingProgress />
      <main
        id="main"
        className="px-4 pt-8 pb-20 sm:px-6 md:px-8 md:pt-28 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          {/* 移动端顶部返回毛玻璃胶囊 */}
          <div className="mb-5 lg:hidden">
            <Link
              href="/writing"
              className="glass-card inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-label font-medium text-fg-secondary transition-colors hover:text-accent"
            >
              <ArrowLeftIcon className="size-4" />
              <span>返回文章列表</span>
            </Link>
          </div>

          {/* 12 列 Liquid Glass 阅读布局：左侧粘性毛玻璃导览卡片，右侧通透阅读稿纸 */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-8">
            {/* 桌面端左侧粘性导览与元信息毛玻璃卡片 */}
            <aside
              aria-label="文章导览"
              className="hidden lg:sticky lg:top-28 lg:col-span-3 lg:flex lg:flex-col lg:gap-4"
            >
              <Link
                href="/writing"
                className="glass-card group inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-4 text-label font-medium text-fg-secondary transition-all hover:border-accent/45 hover:text-accent"
              >
                <ArrowLeftIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>返回文章列表</span>
              </Link>

              {headings.length > 0 ? (
                <div className="glass-card rounded-2xl p-5">
                  <PostToc headings={headings} variant="desktop" />
                </div>
              ) : null}

              <dl className="glass-card flex flex-col gap-3 rounded-2xl p-5 text-caption">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    发布日期
                  </dt>
                  <dd className="font-mono font-medium text-fg tabular-nums">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border/70 pt-2.5">
                  <dt className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    预计阅读
                  </dt>
                  <dd className="font-mono font-medium text-fg tabular-nums">
                    {post.readingMinutes} 分钟
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-border/70 pt-2.5">
                  <dt className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                    作者
                  </dt>
                  <dd className="font-medium text-fg">{siteConfig.name}</dd>
                </div>
              </dl>
            </aside>

            {/* 主阅读毛玻璃稿纸 */}
            <article className="min-w-0 lg:col-span-9">
              <div className="glass-panel rounded-[24px] p-5 sm:rounded-[28px] sm:p-8 md:p-10">
                <header className="border-b border-border/80 pb-7">
                  {post.tags?.length ? (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent-soft px-3 py-1 font-mono text-micro font-medium text-accent"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <h1 className="max-w-[24ch] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.18] font-bold tracking-[-0.03em] text-fg">
                    {post.title}
                  </h1>

                  <p className="mt-4 max-w-[62ch] text-body leading-relaxed text-fg-secondary md:text-[17px]">
                    {post.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-caption text-fg-muted tabular-nums">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} 分钟阅读</span>
                    <span aria-hidden="true">·</span>
                    <span>{siteConfig.name}</span>
                  </div>
                </header>

                {/* 移动端可展开毛玻璃目录 */}
                {headings.length > 0 ? (
                  <div className="mt-6 lg:hidden">
                    <PostToc headings={headings} variant="mobile" />
                  </div>
                ) : null}

                {/* MDX 正文 */}
                <div className="mt-8 flex flex-col gap-6 text-body leading-[1.84] md:mt-9 md:text-[17px]">
                  <Content />
                </div>
              </div>

              {previous || next ? (
                <div className="mt-8">
                  <PostPager previous={previous} next={next} />
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
