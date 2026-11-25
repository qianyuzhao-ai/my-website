"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DualModeConsole } from "@/components/home/dual-mode-console";
import { ArrowIcon, ArrowRightIcon, CloseIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { formatDate, type Post } from "@/lib/post-shared";
import { siteConfig } from "@/lib/site-config";
import { featuredWorks } from "@/lib/works";

function useDialogLightDismiss(
  ref: React.RefObject<HTMLDialogElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    if ("closedBy" in HTMLDialogElement.prototype) {
      return () => dialog.removeEventListener("close", handleClose);
    }

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    };

    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, [ref, onClose]);
}

export function ShrineModal({
  activePanel,
  posts,
  onClose,
}: {
  activePanel: "writing" | "works" | "about" | null;
  posts: Post[];
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [worksTab, setWorksTab] = useState<"gallery" | "console">("gallery");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  useDialogLightDismiss(dialogRef, onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activePanel && !dialog.open) {
      dialog.showModal();
    } else if (!activePanel && dialog.open) {
      dialog.close();
    }
  }, [activePanel]);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags ?? [])));
  const visiblePosts =
    selectedTag === "ALL"
      ? posts
      : posts.filter((p) => p.tags?.includes(selectedTag));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="shrine-modal-title"
      {...({ closedby: "any" } as Record<string, string>)}
      className="m-0 mt-auto max-h-[88dvh] w-full max-w-none overflow-y-auto bg-transparent p-0 text-fg sm:m-auto sm:max-h-[85dvh] sm:max-w-4xl"
    >
      {activePanel === "writing" ? (
        <div className="rounded-t-card-sm border-x border-t border-border bg-surface p-5 shadow-lg sm:rounded-card sm:border sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="font-mono text-micro tracking-widest text-signal uppercase">
                SHRINE 01 {"//"} GINKGO GROVE STELE
              </p>
              <h2
                id="shrine-modal-title"
                className="mt-1 font-serif text-display-sm font-bold tracking-tight"
              >
                古树手稿石碑 · 经验分享
              </h2>
            </div>

            <form method="dialog">
              <button
                type="submit"
                aria-label="关闭手稿面板"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-fg transition-colors hover:border-border-strong"
              >
                <CloseIcon className="size-4" />
              </button>
            </form>
          </div>

          {allTags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTag("ALL")}
                aria-pressed={selectedTag === "ALL"}
                className={`min-h-9 rounded-full border px-3 font-mono text-micro transition-colors ${
                  selectedTag === "ALL"
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-surface-elevated text-fg-muted hover:text-fg"
                }`}
              >
                All ({posts.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  aria-pressed={selectedTag === tag}
                  className={`min-h-9 rounded-full border px-3 font-mono text-micro transition-colors ${
                    selectedTag === tag
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-surface-elevated text-fg-muted hover:text-fg"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : null}

          <ul className="mt-4 divide-y divide-border border-y border-border">
            {visiblePosts.map((post, idx) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1.5 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-micro text-accent">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-case-title font-bold text-fg transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                    </div>
                    <p className="mt-1 line-clamp-2 pl-6 text-caption text-fg-muted">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 pl-6 font-mono text-micro text-fg-muted sm:pl-0">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readingMinutes} min</span>
                    <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-micro text-fg-muted">
              点击任意文章将在新标签页打开阅读，保留当前空岛进度
            </span>
            <Link
              href="/writing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-label font-medium text-bg transition-opacity hover:opacity-90"
            >
              <span>前往完整博客归档</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      ) : null}

      {activePanel === "works" ? (
        <div className="rounded-t-card-sm border-x border-t border-border bg-surface p-5 shadow-lg sm:rounded-card sm:border sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="font-mono text-micro tracking-widest text-signal uppercase">
                SHRINE 02 {"//"} SUMMIT ASTROLABE FORGE
              </p>
              <h2
                id="shrine-modal-title"
                className="mt-1 font-serif text-display-sm font-bold tracking-tight"
              >
                山巅造物星盘 · 作品与实验台
              </h2>
            </div>

            <form method="dialog">
              <button
                type="submit"
                aria-label="关闭造物面板"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-fg transition-colors hover:border-border-strong"
              >
                <CloseIcon className="size-4" />
              </button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setWorksTab("gallery")}
              aria-pressed={worksTab === "gallery"}
              className={`min-h-11 rounded-full border px-4 font-mono text-caption font-medium transition-colors ${
                worksTab === "gallery"
                  ? "border-fg bg-fg text-bg"
                  : "border-border bg-surface-elevated text-fg-muted hover:text-fg"
              }`}
            >
              01 · Coding &amp; AIGC 代表作 ({featuredWorks.length})
            </button>
            <button
              type="button"
              onClick={() => setWorksTab("console")}
              aria-pressed={worksTab === "console"}
              className={`min-h-11 rounded-full border px-4 font-mono text-caption font-medium transition-colors ${
                worksTab === "console"
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface-elevated text-fg-muted hover:text-fg"
              }`}
            >
              02 · 交互式双模控制台
            </button>
          </div>

          {worksTab === "gallery" ? (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {featuredWorks.map((work) => (
                <article
                  key={work.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface-elevated/50 p-5"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-micro text-accent">
                      <span>
                        {work.index} · {work.kind.toUpperCase()}
                      </span>
                      <span className="text-fg-muted">{work.year}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-case-title font-bold text-fg">
                      {work.title}
                    </h3>
                    <p className="mt-1.5 text-caption text-fg-muted">
                      {work.summary}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {work.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-micro text-fg-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {work.isExternal ? (
                      <a
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center gap-1.5 font-mono text-caption font-medium text-accent underline underline-offset-4"
                      >
                        <span>{work.ctaLabel}</span>
                        <ArrowIcon className="size-3.5" />
                      </a>
                    ) : (
                      <Link
                        href={work.href}
                        target={
                          work.href.startsWith("/writing")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          work.href.startsWith("/writing")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="inline-flex min-h-10 items-center gap-1.5 font-mono text-caption font-medium text-accent underline underline-offset-4"
                      >
                        <span>{work.ctaLabel}</span>
                        <ArrowRightIcon className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <DualModeConsole />
            </div>
          )}
        </div>
      ) : null}

      {activePanel === "about" ? (
        <div className="rounded-t-card-sm border-x border-t border-border bg-surface p-5 shadow-lg sm:rounded-card sm:border sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="font-mono text-micro tracking-widest text-accent uppercase">
                SECRET CLOUD ISLET {"//"} HIDDEN MONOLITH
              </p>
              <h2
                id="shrine-modal-title"
                className="mt-1 font-serif text-display-sm font-bold tracking-tight"
              >
                {siteConfig.about.headline}
              </h2>
            </div>

            <form method="dialog">
              <button
                type="submit"
                aria-label="关闭守岛人手记"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-fg transition-colors hover:border-border-strong"
              >
                <CloseIcon className="size-4" />
              </button>
            </form>
          </div>

          <p className="mt-5 text-body leading-relaxed text-fg">
            {siteConfig.about.story}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-elevated/55 p-5">
              <p className="font-mono text-micro tracking-widest text-signal uppercase">
                NOW {"//"} 近期正在折腾
              </p>
              <ul className="mt-3 space-y-2.5 text-label text-fg">
                {siteConfig.about.nowItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface-elevated/55 p-5">
              <p className="font-mono text-micro tracking-widest text-accent uppercase">
                ARSENAL {"//"} 常用造物工具栈
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {siteConfig.about.arsenal.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-caption text-fg"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <span className="font-mono text-micro text-fg-muted">
              踩上飞岛东侧的青绿弹射阵即可乘风返回主岛广场
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                openConnectDialog();
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-label font-medium text-bg transition-opacity hover:opacity-90"
            >
              <span>发起信号连接</span>
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
