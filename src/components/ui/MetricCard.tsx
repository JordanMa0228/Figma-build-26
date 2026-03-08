import type { AccentTone } from '../../types/domain'
import type { IconfontName } from '../../lib/iconfont'
import { cn, getToneClasses } from '../../lib/utils'
import { Surface } from './Surface'
import { IconfontIcon } from './IconfontIcon'

interface MetricCardProps {
  icon: IconfontName
  label: string
  value: string
  description: string
  tone?: AccentTone
}

export function MetricCard({ icon, label, value, description, tone = 'neutral' }: MetricCardProps) {
  return (
    <Surface className="p-5" glow={tone === 'flow' ? 'flow' : tone === 'cyan' || tone === 'focused' ? 'cyan' : 'none'}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className={cn('rounded-2xl border p-3 shadow-sm', getToneClasses(tone))}>
          <IconfontIcon name={icon} size={18} />
        </div>
      </div>
    </Surface>
  )
}
