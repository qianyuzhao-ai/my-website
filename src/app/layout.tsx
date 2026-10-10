import type { Metadata } from "next";
import { Fraunces, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-poppins",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "QianYu · nev",
  description:
    "QianYu 的个人网站：来自北京的产品设计与开发，关注 React、Node、产品设计、AIGC 与 Agentic。",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
