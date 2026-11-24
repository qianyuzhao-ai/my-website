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
        className="px-4 pt-6 pb-16 sm:px-6 md:px-8 md:pt-24 md:pb-24"
      >
        <div className="mx-auto max-w-6xl">
          {/* 返回文章归档 */}
          <div className="border-b border-border pb-4">
            <Link
              href="/writing"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-caption font-medium text-fg-muted transition-colors hover:text-accent"
            >
              <ArrowLeftIcon className="size-4" />
              <span>BACK TO WRITING ARCHIVE</span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-12 lg:items-start">
            {/* 主阅读列 */}
            <article className="min-w-0 lg:col-span-8 lg:col-start-1">
              <header className="flex flex-col gap-4 border-b border-border pb-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-caption text-fg-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} MIN READ</span>
                  <span aria-hidden="true">·</span>
                  <span>BY {siteConfig.name.toUpperCase()}</span>
                </div>

                <h1 className="font-serif text-post-title-sm font-bold tracking-tight text-fg md:text-post-title">
                  {post.title}
                </h1>

                <p className="text-reading text-fg-muted md:text-post-body">
                  {post.summary}
                </p>

                {post.tags?.length ? (
                  <ul aria-label="文章标签" className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border bg-surface-elevated px-3 py-0.5 font-mono text-micro text-fg"
                      >
                        #{tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </header>

              {/* 移动端可展开目录 */}
              {headings.length > 0 ? (
                <div className="mt-6 lg:hidden">
                  <PostToc headings={headings} variant="mobile" />
                </div>
              ) : null}

              {/* MDX 正文 */}
              <div className="mt-8 flex flex-col gap-5 text-reading md:gap-6 md:text-post-body">
                <Content />
              </div>

              {previous || next ? (
                <div className="mt-14 border-t border-border pt-8">
                  <PostPager previous={previous} next={next} />
                </div>
              ) : null}
            </article>

            {/* 桌面端右侧粘性目录栏 */}
            <div className="hidden lg:sticky lg:top-28 lg:col-span-3 lg:col-start-10 lg:block">
              <PostToc headings={headings} variant="desktop" />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
