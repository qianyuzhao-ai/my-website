"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DualModeConsole } from "@/components/home/dual-mode-console";
import { ArrowRightIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";
import { siteConfig } from "@/lib/site-config";

export function EditorialHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="px-4 pt-6 pb-14 sm:px-6 md:px-8 md:pt-24 md:pb-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* 杂志刊头细线标尺 */}
        <div
          data-hero-reveal
          className="flex flex-wrap items-center justify-between gap-2 border-y border-border py-2.5 font-mono text-micro tracking-widest text-fg-muted uppercase"
        >
          <span>{siteConfig.issue}</span>
          <span className="hidden sm:inline">{siteConfig.statusText}</span>
          <span>{siteConfig.location}</span>
        </div>

        {/* 主视觉大字宣言 */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p
              data-hero-reveal
              className="font-mono text-caption tracking-wider text-accent uppercase"
            >
              {siteConfig.name} — {siteConfig.role}
            </p>
            <h1
              data-hero-reveal
              className="mt-3 font-serif text-hero font-bold tracking-tight text-fg"
            >
              Code the <em className="font-normal text-accent italic">Logic</em>
              ,
              <br />
              Sculpt the{" "}
              <em className="font-normal italic underline decoration-border-strong decoration-2 underline-offset-8">
                Latent
              </em>
              .
            </h1>
          </div>

          <div
            data-hero-reveal
            className="flex flex-col gap-5 lg:col-span-4 lg:pb-2"
          >
            <p className="text-body text-fg">
              我是{" "}
              <strong className="font-serif font-bold">
                {siteConfig.name}
              </strong>
              ，{siteConfig.tagline}
            </p>
            <p className="text-label text-fg-muted">{siteConfig.bio}</p>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="#selected-works"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-label font-medium text-bg transition-opacity hover:opacity-90"
              >
                <span>浏览造物展廊</span>
              </a>
              <Link
                href="/writing"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-label font-medium text-fg transition-colors hover:border-border-strong hover:bg-surface-elevated"
              >
                <span>阅读博客手记</span>
                <ArrowRightIcon className="size-4" />
              </Link>
              <button
                type="button"
                onClick={openConnectDialog}
                className="inline-flex min-h-11 items-center rounded-full px-3 font-mono text-caption text-fg-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent"
              >
                @Connect
              </button>
            </div>
          </div>
        </div>

        {/* 双模切换造物实验台 */}
        <div data-hero-reveal className="mt-9 lg:mt-12">
          <DualModeConsole />
        </div>
      </div>
    </section>
  );
}
