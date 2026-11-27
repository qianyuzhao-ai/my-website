import { cookies, headers } from "next/headers";
import {
  isLocale,
  LOCALE_COOKIE,
  type Locale,
  parseAcceptLanguage,
} from "@/lib/i18n/config";

/** 在 Server Component 中读取当前语言：优先 cookie，其次 Accept-Language，默认 zh */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const headerStore = await headers();
  return parseAcceptLanguage(headerStore.get("accept-language"));
}
