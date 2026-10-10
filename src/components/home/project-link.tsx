import { ArrowIcon } from "@/components/home/icons";

type ProjectLinkProps = {
  name: string;
  href?: string;
};

/**
 * 卡片左下角的项目入口：桌面端默认圆形箭头，悬停卡片或键盘聚焦时展开为项目名胶囊；
 * 移动端无悬停，始终展开。只有这个按钮负责跳转，卡片其余区域可自由拖拽。
 */
export function ProjectLink({ name, href }: ProjectLinkProps) {
  const content = (
    <>
      <ArrowIcon className="size-4 shrink-0" />
      <span className="max-w-40 overflow-hidden whitespace-nowrap pl-2 transition-all duration-300 md:max-w-0 md:pl-0 md:opacity-0 md:group-focus-within:max-w-40 md:group-focus-within:pl-2 md:group-focus-within:opacity-100 md:group-hover:max-w-40 md:group-hover:pl-2 md:group-hover:opacity-100">
        {name}
      </span>
    </>
  );
  const className =
    "absolute bottom-4 left-4 flex h-9 items-center rounded-full border border-border bg-surface px-[9px] pr-4 text-label font-medium text-fg md:pr-[9px] md:group-focus-within:pr-4 md:group-hover:pr-4";

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
      className={`${className} transition-colors before:absolute before:-inset-1 hover:border-fg-muted focus-visible:outline-offset-2`}
    >
      {content}
      <span className="sr-only">（在新标签页打开）</span>
    </a>
  );
}
