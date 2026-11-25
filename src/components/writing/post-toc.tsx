"use client";

import { useEffect, useRef, useState } from "react";
import type { PostHeading } from "@/lib/post-shared";

export function PostToc({
  headings,
  variant,
}: {
  headings: PostHeading[];
  variant: "mobile" | "desktop";
}) {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [usesNativeScrollspy, setUsesNativeScrollspy] = useState(false);

  useEffect(() => {
    if (variant !== "desktop" || headings.length === 0) return;

    const supportsNative =
      typeof CSS !== "undefined" && CSS.supports("scroll-target-group", "auto");

    if (supportsNative) {
      setUsesNativeScrollspy(true);
      let rafId = 0;
      const syncAriaCurrent = () => {
        const nav = navRef.current;
        if (!nav) return;
        const currentLink = nav.querySelector("a:target-current");
        for (const link of nav.querySelectorAll("a")) {
          const isCurrent = link === currentLink;
          link.setAttribute("aria-current", isCurrent ? "true" : "false");
          link.classList.toggle("target-current", isCurrent);
        }
      };

      const onScroll = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(syncAriaCurrent);
      };

      syncAriaCurrent();
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("scrollend", syncAriaCurrent, {
        passive: true,
      });
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("scrollend", syncAriaCurrent);
      };
    }

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [headings, variant]);

  if (headings.length === 0) return null;

  if (variant === "mobile") {
    return (
      <details className="writing-toc-details border-y border-border bg-surface-elevated/60 lg:hidden">
        <summary className="flex min-h-12 items-center gap-2.5 px-4 text-label font-medium text-fg">
          <span>章节目录</span>
          <span className="tabular-nums text-fg-muted">
            ({headings.length})
          </span>
        </summary>
        <nav
          aria-label="移动端文章目录"
          className="border-t border-border px-4 py-3"
        >
          <ul className="flex flex-col gap-1">
            {headings.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-4" : undefined}
              >
                <a
                  href={`#${item.id}`}
                  className="block py-1.5 text-label text-fg-muted transition-colors duration-150 hover:text-accent"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    );
  }

  return (
    <div>
      <p className="text-label font-semibold text-fg">章节目录</p>
      <nav
        ref={navRef}
        aria-label="文章章节目录"
        className="writing-toc-nav mt-3"
      >
        <ul className="flex flex-col border-l border-border">
          {headings.map((item) => {
            const active = !usesNativeScrollspy && item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={`writing-toc-link -ml-px block border-l-2 border-transparent py-1.5 text-label text-fg-muted transition-[color,border-color] duration-150 hover:text-fg ${
                    item.level === 3 ? "pl-6" : "pl-3.5"
                  } ${active ? "target-current" : ""}`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
