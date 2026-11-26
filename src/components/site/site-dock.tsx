"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  ArrowIcon,
  ArrowRightIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { siteConfig } from "@/lib/site-config";
import { skyAudio } from "@/lib/sky-audio";

const NAV_ROUTES = [
  {
    key: "works",
    href: "/works",
    index: "01",
    label: "作品",
    mobileTitle: "作品 · Works",
    subtitle: "代表作展廊与交互式双模实验台",
  },
  {
    key: "writing",
    href: "/writing",
    index: "02",
    label: "博客",
    mobileTitle: "博客 · Writing",
    subtitle: "AI Agent 工程与实战复盘归档",
  },
  {
    key: "about",
    href: "/about",
    index: "03",
    label: "关于",
    mobileTitle: "关于 · About",
    subtitle: "守岛人手记、近况与常用工具栈",
  },
] as const;

export function SiteDock() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const isHome = pathname === "/";

  // 路由切换时自动收起移动端下拉菜单
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname 变化时收起移动端菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 展开移动端菜单时，支持按 Escape 或点击外部区域关闭
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const header = headerRef.current;
      if (header && !header.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  function isRouteActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleToggleTheme() {
    const nextDark = resolvedTheme !== "dark";
    setTheme(nextDark ? "dark" : "light");
    if (isHome) {
      skyAudio.playShrineOpen();
      window.dispatchEvent(
        new CustomEvent("qianyu:theme-toast", {
          detail: nextDark
            ? "☾ 时之日晷：空岛入夜 · 随身提灯与萤火虫已点亮"
            : "☀ 时之日晷：晨光破晓 · 暖阳洒满黄金银杏林",
        }),
      );
    }
  }

  function handleToggleMute() {
    const next = !muted;
    setMuted(next);
    skyAudio.muted = next;
    if (!next) {
      skyAudio.playCookingChime();
    }
  }

  function handleOpenConnect() {
    setMenuOpen(false);
    if (isHome) {
      window.dispatchEvent(new CustomEvent("qianyu:glider-launch"));
    }
    openConnectDialog();
  }

  return (
    <header
      ref={headerRef}
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
      }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex flex-col items-center px-3 sm:px-5 md:pt-5"
    >
      <nav
        aria-label="主导航"
        className="glass-dock pointer-events-auto flex w-full max-w-[420px] items-center justify-between gap-1.5 rounded-full px-2 py-1.5 md:w-auto md:max-w-full md:justify-center md:gap-1.5"
      >
        {/* 1. 品牌标识：回首页 */}
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3 text-label font-bold tracking-tight whitespace-nowrap transition-colors md:px-3.5 ${
            isHome
              ? "bg-surface-recessed/80 text-fg"
              : "text-fg hover:bg-surface-recessed/70"
          }`}
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-signal-dot signal-dot"
          />
          <span>{siteConfig.name}</span>
        </Link>

        {/* 桌面端分割线 */}
        <span
          aria-hidden="true"
          className="hidden h-5 w-px shrink-0 bg-border/90 md:block"
        />

        {/* 2. 桌面端主导航链接：首页新标签打开，内页同标签切换 */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ROUTES.map((item) => {
            const active = !isHome && isRouteActive(item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  target={isHome ? "_blank" : undefined}
                  rel={isHome ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full px-3.5 text-label whitespace-nowrap transition-colors ${
                    active
                      ? "bg-ink font-semibold text-ink-fg shadow-xs"
                      : "font-medium text-fg-secondary hover:bg-surface-recessed/75 hover:text-fg"
                  }`}
                >
                  <span>{item.label}</span>
                  {isHome ? (
                    <ArrowIcon className="size-3 text-fg-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 桌面端分割线 */}
        <span
          aria-hidden="true"
          className="hidden h-5 w-px shrink-0 bg-border/90 md:block"
        />

        {/* 3. 右侧圆形工具按钮队列：邮件(联系) + 主题 + 首页音效 + 移动端菜单 */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenConnect}
            aria-label="打开联系面板"
            aria-haspopup="dialog"
            title="联系 QianYu"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors hover:bg-accent hover:text-white md:min-h-10 md:min-w-10"
          >
            <MailIcon className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="切换浅色与深色主题"
            title="切换浅色 / 深色主题"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-surface-recessed/70 text-fg-secondary transition-colors hover:bg-surface-recessed hover:text-fg md:min-h-10 md:min-w-10"
          >
            <SunIcon className="size-4.5 dark:hidden" />
            <MoonIcon className="hidden size-4.5 dark:block" />
          </button>

          {isHome ? (
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={muted ? "开启空岛音效" : "静音空岛音效"}
              aria-pressed={!muted}
              title={muted ? "开启空岛音效" : "静音空岛音效"}
              className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full transition-colors md:min-h-10 md:min-w-10 ${
                muted
                  ? "bg-surface-recessed/70 text-fg-muted hover:text-fg"
                  : "bg-signal-soft text-signal hover:opacity-85"
              }`}
            >
              {muted ? (
                <VolumeOffIcon className="size-4.5" />
              ) : (
                <VolumeOnIcon className="size-4.5" />
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full transition-colors md:hidden ${
              menuOpen
                ? "bg-ink text-ink-fg"
                : "bg-surface-recessed/80 text-fg hover:bg-surface-recessed"
            }`}
          >
            {menuOpen ? (
              <CloseIcon className="size-4" />
            ) : (
              <MenuIcon className="size-4.5" />
            )}
          </button>
        </div>
      </nav>

      {/* 移动端毛玻璃下拉导航面板（紧贴顶栏下方，零遮挡底部 3D 摇杆区） */}
      <div
        id="mobile-nav-drawer"
        hidden={!menuOpen}
        className="glass-panel pointer-events-auto mt-2.5 w-full max-w-[420px] rounded-[26px] p-3.5 md:hidden"
      >
        <ul className="flex flex-col gap-2">
          {NAV_ROUTES.map((item) => {
            const active = !isHome && isRouteActive(item.href);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  target={isHome ? "_blank" : undefined}
                  rel={isHome ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    active
                      ? "border-accent/40 bg-accent-soft/90"
                      : "border-border/80 bg-surface-elevated/75 hover:border-accent/45 hover:bg-surface-solid/95"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-micro font-bold ${
                          active ? "text-accent" : "text-fg-muted"
                        }`}
                      >
                        {item.index}
                      </span>
                      <span
                        className={`text-body font-bold tracking-tight ${
                          active ? "text-accent" : "text-fg"
                        }`}
                      >
                        {item.mobileTitle}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-caption text-fg-secondary">
                      {item.subtitle}
                    </p>
                  </div>

                  {isHome ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-recessed px-2.5 py-1 text-micro font-medium text-fg-muted">
                      <span>新标签</span>
                      <ArrowIcon className="size-3" />
                    </span>
                  ) : (
                    <ArrowRightIcon
                      className={`size-4 shrink-0 ${
                        active ? "text-accent" : "text-fg-muted"
                      }`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-center text-micro text-fg-muted">
          {isHome
            ? "首页点击任意栏目将在新标签页打开，当前 3D 进度保持不变"
            : "点击顶部 QianYu 可随时返回 3D 云上庭园首页"}
        </p>
      </div>
    </header>
  );
}
