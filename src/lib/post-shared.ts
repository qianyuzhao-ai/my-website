// 纯数据结构与格式化工具：无 Node.js API 依赖，可安全在 Server 与 Client 组件中共用。

export type PostMeta = {
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  tags?: string[];
  /** 草稿只在开发环境显示 */
  draft?: boolean;
};

export type Post = PostMeta & {
  slug: string;
  readingMinutes: number;
};

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** 按年份分组，年份从新到旧 */
export function groupByYear(posts: Post[]) {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups];
}

/** 聚合全部文章标签，按出现频次降序排列 */
export function getAllTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 2026-09-28 → 2026.09.28 */
export function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

/** 2026-09-28 → 09.28（列表已按年份分组时使用） */
export function formatMonthDay(date: string) {
  return date.slice(5).replace("-", ".");
}
