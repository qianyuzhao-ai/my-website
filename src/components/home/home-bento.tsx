"use client";

import { type CSSProperties, type ReactNode, useState } from "react";
import { flushSync } from "react-dom";
import { BentoGrid } from "@/components/home/bento-grid";
import {
  type CardId,
  type CategoryId,
  categories,
  links,
} from "@/lib/home-cards";

type HomeBentoProps = {
  cards: Record<CardId, ReactNode>;
};

export function HomeBento({ cards }: HomeBentoProps) {
  const [category, setCategory] = useState<CategoryId>("all");
  const index = categories.findIndex((item) => item.id === category);
  const label = categories[index].label;

  function select(next: CategoryId) {
    if (next === category) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // md 及以上由拖拽网格的 transform 过渡负责位移，只在单列时使用 View Transitions
    const isGrid = window.matchMedia("(min-width: 48rem)").matches;
    if (!document.startViewTransition || reduceMotion || isGrid) {
      setCategory(next);
      return;
    }
    document.startViewTransition(() => flushSync(() => setCategory(next)));
  }

  return (
    <>
      <header className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-y-4 px-5 pt-[18px] pb-3 md:grid-cols-[1fr_auto_1fr] md:px-12 md:pt-10 md:pb-[46px]">
        <a
          href="/"
          className="logo-gradient justify-self-start font-serif text-logo font-bold"
        >
          nev
        </a>
        <nav
          aria-label="卡片分类"
          className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
        >
          <ul className="relative flex h-[52px] w-full rounded-full border border-border bg-nav-track p-1 md:h-11 md:w-[300px]">
            <li
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc((100%_-_8px)/4)] translate-x-(--x) rounded-full bg-nav-selected transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
              style={{ "--x": `${index * 100}%` } as CSSProperties}
            />
            {categories.map((item) => (
              <li key={item.id} className="relative flex-1">
                <button
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => select(item.id)}
                  className="h-11 w-full rounded-full text-label font-medium md:h-9"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {links.contact ? (
          <a
            href={links.contact}
            className="flex min-h-11 items-center justify-self-end text-label font-medium md:col-start-3"
          >
            Contact
          </a>
        ) : (
          <span
            title="联系方式待提供"
            className="justify-self-end text-label font-medium md:col-start-3"
          >
            Contact
          </span>
        )}
      </header>

      <main id="main" className="px-4 pb-16 md:px-6 md:pb-24 xl:px-0">
        <h1 className="sr-only">QianYu 的个人网站</h1>
        <p aria-live="polite" className="sr-only">
          {category === "all"
            ? "显示全部卡片"
            : `已突出显示 ${label} 相关卡片，其余卡片已淡化`}
        </p>
        <BentoGrid cards={cards} category={category} />
      </main>
    </>
  );
}
