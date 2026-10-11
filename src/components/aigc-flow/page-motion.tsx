"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useEffect, useRef } from "react";

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(element.querySelector(".case-reading-progress"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true },
        });
        gsap.from(
          element.querySelectorAll('.case-hero-art [data-name="Canvas"] > div'),
          {
            y: 16,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          },
        );
        for (const number of element.querySelectorAll<HTMLElement>(
          "[data-count]",
        )) {
          const value = Number(number.dataset.count);
          const counter = { value: 0 };
          gsap.to(counter, {
            value,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: number, start: "top 95%", once: true },
            onUpdate: () => {
              number.textContent = String(Math.round(counter.value));
            },
          });
        }
        return () => {
          for (const number of element.querySelectorAll<HTMLElement>(
            "[data-count]",
          )) {
            number.textContent = number.dataset.count ?? "";
          }
        };
      },
      element,
    );
    media.add(
      "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
      () => {
        const eras = element.querySelector<HTMLElement>("[data-eras]");
        if (!eras) return;
        gsap.from(eras.children, {
          opacity: 0.35,
          stagger: 0.8,
          duration: 0.5,
          scrollTrigger: {
            trigger: eras,
            pin: true,
            start: "top 15%",
            end: () => `+=${window.innerHeight * 2.4}`,
            scrub: true,
          },
        });
      },
      element,
    );
    let mounted = true;
    void document.fonts.ready.then(() => {
      if (mounted) {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }
    });
    return () => {
      mounted = false;
      media.revert();
    };
  }, []);
  return (
    <div ref={root}>
      <div className="case-reading-progress" aria-hidden="true" />
      {children}
    </div>
  );
}
