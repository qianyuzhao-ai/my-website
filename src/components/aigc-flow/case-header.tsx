import Link from "next/link";
import { HeaderLinks } from "@/components/site/header-links";
import { categories } from "@/lib/home-cards";

export function CaseHeader() {
  return (
    <header className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-y-4 px-5 pt-[18px] pb-2 md:grid-cols-[1fr_auto_1fr] md:px-12 md:pt-10 md:pb-[46px]">
      <Link
        href="/"
        aria-label="qianyu 首页"
        className="logo-gradient justify-self-start font-serif text-logo font-bold"
      >
        qianyu
      </Link>
      <nav
        aria-label="网站导航"
        className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
      >
        <ul className="flex h-[52px] rounded-full border border-border bg-nav-track p-1 md:h-11 md:w-[300px]">
          {categories.map(({ id, label }) => (
            <li key={id} className="flex-1">
              <Link
                href={id === "all" ? "/" : `/?category=${id}`}
                aria-current={id === "projects" ? "location" : undefined}
                className={`flex h-11 items-center justify-center rounded-full text-label font-medium md:h-9 ${id === "projects" ? "bg-nav-selected" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <HeaderLinks className="justify-self-end md:col-start-3" />
    </header>
  );
}
