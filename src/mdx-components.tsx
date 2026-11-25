import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { ReactNode } from "react";
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

export function Figure({
  alt,
  caption,
  src,
  width = 1280,
  height = 720,
}: FigureProps) {
  return (
    <figure className="my-3 flex w-full flex-col gap-3">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 72rem) 720px, (min-width: 48rem) 82vw, 100vw"
          className="w-full rounded-lg border border-border"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="lab-grid flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-surface-elevated px-6 text-center"
        >
          <span className="max-w-[40ch] text-label text-fg-muted">{alt}</span>
        </div>
      )}
      {caption ? (
        <figcaption className="text-label text-fg-muted">{caption}</figcaption>
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
        className="mt-8 max-w-[65ch] scroll-mt-24 font-serif text-title font-bold tracking-[-0.02em] text-fg focus:outline-none"
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
        className="mt-5 max-w-[65ch] scroll-mt-24 font-serif text-[1.25rem] leading-[1.4] font-semibold tracking-[-0.01em] text-fg focus:outline-none"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: (props) => (
    <p className="max-w-[65ch] leading-[1.82] text-fg" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent underline decoration-accent/40 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-accent"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-2 max-w-[65ch] border-l-[3px] border-accent bg-surface-elevated py-3.5 pr-5 pl-5 font-serif text-fg"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="flex max-w-[65ch] flex-col gap-2.5" {...props} />
  ),
  ol: (props) => (
    <ol
      className="flex max-w-[65ch] list-decimal flex-col gap-2.5 pl-6 marker:font-medium marker:tabular-nums marker:text-accent"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="relative pl-5 in-[ol]:pl-0 before:absolute before:top-[0.72em] before:left-0 before:h-px before:w-2.5 before:bg-accent before:content-[''] in-[ol]:before:hidden"
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
  code: (props) => (
    <code
      className="rounded-sm border border-border bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.875em] text-fg"
      {...props}
    />
  ),
  hr: () => <hr className="my-4 max-w-[65ch] border-border" />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
