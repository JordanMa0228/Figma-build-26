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

export function MobileNav() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ to, labelKey, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500',
              )
            }
          >
            <IconfontIcon name={icon} size={18} />
            {t(labelKey)}
          </NavLink>
        ))}
      </div>
      {!user && (
        <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2">
          <Link
            to="/login"
            className="flex-1 rounded-xl bg-slate-100 py-2 text-center text-[11px] font-medium text-slate-600"
          >
            {t('nav.login')}
          </Link>
          <Link
            to="/register"
            className="flex-1 rounded-xl bg-blue-500 py-2 text-center text-[11px] font-medium text-white"
          >
            {t('nav.register')}
          </Link>
        </div>
      )}
    </nav>
  )
}
