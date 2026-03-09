import { useTranslation } from 'react-i18next'
import { TaskIconView } from '../ui/TaskIconView'
import { Surface } from '../ui/Surface'

interface InsightCardProps {
  icon: string
  text: string
  textKey?: string
  textValues?: Record<string, string | number>
}

export function InsightCard({ icon, text, textKey, textValues }: InsightCardProps) {
  const { t } = useTranslation()
  const displayText = textKey ? t(textKey, textValues) : text
  return (
    <Surface className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          <TaskIconView icon={icon} size={24} className="text-slate-700" />
        </div>
        <p className="text-sm leading-7 text-slate-600">{displayText}</p>
      </div>
    </Surface>
  )
}
