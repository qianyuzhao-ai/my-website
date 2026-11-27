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
import { SearchIcon, SearchPill } from "@/components/site/search-dialog";
import { siteConfig } from "@/lib/site-config";
import { skyAudio } from "@/lib/sky-audio";

const PRIMARY_NAV = [
  { label: "首页", href: "/" },
  { label: "项目", href: "/works" },
  { label: "写作", href: "/writing" },
  { label: "关于", href: "/about" },
  { label: "3D岛", href: "/island" },
] as const;

function NavLinkList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  function isItemActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {PRIMARY_NAV.map((item) => {
        const active = isItemActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center text-label transition-colors lg:min-h-9 ${
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

/** 3D 空岛全屏页面的极简黑白悬浮返回与控制条 */
function IslandFloatingBar() {
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
        <span>返回 {siteConfig.name}</span>
      </Link>

      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-border bg-bg/92 p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label="切换昼夜主题"
          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-fg-secondary transition-colors hover:bg-surface hover:text-fg"
        >
          <SunIcon className="size-4 dark:hidden" />
          <MoonIcon className="hidden size-4 dark:block" />
        </button>
        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={muted ? "开启空岛音效" : "静音空岛音效"}
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
 * - 其余路由：桌面端左侧固定 220px 导航栏（首页 / 项目 / 写作 / 关于 / 3D岛）+ 移动端 60px 顶栏（内联搜索展开 + 滑动抽屉）。
 */
export function EditorialShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isIsland = pathname === "/island";

  const drawerRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    <div className="min-h-dvh bg-bg text-fg lg:flex">
      {/* 移动端与平板端顶部导航条（60px + 内联展开搜索，非弹窗） */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-[60px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-label font-semibold tracking-[-0.02em] text-fg"
          >
            <BrandQMark className="size-[18px] shrink-0" />
            <span>{siteConfig.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((prev) => !prev)}
              aria-label={mobileSearchOpen ? "收起搜索栏" : "展开搜索栏"}
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
              Menu
            </button>
          </div>
        </div>

        {/* 移动端内联搜索条（贴顶展开，下拉结果锚定在正下方） */}
        {mobileSearchOpen ? (
          <div className="border-t border-border px-4 py-3 sm:px-6">
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
        aria-label="主导航抽屉"
        className="editorial-drawer lg:hidden"
      >
        <div ref={scrollerRef} className="editorial-drawer-scroller">
          <nav
            ref={sheetRef}
            aria-label="移动端主导航"
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
                  aria-label="关闭导航菜单"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-fg-secondary transition-colors hover:text-fg"
                >
                  <CloseIcon className="size-4" />
                </button>
              </div>

              <NavLinkList pathname={pathname} onNavigate={closeDrawer} />
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  openConnectDialog();
                }}
                aria-haspopup="dialog"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-border-strong bg-bg px-4 text-caption font-medium text-fg transition-colors hover:bg-surface"
              >
                Connect
              </button>
            </div>
          </nav>
        </div>
      </dialog>

      {/* 桌面端固定 220px 左侧导航栏（首页 / 项目 / 写作 / 关于 / 3D岛） */}
      <aside
        aria-label="主侧边导航"
        className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[220px] lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:border-border lg:bg-bg lg:px-6 lg:py-7"
      >
        <div className="flex flex-col gap-9">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-fg"
          >
            <BrandQMark className="size-[22px] shrink-0" />
            <span aria-hidden="true" className="h-4 w-px bg-border-strong" />
            <span>{siteConfig.name}</span>
          </Link>

          <nav aria-label="桌面主导航">
            <NavLinkList pathname={pathname} />
          </nav>
        </div>

        <button
          type="button"
          onClick={openConnectDialog}
          aria-haspopup="dialog"
          className="inline-flex h-9 w-fit items-center justify-center rounded-full border border-border-strong bg-bg px-5 text-caption font-medium text-fg transition-colors hover:bg-surface"
        >
          Connect
        </button>
      </aside>

      {/* 右侧主画布区 */}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
