"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  type SceneKind,
  sceneTimeline,
} from "@/components/aigc-flow/scene-timelines";
import { Button } from "@/components/ui/button";

type Step = { title: string; desc: string };
type Props = {
  kind: SceneKind;
  steps: readonly Step[];
  children: ReactNode;
  reverse?: boolean;
};

export function CaseScene({ kind, steps, children, reverse = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(steps.length - 1);
  const [pinned, setPinned] = useState(false);
  const [saved, setSaved] = useState(false);
  const count = steps.length;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 900px) and (min-height: 700px)",
        reduced: "(prefers-reduced-motion: reduce)",
        always: "(min-width: 0px)",
      },
      (context) => {
        const animate =
          context.conditions?.desktop && !context.conditions?.reduced;
        setPinned(Boolean(animate));
        if (!animate) return;
        element.dataset.pinned = "true";
        const timeline = sceneTimeline(element, kind, count);
        let previous = -1;
        trigger.current = ScrollTrigger.create({
          trigger: element,
          animation: timeline,
          pin: true,
          scrub: true,
          start: () =>
            `top ${Math.max(24, (window.innerHeight - element.offsetHeight) / 2)}px`,
          end: () => `+=${window.innerHeight * count * 0.8}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(count - 1, Math.floor(self.progress * count));
            if (next !== previous) {
              previous = next;
              setActive(next);
              setSaved(false);
            }
          },
        });
        return () => {
          trigger.current = null;
          delete element.dataset.pinned;
        };
      },
      element,
    );
    return () => media.revert();
  }, [count, kind]);

  function selectStep(index: number) {
    const current = trigger.current;
    if (current) {
      current.scroll(
        current.start +
          ((index + 0.75) / count) * (current.end - current.start),
      );
      current.update();
    }
    setActive(index);
    setSaved(false);
  }

  return (
    <div
      ref={root}
      className={`case-pair case-scene ${reverse ? "case-scene-reverse" : ""}`}
      data-scene={kind}
      data-saved={saved || undefined}
    >
      {children}
      <div className="case-card case-steps">
        <div>
          <p className="case-step-count case-eyebrow text-accent">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <ol className="case-step-list">
            {steps.map((step, index) => (
              <li
                className="case-step"
                key={step.title}
                data-active={active === index}
              >
                <h3>
                  <button
                    type="button"
                    className="case-step-button"
                    onClick={() => selectStep(index)}
                    aria-expanded={!pinned || active === index}
                    aria-controls={`${kind}-step-${index}`}
                  >
                    <span className="case-step-number case-eyebrow">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="case-step-title font-serif">
                      {step.title}
                    </span>
                  </button>
                  <span className="case-step-static">
                    <span className="case-step-number case-eyebrow">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="case-step-title font-serif">
                      {step.title}
                    </span>
                  </span>
                </h3>
                <p
                  id={`${kind}-step-${index}`}
                  className="case-step-description"
                >
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
        {kind === "tabs" ? (
          <div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setSaved(!saved)}
            >
              {saved ? "重新演示保存失败" : "演示重试保存"}
            </Button>
            <p aria-live="polite" className="mt-2 text-caption text-fg-muted">
              {saved
                ? "保存成功，播客 S04 标签已关闭。"
                : "示意：保存失败后，先重试再关闭标签。"}
            </p>
          </div>
        ) : null}
        <p className="case-scroll-hint">
          <span className="case-eyebrow text-accent">SCROLL</span>
          滚动探索，也可以点击步骤
        </p>
      </div>
    </div>
  );
}
