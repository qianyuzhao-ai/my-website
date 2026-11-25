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
        className="px-4 pt-8 pb-20 sm:px-6 md:px-8 md:pt-28 md:pb-28"
      >
        <div className="mx-auto max-w-6xl">
          {/* 移动端顶部返回入口 */}
          <div className="border-b border-border pb-3 lg:hidden">
            <Link
              href="/writing"
              className="inline-flex min-h-11 items-center gap-2 text-label font-medium text-fg-muted transition-colors duration-150 hover:text-accent"
            >
              <ArrowLeftIcon className="size-4" />
              <span>返回文章列表</span>
            </Link>
          </div>

          {/* 瑞士 12 列阅读网格：左栏目录与索引，右主栏专注 65ch 阅读与代码块延展 */}
          <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-0 lg:grid-cols-12 lg:items-start lg:gap-10">
            {/* 桌面端左侧粘性导览与极简无框目录 */}
            <aside
              aria-label="文章导览"
              className="hidden lg:sticky lg:top-28 lg:col-span-3 lg:flex lg:flex-col lg:gap-7"
            >
              <Link
                href="/writing"
                className="group inline-flex min-h-11 w-fit items-center gap-2 text-label font-medium text-fg-muted transition-colors duration-150 hover:text-accent"
              >
                <ArrowLeftIcon className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5" />
                <span>返回文章列表</span>
              </Link>

              {headings.length > 0 ? (
                <div className="border-t border-border pt-6">
                  <PostToc headings={headings} variant="desktop" />
                </div>
              ) : null}

              <dl className="flex flex-col gap-3 border-t border-border pt-6 text-label">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-fg-muted">发布</dt>
                  <dd className="tabular-nums text-fg">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-fg-muted">时长</dt>
                  <dd className="tabular-nums text-fg">
                    {post.readingMinutes} 分钟
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-fg-muted">作者</dt>
                  <dd className="text-fg">{siteConfig.name}</dd>
                </div>
              </dl>
            </aside>

            {/* 主阅读列 */}
            <article className="min-w-0 lg:col-span-8 lg:col-start-5">
              <header className="border-b border-border pb-8">
                <h1 className="max-w-[22ch] font-serif text-[clamp(1.875rem,4.2vw,2.75rem)] leading-[1.16] font-bold tracking-[-0.03em] text-fg">
                  {post.title}
                </h1>

                <p className="mt-4 max-w-[62ch] text-body leading-relaxed text-fg-muted md:text-[17px]">
                  {post.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-label tabular-nums text-fg-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} 分钟阅读</span>
                  <span aria-hidden="true">·</span>
                  <span>{siteConfig.name}</span>
                  {post.tags?.length ? (
                    <>
                      <span aria-hidden="true" className="hidden sm:inline">
                        ·
                      </span>
                      <span className="w-full text-fg sm:w-auto">
                        {post.tags.join(" · ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </header>

              {/* 移动端可展开目录 */}
              {headings.length > 0 ? (
                <div className="mt-6 lg:hidden">
                  <PostToc headings={headings} variant="mobile" />
                </div>
              ) : null}

              {/* MDX 正文 */}
              <div className="mt-8 flex flex-col gap-6 text-body leading-[1.82] md:mt-10 md:text-[17px]">
                <Content />
              </div>

              {previous || next ? (
                <div className="mt-16 border-t border-border pt-8">
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
