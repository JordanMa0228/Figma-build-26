import { useTranslation } from 'react-i18next'
import type { FlowSegment } from '../../types/domain'
import { Surface } from '../ui/Surface'

const stateColors = {
  Flow: '#3b82f6',
  Focused: '#14b8a6',
  Neutral: '#64748b',
  Distracted: '#f59e0b',
}

interface FlowTimelineChartProps {
  timeline: FlowSegment[]
  durationMin: number
}

export function FlowTimelineChart({ timeline, durationMin }: FlowTimelineChartProps) {
  const { t } = useTranslation()
  return (
    <Surface className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('flowTimeline.title')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('flowTimeline.subtitle')}</h3>
        </div>
        <p className="text-sm text-slate-500">{durationMin} {t('flowTimeline.minuteWindow')}</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div className="flex h-16">
          {timeline.map((segment, index) => {
            const width = ((segment.endMin - segment.startMin) / durationMin) * 100

            return (
              <div
                key={`${segment.state}-${index}`}
                className="group relative flex h-full items-center justify-center"
                style={{ width: `${width}%`, backgroundColor: stateColors[segment.state] }}
              >
                <div className="pointer-events-none absolute left-1/2 top-2 hidden -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-panel group-hover:block">
                  <p className="font-semibold text-slate-900">{t(`flowTimelineLegend.${segment.state}`)}</p>
                  <p className="mt-1 text-slate-400">
                    {segment.startMin}m to {segment.endMin}m
                  </p>
                  <p className="text-slate-400">{t('dashboard.avgSTR')} {segment.avgSTR.toFixed(2)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>0m</span>
        <span>{durationMin}m</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {Object.entries(stateColors).map(([stateKey, color]) => (
          <div key={stateKey} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {t(`flowTimelineLegend.${stateKey}`)}
          </div>
        ))}
      </div>
    </Surface>
  )
}

