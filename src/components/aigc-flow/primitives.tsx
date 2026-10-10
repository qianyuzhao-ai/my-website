import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function CaseCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`case-card ${className}`}>{children}</div>;
}

export function SectionHead({
  id,
  eyebrow,
  heading,
}: {
  id: string;
  eyebrow: string;
  heading: string;
}) {
  return (
    <header className="case-section-head">
      <p className="case-eyebrow text-fg-muted">{eyebrow}</p>
      <h2 id={id} className="case-heading font-serif font-bold">
        {heading}
      </h2>
    </header>
  );
}

export function CaseLink({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  const content = (
    <>
      {children}
      <CaseSvg name="arrow" width={16} height={16} />
    </>
  );
  if (!href)
    return (
      <span className="case-link text-fg-muted" title="链接待提供">
        {content}
        <span className="sr-only">（链接待提供）</span>
      </span>
    );
  return (
    <Link href={href} className="case-link hover:border-fg-muted">
      {content}
    </Link>
  );
}

export function CaseSvg({
  name,
  width,
  height,
}: {
  name: "arrow" | "timeline-imgdot" | "timeline-imgdot1";
  width: number;
  height: number;
}) {
  return (
    <span className="inline-flex shrink-0">
      <Image
        src={`/images/aigc-flow/${name}.svg`}
        alt=""
        width={width}
        height={height}
        unoptimized
        className="dark:hidden"
      />
      <Image
        src={`/images/aigc-flow/${name}-dark.svg`}
        alt=""
        width={width}
        height={height}
        unoptimized
        className="hidden dark:block"
      />
    </span>
  );
}

export function Metrics({
  items,
}: {
  items: readonly { value: string; unit: string; label: string }[];
}) {
  return (
    <dl className="case-metrics">
      {items.map((item) => (
        <CaseCard className="case-metric" key={item.label}>
          <dd className="flex items-baseline gap-1.5">
            <span
              className="case-number font-serif font-bold"
              data-count={item.value}
            >
              {item.value}
            </span>
            <span className="font-serif text-case-title font-semibold">
              {item.unit}
            </span>
          </dd>
          <dt className="text-case-small text-fg-muted">{item.label}</dt>
        </CaseCard>
      ))}
    </dl>
  );
}

export function ArtFrame({
  children,
  tone = "yellow",
  label,
  hero = false,
}: {
  children: ReactNode;
  tone?: "blue" | "yellow" | "pink" | "mint";
  label: string;
  hero?: boolean;
}) {
  return (
    <figure
      className={`case-art case-tone-${tone} ${hero ? "case-hero-art" : ""}`}
    >
      <div className="case-art-viewport" aria-hidden="true">
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
