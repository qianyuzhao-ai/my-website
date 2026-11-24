"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  GitHubIcon,
  MailIcon,
  SparklesIcon,
  XIcon,
} from "@/components/home/icons";
import { type SocialChannel, siteConfig } from "@/lib/site-config";

export const CONNECT_DIALOG_ID = "connect-signal-dialog";

export function openConnectDialog() {
  const el = document.getElementById(CONNECT_DIALOG_ID);
  if (el instanceof HTMLDialogElement && !el.open) {
    el.showModal();
  }
}

function ChannelIcon({ id }: { id: SocialChannel["id"] }) {
  if (id === "x") return <XIcon className="size-4" />;
  if (id === "github") return <GitHubIcon className="size-4.5" />;
  return <SparklesIcon className="size-4.5" />;
}

export function ConnectSheet() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  // 为尚未原生支持 <dialog closedby="any"> 的浏览器补充点击遮罩关闭回退
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const handleClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => dialog.removeEventListener("click", handleClick);
  }, []);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id={CONNECT_DIALOG_ID}
      aria-labelledby="connect-dialog-title"
      {...({ closedby: "any" } as Record<string, string>)}
      className="m-0 mt-auto w-full max-w-none bg-transparent p-0 text-fg sm:m-auto sm:max-w-lg"
    >
      <div className="rounded-t-card-sm border-t border-x border-border bg-surface p-5 shadow-lg sm:rounded-card sm:border sm:p-7">
        {/* 顶部铭牌与关闭按钮 */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-micro tracking-widest text-fg-muted uppercase">
              <span className="size-2 rounded-full bg-signal signal-dot" />
              SIGNAL CHANNEL · DIRECT LINE
            </p>
            <h2
              id="connect-dialog-title"
              className="mt-1.5 font-serif text-title font-bold tracking-tight"
            >
              与 {siteConfig.name} 建立连接
            </h2>
          </div>

          <form method="dialog">
            <button
              type="submit"
              aria-label="关闭联系面板"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-fg transition-colors hover:border-border-strong"
            >
              <CloseIcon className="size-4" />
            </button>
          </form>
        </div>

        <p className="mt-4 text-label text-fg-muted">
          欢迎交流 AI Agent 工程架构、AIGC 工作流共创、独立产品想法或商业合作。
        </p>

        {/* 邮箱直连卡片 */}
        <div className="mt-5 rounded-xl border border-border bg-surface-elevated/65 p-3.5 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-micro tracking-wider text-fg-muted uppercase">
                Electronic Mail
              </p>
              <p className="mt-0.5 truncate font-mono text-body font-medium text-fg">
                {siteConfig.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-fg px-4 text-caption font-medium text-bg transition-opacity hover:opacity-90 sm:flex-initial"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5 text-signal" />
                    <span>已复制地址</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3.5" />
                    <span>复制邮箱</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`发送邮件至 ${siteConfig.email}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-border-strong"
              >
                <MailIcon className="size-4" />
              </a>
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? `已将邮箱 ${siteConfig.email} 复制到剪贴板` : ""}
          </p>
        </div>

        {/* 社交平台矩阵 */}
        <div className="mt-4">
          <p className="mb-2.5 font-mono text-micro tracking-widest text-fg-muted uppercase">
            Social Frequencies
          </p>
          <ul className="flex flex-col gap-2">
            {siteConfig.socials.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface-elevated/55"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-fg transition-colors group-hover:border-accent group-hover:text-accent">
                      <ChannelIcon id={item.id} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-label font-medium text-fg">
                          {item.label}
                        </span>
                        <span className="font-mono text-caption text-fg-muted">
                          {item.handle}
                        </span>
                      </div>
                      <p className="truncate text-caption text-fg-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowIcon className="size-4 shrink-0 text-fg-muted transition-colors group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
