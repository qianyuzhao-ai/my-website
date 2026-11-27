import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ReactNode } from "react";
import { MobileOrderDiagramArt } from "@/components/editorial/wireframe-art";
import { CodeBlock } from "@/components/writing/code-block";
import { slugifyHeading } from "@/lib/heading-slug";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}

type FigureProps = {
  alt: string;
  caption?: string;
  src?: string;
  width?: number;
  height?: number;
};

/** 0px 直角平面配图容器 + 1px 细线等宽图注栏（严格对齐 Figma FIG 01） */
export function Figure({
  alt,
  caption,
  src,
  width = 1280,
  height = 720,
}: FigureProps) {
  return (
    <figure className="my-3 w-full bg-surface">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 72rem) 760px, (min-width: 48rem) 82vw, 100vw"
          className="w-full"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex min-h-[180px] w-full items-center justify-center px-5 py-7 sm:min-h-[210px]"
        >
          <MobileOrderDiagramArt className="h-auto w-full max-w-[600px]" />
        </div>
      )}
      {caption ? (
        <figcaption className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-micro text-fg-muted sm:px-5">
          <span>{caption}</span>
          <span className="shrink-0 font-mono tracking-wider uppercase">
            FIG 01
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}

const components: MDXComponents = {
  h2: ({ children, id, ...props }) => {
    const resolvedId = id ?? slugifyHeading(extractText(children));
    return (
      <h2
        id={resolvedId}
        tabIndex={-1}
        className="mt-6 scroll-mt-24 text-[21px] leading-[1.35] font-bold tracking-[-0.015em] text-fg focus:outline-none md:text-[24px]"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, id, ...props }) => {
    const resolvedId = id ?? slugifyHeading(extractText(children));
    return (
      <h3
        id={resolvedId}
        tabIndex={-1}
        className="mt-4 scroll-mt-24 text-[18px] leading-[1.4] font-semibold tracking-[-0.01em] text-fg focus:outline-none"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: (props) => <p className="leading-[1.84] text-fg-secondary" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-fg underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:decoration-fg"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-2 border-l-2 border-fg py-1 pl-5 text-[17px] leading-[1.7] font-medium text-fg [&>p]:text-fg"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="flex flex-col gap-3 text-fg-secondary" {...props} />
  ),
  ol: (props) => (
    <ol
      className="flex list-decimal flex-col gap-3 pl-6 text-fg-secondary marker:font-mono marker:font-medium marker:tabular-nums marker:text-fg-muted"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="relative pl-6 in-[ol]:pl-0 before:absolute before:top-0 before:left-0 before:font-mono before:text-fg-muted before:content-['—'] in-[ol]:before:hidden"
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
  code: (props) => (
    <code
      className="border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.875em] text-fg"
      {...props}
    />
  ),
  hr: () => <hr className="my-4 border-border" />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
