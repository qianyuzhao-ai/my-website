import Link from "next/link";
import { links } from "@/lib/home-cards";

const itemClass = "flex min-h-11 items-center text-label font-medium";

/** 头部右侧的 Writing 与 Contact，首页、文章页、项目页共用 */
export function HeaderLinks({
  current,
  className = "",
}: {
  current?: "writing";
  className?: string;
}) {
  const isWriting = current === "writing";
  return (
    <nav
      aria-label="站点链接"
      className={`flex items-center gap-4 md:gap-7 ${className}`}
    >
      <Link
        href="/writing"
        aria-current={isWriting ? "page" : undefined}
        className={`${itemClass} underline-offset-4 ${isWriting ? "underline" : "hover:underline"}`}
      >
        Writing
      </Link>
      {links.contact ? (
        <a href={links.contact} className={itemClass}>
          Contact
        </a>
      ) : (
        <span title="联系方式待提供" className={itemClass}>
          Contact
        </span>
      )}
    </nav>
  );
}
