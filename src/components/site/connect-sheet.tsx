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
import { useLocale } from "@/components/site/locale-provider";
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
  if (id === "github") return <GitHubIcon className="size-4" />;
  return <SparklesIcon className="size-4" />;
}

export function ConnectSheet() {
  const { dict } = useLocale();
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
      <div className="border border-border bg-bg px-5 pt-4 pb-6 shadow-lg sm:p-7">
        {/* 顶部标题与关闭按钮 */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
              {dict.connect.eyebrow}
            </p>
            <h2
              id="connect-dialog-title"
              className="mt-2 text-title font-bold tracking-[-0.025em] text-fg sm:text-display-sm"
            >
              {dict.connect.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label={dict.connect.closeAria}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-fg-secondary transition-colors hover:border-border-strong hover:text-fg"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <p className="mt-4 text-label leading-relaxed text-fg-secondary">
          {dict.connect.lead}
        </p>

        {/* 邮箱直连平面块 */}
        <div className="mt-5 border border-border bg-surface p-4">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-micro font-medium tracking-wider text-fg-muted uppercase">
                {dict.connect.emailLabel}
              </p>
              <p className="mt-0.5 truncate font-mono text-body font-semibold text-fg">
                {siteConfig.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 sm:flex-initial"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5" />
                    <span>{dict.connect.copiedEmail}</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3.5" />
                    <span>{dict.connect.copyEmail}</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`${dict.connect.mailToAria} ${siteConfig.email}`}
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg text-fg transition-colors hover:bg-surface-recessed"
              >
                <MailIcon className="size-4" />
              </a>
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? dict.connect.copiedEmailSr : ""}
          </p>
        </div>

        {/* 社交渠道细线列表 */}
        <div className="mt-5">
          <p className="mb-2 font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
            {dict.connect.channelsLabel}
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {siteConfig.socials.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-14 items-center justify-between gap-3 py-3 transition-colors hover:bg-surface sm:px-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-fg">
                      <ChannelIcon id={item.id} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-label font-semibold text-fg">
                          {item.label}
                        </span>
                        <span className="font-mono text-caption text-fg-muted">
                          {item.handle}
                        </span>
                      </div>
                      <p className="truncate text-caption text-fg-secondary">
                        {dict.about.socialDescriptions[item.id]}
                      </p>
                    </div>
                  </div>
                  <ArrowIcon className="size-4 shrink-0 text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
