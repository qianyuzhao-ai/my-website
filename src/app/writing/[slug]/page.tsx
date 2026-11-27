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
import { formatLocalizedDate, getDictionary } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";
import { getPost, getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts("zh");
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getServerLocale()]);
  const result = await getPost(slug, locale);
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
  const [{ slug }, locale] = await Promise.all([params, getServerLocale()]);
  const dict = getDictionary(locale);
  const result = await getPost(slug, locale);
  if (!result) notFound();
  const { post, Content, headings, isFallback, previous, next } = result;
  const primaryTag = post.tags?.[0] ?? "Essay";
  const localizedDate = formatLocalizedDate(post.date, locale);

  return (
    <>
      <ReadingProgress />
      <main
        id="main"
        className="flex-1 px-4 pt-5 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,760px)_260px] xl:items-start xl:justify-between xl:gap-16">
            {/* 中间专注阅读列 */}
            <article className="min-w-0">
              <nav
                aria-label={dict.article.breadcrumbRoot}
                className="mb-6 flex items-center gap-3 text-caption text-fg-muted"
              >
                <Link
                  href="/writing"
                  aria-label={dict.article.backToList}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-border-strong hover:bg-surface sm:size-8"
                >
                  <ArrowLeftIcon className="size-3.5" />
                </Link>
                <Link
                  href="/writing"
                  className="transition-colors hover:text-fg"
                >
                  {dict.article.breadcrumbRoot}
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/writing?tag=${encodeURIComponent(primaryTag)}`}
                  className="font-medium text-fg transition-opacity hover:opacity-75"
                >
                  {primaryTag}
                </Link>
              </nav>

              {/* 若英文版暂缺，显示极简提示条并回退展示中文原文 */}
              {isFallback ? (
                <div className="mb-6 border border-border bg-surface px-4 py-3 text-caption text-fg-secondary">
                  {dict.article.fallbackNotice}
                </div>
              ) : null}

              <header className="flex flex-col gap-3.5">
                <h1 className="text-[26px] leading-[1.32] font-bold tracking-[-0.02em] text-fg sm:text-[34px] md:text-[38px] md:leading-[1.24]">
                  {post.title}
                </h1>
                <p className="max-w-[60ch] text-[15px] leading-[1.7] text-fg-secondary md:text-[17px]">
                  {post.summary}
                </p>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-caption text-fg-muted xl:hidden">
                  <span className="font-medium text-fg">
                    {dict.article.by} {siteConfig.name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date} className="font-mono tabular-nums">
                    {post.date}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {post.readingMinutes} {dict.article.minRead}
                  </span>
                </div>
              </header>

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

              <div className="mt-6 hidden items-center gap-1.5 text-label text-fg-muted xl:flex">
                <span>{dict.article.by}</span>
                <Link
                  href="/about"
                  className="font-medium text-fg underline underline-offset-4"
                >
                  {siteConfig.name}
                </Link>
                <span>, {dict.article.roleLocation}</span>
              </div>

              {headings.length > 0 ? (
                <div className="mt-6 xl:hidden">
                  <PostToc headings={headings} variant="mobile" />
                </div>
              ) : null}

              <div className="mt-7 flex flex-col gap-6 text-body leading-[1.84]">
                <Content />
              </div>

              <div className="mt-10 flex flex-col gap-5 border-t border-border pt-6 xl:hidden">
                {post.tags?.length ? (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption">
                    <span className="font-mono text-micro text-fg-muted uppercase">
                      {dict.article.tags}
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

              {previous || next ? (
                <div className="mt-12 border-t border-border pt-8">
                  <PostPager previous={previous} next={next} />
                </div>
              ) : null}
            </article>

            {/* 桌面端右侧粘性元信息栏 */}
            <aside
              aria-label={dict.article.author}
              className="hidden xl:sticky xl:top-10 xl:flex xl:max-h-[calc(100svh-3.5rem)] xl:flex-col xl:gap-7 xl:overflow-y-auto xl:pt-12 xl:pr-1"
            >
              <div className="flex flex-col gap-2.5">
                <p className="text-micro text-fg-muted">
                  {dict.article.author}
                </p>
                <Link href="/about" className="group flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-micro font-medium text-fg">
                    QY
                  </span>
                  <span className="flex flex-col">
                    <span className="text-label font-semibold text-fg group-hover:underline">
                      {siteConfig.name}
                    </span>
                    <span className="text-micro text-fg-muted">
                      {dict.article.roleLocation}
                    </span>
                  </span>
                </Link>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-micro text-fg-muted">{dict.article.date}</p>
                <time dateTime={post.date} className="text-caption">
                  <span className="font-semibold text-fg">
                    {localizedDate.lead}
                  </span>{" "}
                  <span className="text-fg-muted">{localizedDate.rest}</span>
                </time>
                <p className="font-mono text-micro text-fg-muted tabular-nums">
                  {post.readingMinutes} {dict.article.minRead}
                </p>
              </div>

              {post.tags?.length ? (
                <div className="flex flex-col gap-2">
                  <p className="text-micro text-fg-muted">
                    {dict.article.tags}
                  </p>
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

              <PostToc headings={headings} variant="desktop" />

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
