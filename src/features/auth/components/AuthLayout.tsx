import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getStoredLanguage, setStoredLanguage, supportedLngs, type SupportedLng } from '../../../lib/i18n'
import i18n from '../../../lib/i18n'
import { track } from '../../../lib/tracking'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'

interface AuthLayoutProps {
  children: ReactNode
  showLanguage?: boolean
  variant?: 'login' | 'register'
}

export function AuthLayout({ children, showLanguage = true, variant = 'login' }: AuthLayoutProps) {
  const { t } = useTranslation()
  const currentLng = getStoredLanguage()
  const welcomeTitle = variant === 'register' ? t('auth.welcomeTitleRegister', 'Create your account') : t('auth.welcomeTitle', 'Welcome back!')
  const welcomeDesc = variant === 'register' ? t('auth.welcomeDescRegister', 'Join to start tracking your flow sessions and analytics.') : t('auth.welcomeDesc', 'Please login using your account')

  const onLanguageChange = (lng: SupportedLng) => {
    const prev = i18n.language
    setStoredLanguage(lng)
    i18n.changeLanguage(lng)
    track('language_change', { from: prev, to: lng, context: 'auth' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-canvas">
      {/* Language selector - top right */}
      {showLanguage && (
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className="text-sm text-slate-500">{t('home.language')}</span>
          <select
            value={currentLng}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLng)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            {supportedLngs.map((lng) => (
              <option key={lng} value={lng} className="text-slate-900">
                {lng === 'en' ? 'English' : lng === 'zh' ? '中文' : 'Español'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Centered white card - same layout as Figma, site colors */}
      <div className="w-full max-w-[552px] rounded-[14px] border border-slate-200 bg-white p-10 shadow-panel">
        <div className="mb-8">
          <h1 className="text-[38px] font-bold leading-tight text-slate-900">
            {welcomeTitle}
          </h1>
          <p className="mt-3 text-[16px] text-slate-600">
            {welcomeDesc}
          </p>
        </div>
        {children}
      </div>

      <Link to="/" className="absolute left-4 top-4 flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
          <IconfontIcon name="dashboard" size={18} className="text-white" />
        </div>
        <span className="font-semibold">{t('app.brand')}</span>
      </Link>
    </div>
  )
}
