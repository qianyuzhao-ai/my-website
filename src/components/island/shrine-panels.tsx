"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DualModeConsole } from "@/components/home/dual-mode-console";
import {
  ArrowIcon,
  ArrowRightIcon,
  CloseIcon,
  SparklesIcon,
  TerminalIcon,
} from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { closeDialogSmoothly, supportsTopLayerExit } from "@/lib/dialog-motion";
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

    const handleClose = () => {
      dialog.removeAttribute("data-closing");
      onClose();
    };
    const handleCancel = (event: Event) => {
      if (supportsTopLayerExit()) return;
      event.preventDefault();
      void closeDialogSmoothly(dialog);
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("cancel", handleCancel);

    if ("closedBy" in HTMLDialogElement.prototype) {
      return () => {
        dialog.removeEventListener("close", handleClose);
        dialog.removeEventListener("cancel", handleCancel);
      };
    }

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!inside) {
        void closeDialogSmoothly(dialog);
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [ref, onClose]);
}

function ModalGrabHandle() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-fg/18 sm:hidden"
    />
  );
}

function GlassCloseButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated/90 text-fg-secondary shadow-xs transition-[background-color,border-color,color,transform] duration-150 hover:border-border-strong hover:bg-surface-solid hover:text-fg active:scale-95"
    >
      <CloseIcon className="size-4" />
    </button>
  );
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

  useDialogLightDismiss(dialogRef, onClose);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activePanel && !dialog.open) {
      dialog.removeAttribute("data-closing");
      dialog.showModal();
    } else if (!activePanel && dialog.open) {
      void closeDialogSmoothly(dialog);
    }
  }, [activePanel]);

  function handleDismiss() {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      void closeDialogSmoothly(dialog);
    } else {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="shrine-modal-title"
      {...({ closedby: "any" } as Record<string, string>)}
      className="m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-y-auto bg-transparent p-0 text-fg sm:m-auto sm:max-h-[86dvh] sm:w-[calc(100%-2rem)] sm:max-w-[920px]"
    >
      {activePanel === "writing" ? (
        <div className="glass-panel rounded-t-[28px] px-5 pt-3 pb-6 sm:rounded-[32px] sm:p-8">
          <ModalGrabHandle />

          {/* 顶部栏 */}
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 font-mono text-micro font-medium tracking-wider text-signal uppercase">
                <span className="size-1.5 rounded-full bg-signal-dot" />
                <span>SHRINE 01 {"//"} STONE LECTERN</span>
              </div>
              <h2
                id="shrine-modal-title"
                className="mt-2.5 text-display-sm font-bold tracking-[-0.025em] text-fg"
              >
                石页书台 · 经验分享
              </h2>
            </div>

            <GlassCloseButton label="关闭手稿面板" onClick={handleDismiss} />
          </div>

          {/* 文章目录列表 */}
          <ul className="mt-5 flex flex-col gap-2">
            {posts.map((post, idx) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-2 rounded-2xl border border-border/75 bg-surface-elevated/65 px-4 py-3.5 transition-all duration-200 hover:border-accent/45 hover:bg-surface-solid/90 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-micro font-semibold text-accent tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-case-title font-semibold tracking-[-0.015em] text-fg transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                    </div>
                    <p className="mt-1 line-clamp-2 pl-7 text-caption text-fg-secondary">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 pl-7 font-mono text-micro text-fg-muted tabular-nums sm:pl-0">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min</span>
                    <ArrowRightIcon className="ml-0.5 size-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* 底部栏 */}
          <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-micro text-fg-muted">
              点击任意文章将在新标签页打开阅读，保留当前空岛进度
            </span>
            <Link
              href="/writing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-label font-medium text-ink-fg shadow-xs transition-opacity hover:opacity-90"
            >
              <span>前往完整博客归档</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      ) : null}

      {activePanel === "works" ? (
        <div className="glass-panel rounded-t-[28px] px-5 pt-3 pb-6 sm:rounded-[32px] sm:p-8">
          <ModalGrabHandle />

          {/* 顶部栏 */}
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 font-mono text-micro font-medium tracking-wider text-accent uppercase">
                <SparklesIcon className="size-3.5" />
                <span>SHRINE 02 {"//"} SUMMIT WORKS FORGE</span>
              </div>
              <h2
                id="shrine-modal-title"
                className="mt-2.5 text-display-sm font-bold tracking-[-0.025em] text-fg"
              >
                造物展廊 · 作品与实验台
              </h2>
            </div>

            <GlassCloseButton label="关闭造物面板" onClick={handleDismiss} />
          </div>

          {/* 液态玻璃分段胶囊 Tab */}
          <div
            role="tablist"
            aria-label="造物展廊视图切换"
            className="mt-5 grid grid-cols-1 gap-1.5 rounded-2xl border border-border/80 bg-surface-recessed p-1.5 sm:inline-grid sm:grid-cols-2 sm:rounded-full"
          >
            <button
              type="button"
              role="tab"
              aria-selected={worksTab === "gallery"}
              onClick={() => setWorksTab("gallery")}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 font-mono text-caption font-medium transition-all sm:rounded-full ${
                worksTab === "gallery"
                  ? "bg-surface-solid text-fg shadow-xs"
                  : "text-fg-secondary hover:text-fg"
              }`}
            >
              <span>
                01 · Coding &amp; AIGC 代表作 ({featuredWorks.length})
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={worksTab === "console"}
              onClick={() => setWorksTab("console")}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 font-mono text-caption font-medium transition-all sm:rounded-full ${
                worksTab === "console"
                  ? "bg-accent text-white shadow-xs"
                  : "text-fg-secondary hover:text-fg"
              }`}
            >
              <TerminalIcon className="size-3.5" />
              <span>02 · 交互式双模控制台</span>
            </button>
          </div>

          {worksTab === "gallery" ? (
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {featuredWorks.map((work) => {
                  const isCoding = work.kind === "coding";
                  return (
                    <article
                      key={work.id}
                      className="glass-card flex flex-col justify-between gap-4 rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-mono text-micro font-semibold ${
                              isCoding
                                ? "bg-signal-soft text-signal"
                                : "bg-accent-soft text-accent"
                            }`}
                          >
                            {work.index} · {work.kind.toUpperCase()}
                          </span>
                          <span className="font-mono text-micro text-fg-muted tabular-nums">
                            {work.year}
                          </span>
                        </div>

                        <h3 className="mt-3 text-case-title font-bold tracking-[-0.015em] text-fg">
                          {work.title}
                        </h3>
                        <p className="mt-2 text-caption leading-relaxed text-fg-secondary">
                          {work.summary}
                        </p>

                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {work.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-border/80 bg-surface-solid/80 px-2.5 py-0.5 font-mono text-micro text-fg-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {work.href ? (
                        <div className="border-t border-border/70 pt-3">
                          {work.isExternal ? (
                            <a
                              href={work.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-10 items-center gap-1.5 font-mono text-caption font-medium text-accent transition-opacity hover:opacity-80"
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
                              className="group inline-flex min-h-10 items-center gap-1.5 font-mono text-caption font-medium text-accent transition-opacity hover:opacity-80"
                            >
                              <span>{work.ctaLabel}</span>
                              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          )}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>

              {/* 深色玻璃双模控制台快捷预览条（对应 Figma 02） */}
              <div className="glass-dark-surface flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-micro text-[#7dd3fc]">
                    <span className="size-2 rounded-full bg-[#34d399] signal-dot" />
                    <span>LIVE PREVIEW {"//"} DUAL-MODE CONSOLE</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-caption text-[#e2e8f0]">
                    pipeline/storyboard-agent.ts · Code 工程态 ↔ AIGC
                    潜空间实时切换
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setWorksTab("console")}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#4f94ff] px-4 text-caption font-medium text-white transition-colors hover:bg-[#3b82f6]"
                >
                  <span>进入交互控制台</span>
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <DualModeConsole />
            </div>
          )}
        </div>
      ) : null}

      {activePanel === "about" ? (
        <div className="glass-panel rounded-t-[28px] px-5 pt-3 pb-6 sm:rounded-[32px] sm:p-8">
          <ModalGrabHandle />

          {/* 顶部栏 */}
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 font-mono text-micro font-medium tracking-wider text-signal uppercase">
                <span className="size-1.5 rounded-full bg-signal-dot signal-dot" />
                <span>SECRET CLOUD ISLET {"//"} KEEPER MONUMENT</span>
              </div>
              <h2
                id="shrine-modal-title"
                className="mt-2.5 text-display-sm font-bold tracking-[-0.025em] text-fg"
              >
                {siteConfig.about.headline}
              </h2>
            </div>

            <GlassCloseButton label="关闭守岛人手记" onClick={handleDismiss} />
          </div>

          {/* 个人简介与状态胶囊条 */}
          <p className="mt-5 text-body leading-relaxed text-fg-secondary">
            {siteConfig.about.story}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-elevated/85 px-3 py-1 font-mono text-micro text-fg-secondary">
              <span className="size-1.5 rounded-full bg-signal-dot" />
              {siteConfig.location}
            </span>
            <span className="inline-flex items-center rounded-full border border-border/80 bg-surface-elevated/85 px-3 py-1 font-mono text-micro text-fg-secondary">
              {siteConfig.role}
            </span>
            <span className="inline-flex items-center rounded-full bg-accent-soft px-3 py-1 font-mono text-micro font-medium text-accent">
              Open to Collaborate
            </span>
          </div>

          {/* 双栏毛玻璃卡片 */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="glass-card rounded-2xl p-5">
              <p className="font-mono text-micro font-semibold tracking-widest text-signal uppercase">
                NOW {"//"} 近期正在折腾
              </p>
              <ul className="mt-3.5 space-y-2.5 text-label text-fg">
                {siteConfig.about.nowItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal-dot" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="font-mono text-micro font-semibold tracking-widest text-accent uppercase">
                ARSENAL {"//"} 常用造物工具栈
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {siteConfig.about.arsenal.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-border/85 bg-surface-solid/85 px-3 py-1 font-mono text-caption text-fg"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 底部栏 */}
          <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-micro text-fg-muted">
              踩上飞岛东侧的青绿弹射阵即可乘风返回主岛广场
            </span>
            <button
              type="button"
              onClick={() => {
                handleDismiss();
                window.setTimeout(() => openConnectDialog(), 120);
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-label font-medium text-ink-fg shadow-xs transition-opacity hover:opacity-90"
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
