import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/ui/PageHeader'
import { FilterChip } from '../../../components/ui/FilterChip'
import { MetricCard } from '../../../components/ui/MetricCard'
import { Surface } from '../../../components/ui/Surface'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { SessionListCard } from '../../../components/cards/SessionListCard'
import { NewSessionModal } from '../components/NewSessionModal'
import { taskFilterOptions } from '../../../data/mock-data'
import { average, formatStr } from '../../../lib/utils'
import { useUiStore } from '../../../store/ui-store'
import { useCreatedSessionsStore } from '../../../store/created-sessions-store'
import { useSessionsData } from '../hooks'

export function SessionsPage() {
  const { t } = useTranslation()
  const [newSessionOpen, setNewSessionOpen] = useState(false)
  const { data: apiSessions = [] } = useSessionsData()
  const createdSessions = useCreatedSessionsStore((s) => s.sessions)
  const sessions = useMemo(
    () => [...createdSessions, ...apiSessions],
    [createdSessions, apiSessions],
  )
  const sessionFilter = useUiStore((state) => state.sessionFilter)
  const sessionSearch = useUiStore((state) => state.sessionSearch)
  const setSessionFilter = useUiStore((state) => state.setSessionFilter)
  const setSessionSearch = useUiStore((state) => state.setSessionSearch)

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesFilter = sessionFilter === 'All' || session.taskLabel === sessionFilter
      const searchValue = sessionSearch.toLowerCase()
      const matchesSearch =
        session.taskLabel.toLowerCase().includes(searchValue) ||
        session.note?.toLowerCase().includes(searchValue) ||
        session.date.includes(searchValue)

      return matchesFilter && matchesSearch
    })
  }, [sessionFilter, sessionSearch, sessions])

  const avgFlow = Math.round(average(filteredSessions.map((session) => session.flowPercent)))
  const avgQuality = Math.round(average(filteredSessions.map((session) => session.qualityScore)))
  const avgSTR = average(filteredSessions.map((session) => session.avgSTR))

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('pages.sessions.title', 'Sessions')}
        title={t('sessions.warehouseTitle', 'Searchable session warehouse')}
        description={t('sessions.warehouseDesc', 'A more data-dense view of every sample. Filters, search, and operational labels.')}
        actions={
          <button
            type="button"
            onClick={() => setNewSessionOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            <IconfontIcon name="plus" size={16} className="text-white" />
            {t('sessions.newSession', 'New session')}
          </button>
        }
      />

      <Surface className="space-y-5 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <IconfontIcon name="search" size={18} className="text-slate-500" />
            <input
              value={sessionSearch}
              onChange={(event) => setSessionSearch(event.target.value)}
              placeholder={t('sessions.searchPlaceholder')}
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              <IconfontIcon name="sliders" size={14} className="text-slate-500" />
              {t('sessions.taskFilter')}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {taskFilterOptions.map((option) => (
                <FilterChip key={option} active={sessionFilter === option} onClick={() => setSessionFilter(option)}>
                  {option}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon="search"
          label={t('sessions.filteredResults')}
          value={String(filteredSessions.length)}
          description={t('sessions.filteredResultsDesc')}
          tone="cyan"
        />
        <MetricCard
          icon="sliders"
          label={t('dashboard.quality')}
          value={`${avgQuality || 0}`}
          description={t('sessions.avgQualityDesc')}
          tone="focused"
        />
        <MetricCard
          icon="gauge"
          label={t('dashboard.avgSTR')}
          value={formatStr(avgSTR || 0)}
          description={t('sessions.avgSTRDescFilteredWithPercent', { percent: avgFlow || 0 })}
          tone="flow"
        />
      </section>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <SessionListCard key={session.id} session={session} />
        ))}
        {!filteredSessions.length ? (
          <Surface className="p-12 text-center">
            <p className="text-lg font-medium text-slate-900">{t('sessions.noSessionsMatch')}</p>
            <p className="mt-2 text-sm text-slate-500">{t('sessions.noSessionsHint')}</p>
          </Surface>
        ) : null}
      </div>

      <NewSessionModal open={newSessionOpen} onClose={() => setNewSessionOpen(false)} />
    </div>
  )
}

