import { enUS, es, zhCN } from 'date-fns/locale'
import type { Locale } from 'date-fns'

const localeMap: Record<string, Locale> = {
  en: enUS,
  'en-US': enUS,
  zh: zhCN,
  'zh-CN': zhCN,
  'zh-TW': zhCN,
  es,
  'es-ES': es,
}

/** Get date-fns locale for current i18n language (e.g. from useTranslation().i18n.language). */
export function getDateLocale(i18nLanguage: string): Locale {
  return localeMap[i18nLanguage] ?? localeMap[i18nLanguage.split('-')[0]] ?? enUS
}
