import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Surface } from '../../../components/ui/Surface'
import { FilterChip } from '../../../components/ui/FilterChip'
import { settingsSchema, type SettingsSchema } from '../schema'
import { defaultSettings } from '../api'
import { useSaveSettingsMutation, useSettingsQuery } from '../hooks'
import type { SettingsFormValues } from '../../../types/domain'

const sensitivityOptions: SettingsSchema['flowSensitivity'][] = ['Conservative', 'Balanced', 'Aggressive']

function ToggleField({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()
  const [saved, setSaved] = useState(false)
  const { data: settings } = useSettingsQuery()
  const saveMutation = useSaveSettingsMutation()
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  })

  useEffect(() => {
    if (settings) {
      reset(settings)
    }
  }, [reset, settings])

  const values = watch()

  const onSubmit = async (payload: SettingsSchema) => {
    await saveMutation.mutateAsync(payload as SettingsFormValues)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('nav.settings')}
        title={t('settings.configTitle')}
        description={t('settings.configDesc')}
        actions={
          <button
            onClick={handleSubmit(onSubmit)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {saved ? <IconfontIcon name="check" size={16} /> : <IconfontIcon name="database" size={16} />}
            {saveMutation.isPending ? t('settings.saving') : saved ? t('settings.savedLocally') : t('settings.saveSettings')}
          </button>
        }
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Surface className="space-y-5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('settings.sensorPermissions')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('settings.signalSources')}</h3>
          </div>

          {[
            { key: 'eye', labelKey: 'settings.eyeTracker', descKey: 'settings.eyeTrackerDesc', icon: 'eye' as const },
            { key: 'eeg', labelKey: 'settings.eeg', descKey: 'settings.eegDesc', icon: 'brain' as const },
            { key: 'hr', labelKey: 'settings.heartRate', descKey: 'settings.heartRateDesc', icon: 'heart' as const },
          ].map(({ key, labelKey, descKey, icon }) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <IconfontIcon name={icon} size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t(labelKey)}</p>
                  <p className="text-sm text-slate-500">{t(descKey)}</p>
                </div>
              </div>

              <Controller
                control={control}
                name={`sensors.${key}` as 'sensors.eye'}
                render={({ field }) => <ToggleField checked={field.value} onChange={field.onChange} />}
              />
            </div>
          ))}
        </Surface>

        <div className="grid gap-6 xl:grid-cols-2">
          <Surface className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('settings.qualityThreshold')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('settings.qualityThresholdTitle')}</h3>
            <p className="mt-2 text-sm text-slate-500">{t('settings.qualityThresholdDesc')}</p>
            <Controller
              control={control}
              name="qualityThreshold"
              render={({ field }) => (
                <div className="mt-6">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">50%</span>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-600">
                      {field.value}%
                    </span>
                    <span className="text-slate-500">100%</span>
                  </div>
                </div>
              )}
            />
          </Surface>

          <Surface className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('settings.flowSensitivity')}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{t('settings.classifierStrictness')}</h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {sensitivityOptions.map((option) => (
                <FilterChip
                  key={option}
                  type="button"
                  active={values.flowSensitivity === option}
                  onClick={() => setValue('flowSensitivity', option)}
                >
                  {t(`settings.${option.toLowerCase()}`)}
                </FilterChip>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              {values.flowSensitivity === 'Conservative' && t('settings.conservativeDesc')}
              {values.flowSensitivity === 'Balanced' && t('settings.balancedDesc')}
              {values.flowSensitivity === 'Aggressive' && t('settings.aggressiveDesc')}
            </p>
          </Surface>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Surface className="space-y-5 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('settings.storageMode')}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('settings.privacyControls')}</h3>
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-3 text-slate-500 shadow-sm">
                  {values.cloudSync ? <IconfontIcon name="cloud" size={18} /> : <IconfontIcon name="harddrive" size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t('settings.cloudSync')}</p>
                  <p className="text-sm text-slate-500">{t('settings.cloudSyncDesc')}</p>
                </div>
              </div>
              <Controller control={control} name="cloudSync" render={({ field }) => <ToggleField checked={field.value} onChange={field.onChange} />} />
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{t('settings.localOnly')}</p>
                <p className="text-sm text-slate-500">{t('settings.localOnlyDesc')}</p>
              </div>
              <Controller control={control} name="localOnly" render={({ field }) => <ToggleField checked={field.value} onChange={field.onChange} />} />
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{t('settings.anonModel')}</p>
                <p className="text-sm text-slate-500">{t('settings.anonModelDesc')}</p>
              </div>
              <Controller
                control={control}
                name="allowAnonTraining"
                render={({ field }) => <ToggleField checked={field.value} onChange={field.onChange} />}
              />
            </div>
          </Surface>

          <Surface className="p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('settings.formSnapshotTitle')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('settings.formSnapshot')}</h3>
            <p className="mt-2 text-sm text-slate-500">{t('settings.formSnapshotDesc')}</p>
            <pre className="mt-6 overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-600">
              {JSON.stringify(values, null, 2)}
            </pre>
          </Surface>
        </div>
      </form>
    </div>
  )
}

