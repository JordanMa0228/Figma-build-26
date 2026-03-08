import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { Modal } from '../../../components/ui/Modal'
import { newSessionSchema, TASK_ICONS, type NewSessionSchema } from '../newSessionSchema'
import { buildSessionFromForm } from '../buildSessionFromForm'
import { useCreatedSessionsStore } from '../../../store/created-sessions-store'
import { track } from '../../../lib/tracking'
import { createSession } from '../api'

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

interface NewSessionModalProps {
  open: boolean
  onClose: () => void
}

export function NewSessionModal({ open, onClose }: NewSessionModalProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const addSession = useCreatedSessionsStore((s) => s.addSession)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewSessionSchema>({
    resolver: zodResolver(newSessionSchema),
    defaultValues: {
      taskLabel: 'Coding',
      date: new Date().toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '10:00',
      note: '',
    },
  })

  const onSubmit = async (data: NewSessionSchema) => {
    try {
      const startMin = parseTimeToMinutes(data.startTime)
      const endMin = parseTimeToMinutes(data.endTime)
      const durationMin = Math.max(0, endMin - startMin)

      const result = await createSession({
        taskLabel: data.taskLabel,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMin,
        avgStr: 0.7,
        flowRatio: 0.5,
        peakStr: 0.5,
        longestFlowStreakMin: Math.floor(durationMin / 3),
        flowIntervals: [
          { startMin: 0, endMin: Math.floor(durationMin / 3), state: 'Neutral', avgSTR: 0.95 },
          { startMin: Math.floor(durationMin / 3), endMin: durationMin, state: 'Flow', avgSTR: 0.55 },
        ],
        strTimeseries: [
          { t: 0, str: 1.0 },
          { t: Math.floor(durationMin / 2), str: 0.55 },
          { t: durationMin, str: 0.98 },
        ],
        quality: { eye: 90, eeg: 88, hr: 92 },
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
      track('session_create', { sessionId: result.data.id, taskLabel: result.data.taskLabel })
      reset()
      onClose()
    } catch (error) {
      console.error('[NewSessionModal] API save failed, falling back to local store:', error)
      const session = buildSessionFromForm(data)
      addSession(session)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['sessions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
      track('session_create', { sessionId: session.id, taskLabel: session.taskLabel })
      reset()
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="">
      <div className="p-8 sm:p-10">
        {/* Header: title + close + subtitle */}
        <div className="relative mb-8">
          <h2 className="text-[34px] font-bold leading-normal text-slate-900">
            {t('sessions.newSessionTitle', 'Add New Session')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-2xl leading-none text-slate-700 hover:opacity-70"
            aria-label={t('common.close')}
          >
            ×
          </button>
          <p className="mt-2 text-lg text-slate-500">
            {t('sessions.newSessionSubtitle', 'Create a new flow session with date, time and notes.')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <p className="rounded-[14px] bg-red-50 px-4 py-3 text-sm text-red-600">{errors.root.message}</p>
          )}

          {/* Row 1: Date (single) - full width or half; design has Start date + End date, we use one Date */}
          <div>
            <label className="mb-1.5 block text-base font-bold uppercase tracking-[1px] text-slate-400">
              {t('sessions.date', 'Date')}
            </label>
            <input
              type="date"
              className="h-[60px] w-full rounded-[14px] border border-slate-200 bg-slate-100 px-4 text-[20px] font-semibold text-slate-900 focus:border-2 focus:border-blue-500 focus:bg-white focus:outline-none"
              {...register('date')}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>

          {/* Row 2: Start time + End time */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-base font-bold uppercase tracking-[1px] text-slate-400">
                {t('sessions.startTime', 'Start time')}
              </label>
              <input
                type="text"
                placeholder="09:00"
                className="h-[60px] w-full rounded-[14px] border border-slate-200 bg-white px-4 text-[20px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-2 focus:border-blue-500 focus:outline-none"
                {...register('startTime')}
              />
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-base font-bold uppercase tracking-[1px] text-slate-400">
                {t('sessions.endTime', 'End time')}
              </label>
              <input
                type="text"
                placeholder="10:00"
                className="h-[60px] w-full rounded-[14px] border border-slate-200 bg-white px-4 text-[20px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-2 focus:border-blue-500 focus:outline-none"
                {...register('endTime')}
              />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>}
            </div>
          </div>

          {/* Row 3: Session type (task) - EVENT NAME in design */}
          <div>
            <label className="mb-1.5 block text-base font-bold uppercase tracking-[1px] text-slate-400">
              {t('sessions.taskType', 'Session type')}
            </label>
            <select
              className="h-[60px] w-full rounded-[14px] border border-slate-200 bg-white px-4 text-[18px] font-semibold text-slate-900 focus:border-2 focus:border-blue-500 focus:outline-none"
              {...register('taskLabel')}
            >
              {(Object.keys(TASK_ICONS) as NewSessionSchema['taskLabel'][]).map((task) => (
                <option key={task} value={task}>
                  {TASK_ICONS[task]} {task}
                </option>
              ))}
            </select>
            {errors.taskLabel && <p className="mt-1 text-sm text-red-600">{errors.taskLabel.message}</p>}
          </div>

          {/* Row 4: Description (note) */}
          <div>
            <label className="mb-1.5 block text-base font-bold uppercase tracking-[1px] text-slate-400">
              {t('sessions.note', 'Description')}
            </label>
            <textarea
              rows={4}
              placeholder={t('sessions.notePlaceholder', 'Optional notes for this session.')}
              className="w-full resize-y rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-[16px] leading-6 text-slate-900 placeholder:text-slate-400 focus:border-2 focus:border-blue-500 focus:outline-none"
              {...register('note')}
            />
          </div>

          {/* Actions: Cancel (secondary) + Submit (primary) */}
          <div className="flex flex-wrap items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[60px] min-w-[180px] items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white text-[18px] font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[60px] min-w-[194px] items-center justify-center gap-2 rounded-[14px] bg-blue-500 text-[18px] font-bold text-white shadow-glow hover:bg-blue-600 disabled:opacity-60"
            >
              {isSubmitting ? t('common.loading') : t('sessions.createSession', 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
