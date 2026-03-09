import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconfontIcon } from '../ui/IconfontIcon'
import { format } from 'date-fns'
import type { SessionRecord } from '../../types/domain'
import { cn, formatStr, getScoreTone, getStrNarrativeKey, getToneClasses } from '../../lib/utils'
import { Surface } from '../ui/Surface'
import { StatusPill } from '../ui/StatusPill'
import { TaskIconView } from '../ui/TaskIconView'
import { getDateLocale } from '../../lib/date-locale'

interface SessionListCardProps {
  session: SessionRecord
}

export function SessionListCard({ session }: SessionListCardProps) {
  const { t, i18n } = useTranslation()
  return (
    <Surface className="p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <TaskIconView icon={session.taskIcon} size={28} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-slate-900">{session.taskLabel}</h3>
                <StatusPill tone={session.flowPercent >= 60 ? 'flow' : session.avgSTR <= 0.9 ? 'focused' : 'neutral'}>
                  {t('sessions.flowPercentFormat', { percent: session.flowPercent })}
                </StatusPill>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {format(new Date(session.date), 'PPP', { locale: getDateLocale(i18n.language) })} · {session.startTime} to {session.endTime} · {session.durationMin} min
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={cn('rounded-full border px-3 py-1 text-xs font-medium', getToneClasses(getScoreTone(session.qualityScore)))}>
              {t('sessions.qualityLabel')} {session.qualityScore}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              {t('sessions.avgSTRShort')} {formatStr(session.avgSTR)}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              {t('sessions.longestStreakShort')} {session.longestFlowStreakMin}m
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:w-[28rem]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('sessions.state')}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{t(getStrNarrativeKey(session.avgSTR))}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('sessions.distractions')}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{session.distractionEvents}</p>
          </div>
          <Link
            to={`/sessions/${session.id}`}
            className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700 transition-colors hover:bg-blue-100"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-blue-600">{t('sessions.detail')}</p>
              <p className="mt-1 text-sm font-semibold">{t('sessions.openReport')}</p>
            </div>
            <IconfontIcon name="star" size={18} className="text-blue-700" />
            <IconfontIcon name="arrow-right" size={18} className="text-blue-700" />
          </Link>
        </div>
      </div>
    </Surface>
  )
}

