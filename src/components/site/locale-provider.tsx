"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { type Dictionary, getDictionary } from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  isPending: boolean;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  dict: getDictionary("zh"),
  isPending: false,
  setLocale: () => {},
});

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === initialLocale) return;
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks universal Safari support; document.cookie persists locale for SSR
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next === "en" ? "en" : "zh-CN";
      startTransition(() => {
        router.refresh();
      });
    },
    [initialLocale, router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: initialLocale,
      dict: getDictionary(initialLocale),
      isPending,
      setLocale,
    }),
    [initialLocale, isPending, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * 极简黑白中英文切换胶囊（用于侧边栏底部、移动端抽屉与页脚）
 */
export function LanguageToggle({
  variant = "compact",
}: {
  variant?: "compact" | "footer";
}) {
  const { locale, dict, isPending, setLocale } = useLocale();
  const nextLocale: Locale = locale === "zh" ? "en" : "zh";

  if (variant === "footer") {
    return (
      <fieldset
        disabled={isPending}
        aria-label={dict.nav.switchLangAria}
        className="inline-flex items-center gap-0.5 rounded-full border border-border bg-bg p-0.5"
      >
        <legend className="sr-only">{dict.nav.switchLangAria}</legend>
        {(
          [
            ["zh", "中文"],
            ["en", "EN"],
          ] as const
        ).map(([code, label]) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              className={`min-h-8 rounded-full px-3 text-micro transition-colors sm:min-h-7 ${
                active
                  ? "bg-ink font-semibold text-ink-fg"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          );
        })}
      </fieldset>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => setLocale(nextLocale)}
      aria-label={dict.nav.switchLangAria}
      title={locale === "zh" ? "Switch to English" : "切换为中文"}
      className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border bg-bg px-3.5 font-mono text-micro font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg lg:min-h-9 lg:px-3"
    >
      <span className={locale === "zh" ? "font-semibold text-fg" : undefined}>
        中
      </span>
      <span aria-hidden="true" className="text-border-strong">
        /
      </span>
      <span className={locale === "en" ? "font-semibold text-fg" : undefined}>
        EN
      </span>
    </button>
  );
}
