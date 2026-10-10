import { ArrowIcon } from "@/components/home/icons";

type ProjectLinkProps = {
  name: string;
  href?: string;
};

/**
 * 卡片左下角的项目入口：默认圆形箭头，悬停或键盘聚焦时展开为项目名胶囊。
 * 有链接时整张卡片可点击（触控友好）；链接待提供时仅展示。
 */
export function ProjectLink({ name, href }: ProjectLinkProps) {
  const content = (
    <>
      <ArrowIcon className="size-4 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-focus-within:max-w-40 group-focus-within:opacity-100 group-hover:max-w-40 group-hover:opacity-100">
        {name}
      </span>
    </>
  );
  const className =
    "absolute bottom-4 left-4 flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-[9px] text-label font-medium text-fg group-hover:pr-4 group-focus-within:pr-4";

  if (!href) {
    return (
      <span className={className} title="链接待提供">
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      draggable={false}
      target="_blank"
      rel="noreferrer"
      className={`${className} after:absolute after:inset-[-100vmax] focus-visible:outline-offset-2`}
    >
      {content}
      <span className="sr-only">（在新标签页打开）</span>
    </a>
  );
}
