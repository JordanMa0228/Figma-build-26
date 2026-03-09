import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { annotationOptionKeys } from '../../../data/mock-data'
import { useCreatedSessionsStore } from '../../../store/created-sessions-store'
import { useSessionDetail } from '../hooks'
import { PageHeader } from '../../../components/ui/PageHeader'
import { MetricCard } from '../../../components/ui/MetricCard'
import { Surface } from '../../../components/ui/Surface'
import { FilterChip } from '../../../components/ui/FilterChip'
import { FlowTimelineChart } from '../../../components/charts/FlowTimelineChart'
import { StrLineChart } from '../../../components/charts/StrLineChart'
import { DataQualityPanel } from '../../../components/cards/DataQualityPanel'
import { formatStr, getStateTone, safeFormat } from '../../../lib/utils'
import { StatusPill } from '../../../components/ui/StatusPill'
import { TaskIconView } from '../../../components/ui/TaskIconView'
import { getDateLocale } from '../../../lib/date-locale'

export function SessionDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const createdSession = useCreatedSessionsStore((s) => (id ? s.sessions.find((x) => x.id === id) : undefined))
  const { data: apiSession } = useSessionDetail(createdSession ? undefined : id)
  const session = createdSession ?? apiSession
  const [activeAnnotations, setActiveAnnotations] = useState<string[]>([])
  const displayNote = session?.note?.startsWith('sessionNotes.') ? t(session.note) : session?.note ?? ''

  const totalFlowMinutes = useMemo(() => {
    if (!session) return 0
    return Math.round((session.durationMin * session.flowPercent) / 100)
  }, [session])

  if (!session) {
    return (
      <Surface className="p-10 text-center">
        <p className="text-lg font-medium text-slate-900">{t('sessions.sessionNotFound')}</p>
        <button onClick={() => navigate('/sessions')} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
          {t('sessions.backToSessions')}
        </button>
      </Surface>
    )
  }

  const toggleAnnotation = (value: string) => {
    setActiveAnnotations((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/sessions')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        <IconfontIcon name="arrow-left" size={16} />
        {t('sessions.backToSessions')}
      </button>

      <PageHeader
        eyebrow={t('sessions.sessionReport')}
        title={
          <>
            <TaskIconView icon={session.taskIcon} size={28} className="mr-2 inline-block align-middle text-slate-700" />
            {t(`tasks.${session.taskLabel}`)} {t('sessions.deepDive')}
          </>
        }
        description={`${safeFormat(session.date, 'EEEE, MMM d, yyyy', getDateLocale(i18n.language))} · ${session.startTime}–${session.endTime} · ${displayNote}`}
        actions={<StatusPill tone={session.flowPercent >= 60 ? 'flow' : 'neutral'}>{t('sessions.flowPercentFormat', { percent: session.flowPercent })}</StatusPill>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="star"
          label={t('dashboard.flowTime')}
          value={t('common.minutesFormat', { value: totalFlowMinutes })}
          description={`${session.flowPercent}% ${t('sessions.flowTimeDesc')}`}
          tone="flow"
        />
        <MetricCard
          icon="gauge"
          label={t('dashboard.avgSTR')}
          value={formatStr(session.avgSTR)}
          description={t('sessions.avgSTRDescDetail')}
          tone={session.avgSTR < 1 ? 'cyan' : 'distracted'}
        />
        <MetricCard
          icon="brain"
          label={t('dashboard.quality')}
          value={String(session.qualityScore)}
          description={t('sessions.qualityScoreDesc')}
          tone="focused"
        />
        <MetricCard
          icon="tag"
          label={t('dashboard.longestStreak')}
          value={t('common.minutesFormat', { value: session.longestFlowStreakMin })}
          description={t('sessions.longestStreakDesc')}
          tone="neutral"
        />
      </section>

      <FlowTimelineChart timeline={session.flowTimeline} durationMin={session.durationMin} />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <StrLineChart
          timeseries={session.strTimeseries}
          subtitle={t('sessions.strSubtitle')}
        />

        <Surface className="space-y-5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('sessions.annotations')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('sessions.interpretiveLabels')}</h3>
            <p className="mt-2 text-sm text-slate-500">{t('sessions.annotationsDesc')}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {annotationOptionKeys.map((key) => (
              <FilterChip key={key} active={activeAnnotations.includes(key)} onClick={() => toggleAnnotation(key)}>
                {t(`annotations.${key}`)}
              </FilterChip>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{t('sessions.analystNote')}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{displayNote}</p>
            <p className="mt-3 text-xs text-slate-500">
              {t('sessions.activeTags')}: {activeAnnotations.length ? activeAnnotations.map((k) => t(`annotations.${k}`)).join(', ') : t('common.none')}
            </p>
          </div>
        </Surface>
      </section>

      <DataQualityPanel quality={session.dataQuality} />

      <Surface className="p-6">
        <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('sessions.segmentTable')}</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('sessions.detailedBreakdown')}</h3>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">{t('sessions.segment')}</th>
                <th className="px-4 py-3 font-medium">{t('sessions.window')}</th>
                <th className="px-4 py-3 font-medium">{t('sessions.state')}</th>
                <th className="px-4 py-3 font-medium">{t('dashboard.avgSTR')}</th>
                <th className="px-4 py-3 font-medium">{t('sessions.duration')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {session.flowTimeline.map((segment, index) => (
                <tr key={`${segment.state}-${index}`} className="bg-white">
                  <td className="px-4 py-3 text-slate-900">#{index + 1}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {segment.startMin}{t('common.minAbbr')} – {segment.endMin}{t('common.minAbbr')}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={getStateTone(segment.state)}>{t(`flowTimelineLegend.${segment.state}`)}</StatusPill>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{segment.avgSTR.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{segment.endMin - segment.startMin}{t('common.minAbbr')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  )
}

