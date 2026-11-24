"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { siteConfig } from "@/lib/site-config";

export function SiteDock() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isHome = pathname === "/";
  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/");

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-2.5 sm:px-4 md:top-5 md:bottom-auto">
      <nav
        aria-label="主导航"
        className="pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full border border-border bg-surface/88 p-1 shadow-lg backdrop-blur-md sm:gap-1 sm:p-1.5"
      >
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 text-caption font-medium transition-colors sm:gap-2 sm:px-4 sm:text-label ${
            isHome ? "bg-fg text-bg" : "text-fg hover:bg-surface-elevated"
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full signal-dot ${
              isHome ? "bg-signal" : "bg-accent"
            }`}
          />
          <span className="font-serif font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <Link
          href="/writing"
          aria-current={isWriting ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-full px-2.5 text-caption font-medium transition-colors sm:px-4 sm:text-label ${
            isWriting ? "bg-fg text-bg" : "text-fg hover:bg-surface-elevated"
          }`}
        >
          Writing
        </Link>

        <button
          type="button"
          onClick={openConnectDialog}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-surface-elevated/70 px-2.5 text-caption font-medium text-fg transition-colors hover:border-accent hover:text-accent sm:px-4 sm:text-label"
        >
          <span>Connect</span>
        </button>

        <span
          aria-hidden="true"
          className="mx-0.5 h-5 w-px shrink-0 bg-border"
        />

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="切换浅色与深色主题"
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-elevated"
        >
          <SunIcon className="size-4.5 dark:hidden" />
          <MoonIcon className="hidden size-4.5 dark:block" />
        </button>
      </nav>
    </header>
  );
}
