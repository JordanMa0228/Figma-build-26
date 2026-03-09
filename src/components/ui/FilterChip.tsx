import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
}

export function FilterChip({ active = false, children, className, ...props }: FilterChipProps) {
  return (
    <button
      className={cn(
        'rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all',
        active
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

