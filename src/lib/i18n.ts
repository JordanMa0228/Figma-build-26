import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import es from '../locales/es.json'

export const supportedLngs = ['en', 'zh', 'es'] as const
export type SupportedLng = (typeof supportedLngs)[number]

const STORAGE_KEY = 'flowsense.locale'

export function getStoredLanguage(): SupportedLng {
  if (typeof window === 'undefined') return 'en'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw && supportedLngs.includes(raw as SupportedLng)) return raw as SupportedLng
  return 'en'
}

export function setStoredLanguage(lng: SupportedLng) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, lng)
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    es: { translation: es },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...supportedLngs],
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') document.documentElement.lang = lng
})
if (typeof document !== 'undefined') document.documentElement.lang = i18n.language

export default i18n
