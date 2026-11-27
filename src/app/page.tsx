import Link from "next/link";
import {
  OpenFlowIsometricArt,
  PostHeroArt,
} from "@/components/editorial/wireframe-art";
import { SearchPill } from "@/components/site/search-dialog";
import { SiteFooter } from "@/components/site/site-footer";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const posts = await getPosts(locale);
  const featuredPosts = posts.slice(0, 3);

  return (
    <>
      <main
        id="main"
        className="flex-1 px-4 pt-6 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1120px] flex-col gap-12 md:gap-16">
          {/* 1. 顶部刊头与桌面端 ⌘K 内联搜索框 */}
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-[28px] leading-[1.18] font-semibold tracking-[-0.025em] text-fg md:text-[38px] md:leading-[1.14]">
              {dict.home.title}
            </h1>
            <SearchPill className="hidden lg:block" />
          </header>

          {/* 2. 精选案例（Featured Case Study） */}
          <section
            aria-labelledby="featured-works-heading"
            className="flex flex-col gap-5"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="featured-works-heading"
                className="text-[20px] leading-tight font-semibold tracking-[-0.02em] text-fg md:text-[24px]"
              >
                {dict.home.featuredWorksHeading}
              </h2>
              <Link
                href="/works"
                className="inline-flex min-h-11 items-center text-caption font-medium text-fg-muted transition-colors hover:text-fg md:min-h-0"
              >
                {dict.home.allWorksLink}
              </Link>
            </div>

            <div className="bg-surface p-5 sm:p-7 lg:p-10">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
                <div className="order-2 flex flex-col justify-between gap-6 lg:order-1 lg:col-span-6">
                  <div className="hidden items-center gap-2.5 font-mono text-micro text-fg-muted lg:flex">
                    <span aria-hidden="true" className="size-1.5 bg-fg" />
                    <span className="font-medium tracking-wider text-fg uppercase">
                      {dict.home.heroBadge}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>2026 · v1.4.0</span>
                  </div>

                  <div>
                    <h3 className="text-[22px] leading-[1.32] font-bold tracking-[-0.02em] text-fg sm:text-[28px] lg:text-[30px] lg:leading-[1.34]">
                      {dict.home.heroTitle}
                    </h3>
                    <p className="mt-3.5 max-w-[46ch] text-label leading-[1.65] text-fg-secondary md:text-[15px]">
                      {dict.home.heroDesc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="hidden items-center gap-3 font-mono text-micro tracking-wider text-fg-muted uppercase lg:flex">
                      <span>{dict.home.heroSpecs[0]}</span>
                      <span aria-hidden="true">/</span>
                      <span>{dict.home.heroSpecs[1]}</span>
                    </div>

                    <Link
                      href="/works/openflow"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-5 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 lg:hidden"
                    >
                      {dict.home.heroCta}
                    </Link>
                  </div>
                </div>

                <div className="order-1 flex flex-col justify-between gap-4 lg:order-2 lg:col-span-6 lg:items-end">
                  <p className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase lg:hidden">
                    {dict.home.heroMobileBadge}
                  </p>

                  <div className="flex w-full items-center justify-center py-1 lg:flex-1">
                    <OpenFlowIsometricArt className="h-auto w-full max-w-[420px]" />
                  </div>

                  <Link
                    href="/works/openflow"
                    className="hidden h-9 items-center justify-center rounded-full bg-ink px-5 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 lg:inline-flex"
                  >
                    {dict.home.heroCta}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 3. 精选文章（Featured Writing；更多筛选与归档留在 /writing） */}
          {featuredPosts.length > 0 ? (
            <section
              aria-labelledby="featured-writing-heading"
              className="flex flex-col gap-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id="featured-writing-heading"
                  className="text-[20px] leading-tight font-semibold tracking-[-0.02em] text-fg md:text-[24px]"
                >
                  {dict.home.featuredWritingHeading}
                </h2>
                <Link
                  href="/writing"
                  className="inline-flex min-h-11 items-center text-caption font-medium text-fg-muted transition-colors hover:text-fg md:min-h-0"
                >
                  {dict.home.allWritingLink}
                </Link>
              </div>

              {featuredPosts.length === 1 ? (
                (() => {
                  const post = featuredPosts[0];
                  const tagsLabel = post.tags?.slice(0, 3).join(" · ") ?? "";
                  return (
                    <article className="border border-border bg-bg p-5 sm:p-7 lg:p-10">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
                        <div className="order-2 flex flex-col gap-5 lg:order-1 lg:col-span-6">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro text-fg-muted tabular-nums">
                            {tagsLabel ? (
                              <>
                                <span className="font-medium text-fg uppercase">
                                  {tagsLabel}
                                </span>
                                <span aria-hidden="true">·</span>
                              </>
                            ) : null}
                            <time dateTime={post.date}>{post.date}</time>
                            <span aria-hidden="true">·</span>
                            <span>
                              {post.readingMinutes} {dict.article.minRead}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-[22px] leading-[1.32] font-bold tracking-[-0.02em] text-fg sm:text-[26px]">
                              <Link
                                href={`/writing/${post.slug}`}
                                className="underline-offset-4 hover:underline"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            <p className="mt-3 max-w-[48ch] text-label leading-[1.7] text-fg-secondary md:text-[15px]">
                              {post.summary}
                            </p>
                          </div>

                          <div className="pt-1">
                            <Link
                              href={`/writing/${post.slug}`}
                              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border-strong bg-bg px-5 text-caption font-medium text-fg transition-colors hover:border-fg hover:bg-surface sm:w-fit md:min-h-9"
                            >
                              {dict.home.readArticleCta} →
                            </Link>
                          </div>
                        </div>

                        <Link
                          href={`/writing/${post.slug}`}
                          aria-label={post.title}
                          className="group order-1 flex aspect-[16/10] w-full items-center justify-center bg-surface p-5 transition-colors hover:bg-surface-recessed lg:order-2 lg:col-span-6"
                        >
                          <PostHeroArt
                            slug={post.slug}
                            className="h-auto w-full max-w-[420px]"
                          />
                        </Link>
                      </div>
                    </article>
                  );
                })()
              ) : (
                <div
                  className={`grid grid-cols-1 gap-8 ${
                    featuredPosts.length === 2
                      ? "md:grid-cols-2 lg:gap-10"
                      : "sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                  }`}
                >
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/writing/${post.slug}`}
                      className="group flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between gap-2 text-micro">
                        <span className="truncate font-medium text-fg">
                          {post.tags?.slice(0, 2).join(" · ") || "Essay"}
                        </span>
                        <time
                          dateTime={post.date}
                          className="shrink-0 font-mono text-fg-muted tabular-nums"
                        >
                          {post.date}
                        </time>
                      </div>

                      <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-surface px-4 py-3 transition-colors group-hover:bg-surface-recessed">
                        <PostHeroArt
                          slug={post.slug}
                          className="h-auto w-full max-w-[320px]"
                        />
                      </div>

                      <h3 className="text-case-title font-bold tracking-[-0.01em] text-fg underline-offset-4 group-hover:underline">
                        {post.title}
                      </h3>

                      <p className="line-clamp-3 text-label leading-[1.6] text-fg-secondary">
                        {post.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* 4. Explore by topic 宽幅平面横幅 */}
          <section
            aria-labelledby="topic-explorer-heading"
            className="flex flex-col gap-6 bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9"
          >
            <div className="flex flex-col gap-3">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                {dict.home.topicEyebrow}
              </p>
              <h2
                id="topic-explorer-heading"
                className="text-[20px] leading-snug font-semibold tracking-[-0.02em] text-fg md:text-[24px]"
              >
                {dict.home.topicHeading}
              </h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                {dict.home.topicLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-caption transition-colors ${
                      item.active
                        ? "font-semibold text-fg underline underline-offset-4"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/works"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full bg-ink px-5 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 md:min-h-9 md:w-auto"
            >
              {dict.home.topicCta}
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
