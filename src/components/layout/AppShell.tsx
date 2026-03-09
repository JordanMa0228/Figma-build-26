import { useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconfontIcon } from '../ui/IconfontIcon'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { setStoredLanguage, getStoredLanguage, supportedLngs, type SupportedLng } from '../../lib/i18n'
import i18n from '../../lib/i18n'
import { track } from '../../lib/tracking'
import { useAuthStore } from '../../store/auth-store'

const pageMetaKeys: Record<string, { titleKey: string; subtitleKey: string }> = {
  '/': { titleKey: 'pages.dashboard.title', subtitleKey: 'pages.dashboard.subtitle' },
  '/sessions': { titleKey: 'pages.sessions.title', subtitleKey: 'pages.sessions.subtitle' },
  '/trends': { titleKey: 'pages.trends.title', subtitleKey: 'pages.trends.subtitle' },
  '/compare': { titleKey: 'pages.compare.title', subtitleKey: 'pages.compare.subtitle' },
  '/settings': { titleKey: 'pages.settings.title', subtitleKey: 'pages.settings.subtitle' },
}

export function AppShell() {
  const { t } = useTranslation()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const metaKeys = pageMetaKeys[location.pathname] ?? {
    titleKey: 'pages.sessionDetail.title',
    subtitleKey: 'pages.sessionDetail.subtitle',
  }

  useEffect(() => {
    track('page_view', { path: location.pathname })
  }, [location.pathname])

  const currentLng = getStoredLanguage()
  const onLanguageChange = (lng: SupportedLng) => {
    const prev = i18n.language
    setStoredLanguage(lng)
    i18n.changeLanguage(lng)
    track('language_change', { from: prev, to: lng, context: 'app' })
  }

  const handleLogout = () => {
    track('logout', {})
    logout()
  }

  return (
    <div className="min-h-screen bg-canvas text-slate-900">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.04),transparent_20%)]" />
      </div>

      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                  {t(metaKeys.titleKey)}
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">{t(metaKeys.subtitleKey)}</p>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">{t('home.language')}:</span>
                  <select
                    value={currentLng}
                    onChange={(e) => onLanguageChange(e.target.value as SupportedLng)}
                    className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700"
                  >
                    {supportedLngs.map((lng) => (
                      <option key={lng} value={lng}>
                        {lng === 'en' ? 'English' : lng === 'zh' ? '中文' : 'Español'}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                  <IconfontIcon name="search" size={16} className="text-slate-400" />
                  <input
                    readOnly
                    placeholder={t('common.search')}
                    className="w-32 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none"
                  />
                </label>
                <button className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-slate-500 hover:bg-slate-100">
                  <IconfontIcon name="bell" size={16} />
                </button>
                {user ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                      <IconfontIcon name="grid" size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="ml-2 rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-xl bg-blue-500 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 pb-24 md:pb-8">
            <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
