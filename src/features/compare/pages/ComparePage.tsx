import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Surface } from '../../../components/ui/Surface'
import { MetricCard } from '../../../components/ui/MetricCard'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { FlowTimelineChart } from '../../../components/charts/FlowTimelineChart'
import { StrLineChart } from '../../../components/charts/StrLineChart'
import { useUiStore } from '../../../store/ui-store'
import { getDeltaLabel } from '../../../lib/utils'
import type { SessionRecord } from '../../../types/domain'
import { useSessionsData } from '../../sessions/hooks'

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
  const session = sessions.find((item) => item.id === value)

  if (!session) return null

  return (
    <div className="space-y-4">
      <Surface className="p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
        >
          {sessions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.taskLabel} · {item.date} · {item.durationMin} min
            </option>
          ))}
        </select>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-lg font-semibold text-slate-900">
            {session.taskIcon} {session.taskLabel}
          </p>
          <p className="mt-2 text-sm text-slate-500">{session.note}</p>
        </div>
      </Surface>

      <FlowTimelineChart timeline={session.flowTimeline} durationMin={session.durationMin} />
      <StrLineChart timeseries={session.strTimeseries} />
    </div>
  )
}

export function ComparePage() {
  const { t } = useTranslation()
  const { data: sessions = [] } = useSessionsData()
  const compareLeftId = useUiStore((state) => state.compareLeftId)
  const compareRightId = useUiStore((state) => state.compareRightId)
  const setCompareLeftId = useUiStore((state) => state.setCompareLeftId)
  const setCompareRightId = useUiStore((state) => state.setCompareRightId)

  const leftSession = sessions.find((item) => item.id === compareLeftId)
  const rightSession = sessions.find((item) => item.id === compareRightId)

  if (!leftSession || !rightSession) return null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('compare.eyebrow')}
        title={t('compare.title')}
        description={t('compare.description')}
      />

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

