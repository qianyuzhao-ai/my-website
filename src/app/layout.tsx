import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ConnectSheet } from "@/components/site/connect-sheet";
import { EditorialShell } from "@/components/site/editorial-shell";
import { LocaleProvider } from "@/components/site/locale-provider";
import { SearchProvider } from "@/components/site/search-dialog";
import { SkipLink } from "@/components/site/skip-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";
import { getPosts } from "@/lib/posts";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  const posts = await getPosts(locale);

  return (
    <html
      lang={dict.htmlLang}
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
          <LocaleProvider initialLocale={locale}>
            <SearchProvider posts={posts}>
              <SkipLink />
              <EditorialShell>{children}</EditorialShell>
              <ConnectSheet />
            </SearchProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
