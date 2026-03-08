import { useTranslation } from 'react-i18next'
import { Radar, RadarChart, PolarAngleAxis, PolarGrid, ResponsiveContainer } from 'recharts'
import type { SensorQuality } from '../../types/domain'
import { Surface } from '../ui/Surface'

interface DataQualityPanelProps {
  quality: SensorQuality
}

export function DataQualityPanel({ quality }: DataQualityPanelProps) {
  const { t } = useTranslation()
  const data = [
    { metric: t('settings.eyeTracker'), value: quality.eye },
    { metric: t('settings.eeg'), value: quality.eeg },
    { metric: t('settings.heartRate'), value: quality.hr },
  ]

  return (
    <Surface className="grid gap-6 p-6 lg:grid-cols-[1fr_220px]">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('dataQuality.signalQuality')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dataQuality.sensorConfidence')}</h3>
        </div>

        {data.map((item) => (
          <div key={item.metric} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.metric}</span>
              <span className="text-blue-600">{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#dbe3ef" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
            <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Surface>
  )
}

