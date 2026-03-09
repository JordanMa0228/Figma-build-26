import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns'
import { useSessionsData } from '../../features/sessions/hooks'
import { Surface } from '../ui/Surface'
import { IconfontIcon } from '../ui/IconfontIcon'
import { cn } from '../../lib/utils'
import { getDateLocale } from '../../lib/date-locale'

/** 从 sessions 按日期汇总当日 mind flow 总时长（分钟） */
function useDailyFlowMinutes(): Record<string, number> {
  const { data: sessions = [] } = useSessionsData()
  return useMemo(() => {
    const byDate: Record<string, number> = {}
    for (const s of sessions) {
      const flowMin = Math.round((s.durationMin * s.flowPercent) / 100)
      byDate[s.date] = (byDate[s.date] ?? 0) + flowMin
    }
    return byDate
  }, [sessions])
}

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export function FlowCalendar() {
  const { t, i18n } = useTranslation()
  const [viewDate, setViewDate] = useState(() => new Date())
  const dailyFlow = useDailyFlowMinutes()

  const { days, monthStartWeekday } = useMemo(() => {
    const start = startOfMonth(viewDate)
    const end = endOfMonth(viewDate)
    const daysInMonth = eachDayOfInterval({ start, end })
    return {
      days: daysInMonth,
      monthStartWeekday: getDay(start),
    }
  }, [viewDate])

  const prevMonth = () => setViewDate((d) => subMonths(d, 1))
  const nextMonth = () => setViewDate((d) => addMonths(d, 1))

  /** 当月第一天前需要留空的格子数（周日为 0） */
  const leadingBlanks = monthStartWeekday
  const totalCells = leadingBlanks + days.length
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)

  return (
    <Surface className="p-6" glow="flow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{t('calendar.mindFlow')}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{t('calendar.dailyFlowMinutes')}</h3>
          <p className="mt-1 text-sm text-slate-500">{t('calendar.eachDayShows')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label={t('calendar.prevMonth')}
          >
            <IconfontIcon name="arrow-left" size={18} />
          </button>
          <span className="min-w-[10rem] text-center text-base font-semibold text-slate-900">
            {format(viewDate, 'MMMM yyyy', { locale: getDateLocale(i18n.language) })}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label={t('calendar.nextMonth')}
          >
            <IconfontIcon name="arrow-right" size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-7 gap-px rounded-xl border border-slate-200 bg-slate-200 overflow-hidden">
          {WEEKDAY_KEYS.map((key) => (
            <div
              key={key}
              className="bg-slate-50 px-2 py-2 text-center text-xs font-medium text-slate-500"
            >
              {t(`calendar.${key}`)}
            </div>
          ))}
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`lead-${i}`} className="min-h-[4.5rem] bg-slate-50/50" />
          ))}
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const flowMin = dailyFlow[dateKey] ?? 0
            const isCurrentMonth = isSameMonth(day, viewDate)
            const today = isToday(day)
            const hasFlow = flowMin > 0
            const intensity = hasFlow ? Math.min(1, flowMin / 90) : 0
            return (
              <div
                key={dateKey}
                className={cn(
                  'min-h-[4.5rem] flex flex-col bg-white p-2 transition-colors',
                  today && 'ring-1 ring-inset ring-blue-400',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrentMonth ? 'text-slate-900' : 'text-slate-300',
                    today && 'text-blue-600',
                  )}
                >
                  {format(day, 'd')}
                </span>
                {hasFlow ? (
                  <div className="mt-1 flex flex-1 flex-col justify-end">
                    <div
                      className="rounded-lg px-1.5 py-1 text-right text-xs font-medium text-white"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${0.5 + intensity * 0.5})`,
                      }}
                      title={t('common.minutesFormat', { value: flowMin })}
                    >
                      {flowMin}{t('common.minAbbr')}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex-1" />
                )}
              </div>
            )
          })}
          {Array.from({ length: trailingBlanks }).map((_, i) => (
            <div key={`trail-${i}`} className="min-h-[4.5rem] bg-slate-50/50" />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-4 w-6 rounded bg-blue-200" />
            {t('calendar.low')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-4 w-6 rounded bg-blue-500" />
            {t('calendar.high')}
          </span>
        </div>
      </div>
    </Surface>
  )
}
