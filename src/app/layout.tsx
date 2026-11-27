import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ConnectSheet } from "@/components/site/connect-sheet";
import { EditorialShell } from "@/components/site/editorial-shell";
import { SearchProvider } from "@/components/site/search-dialog";
import { SkipLink } from "@/components/site/skip-link";
import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-geist-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  display: "swap",
  variable: "--font-fraunces",
});

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: `${siteConfig.name} 的个人网站：${siteConfig.tagline}`,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const posts = await getPosts();

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          storageKey="starter-ui-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SearchProvider posts={posts}>
            <SkipLink />
            <EditorialShell>{children}</EditorialShell>
            <ConnectSheet />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
