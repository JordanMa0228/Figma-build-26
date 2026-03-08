import type { AccentTone } from '../../types/domain'
import { cn, getToneClasses } from '../../lib/utils'

interface StatusPillProps {
  tone: AccentTone
  children: string
}

export function StatusPill({ tone, children }: StatusPillProps) {
  return <span className={cn('rounded-full border px-3 py-1 text-xs font-medium', getToneClasses(tone))}>{children}</span>
}

