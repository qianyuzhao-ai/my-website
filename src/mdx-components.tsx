// MDX 正文的全局样式映射：移动端 16/28，md 起 17/30；正文列宽由文章页控制。

import type { MDXComponents } from "mdx/types";
import Image from "next/image";

type FigureProps = {
  alt: string;
  caption?: string;
  /** public 下的图片路径；不填时显示 16:9 占位 */
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
    <figure className="flex flex-col items-center gap-2.5">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 72rem) 640px, (min-width: 48rem) 80vw, 100vw"
          className="w-full rounded-3xl"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="aspect-video w-full rounded-3xl bg-pill"
        />
      )}
      {caption ? (
        <figcaption className="text-case-small text-fg-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-3 font-serif text-case-title font-bold md:text-post-heading"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-2 font-serif text-case-title font-semibold" {...props} />
  ),
  p: (props) => <p {...props} />,
  a: (props) => (
    <a
      className="underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-[3px] border-accent py-1 pl-5 text-fg-muted"
      {...props}
    />
  ),
  ul: (props) => <ul className="flex flex-col gap-2" {...props} />,
  ol: (props) => (
    <ol
      className="flex list-decimal flex-col gap-2 pl-6 marker:text-accent"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="relative pl-6 in-[ol]:pl-0 before:absolute before:left-0 before:text-accent before:content-['•'] in-[ol]:before:hidden"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-2xl bg-pill px-5 py-4 font-mono text-code [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-sm bg-pill px-1 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  hr: () => <hr className="border-border" />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
