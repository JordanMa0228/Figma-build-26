import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import type { StrPoint } from '../../types/domain'
import { Surface } from '../ui/Surface'

interface StrLineChartProps {
  timeseries: StrPoint[]
  title?: string
  subtitle?: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string | number
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  const { t } = useTranslation()
  if (!active || !payload?.length) return null

  const value = Number(payload[0].value)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-panel">
      <p className="text-slate-400">{t('strChart.minuteLabel')} {label}</p>
      <p className="mt-1 font-semibold text-slate-900">STR {value.toFixed(2)}</p>
      <p className="mt-1 text-slate-500">{value < 1 ? t('strChart.timeCompressed') : t('strChart.timeStretched')}</p>
    </div>
  )
}

export function StrLineChart({
  timeseries,
  title,
  subtitle,
}: StrLineChartProps) {
  const { t } = useTranslation()
  const displayTitle = title ?? t('strChart.defaultTitle')
  const displaySubtitle = subtitle ?? t('strChart.defaultSubtitle')
  return (
    <Surface className="p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('strChart.title')}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{displayTitle}</h3>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">{displaySubtitle}</p>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeseries} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis
              domain={[0.35, 1.6]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine y={1} stroke="#cbd5e1" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="str"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 0 }}
              activeDot={{ r: 5, fill: '#3b82f6', stroke: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Surface>
  )
}

