import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../../../components/ui/PageHeader'
import { MetricCard } from '../../../components/ui/MetricCard'
import { Surface } from '../../../components/ui/Surface'
import { IconfontIcon } from '../../../components/ui/IconfontIcon'
import { InsightCard } from '../../../components/cards/InsightCard'
import { SessionListCard } from '../../../components/cards/SessionListCard'
import { FlowCalendar } from '../../../components/calendar/FlowCalendar'
import { useDashboardData } from '../hooks'
import { formatPercent, formatStr, getStrNarrativeKey, safeDateFormat } from '../../../lib/utils'
import { TaskIconView } from '../../../components/ui/TaskIconView'
import { getDateLocale } from '../../../lib/date-locale'

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { data } = useDashboardData()

  if (!data) return null
  const topSessionNote = data.topSession.note.startsWith('sessionNotes.') ? t(data.topSession.note) : data.topSession.note

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('dashboard.overview')}
        title={t('dashboard.headline')}
        description={t('dashboard.headlineDesc')}
        actions={
          <Link
            to="/sessions"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            {t('dashboard.openSessions')}
            <IconfontIcon name="arrow-right" size={16} className="text-white" />
          </Link>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[8fr_4fr]">
        <Surface className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                <IconfontIcon name="star" size={12} className="text-blue-600" />
                {t('dashboard.bestSession')}
              </div>
              <h3 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900">
                <TaskIconView icon={data.topSession.taskIcon} size={44} className="mr-3 inline-block align-middle text-slate-700" />
                {t(`tasks.${data.topSession.taskLabel}`)}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{topSessionNote}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:min-w-[300px]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{t('dashboard.flowRatio')}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{formatPercent(data.topSession.flowPercent)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{t('dashboard.avgSTR')}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{formatStr(data.topSession.avgSTR)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{t('dashboard.quality')}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{data.topSession.qualityScore}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{t('dashboard.interpretation')}</p>
                <p className="mt-3 text-base font-medium text-blue-600">{t(getStrNarrativeKey(data.topSession.avgSTR))}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyFlowData}>
                <defs>
                  <linearGradient id="dashboardFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => t(`daysShort.${value}`)}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    borderColor: '#e2e8f0',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
                  }}
                />
                <Area type="monotone" dataKey="flowMin" stroke="#3b82f6" fill="url(#dashboardFlow)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <div className="grid gap-6 xl:max-w-xl">
          <MetricCard
            icon="clock"
            label={t('dashboard.lastSession')}
            value={safeDateFormat(data.summary.lastSessionDate, 'MMM d, yyyy', { locale: getDateLocale(i18n.language) })}
            description={t('dashboard.lastSessionDesc')}
            tone="cyan"
          />
          <MetricCard
            icon="activity"
            label={t('dashboard.flowTime')}
            value={t('common.minutesFormat', { value: data.summary.totalFlowTimeMin })}
            description={t('dashboard.flowTimeDescMetric')}
            tone="flow"
          />
          <MetricCard
            icon="gauge"
            label={t('dashboard.avgSTR')}
            value={formatStr(data.summary.avgSTR)}
            description={t('dashboard.avgSTRDescMetric')}
            tone="focused"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="brain"
          label={t('dashboard.totalSessions')}
          value={String(data.weeklyStats.totalSessions)}
          description={t('dashboard.totalSessionsDesc')}
          tone="neutral"
        />
        <MetricCard
          icon="activity"
          label={t('dashboard.weeklyFlow')}
          value={t('common.minutesFormat', { value: data.weeklyStats.weeklyFlowTimeMin })}
          description={t('dashboard.weeklyFlowDesc')}
          tone="flow"
        />
        <MetricCard
          icon="gauge"
          label={t('dashboard.weeklySTR')}
          value={formatStr(data.weeklyStats.avgSTRThisWeek)}
          description={t('dashboard.weeklySTRDesc')}
          tone="cyan"
        />
        <MetricCard
          icon="star"
          label={t('dashboard.longestStreak')}
          value={t('common.minutesFormat', { value: data.summary.longestFlowStreakMin })}
          description={t('dashboard.longestStreakDesc')}
          tone="focused"
        />
      </section>

      <section>
        <FlowCalendar />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('dashboard.recentSessions')}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dashboard.mostRecentRecords')}</h3>
            </div>
            <Link to="/sessions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {t('dashboard.seeAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentSessions.map((session) => (
              <SessionListCard key={session.id} session={session} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-400">{t('dashboard.insights')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dashboard.autoInsights')}</h3>
          </div>
          {data.insights.map((item) => (
            <InsightCard key={item.id} icon={item.icon} text={item.text} textKey={item.textKey} />
          ))}
        </div>
      </section>
    </div>
  )
}

