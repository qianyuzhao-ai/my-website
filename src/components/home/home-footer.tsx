import Image from "next/image";
import { links } from "@/lib/home-cards";

function FooterArrow({ direction }: { direction: "up" | "up-right" }) {
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Image
        src={`/images/footer/arrow-${direction}-light.svg`}
        alt=""
        width={16}
        height={16}
        className="dark:hidden"
      />
      <Image
        src={`/images/footer/arrow-${direction}-dark.svg`}
        alt=""
        width={16}
        height={16}
        className="hidden dark:block"
      />
    </span>
  );
}

export function HomeFooter() {
  return (
    <footer className="px-4 md:px-6 xl:px-0">
      <div className="mx-auto flex max-w-[1168px] flex-col gap-4 border-t border-border pt-6 pb-8 text-label font-medium text-fg/70 md:flex-row md:items-center md:justify-between md:py-6">
        <p>© {new Date().getFullYear()} QianYu</p>
        <nav
          aria-label="页脚导航"
          className="flex flex-wrap items-center gap-6"
        >
          {links.social ? (
            <a
              href={links.social}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="QianYu 的 X 主页（新窗口打开）"
              className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-sm transition-colors hover:text-fg"
            >
              X
              <FooterArrow direction="up-right" />
            </a>
          ) : null}
          <a
            href="#top"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm transition-colors hover:text-fg"
          >
            Back to top
            <FooterArrow direction="up" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
