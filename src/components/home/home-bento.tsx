"use client";

import { type CSSProperties, type ReactNode, useState } from "react";
import { flushSync } from "react-dom";
import {
  type CardId,
  type CategoryId,
  cardSizes,
  categories,
  desktopPlacement,
  highlighted,
  links,
  mobileOrder,
} from "@/lib/home-cards";

const sizeClasses = {
  square: "",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
} as const;

const span = {
  square: [1, 1],
  wide: [2, 1],
  tall: [1, 2],
} as const;

type HomeBentoProps = {
  cards: Record<CardId, ReactNode>;
};

export function HomeBento({ cards }: HomeBentoProps) {
  const [category, setCategory] = useState<CategoryId>("all");
  const active = highlighted[category];
  const label = categories.find((item) => item.id === category)?.label;

  function select(next: CategoryId) {
    if (next === category) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!document.startViewTransition || reduceMotion) {
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
          <ul className="flex h-[52px] w-full rounded-full border border-border bg-nav-track p-1 md:h-11 md:w-[300px]">
            {categories.map((item) => (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  aria-pressed={category === item.id}
                  onClick={() => select(item.id)}
                  className="h-11 w-full rounded-full text-label font-medium transition-colors aria-pressed:bg-nav-selected md:h-9"
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
        <div className="@container mx-auto max-w-[1168px]">
          <div className="grid grid-cols-1 gap-3 md:grid-flow-dense md:auto-rows-[minmax(calc((100cqw_-_16px)/2),auto)] md:grid-cols-2 md:gap-4 lg:auto-rows-[minmax(calc((100cqw_-_48px)/4),auto)] lg:grid-cols-4">
            {mobileOrder(category).map((id) => {
              const size = cardSizes[id];
              const [col, row] = desktopPlacement[category][id];
              const [w, h] = span[size];
              return (
                <div
                  key={id}
                  className={`${sizeClasses[size]} transition-opacity duration-300 lg:[grid-column:var(--col)] lg:[grid-row:var(--row)] ${active.includes(id) ? "" : "opacity-[0.22]"}`}
                  style={
                    {
                      "--col": `${col} / span ${w}`,
                      "--row": `${row} / span ${h}`,
                      viewTransitionName: `card-${id}`,
                    } as CSSProperties
                  }
                >
                  {cards[id]}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
