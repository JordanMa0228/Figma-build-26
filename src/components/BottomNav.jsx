import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Clock, TrendingUp, GitCompare, Settings } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/sessions', label: 'Sessions', icon: Clock },
  { to: '/trends', label: 'Trends', icon: TrendingUp },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex z-50">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              isActive ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <Icon size={20} />
          <span className="mt-1">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
