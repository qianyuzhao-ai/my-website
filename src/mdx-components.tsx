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
    <figure className="my-2 flex flex-col items-center gap-3">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 72rem) 680px, (min-width: 48rem) 80vw, 100vw"
          className="w-full rounded-2xl border border-border"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="lab-grid flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-surface-elevated px-6 text-center font-mono text-caption text-fg-muted"
        >
          <span>
            [ ILLUSTRATION {"//"} {alt} ]
          </span>
        </div>
      )}
      {caption ? (
        <figcaption className="font-mono text-caption text-fg-muted">
          {caption}
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
        className="mt-6 scroll-mt-24 font-serif text-title font-bold tracking-tight text-fg md:text-post-heading"
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
        className="mt-4 scroll-mt-24 font-serif text-case-title font-semibold text-fg"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: (props) => <p className="leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="underline decoration-accent decoration-1.5 underline-offset-4 transition-colors hover:text-accent"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="rounded-r-xl border-l-[3px] border-accent bg-surface-elevated/55 py-3 pr-4 pl-5 font-serif text-fg italic"
      {...props}
    />
  ),
  ul: (props) => <ul className="flex flex-col gap-2.5" {...props} />,
  ol: (props) => (
    <ol
      className="flex list-decimal flex-col gap-2.5 pl-6 marker:font-mono marker:text-accent"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="relative pl-6 in-[ol]:pl-0 before:absolute before:left-0 before:text-accent before:content-['◆'] before:text-[0.65em] before:top-[0.45em] in-[ol]:before:hidden"
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
  code: (props) => (
    <code
      className="rounded-sm border border-border bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.88em]"
      {...props}
    />
  ),
  hr: () => <hr className="my-2 border-border" />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
