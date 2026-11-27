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
        const links = nav.querySelectorAll("a");
        const matched = nav.querySelector("a:target-current");
        const currentLink = matched ?? (window.scrollY < 40 ? links[0] : null);
        for (const link of links) {
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
      <details className="writing-toc-details overflow-hidden rounded-[22px] border border-border bg-bg xl:hidden">
        <summary className="flex min-h-11 items-center gap-2 px-4 text-caption font-medium text-fg">
          <span>On this page</span>
          <span className="font-mono text-micro text-fg-muted tabular-nums">
            · {headings.length} sections
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
                  className="block py-1.5 text-label text-fg-secondary transition-colors hover:text-fg"
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
    <div className="border-t border-border pt-6">
      <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
        ON THIS PAGE
      </p>
      <nav
        ref={navRef}
        aria-label="文章章节目录"
        className="writing-toc-nav mt-3"
      >
        <ul className="flex flex-col gap-1 border-l border-border">
          {headings.map((item) => {
            const active = !usesNativeScrollspy && item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "true" : undefined}
                  className={`writing-toc-link -ml-px block border-l-[1.5px] border-transparent py-1 text-caption text-fg-muted transition-colors hover:text-fg ${
                    item.level === 3 ? "pl-5" : "pl-3"
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
