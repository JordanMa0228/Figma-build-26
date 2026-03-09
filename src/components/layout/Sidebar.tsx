import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconfontIcon } from '../ui/IconfontIcon'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/auth-store'

const navItems = [
  { to: '/', labelKey: 'nav.dashboard', icon: 'dashboard' as const },
  { to: '/sessions', labelKey: 'nav.sessions', icon: 'clock' as const },
  { to: '/trends', labelKey: 'nav.trends', icon: 'trending' as const },
  { to: '/compare', labelKey: 'nav.compare', icon: 'compare' as const },
  { to: '/settings', labelKey: 'nav.settings', icon: 'settings' as const },
]

export function Sidebar() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:flex md:flex-col">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
          <IconfontIcon name="dashboard" size={20} className="text-white" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">{t('app.brand')}</p>
          <p className="text-xs text-slate-500">{t('app.tagline')}</p>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map(({ to, labelKey, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <IconfontIcon name={icon} size={18} className="shrink-0" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {!user && (
        <div className="mt-4 space-y-2">
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <IconfontIcon name="user" size={18} className="shrink-0" />
            <span>{t('nav.login')}</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            <IconfontIcon name="plus" size={18} className="shrink-0" />
            <span>{t('nav.register')}</span>
          </Link>
        </div>
      )}

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{t('sidebar.quickStats')}</p>
        <div className="mt-3 flex gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 rounded-full bg-blue-500" />
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">{t('sidebar.sessionsThisWeek')}</p>
      </div>
    </aside>
  )
}
