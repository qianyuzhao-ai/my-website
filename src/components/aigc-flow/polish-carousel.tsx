"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { polish } from "@/lib/aigc-flow";

export function PolishCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  useEffect(() => {
    const container = root.current,
      frame = viewport.current,
      rail = track.current;
    if (!container || !frame || !rail) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
      () => {
        frame.scrollLeft = 0;
        gsap.set(frame, { overflowX: "hidden" });
        const distance = () =>
          Math.max(0, rail.scrollWidth - frame.clientWidth);
        const tween = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: true,
            start: "top 20%",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });
        trigger.current = tween.scrollTrigger ?? null;
        return () => {
          trigger.current = null;
        };
      },
      container,
    );
    return () => media.revert();
  }, []);

  function move(direction: number) {
    if (trigger.current) {
      const current = trigger.current;
      current.scroll(
        Math.max(
          current.start,
          Math.min(current.end, current.scroll() + direction * 296),
        ),
      );
    } else {
      viewport.current?.scrollBy({
        left: direction * 284,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }
  return (
    <div ref={root} data-polish>
      <div ref={viewport} className="case-polish-viewport">
        <div ref={track} className="case-polish-track">
          {polish.map((item) => (
            <article className="case-card case-polish-card" key={item.title}>
              <p className="case-eyebrow text-accent">{item.tag}</p>
              <h3 className="font-serif text-case-title font-semibold">
                {item.title}
              </h3>
              <p className="text-case-small text-fg-muted">{item.problem}</p>
              <hr className="border-border" />
              <p className="case-eyebrow">改法</p>
              <p className="text-case-small">{item.fix}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="case-polish-hint">
        <span className="case-eyebrow text-fg-muted">SWIPE</span>
        <p className="flex-1 text-case-small text-fg-muted">
          左右滑动查看全部 8 条
        </p>
        <Button
          variant="secondary"
          size="lg"
          aria-label="上一条打磨记录"
          onClick={() => move(-1)}
        >
          ←
        </Button>
        <Button
          variant="secondary"
          size="lg"
          aria-label="下一条打磨记录"
          onClick={() => move(1)}
        >
          →
        </Button>
      </div>
    </div>
  );
}
