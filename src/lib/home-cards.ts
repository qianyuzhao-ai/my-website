// 首页 Bento 卡片的数据与布局。网格位置对应 Figma 3:35（All）、3:39（About）、3:40（Projects）。

export const categories = [
  { id: "all", label: "All" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "media", label: "Media" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type CardId =
  | "intro"
  | "map"
  | "music"
  | "social"
  | "vouch"
  | "skip"
  | "article"
  | "wrap"
  | "theme"
  | "subscribe";

/** 1×1、2×1、1×2 三种卡片比例 */
export type CardSize = "square" | "wide" | "tall";

export const cardSizes: Record<CardId, CardSize> = {
  intro: "wide",
  map: "square",
  music: "square",
  social: "square",
  vouch: "tall",
  skip: "tall",
  article: "wide",
  wrap: "wide",
  theme: "square",
  subscribe: "wide",
};

/** 移动端与平板的默认顺序（Figma 3:37） */
export const defaultOrder: CardId[] = [
  "intro",
  "map",
  "music",
  "social",
  "vouch",
  "skip",
  "article",
  "wrap",
  "theme",
  "subscribe",
];

/** 每个分类突出显示的卡片；其余卡片降低不透明度。Media 稿中未定义，暂定音乐与社交。 */
export const highlighted: Record<CategoryId, CardId[]> = {
  all: defaultOrder,
  about: ["intro", "map", "social"],
  projects: ["wrap", "vouch", "skip"],
  media: ["music", "social"],
};

/** 桌面 4 列网格中的起始 [列, 行]，跨度由 cardSizes 决定 */
export const desktopPlacement: Record<
  CategoryId,
  Record<CardId, [col: number, row: number]>
> = {
  all: {
    intro: [1, 1],
    map: [3, 1],
    skip: [4, 1],
    music: [1, 2],
    social: [2, 2],
    vouch: [3, 2],
    article: [1, 3],
    theme: [4, 3],
    wrap: [1, 4],
    subscribe: [3, 4],
  },
  about: {
    intro: [1, 1],
    map: [3, 1],
    social: [4, 1],
    music: [1, 2],
    theme: [2, 2],
    vouch: [3, 2],
    skip: [4, 2],
    article: [1, 3],
    wrap: [1, 4],
    subscribe: [3, 4],
  },
  projects: {
    wrap: [1, 1],
    vouch: [3, 1],
    skip: [4, 1],
    intro: [1, 2],
    music: [1, 3],
    theme: [2, 3],
    map: [3, 3],
    social: [4, 3],
    article: [1, 4],
    subscribe: [3, 4],
  },
  media: {
    music: [1, 1],
    social: [2, 1],
    map: [3, 1],
    skip: [4, 1],
    intro: [1, 2],
    vouch: [3, 2],
    article: [1, 3],
    theme: [4, 3],
    wrap: [1, 4],
    subscribe: [3, 4],
  },
};

/** 移动端 / 平板顺序：突出的卡片在前，其余保持默认顺序 */
export function mobileOrder(category: CategoryId): CardId[] {
  const first = highlighted[category];
  return [...first, ...defaultOrder.filter((id) => !first.includes(id))];
}

// TODO: 以下链接待提供；为 undefined 时渲染为不可点击的占位。
export const links = {
  contact: undefined as string | undefined,
  article: undefined as string | undefined,
  social: undefined as string | undefined,
  vouch: undefined as string | undefined,
  skip: undefined as string | undefined,
  wrap: undefined as string | undefined,
};

export const projects = {
  social: { name: "Twitter", tone: "bg-card-blue" },
  vouch: { name: "Vouch", tone: "bg-card-blue" },
  skip: { name: "Skip", tone: "bg-card-pink" },
  wrap: { name: "Wrap.so", tone: "bg-card-yellow" },
} as const;
