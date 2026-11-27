import type { Metadata } from "next";
import Link from "next/link";
import {
  AgentWorkflowArt,
  ArchitectureLayersArt,
  OpenFlowIsometricArt,
  StoryboardGridArt,
} from "@/components/editorial/wireframe-art";
import { SearchPill } from "@/components/site/search-dialog";
import { SiteFooter } from "@/components/site/site-footer";
import { getDictionary, type WorkCardEntry } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.worksTitle,
    description: dict.meta.worksDescription,
  };
}

function WorkArtwork({ work }: { work: WorkCardEntry }) {
  if (work.id === "openflow") {
    return <OpenFlowIsometricArt className="h-auto w-full max-w-[320px]" />;
  }
  if (work.id === "aigc-storyboard-studio") {
    return <StoryboardGridArt className="h-auto w-full max-w-[300px]" />;
  }
  if (work.id === "agentic-design-compiler") {
    return <AgentWorkflowArt className="h-auto w-full max-w-[300px]" />;
  }
  return <ArchitectureLayersArt className="h-auto w-full max-w-[300px]" />;
}

export default async function WorksPage() {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <main
        id="main"
        className="flex-1 px-4 pt-6 sm:px-6 md:px-10 md:pt-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1120px] flex-col gap-12 md:gap-14">
          {/* 页面刊头 */}
          <header className="flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                {dict.works.eyebrow}
              </p>
              <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.025em] text-fg md:text-[42px] md:leading-[1.12]">
                {dict.works.title}
              </h1>
              <p className="mt-1 max-w-[56ch] text-pretty text-label leading-relaxed text-fg-secondary md:text-[15px]">
                {dict.works.description}
              </p>
            </div>
            <SearchPill className="hidden lg:block" />
          </header>

          {/* 01 · Selected Systems 3 列展廊 */}
          <section
            aria-labelledby="selected-works-heading"
            className="flex flex-col gap-6"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="selected-works-heading"
                className="text-[22px] font-semibold tracking-[-0.02em] text-fg md:text-[26px]"
              >
                {dict.works.selectedHeading}
              </h2>
              <span className="font-mono text-micro text-fg-muted">
                {dict.works.items.length} {dict.works.itemsUnit}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
              {dict.works.items.map((work) => {
                const cardBody = (
                  <>
                    <div className="flex items-center justify-between gap-2 font-mono text-micro text-fg-muted">
                      <span className="font-medium text-fg">
                        {work.index} · {work.kind.toUpperCase()}
                      </span>
                      <span className="tabular-nums">{work.year}</span>
                    </div>

                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-surface px-4 py-3 transition-colors group-hover:bg-surface-recessed">
                      <WorkArtwork work={work} />
                    </div>

                    <h3
                      className={`flex items-center justify-between gap-2 text-case-title font-bold tracking-[-0.01em] text-fg ${
                        work.href
                          ? "underline-offset-4 group-hover:underline"
                          : ""
                      }`}
                    >
                      <span>{work.title}</span>
                      {work.href ? (
                        <span
                          aria-hidden="true"
                          className="font-mono text-caption font-normal text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                        >
                          →
                        </span>
                      ) : null}
                    </h3>

                    <p className="line-clamp-3 text-label leading-[1.6] text-fg-secondary">
                      {work.summary}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3 font-mono text-micro text-fg-muted">
                      {work.metrics.map((m) => (
                        <span key={m.label}>
                          {m.label}:{" "}
                          <strong className="text-fg">{m.value}</strong>
                        </span>
                      ))}
                    </div>
                  </>
                );

                return work.href ? (
                  <Link
                    key={work.id}
                    href={work.href}
                    className="group flex flex-col gap-3"
                  >
                    {cardBody}
                  </Link>
                ) : (
                  <article key={work.id} className="flex flex-col gap-3">
                    {cardBody}
                  </article>
                );
              })}
            </div>
          </section>

          {/* 02 · 3D岛实验子页入口 */}
          <section
            aria-labelledby="sky-island-heading"
            className="flex flex-col gap-5 bg-surface p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:px-10"
          >
            <div className="flex flex-col gap-2">
              <p className="font-mono text-micro font-medium tracking-widest text-fg-muted uppercase">
                02 {"//"} {dict.works.islandEyebrow}
              </p>
              <h2
                id="sky-island-heading"
                className="text-[20px] font-semibold tracking-[-0.02em] text-fg md:text-[24px]"
              >
                {dict.works.islandTitle}
              </h2>
              <p className="max-w-[54ch] text-label text-fg-secondary">
                {dict.works.islandDesc}
              </p>
            </div>

            <Link
              href="/island"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg px-5 text-caption font-medium text-fg transition-colors hover:bg-surface-recessed md:min-h-9 md:w-auto"
            >
              {dict.works.islandCta}
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
