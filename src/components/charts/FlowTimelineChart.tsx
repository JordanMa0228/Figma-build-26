import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FlowSegment } from '../../types/domain'
import { Surface } from '../ui/Surface'

const stateColors = {
  Flow: '#3b82f6', // blue-500
  Focused: '#38bdf8', // sky-400
  Neutral: '#93c5fd', // blue-300
  Distracted: '#1d4ed8', // blue-700
}

interface FlowTimelineChartProps {
  timeline: FlowSegment[]
  durationMin: number
}

export function FlowTimelineChart({ timeline, durationMin }: FlowTimelineChartProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [tooltipLeft, setTooltipLeft] = useState<number | null>(null)
  return (
    <Surface className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('flowTimeline.title')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('flowTimeline.subtitle')}</h3>
        </div>
        <p className="text-sm text-slate-500">{t('common.minutesFormat', { value: durationMin })}</p>
      </div>

      <div className="mt-6 rounded-3xl px-1 py-1 relative">
        <div
          className="flex h-14"
          onMouseLeave={() => {
            setActiveIndex(null)
            setTooltipLeft(null)
          }}
        >
          {timeline.map((segment, index) => {
            const width = ((segment.endMin - segment.startMin) / durationMin) * 100
            const isFirst = index === 0
            const isLast = index === timeline.length - 1
            const borderRadius = isFirst && isLast
              ? '9999px'
              : isFirst
                ? '9999px 0 0 9999px'
                : isLast
                  ? '0 9999px 9999px 0'
                  : undefined

            const centerPercent = ((segment.startMin + segment.endMin) / 2 / durationMin) * 100

            return (
              <div
                key={`${segment.state}-${index}`}
                className="flex h-full flex-1 cursor-pointer items-center justify-center"
                style={{
                  width: `${width}%`,
                  backgroundColor: stateColors[segment.state],
                  borderRadius,
                }}
                onMouseEnter={() => {
                  setActiveIndex(index)
                  setTooltipLeft(centerPercent)
                }}
              >
              </div>
            )
          })}

          {activeIndex !== null && tooltipLeft !== null && (
            <div
              className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-panel transition-[left,transform] duration-150 ease-out"
              style={{ left: `${tooltipLeft}%` }}
            >
              <p className="font-semibold text-slate-900">
                {t(`flowTimelineLegend.${timeline[activeIndex].state}`)}
              </p>
              <p className="mt-1 text-slate-400">
                {timeline[activeIndex].startMin}{t('common.minAbbr')} – {timeline[activeIndex].endMin}{t('common.minAbbr')}
              </p>
              <p className="text-slate-400">
                {t('dashboard.avgSTR')} {timeline[activeIndex].avgSTR.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>0{t('common.minAbbr')}</span>
        <span>{durationMin}{t('common.minAbbr')}</span>
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

