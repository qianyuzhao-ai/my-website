import Link from "next/link";
import { HeaderLinks } from "@/components/site/header-links";

/** 文章页头部：不显示首页的分类筛选器 */
export function WritingHeader() {
  return (
    <header
      id="top"
      className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 pt-[18px] pb-4 md:px-12 md:pt-10 md:pb-[46px]"
    >
      <Link
        href="/"
        aria-label="qianyu 首页"
        className="logo-gradient font-serif text-logo font-bold"
      >
        qianyu
      </Link>
      <HeaderLinks current="writing" />
    </header>
  );
}
