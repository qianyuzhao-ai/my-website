import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 pt-8 pb-28 md:px-8 md:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-caption text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-micro tracking-wider uppercase">
          <span className="font-semibold text-fg">{siteConfig.name}</span>
          <span aria-hidden="true">/</span>
          <span>{siteConfig.role}</span>
          <span aria-hidden="true">/</span>
          <span>{siteConfig.location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/" className="transition-colors hover:text-fg">
            Index
          </Link>
          <Link href="/writing" className="transition-colors hover:text-fg">
            Writing
          </Link>
          {siteConfig.socials.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
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
