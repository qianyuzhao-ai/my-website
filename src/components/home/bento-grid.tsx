"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  type Layout,
  ReactGridLayout,
  useContainerWidth,
} from "react-grid-layout";
import {
  type CardId,
  type CategoryId,
  cardSizes,
  defaultOrder,
  desktopPlacement,
  type GridCols,
  type GridItem,
  highlighted,
  loadLayouts,
  mobileOrder,
  presetLayout,
  type SavedLayouts,
  saveLayouts,
} from "@/lib/home-cards";

const GAP = 16;
const MD = "(min-width: 48rem)";
const LG = "(min-width: 72rem)";

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

function subscribe(onChange: () => void) {
  const queries = [MD, LG].map((query) => window.matchMedia(query));
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

/** md 以下返回 0（不拖拽），md 为 2 列，lg 为 4 列 */
function getCols(): 0 | GridCols {
  if (window.matchMedia(LG).matches) return 4;
  if (window.matchMedia(MD).matches) return 2;
  return 0;
}

/** 卡片在视觉顺序（先行后列）中的位置，用于错峰入场 */
function visualIndex(layout: GridItem[], id: CardId) {
  const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  return sorted.findIndex((item) => item.i === id);
}

type BentoGridProps = {
  cards: Record<CardId, ReactNode>;
  category: CategoryId;
};

export function BentoGrid({ cards, category }: BentoGridProps) {
  const { width, containerRef, mounted } = useContainerWidth();
  const cols = useSyncExternalStore<0 | GridCols>(subscribe, getCols, () => 0);
  const [saved, setSaved] = useState<SavedLayouts>({});
  const [session, setSession] = useState<Record<string, GridItem[]>>({});
  const dragged = useRef(false);
  const [entered, setEntered] = useState(false);
  const active = highlighted[category];

  useEffect(() => {
    setSaved(loadLayouts());
    // 入场动画只播放一次；之后卡片节点移动或重挂载都不会再次淡入
    const timer = setTimeout(() => setEntered(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  function content(id: CardId, index: number) {
    return (
      <div
        className={`h-full transition-opacity duration-300 ${active.includes(id) ? "" : "opacity-[0.22]"}`}
      >
        <div
          className={`h-full ${entered ? "" : "card-enter"}`}
          style={{ "--i": index } as CSSProperties}
        >
          {cards[id]}
        </div>
      </div>
    );
  }

  // 拖拽结束时吞掉随之而来的 click，避免误触主题开关或项目链接
  function handleClickCapture(event: MouseEvent) {
    if (!dragged.current) return;
    dragged.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  if (!mounted || cols === 0) {
    return (
      <div ref={containerRef} className="@container mx-auto max-w-[1168px]">
        <div className="grid grid-cols-1 gap-3 md:grid-flow-dense md:auto-rows-[minmax(calc((100cqw_-_16px)/2),auto)] md:grid-cols-2 md:gap-4 lg:auto-rows-[minmax(calc((100cqw_-_48px)/4),auto)] lg:grid-cols-4">
          {mobileOrder(category).map((id, index) => {
            const size = cardSizes[id];
            const [col, row] = desktopPlacement[category][id];
            const [w, h] = span[size];
            return (
              <div
                key={id}
                className={`${sizeClasses[size]} lg:[grid-column:var(--col)] lg:[grid-row:var(--row)]`}
                style={
                  {
                    "--col": `${col} / span ${w}`,
                    "--row": `${row} / span ${h}`,
                    viewTransitionName: `card-${id}`,
                  } as CSSProperties
                }
              >
                {content(id, index)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const key = `${category}-${cols}`;
  const layout =
    (category === "all" ? saved[cols] : session[key]) ??
    presetLayout(category, cols);

  function handleDragStop(next: Layout) {
    const items = next.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }));
    const typed = items as GridItem[];
    if (category === "all") {
      const updated = { ...saved, [cols]: typed };
      setSaved(updated);
      saveLayouts(updated);
    } else {
      setSession((current) => ({ ...current, [key]: typed }));
    }
    // click 在 mouseup 之后同步派发，下一轮任务再复位
    setTimeout(() => {
      dragged.current = false;
    }, 0);
  }

  return (
    <div
      ref={containerRef}
      onClickCapture={handleClickCapture}
      className="mx-auto max-w-[1168px]"
    >
      <ReactGridLayout
        width={width}
        layout={layout}
        gridConfig={{
          cols,
          rowHeight: (width - GAP * (cols - 1)) / cols,
          margin: [GAP, GAP],
          containerPadding: [0, 0],
        }}
        dragConfig={{
          threshold: 4,
          cancel: "input, textarea, select, label, [data-no-drag]",
        }}
        resizeConfig={{ enabled: false }}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragStop={handleDragStop}
      >
        {/* 子节点顺序保持不变：移动 DOM 节点会让浏览器重新播放其中的动画 */}
        {defaultOrder.map((id) => (
          <div key={id}>{content(id, visualIndex(layout, id))}</div>
        ))}
      </ReactGridLayout>
    </div>
  );
}
