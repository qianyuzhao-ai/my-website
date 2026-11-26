import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ConnectSheet } from "@/components/site/connect-sheet";
import { SiteDock } from "@/components/site/site-dock";
import { SkipLink } from "@/components/site/skip-link";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${poppins.variable} ${fraunces.variable}`}
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
          <SkipLink />
          <SiteDock />
          {children}
          <ConnectSheet />
        </ThemeProvider>
      </body>
    </html>
  );
}
