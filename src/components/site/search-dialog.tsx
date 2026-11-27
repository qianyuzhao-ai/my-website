"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { CloseIcon } from "@/components/home/icons";
import type { Post } from "@/lib/post-shared";
import { featuredWorks } from "@/lib/works";

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10.8 10.8 14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

type SearchEntry = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  keywords: string;
};

const STATIC_ENTRIES: SearchEntry[] = [
  {
    id: "work-openflow",
    title: "OpenFlow：面向 12 人团队的 AIGC 无限画布生产平台",
    excerpt:
      "面向 AI 视频播客生产与多模态评测一线场景，以需求拆解驱动 Coding Agent 全栈落地，将单条 5 分钟串行等待重构为并发工作流。",
    href: "/works/openflow",
    keywords: "openflow electron react flow aigc 项目 work 作品 并发画布",
  },
  {
    id: "page-island",
    title: "3D岛 · Sky Island 云上庭园",
    excerpt:
      "基于 Three.js 构建的可漫游 3D 空岛交互实验——包含昼夜日晷、机关解谜与彩蛋飞岛。",
    href: "/island",
    keywords: "3d 3d岛 sky island game 空岛 three webgl 交互游戏",
  },
  {
    id: "page-about",
    title: "守岛人手记 · About & Now",
    excerpt:
      "QianYu，常驻北京的 AI Builder。专注 Agentic 工作流、全栈交互工程与 AIGC 视觉创作。",
    href: "/about",
    keywords: "about 关于 个人简介 now arsenal contact",
  },
];

const SearchEntriesContext = createContext<SearchEntry[]>(STATIC_ENTRIES);

export function SearchProvider({
  posts,
  children,
}: {
  posts: Post[];
  children: ReactNode;
}) {
  const entries = useMemo<SearchEntry[]>(() => {
    const postEntries: SearchEntry[] = posts.map((p) => ({
      id: `post-${p.slug}`,
      title: p.title,
      excerpt: p.summary,
      href: `/writing/${p.slug}`,
      keywords: `${p.title} ${p.summary} ${(p.tags ?? []).join(" ")}`,
    }));

    const workEntries: SearchEntry[] = featuredWorks.map((w) => ({
      id: `work-${w.id}`,
      title: w.title,
      excerpt: `${w.subtitle} ${w.summary}`,
      href: w.href,
      keywords: `${w.title} ${w.subtitle} ${w.summary} ${w.categoryLabel} ${w.stack.join(" ")}`,
    }));

    return [...postEntries, ...STATIC_ENTRIES, ...workEntries];
  }, [posts]);

  return (
    <SearchEntriesContext.Provider value={entries}>
      {children}
    </SearchEntriesContext.Provider>
  );
}

/** 高亮匹配关键词片段（还原参考图的加粗高亮风格） */
function HighlightedText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === trimmed.toLowerCase();
        const key = `${index}-${part}`;
        return isMatch ? (
          <strong key={key} className="font-semibold text-fg">
            {part}
          </strong>
        ) : (
          <span key={key}>{part}</span>
        );
      })}
    </>
  );
}

/**
 * 内联胶囊搜索框 + 正下方锚定结果下拉（参考 blog.x.com，非居中弹窗）：
 * - 直接在胶囊内输入，实时下拉展示匹配条目并加粗命中词
 * - 支持 ⌘K / Ctrl+K 聚焦输入框、↑/↓ 切换结果、Enter 跳转、Esc 或点击外部收起
 */
export function SearchPill({
  className,
  autoFocus = false,
  align = "right",
  onNavigate,
}: {
  className?: string;
  autoFocus?: boolean;
  align?: "left" | "right";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const entries = useContext(SearchEntriesContext);
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 5);
    return entries.filter((item) =>
      `${item.title} ${item.excerpt} ${item.keywords}`
        .toLowerCase()
        .includes(q),
    );
  }, [entries, query]);

  const safeIndex =
    results.length > 0 ? Math.min(activeIndex, results.length - 1) : -1;

  // 移动端展开时自动聚焦输入框
  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      setOpen(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  // ⌘K / Ctrl+K 直接聚焦当前可见的内联搜索框（不弹新窗口）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        const input = inputRef.current;
        if (!input || input.offsetParent === null) return;
        event.preventDefault();
        input.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 点击搜索组件外部时收起下拉列表
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const root = containerRef.current;
      if (root && !root.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function selectEntry(entry: SearchEntry) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    onNavigate?.();
    router.push(entry.href);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (results.length > 0) {
        setActiveIndex((prev) => (prev + 1) % results.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (event.key === "Enter" && open && safeIndex >= 0) {
      event.preventDefault();
      const target = results[safeIndex];
      if (target) selectEntry(target);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open;
  const activeOptionId =
    showDropdown && safeIndex >= 0
      ? `${listboxId}-opt-${safeIndex}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[360px] ${className ?? ""}`}
    >
      {/* 胶囊输入框 */}
      <div
        className={`flex h-11 items-center gap-2.5 rounded-full border bg-bg pr-3 pl-4 transition-colors focus-within:border-fg lg:h-10 ${
          open ? "border-fg" : "border-border hover:border-border-strong"
        }`}
      >
        <SearchIcon className="size-4 shrink-0 text-fg-muted" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          aria-label="搜索文章与项目"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          placeholder="Search"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-fg placeholder:text-fg-muted outline-none! focus-visible:outline-none! sm:text-label"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
            aria-label="清空搜索词"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <CloseIcon className="size-3" />
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="hidden shrink-0 font-mono text-caption text-fg-muted/70 sm:inline-block"
          >
            ⌘K
          </span>
        )}
      </div>

      {/* 锚定在输入框正下方的下拉结果浮层 */}
      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="搜索结果"
          className={`absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-bg shadow-lg sm:w-[400px] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="px-4 pt-3.5 pb-1.5 text-caption text-fg-muted">
            {query.trim() ? "Search results" : "Quick navigation"}
          </div>

          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-label text-fg-muted">
              未找到与「{query}」相关的内容
            </p>
          ) : (
            <div className="flex max-h-[400px] flex-col overflow-y-auto px-2 pb-2">
              {results.map((item, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={item.id}
                    id={`${listboxId}-opt-${index}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectEntry(item)}
                    className={`flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive ? "bg-surface" : "hover:bg-surface"
                    }`}
                  >
                    <span className="text-[15px] leading-snug font-semibold text-fg">
                      <HighlightedText text={item.title} query={query} />
                    </span>
                    <span className="line-clamp-2 text-caption leading-relaxed text-fg-muted">
                      <HighlightedText text={item.excerpt} query={query} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
