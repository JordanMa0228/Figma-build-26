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
    <Surface className="p-3" glow={tone === 'flow' ? 'flow' : tone === 'cyan' || tone === 'focused' ? 'cyan' : 'none'}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-0.5 text-[11px] md:text-[12px] leading-snug text-slate-500">{description}</p>
        </div>
        <div className={cn('rounded-2xl border p-2 shadow-sm', getToneClasses(tone))}>
          <IconfontIcon name={icon} size={14} />
        </div>
      </div>
    </Surface>
  )
}
