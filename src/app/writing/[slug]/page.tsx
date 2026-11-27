import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostHeroArt } from "@/components/editorial/wireframe-art";
import { ArrowLeftIcon } from "@/components/home/icons";
import { SiteFooter } from "@/components/site/site-footer";
import { PostPager } from "@/components/writing/post-pager";
import { PostToc } from "@/components/writing/post-toc";
import { ReadingProgress } from "@/components/writing/reading-progress";
import { ShareButton } from "@/components/writing/share-button";
import { formatEditorialDate } from "@/lib/post-shared";
import { getPost, getPosts } from "@/lib/posts";
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
  const primaryTag = post.tags?.[0] ?? "Essay";
  const editorialDate = formatEditorialDate(post.date);

  return (
    <>
      <ReadingProgress />
      <main
        id="main"
        className="flex-1 px-4 pt-5 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1120px]">
          {/* 三栏阅读架构（外壳提供左侧 220px 栏，此处为居中 760px 正文列 + 右侧 260px 粘性元信息栏） */}
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,760px)_260px] xl:items-start xl:justify-between xl:gap-16">
            {/* 中间专注阅读列 */}
            <article className="min-w-0">
              {/* 面包屑与圆形返回钮 */}
              <nav
                aria-label="文章位置"
                className="mb-6 flex items-center gap-3 text-caption text-fg-muted"
              >
                <Link
                  href="/writing"
                  aria-label="返回文章列表"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-border-strong hover:bg-surface sm:size-8"
                >
                  <ArrowLeftIcon className="size-3.5" />
                </Link>
                <Link
                  href="/writing"
                  className="transition-colors hover:text-fg"
                >
                  Writing
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/writing?tag=${encodeURIComponent(primaryTag)}`}
                  className="font-medium text-fg transition-opacity hover:opacity-75"
                >
                  {primaryTag}
                </Link>
              </nav>

              {/* 标题与摘要 */}
              <header className="flex flex-col gap-3.5">
                <h1 className="text-[26px] leading-[1.32] font-bold tracking-[-0.02em] text-fg sm:text-[34px] md:text-[38px] md:leading-[1.24]">
                  {post.title}
                </h1>
                <p className="max-w-[60ch] text-[15px] leading-[1.7] text-fg-secondary md:text-[17px]">
                  {post.summary}
                </p>

                {/* 移动端/平板端紧凑元信息条 */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-caption text-fg-muted xl:hidden">
                  <span className="font-medium text-fg">
                    By {siteConfig.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date} className="font-mono tabular-nums">
                    {post.date}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {post.readingMinutes} min read
                  </span>
                </div>
              </header>

              {/* 0px 直角单色架构线框主图 + 1px 细线等宽图注 */}
              <figure className="mt-7 bg-surface">
                <div className="flex min-h-[200px] items-center justify-center px-6 py-8 sm:min-h-[280px]">
                  <PostHeroArt
                    slug={post.slug}
                    className="h-auto w-full max-w-[440px]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 font-mono text-micro tracking-wider text-fg-muted uppercase sm:px-5">
                  <span className="truncate">
                    FIG 00 {"//"} {post.slug.replaceAll("-", " ")}
                  </span>
                  <span className="shrink-0">SCALE 1:1</span>
                </figcaption>
              </figure>

              {/* 桌面端署名行 */}
              <div className="mt-6 hidden items-center gap-1.5 text-label text-fg-muted xl:flex">
                <span>By</span>
                <Link
                  href="/about"
                  className="font-medium text-fg underline underline-offset-4"
                >
                  {siteConfig.name}
                </Link>
                <span>
                  , {siteConfig.role} · {siteConfig.location.split(" ")[0]}
                </span>
              </div>

              {/* 移动端可展开胶囊目录 */}
              {headings.length > 0 ? (
                <div className="mt-6 xl:hidden">
                  <PostToc headings={headings} variant="mobile" />
                </div>
              ) : null}

              {/* MDX 正文 */}
              <div className="mt-7 flex flex-col gap-6 text-body leading-[1.84]">
                <Content />
              </div>

              {/* 移动端底部标签与分享 */}
              <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 xl:hidden">
                {post.tags?.length ? (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption">
                    <span className="font-mono text-micro text-fg-muted uppercase">
                      Tags
                    </span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/writing?tag=${encodeURIComponent(tag)}`}
                        className="font-medium text-fg underline-offset-4 hover:underline"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <ShareButton title={post.title} fullWidth />
              </div>

              {/* 上一篇 / 下一篇 */}
              {previous || next ? (
                <div className="mt-12 border-t border-border pt-8">
                  <PostPager previous={previous} next={next} />
                </div>
              ) : null}
            </article>

            {/* 桌面端右侧粘性元信息栏（严格对齐 Figma StickyMetaRail） */}
            <aside
              aria-label="文章元信息"
              className="hidden xl:sticky xl:top-10 xl:flex xl:flex-col xl:gap-7 xl:pt-12"
            >
              {/* Author */}
              <div className="flex flex-col gap-2.5">
                <p className="text-micro text-fg-muted">Author</p>
                <Link href="/about" className="group flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-micro font-medium text-fg">
                    QY
                  </span>
                  <span className="flex flex-col">
                    <span className="text-label font-semibold text-fg group-hover:underline">
                      {siteConfig.name}
                    </span>
                    <span className="text-micro text-fg-muted">
                      {siteConfig.role} · {siteConfig.location.split(" ")[0]}
                    </span>
                  </span>
                </Link>
              </div>

              {/* Date（星期加粗 + 日期柔和灰，致敬 blog.x.com） */}
              <div className="flex flex-col gap-1.5">
                <p className="text-micro text-fg-muted">Date</p>
                <time dateTime={post.date} className="text-caption">
                  <span className="font-semibold text-fg">
                    {editorialDate.weekday}
                  </span>{" "}
                  <span className="text-fg-muted">{editorialDate.rest}</span>
                </time>
                <p className="font-mono text-micro text-fg-muted tabular-nums">
                  {post.readingMinutes} min read
                </p>
              </div>

              {/* Tags（纯文本链接，不套重型边框） */}
              {post.tags?.length ? (
                <div className="flex flex-col gap-2">
                  <p className="text-micro text-fg-muted">Tags</p>
                  <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-caption">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/writing?tag=${encodeURIComponent(tag)}`}
                        className="font-medium text-fg underline-offset-4 hover:underline"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* ON THIS PAGE 极简左线目录 */}
              <PostToc headings={headings} variant="desktop" />

              {/* Share 胶囊 */}
              <div className="pt-2">
                <ShareButton title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
