import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Surface } from '../../../components/ui/Surface'
import { MetricCard } from '../../../components/ui/MetricCard'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { FlowTimelineChart } from '../../../components/charts/FlowTimelineChart'
import { StrLineChart } from '../../../components/charts/StrLineChart'
import { useUiStore } from '../../../store/ui-store'
import { getDeltaLabel, safeDateFormat } from '../../../lib/utils'
import type { SessionRecord } from '../../../types/domain'
import { useSessionsData } from '../../sessions/hooks'
import { useCreatedSessionsStore } from '../../../store/created-sessions-store'
import { TaskIconView } from '../../../components/ui/TaskIconView'
import { getDateLocale } from '../../../lib/date-locale'

function CompareColumn({
  title,
  value,
  onChange,
  sessions,
}: {
  title: string
  value: string
  onChange: (nextValue: string) => void
  sessions: SessionRecord[]
}) {
  const { t, i18n } = useTranslation()
  const session = sessions.find((item) => item.id === value)

  const displayNote = session ? (session.note.startsWith('sessionNotes.') ? t(session.note) : session.note) : ''
  const displayDate = session ? safeDateFormat(session.date, 'MMM d, yyyy', { locale: getDateLocale(i18n.language) }) : ''

  return (
    <div className="space-y-4">
      <Surface className="p-5">
        <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{title}</p>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
        >
          <option value="" disabled>{t('compare.selectSession')}</option>
          {sessions.map((item) => (
            <option key={item.id} value={item.id}>
              {t(`tasks.${item.taskLabel}`)} · {safeDateFormat(item.date, 'MMM d, yyyy', { locale: getDateLocale(i18n.language) })} · {t('common.minutesFormat', { value: item.durationMin })}
            </option>
          ))}
        </select>
        {session ? (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-900">
              <TaskIconView icon={session.taskIcon} size={22} className="mr-2 inline-block align-middle text-slate-700" />
              {t(`tasks.${session.taskLabel}`)}
            </p>
            <p className="mt-2 text-sm text-slate-500">{displayDate} · {displayNote}</p>
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-400">
            {t('compare.selectSessionPrompt')}
          </div>
        )}
      </Surface>

      {session && (
        <>
          <FlowTimelineChart timeline={session.flowTimeline} durationMin={session.durationMin} />
          <StrLineChart timeseries={session.strTimeseries} />
        </>
      )}
    </div>
  )
}

export function ComparePage() {
  const { t } = useTranslation()
  const { data: apiSessions = [] } = useSessionsData()
  const createdSessions = useCreatedSessionsStore((s) => s.sessions)
  const sessions = useMemo(() => {
    const merged = [...createdSessions, ...apiSessions]
    const seen = new Set<string>()
    return merged.filter((s) => {
      if (seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })
  }, [createdSessions, apiSessions])
  const compareLeftId = useUiStore((state) => state.compareLeftId)
  const compareRightId = useUiStore((state) => state.compareRightId)
  const setCompareLeftId = useUiStore((state) => state.setCompareLeftId)
  const setCompareRightId = useUiStore((state) => state.setCompareRightId)

  useEffect(() => {
    if (sessions.length >= 1 && !compareLeftId) {
      setCompareLeftId(sessions[0].id)
    }
    if (sessions.length >= 2 && !compareRightId) {
      setCompareRightId(sessions[1].id)
    }
  }, [sessions, compareLeftId, compareRightId, setCompareLeftId, setCompareRightId])

  const leftSession = sessions.find((item) => item.id === compareLeftId)
  const rightSession = sessions.find((item) => item.id === compareRightId)

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow={t('compare.eyebrow')}
          title={t('compare.title')}
          description={t('compare.description')}
        />
        <Surface className="p-12 text-center">
          <p className="text-lg font-medium text-slate-900">{t('compare.noSessions')}</p>
          <p className="mt-2 text-sm text-slate-500">{t('compare.noSessionsHint')}</p>
        </Surface>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('compare.eyebrow')}
        title={t('compare.title')}
        description={t('compare.description')}
      />

      {leftSession && rightSession && (
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon="compare"
            label={t('compare.flowDelta')}
            value={getDeltaLabel(leftSession.flowPercent, rightSession.flowPercent, '%')}
            description={t('compare.flowDeltaDesc')}
            tone="flow"
          />
          <MetricCard
            icon="compare"
            label={t('compare.strDelta')}
            value={getDeltaLabel(leftSession.avgSTR, rightSession.avgSTR)}
            description={t('compare.strDeltaDesc')}
            tone="cyan"
          />
          <MetricCard
            icon="compare"
            label={t('compare.qualityDelta')}
            value={getDeltaLabel(leftSession.qualityScore, rightSession.qualityScore)}
            description={t('compare.qualityDeltaDesc')}
            tone="focused"
          />
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_auto_1fr]">
        <CompareColumn title={t('compare.sessionA')} value={compareLeftId} onChange={setCompareLeftId} sessions={sessions} />
        <div className="hidden items-center justify-center xl:flex">
          <div className="rounded-full border border-blue-200 bg-blue-50 p-3 text-blue-600">
            <IconfontIcon name="compare" size={18} />
          </div>
        </div>
        <CompareColumn title={t('compare.sessionB')} value={compareRightId} onChange={setCompareRightId} sessions={sessions} />
      </div>
    </div>
  )
}

