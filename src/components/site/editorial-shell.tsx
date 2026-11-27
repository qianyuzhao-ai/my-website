"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandQMark } from "@/components/editorial/wireframe-art";
import {
  ArrowLeftIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { LanguageToggle, useLocale } from "@/components/site/locale-provider";
import { SearchIcon, SearchPill } from "@/components/site/search-dialog";
import { siteConfig } from "@/lib/site-config";
import { skyAudio } from "@/lib/sky-audio";

function NavLinkList({
  pathname,
  orientation = "vertical",
  onNavigate,
}: {
  pathname: string;
  orientation?: "vertical" | "horizontal";
  onNavigate?: () => void;
}) {
  const { dict } = useLocale();
  const items = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.works, href: "/works" },
    { label: dict.nav.writing, href: "/writing" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.island, href: "/island" },
  ] as const;

  function isItemActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (orientation === "horizontal") {
    return (
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isItemActive(item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`site-nav-link relative inline-flex h-10 items-center whitespace-nowrap px-3 text-label transition-colors ${
                  active
                    ? "font-semibold text-fg"
                    : "font-normal text-fg-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => {
        const active = isItemActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`site-nav-drawer-link flex min-h-11 items-center border-l-2 pl-3 text-label transition-colors ${
                active
                  ? "border-fg font-semibold text-fg"
                  : "border-transparent font-normal text-fg-muted hover:text-fg"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** 3D 空岛全屏页面的极简黑白悬浮返回与控制条 */
function IslandFloatingBar() {
  const { dict } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const [muted, setMuted] = useState(false);

  function handleToggleTheme() {
    const nextDark = resolvedTheme !== "dark";
    setTheme(nextDark ? "dark" : "light");
    skyAudio.playShrineOpen();
    window.dispatchEvent(
      new CustomEvent("qianyu:theme-toast", {
        detail: nextDark
          ? "☾ 时之日晷：空岛入夜 · 随身提灯与萤火虫已点亮"
          : "☀ 时之日晷：晨光破晓 · 暖阳洒满黄金银杏林",
      }),
    );
  }

  function handleToggleMute() {
    const next = !muted;
    setMuted(next);
    skyAudio.muted = next;
    if (!next) {
      skyAudio.playCookingChime();
    }
  }

  return (
    <header
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 md:px-6 md:pt-5"
    >
      <Link
        href="/"
        className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg/92 px-4 text-caption font-medium text-fg backdrop-blur-sm transition-colors hover:border-border-strong"
      >
        <ArrowLeftIcon className="size-3.5" />
        <span>{dict.nav.backToSite}</span>
      </Link>

      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-bg/92 p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label={dict.nav.toggleTheme}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface hover:text-fg"
        >
          <SunIcon className="size-4 dark:hidden" />
          <MoonIcon className="hidden size-4 dark:block" />
        </button>
        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={muted ? dict.nav.unmuteAudio : dict.nav.muteAudio}
          aria-pressed={!muted}
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface hover:text-fg"
        >
          {muted ? (
            <VolumeOffIcon className="size-4" />
          ) : (
            <VolumeOnIcon className="size-4" />
          )}
        </button>
      </div>
    </header>
  );
}

/**
 * 全局黑白编辑部外壳：
 * - /island 路由：交出全屏给 3D 空岛，仅保留悬浮返回条；
 * - 其余路由：全端统一顶部粘性导航栏（桌面端横向展示 首页 / 项目 / 写作 / 关于 / 3D岛 + Connect + 语言切换；移动端保留内联搜索展开与侧滑抽屉）。
 */
export function EditorialShell({ children }: { children: ReactNode }) {
  const { dict } = useLocale();
  const pathname = usePathname();
  const isIsland = pathname === "/island";

  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // 阻止鼠标/触控板悬停在固定顶栏上时的滚轮穿透与顶底回弹
  useEffect(() => {
    if (isIsland) return;
    const header = headerRef.current;
    if (!header) return;

    const handleWheel = (event: WheelEvent) => {
      let el = event.target as HTMLElement | null;
      while (el && el !== header) {
        if (el.scrollHeight > el.clientHeight + 1) return;
        el = el.parentElement;
      }
      event.preventDefault();
    };

    header.addEventListener("wheel", handleWheel, { passive: false });
    return () => header.removeEventListener("wheel", handleWheel);
  }, [isIsland]);

  const openDrawer = useCallback(async () => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !scroller || drawer.open) return;

    setMobileSearchOpen(false);
    drawer.showModal();

    if (
      typeof CSS !== "undefined" &&
      !CSS.supports("scroll-initial-target", "nearest")
    ) {
      scroller.scrollTo({ left: scroller.offsetWidth, behavior: "instant" });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }

    scroller.scrollTo({ left: 0, behavior: "auto" });
  }, []);

  const closeDrawer = useCallback(() => {
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    if (!drawer?.open || !scroller) return;
    scroller.scrollTo({ left: scroller.offsetWidth, behavior: "auto" });
  }, []);

  // 路由变化时收起移动端抽屉与展开的内联搜索栏
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname 变化时收起浮层
  useEffect(() => {
    setMobileSearchOpen(false);
    const drawer = drawerRef.current;
    if (drawer?.open) {
      drawer.close();
      setDrawerOpen(false);
    }
  }, [pathname]);

  // 原生 <dialog> 滑动抽屉：IntersectionObserver 状态同步 + 无 animation-timeline 时的 backdrop 回退
  useEffect(() => {
    if (isIsland) return;
    const drawer = drawerRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    const visibleThreshold = 1 / Math.max(window.innerWidth, 320);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry) return;
        if (entry.intersectionRatio < visibleThreshold) {
          if (drawer.open) drawer.close();
          setDrawerOpen(false);
        } else if (entry.intersectionRatio >= 0.99) {
          setDrawerOpen(true);
        }
      },
      { root: drawer, threshold: [visibleThreshold, 0.99] },
    );
    observer.observe(sheet);

    const handleBackdropClick = (event: MouseEvent) => {
      if (!sheet.contains(event.target as Node)) {
        closeDrawer();
      }
    };

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeDrawer();
      }
    };

    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: scroll()");

    const handleScrollFallback = () => {
      const width = sheet.offsetWidth || 1;
      const ratio = Math.max(0, Math.min(1, 1 - scroller.scrollLeft / width));
      drawer.style.setProperty("--drawer-backdrop", String(ratio));
    };

    drawer.addEventListener("click", handleBackdropClick);
    drawer.addEventListener("cancel", handleCancel);
    if (!supportsScrollTimeline) {
      scroller.addEventListener("scroll", handleScrollFallback, {
        passive: true,
      });
    }

    return () => {
      observer.disconnect();
      drawer.removeEventListener("click", handleBackdropClick);
      drawer.removeEventListener("cancel", handleCancel);
      if (!supportsScrollTimeline) {
        scroller.removeEventListener("scroll", handleScrollFallback);
      }
    };
  }, [isIsland, closeDrawer]);

  if (isIsland) {
    return (
      <>
        <IslandFloatingBar />
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      {/* 全端统一固定顶栏（fixed 钉死视口顶部，不随页面顶底弹性回弹） */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-30 overscroll-none border-b border-border bg-bg/95 px-4 backdrop-blur-sm sm:px-6 md:px-10 lg:px-12"
      >
        <div className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between gap-4 lg:h-[64px]">
          <Link
            href="/"
            className="inline-flex min-h-11 shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-fg lg:min-h-9"
          >
            <BrandQMark className="size-[18px] shrink-0 lg:size-[20px]" />
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-border-strong sm:block"
            />
            <span>{siteConfig.name}</span>
          </Link>

          {/* 桌面端横向主导航 */}
          <nav aria-label={dict.nav.menu} className="hidden lg:block">
            <NavLinkList pathname={pathname} orientation="horizontal" />
          </nav>

          {/* 桌面端右侧操作：Connect + 中/EN */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={openConnectDialog}
              aria-haspopup="dialog"
              className="inline-flex h-9 items-center justify-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg transition-colors hover:bg-surface"
            >
              {dict.nav.connect}
            </button>
            <LanguageToggle variant="compact" />
          </div>

          {/* 移动端与平板端右侧操作：内联搜索 + 菜单抽屉 */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label={
                mobileSearchOpen
                  ? dict.nav.collapseSearch
                  : dict.nav.expandSearch
              }
              aria-expanded={mobileSearchOpen}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border transition-colors ${
                mobileSearchOpen
                  ? "border-fg bg-ink text-ink-fg"
                  : "border-border text-fg hover:border-border-strong hover:bg-surface"
              }`}
            >
              {mobileSearchOpen ? (
                <CloseIcon className="size-3.5" />
              ) : (
                <SearchIcon className="size-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => void openDrawer()}
              aria-expanded={drawerOpen}
              aria-controls="mobile-editorial-drawer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-4 text-caption font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface"
            >
              {dict.nav.menu}
            </button>
          </div>
        </div>

        {/* 移动端内联搜索条（贴顶展开，下拉结果锚定在正下方） */}
        {mobileSearchOpen ? (
          <div className="-mx-4 border-t border-border px-4 py-3 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:hidden">
            <SearchPill
              autoFocus
              align="left"
              className="max-w-none"
              onNavigate={() => setMobileSearchOpen(false)}
            />
          </div>
        ) : null}
      </header>

      {/* 移动端原生 <dialog> 侧滑抽屉 */}
      <dialog
        ref={drawerRef}
        id="mobile-editorial-drawer"
        aria-label={dict.nav.menu}
        className="editorial-drawer lg:hidden"
      >
        <div ref={scrollerRef} className="editorial-drawer-scroller">
          <nav
            ref={sheetRef}
            aria-label={dict.nav.menu}
            className="editorial-drawer-sheet px-6 py-6"
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-fg"
                >
                  <BrandQMark className="size-5 shrink-0" />
                  <span
                    aria-hidden="true"
                    className="h-4 w-px bg-border-strong"
                  />
                  <span>{siteConfig.name}</span>
                </Link>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label={dict.nav.closeMenu}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-fg-secondary transition-colors hover:text-fg"
                >
                  <CloseIcon className="size-4" />
                </button>
              </div>

              <NavLinkList pathname={pathname} onNavigate={closeDrawer} />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  openConnectDialog();
                }}
                aria-haspopup="dialog"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg transition-colors hover:bg-surface"
              >
                {dict.nav.connect}
              </button>
              <LanguageToggle variant="compact" />
            </div>
          </nav>
        </div>
      </dialog>

      {/* 全宽居中主画布区（预留固定顶栏高度，避免内容被遮挡） */}
      <div className="flex min-w-0 flex-1 flex-col pt-[60px] lg:pt-[64px]">
        {children}
      </div>
    </div>
  );
}
