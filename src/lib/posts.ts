// 文章数据：读取 src/content/posts/*.mdx，元信息来自每篇文件里的 `export const metadata`。

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { MDXContent } from "mdx/types";
import { cache } from "react";
import { slugifyHeading } from "@/lib/heading-slug";
import type { Post, PostHeading, PostMeta } from "@/lib/post-shared";

export {
  formatDate,
  formatMonthDay,
  getAllTags,
  groupByYear,
  type Post,
  type PostHeading,
  type PostMeta,
} from "@/lib/post-shared";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

function importPost(slug: string) {
  return import(`@/content/posts/${slug}.mdx`) as Promise<{
    default: MDXContent;
    metadata?: Partial<PostMeta>;
  }>;
}

function assertMeta(slug: string, meta: Partial<PostMeta> | undefined) {
  const valid =
    typeof meta?.title === "string" &&
    typeof meta.summary === "string" &&
    typeof meta.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(meta.date);
  if (!valid) {
    throw new Error(
      `${slug}.mdx 需要导出 metadata，包含 title、summary 和 YYYY-MM-DD 格式的 date`,
    );
  }
  return meta as PostMeta;
}

/** 中文按每分钟 400 字、英文按每分钟 200 词估算，不计代码块与元信息 */
function readingMinutes(source: string) {
  const text = source
    .replace(/^export const metadata[\s\S]*?\n};?\s*$/m, "")
    .replace(/```[\s\S]*?```/g, "");
  const cjk = text.match(/[㐀-鿿]/g)?.length ?? 0;
  const words = text.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

/** 提取 MDX 正文中的二级与三级标题（忽略代码块内部） */
function extractHeadings(source: string): PostHeading[] {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  const headings: PostHeading[] = [];
  for (const rawLine of withoutCode.split("\n")) {
    const match = rawLine.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[`*_~]/g, "").trim();
    if (!text) continue;
    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }
  return headings;
}

/** 全部已发布文章，按日期从新到旧 */
export const getPosts = cache(async (): Promise<Post[]> => {
  const files = (await readdir(POSTS_DIR)).filter((file) =>
    file.endsWith(".mdx"),
  );
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.slice(0, -".mdx".length);
      const [{ metadata }, source] = await Promise.all([
        importPost(slug),
        readFile(path.join(POSTS_DIR, file), "utf8"),
      ]);
      return {
        ...assertMeta(slug, metadata),
        slug,
        readingMinutes: readingMinutes(source),
      };
    }),
  );
  return posts
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date));
});

export async function getPost(slug: string) {
  const posts = await getPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return null;
  const [{ default: Content }, source] = await Promise.all([
    importPost(slug),
    readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8"),
  ]);
  return {
    post: posts[index],
    Content,
    headings: extractHeadings(source),
    /** 更早的一篇 */
    previous: posts[index + 1] ?? null,
    /** 更新的一篇 */
    next: posts[index - 1] ?? null,
  };
}
