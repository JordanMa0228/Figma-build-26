import { Surface } from '../ui/Surface'

interface InsightCardProps {
  icon: string
  text: string
}

export function InsightCard({ icon, text }: InsightCardProps) {
  return (
    <Surface className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          {icon}
        </div>
        <p className="text-sm leading-7 text-slate-600">{text}</p>
      </div>
    </Surface>
  )
}

