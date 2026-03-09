import { useTranslation } from 'react-i18next'
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
    <Surface className="p-6">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('dataQuality.signalQuality')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dataQuality.sensorConfidence')}</h3>
        </div>

        {data.map((item) => (
          <div key={item.metric} className="space-y-1.5">
            <span className="text-sm text-slate-600">{item.metric}</span>
            <div className="flex items-center gap-4">
              <div className="h-2 flex-1 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm text-blue-600">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  )
}

