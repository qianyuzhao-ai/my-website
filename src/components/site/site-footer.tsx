import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 px-4 py-10 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-micro tracking-wider uppercase">
          <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
            <span className="size-1.5 rounded-full bg-signal-dot" />
            {siteConfig.name}
          </span>
          <span aria-hidden="true">/</span>
          <span>{siteConfig.role}</span>
          <span aria-hidden="true">/</span>
          <span>{siteConfig.location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/" className="transition-colors hover:text-accent">
            空岛
          </Link>
          <Link href="/works" className="transition-colors hover:text-accent">
            作品
          </Link>
          <Link href="/writing" className="transition-colors hover:text-accent">
            博客
          </Link>
          <Link href="/about" className="transition-colors hover:text-accent">
            关于
          </Link>
          {siteConfig.socials.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {item.label.split(" ")[0]}
            </a>
          ))}
          <span className="font-mono text-micro">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
