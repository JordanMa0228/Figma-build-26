import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType
  children: ReactNode
  glow?: 'flow' | 'cyan' | 'amber' | 'none'
}

export function Surface({ as: Component = 'div', children, className, glow = 'none', ...props }: SurfaceProps) {
  const glowClasses = {
    flow: 'before:shadow-[0_0_50px_rgba(59,130,246,0.06)]',
    cyan: 'before:shadow-[0_0_50px_rgba(14,165,233,0.06)]',
    amber: 'before:shadow-[0_0_50px_rgba(245,158,11,0.05)]',
    none: '',
  }[glow]

  return (
    <Component
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200 bg-panel shadow-panel',
        "before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-8 before:rounded-full before:content-['']",
        glowClasses,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

