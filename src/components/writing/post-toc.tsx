"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "@/lib/post-shared";

export function PostToc({
  headings,
  variant,
}: {
  headings: PostHeading[];
  variant: "mobile" | "desktop";
}) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

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
  }, [headings]);

  if (headings.length === 0) return null;

  if (variant === "mobile") {
    return (
      <details className="rounded-xl border border-border bg-surface-elevated/60 px-4 py-2 lg:hidden">
        <summary className="flex min-h-11 items-center justify-between font-mono text-caption font-medium text-fg">
          <span>ON THIS PAGE · 章节目录 ({headings.length})</span>
          <span className="text-fg-muted">+</span>
        </summary>
        <nav
          aria-label="移动端文章目录"
          className="border-t border-border py-3"
        >
          <ul className="flex flex-col gap-2">
            {headings.map((item) => (
              <li
                key={item.id}
                className={item.level === 3 ? "pl-4" : undefined}
              >
                <a
                  href={`#${item.id}`}
                  className="block py-1 text-label text-fg-muted transition-colors hover:text-accent"
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
    <aside aria-label="桌面端文章目录">
      <p className="font-mono text-micro tracking-widest text-fg-muted uppercase">
        ON THIS PAGE
      </p>
      <ul className="mt-3 flex flex-col gap-2 border-l border-border">
        {headings.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l-2 py-1 text-caption transition-colors ${
                  item.level === 3 ? "pl-6" : "pl-3.5"
                } ${
                  active
                    ? "border-accent font-medium text-fg"
                    : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
