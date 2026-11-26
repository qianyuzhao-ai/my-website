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

  // 首页由 3D 空岛专属 HUD 接管，避免与虚拟摇杆/动作键重叠；博客与内页保留全局毛玻璃导航坞
  if (isHome) return null;

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-2.5 sm:px-4 md:top-5 md:bottom-auto">
      <nav
        aria-label="主导航"
        className="glass-dock pointer-events-auto flex max-w-full items-center gap-0.5 rounded-full p-1 sm:gap-1 sm:p-1.5"
      >
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-caption font-semibold whitespace-nowrap transition-colors sm:gap-2 sm:px-4 sm:text-label ${
            isHome
              ? "bg-ink text-ink-fg"
              : "text-fg hover:bg-surface-recessed/80"
          }`}
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-signal-dot signal-dot"
          />
          <span className="tracking-tight">{siteConfig.name}</span>
        </Link>

        <Link
          href="/writing"
          aria-current={isWriting ? "page" : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-2.5 text-caption font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-label ${
            isWriting
              ? "bg-ink text-ink-fg shadow-xs"
              : "text-fg-secondary hover:bg-surface-recessed/80 hover:text-fg"
          }`}
        >
          Writing
        </Link>

        <button
          type="button"
          onClick={openConnectDialog}
          aria-haspopup="dialog"
          className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 text-caption font-medium whitespace-nowrap text-accent transition-colors hover:bg-accent hover:text-white sm:px-4 sm:text-label"
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
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface-recessed/80 hover:text-fg"
        >
          <SunIcon className="size-4.5 dark:hidden" />
          <MoonIcon className="hidden size-4.5 dark:block" />
        </button>
      </nav>
    </header>
  );
}
