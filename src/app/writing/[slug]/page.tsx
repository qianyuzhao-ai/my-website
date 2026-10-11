import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HomeFooter } from "@/components/home/home-footer";
import { ArrowLeftIcon } from "@/components/home/icons";
import { SkipLink } from "@/components/site/skip-link";
import { PostPager } from "@/components/writing/post-pager";
import { WritingHeader } from "@/components/writing/writing-header";
import { formatDate, getPost, getPosts } from "@/lib/posts";

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
    title: `${title} · QianYu`,
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
  const { post, Content, previous, next } = result;

  return (
    <>
      <SkipLink />
      <WritingHeader />
      <main id="main" className="px-5 pb-10 md:px-6 xl:px-0">
        <article className="mx-auto flex max-w-[872px] flex-col gap-6 md:gap-8 md:rounded-card md:bg-surface md:px-12 md:pt-10 md:pb-14 lg:px-[116px] md:dark:border-[1.5px] md:dark:border-border">
          <Link
            href="/writing"
            className="inline-flex min-h-11 items-center gap-1.5 self-start text-label font-medium"
          >
            <ArrowLeftIcon className="size-4" />
            All posts
          </Link>

          <header className="flex flex-col gap-4">
            <p className="text-caption text-fg-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
              {post.readingMinutes} min read
            </p>
            <h1 className="font-serif text-post-title-sm font-bold md:text-post-title">
              {post.title}
            </h1>
            <p className="text-reading text-fg-muted md:text-post-body">
              {post.summary}
            </p>
            {post.tags?.length ? (
              <ul aria-label="标签" className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-pill px-3 py-0.5 text-case-small"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <hr className="border-border" />

          <div className="flex flex-col gap-5 text-reading md:gap-6 md:text-post-body">
            <Content />
          </div>

          {previous || next ? (
            <>
              <hr className="border-border" />
              <PostPager previous={previous} next={next} />
            </>
          ) : null}
        </article>
      </main>
      <HomeFooter />
    </>
  );
}
