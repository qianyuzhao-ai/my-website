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
import { closeDialogSmoothly, supportsTopLayerExit } from "@/lib/dialog-motion";
import { type SocialChannel, siteConfig } from "@/lib/site-config";

export const CONNECT_DIALOG_ID = "connect-signal-dialog";

export function openConnectDialog() {
  const el = document.getElementById(CONNECT_DIALOG_ID);
  if (el instanceof HTMLDialogElement && !el.open) {
    el.removeAttribute("data-closing");
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

  // 为尚未原生支持 <dialog closedby="any"> 与 top-layer 离场动画的浏览器补充回退
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => dialog.removeAttribute("data-closing");
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
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) {
        void closeDialogSmoothly(dialog);
      }
    };

    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, []);

  function handleDismiss() {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      void closeDialogSmoothly(dialog);
    }
  }

  async function handleCopyEmail() {
    window.dispatchEvent(new CustomEvent("qianyu:glider-launch"));
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
      className="m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-y-auto bg-transparent p-0 text-fg sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[540px]"
    >
      <div className="glass-panel rounded-t-[28px] px-5 pt-3 pb-6 sm:rounded-[32px] sm:p-7">
        {/* 移动端底抽屉抓手条 */}
        <div
          aria-hidden="true"
          className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-fg/18 sm:hidden"
        />

        {/* 顶部铭牌与关闭按钮 */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-signal-soft px-3 py-1 font-mono text-micro font-medium tracking-wider text-signal uppercase">
              <span className="size-1.5 rounded-full bg-signal-dot signal-dot" />
              <span>SIGNAL CHANNEL · DIRECT LINE</span>
            </div>
            <h2
              id="connect-dialog-title"
              className="mt-2.5 text-title font-bold tracking-[-0.025em] text-fg sm:text-display-sm"
            >
              与 {siteConfig.name} 建立连接
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="关闭联系面板"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated/90 text-fg-secondary shadow-xs transition-[background-color,border-color,color,transform] duration-150 hover:border-border-strong hover:bg-surface-solid hover:text-fg active:scale-95"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-label leading-relaxed text-fg-secondary">
          欢迎交流 AI Agent 工程架构、AIGC 工作流共创、独立产品想法或商业合作。
        </p>

        {/* 邮箱直连毛玻璃卡片 */}
        <div className="glass-card mt-5 rounded-2xl p-4">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                Electronic Mail
              </p>
              <p className="mt-0.5 truncate font-mono text-body font-semibold text-fg">
                {siteConfig.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-caption font-medium text-white shadow-xs transition-colors hover:bg-accent-hover sm:flex-initial"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5" />
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
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-solid/85 text-fg transition-colors hover:border-accent/50 hover:text-accent"
              >
                <MailIcon className="size-4" />
              </a>
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? `已将邮箱 ${siteConfig.email} 复制到剪贴板` : ""}
          </p>
        </div>

        {/* 社交平台毛玻璃矩阵 */}
        <div className="mt-5">
          <p className="mb-2.5 font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
            Social Frequencies
          </p>
          <ul className="flex flex-col gap-2">
            {siteConfig.socials.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-border/85 bg-surface-elevated/75 px-4 py-3 transition-all duration-200 hover:border-accent/45 hover:bg-surface-solid/95"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-solid/90 text-fg transition-colors group-hover:border-accent/40 group-hover:bg-accent-soft group-hover:text-accent">
                      <ChannelIcon id={item.id} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-label font-semibold text-fg transition-colors group-hover:text-accent">
                          {item.label}
                        </span>
                        <span className="font-mono text-caption text-fg-muted">
                          {item.handle}
                        </span>
                      </div>
                      <p className="truncate text-caption text-fg-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowIcon className="size-4 shrink-0 text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
