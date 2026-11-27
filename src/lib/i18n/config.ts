export type Locale = "zh" | "en";

export const LOCALES: readonly Locale[] = ["zh", "en"] as const;
export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_COOKIE = "site-locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "zh" || value === "en";
}

/**
 * 首次访问无 cookie 时，根据请求头 Accept-Language 温和探测默认语言：
 * 仅当英文权重明确排在中文之前时返回 "en"，否则默认返回 "zh"。
 */
export function parseAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const parts = header
    .toLowerCase()
    .split(",")
    .map((part) => part.trim().split(";")[0] ?? "");
  for (const tag of parts) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LOCALE;
}
