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
import { formatMinutes, formatPercent, formatStr, getStrNarrative } from '../../../lib/utils'
import { useAuthStore } from '../../../store/auth-store'

export function DashboardPage() {
  const { t } = useTranslation()
  const token = useAuthStore((s) => s.token)
  const { data, isLoading, isError } = useDashboardData()

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl" role="img" aria-label="Brain icon">🧠</div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t('dashboard.welcomeTitle', 'Welcome to FlowSense')}
          </h2>
          <p className="text-slate-500">
            {t('dashboard.welcomeDesc', 'Track your sessions, flow time, and signal quality. Sign in to get started.')}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
            >
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-3" role="alert">
          <p className="text-slate-500">{t('common.errorLoadingData', 'Failed to load dashboard. Please try again.')}</p>
        </div>
      </div>
    )
  }

  const hasSessions = data.recentSessions.length > 0

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

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Surface className="p-6">
          {hasSessions ? (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <IconfontIcon name="star" size={12} className="text-blue-600" />
                    {t('dashboard.bestSession')}
                  </div>
                  <h3 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                    {data.topSession.taskIcon} {data.topSession.taskLabel}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{data.topSession.note}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('dashboard.flowRatio')}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{formatPercent(data.topSession.flowPercent)}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('dashboard.avgSTR')}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{formatStr(data.topSession.avgSTR)}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('dashboard.quality')}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{data.topSession.qualityScore}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('dashboard.interpretation')}</p>
                    <p className="mt-3 text-base font-medium text-blue-600">{t(getStrNarrative(data.topSession.avgSTR))}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weeklyFlowData}>
                    <defs>
                      <linearGradient id="dashboardFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="flowMin" stroke="#3b82f6" fill="url(#dashboardFlow)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-2xl">🎯</p>
              <h3 className="text-xl font-semibold text-slate-700">{t('dashboard.noSessionsYet', 'No sessions yet')}</h3>
              <p className="text-sm text-slate-500 max-w-xs">{t('dashboard.noSessionsDesc', 'Complete your first focus session to see your analytics here.')}</p>
              <Link to="/sessions" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
                {t('dashboard.openSessions')}
              </Link>
            </div>
          )}
        </Surface>

        <div className="grid gap-6">
          <MetricCard
            icon="clock"
            label={t('dashboard.lastSession')}
            value={data.summary.lastSessionDate}
            description={t('dashboard.lastSessionDesc')}
            tone="cyan"
          />
          <MetricCard
            icon="activity"
            label={t('dashboard.flowTime')}
            value={formatMinutes(data.summary.totalFlowTimeMin)}
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
          value={formatMinutes(data.weeklyStats.weeklyFlowTimeMin)}
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
          value={formatMinutes(data.summary.longestFlowStreakMin)}
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
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('dashboard.recentSessions')}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dashboard.mostRecentRecords')}</h3>
            </div>
            <Link to="/sessions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {t('dashboard.seeAll')}
            </Link>
          </div>
          <div className="space-y-4">
            {hasSessions ? (
              data.recentSessions.map((session) => (
                <SessionListCard key={session.id} session={session} />
              ))
            ) : (
              <p className="text-sm text-slate-500">{t('dashboard.noSessionsYet', 'No sessions yet')}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('dashboard.insights')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('dashboard.autoInsights')}</h3>
          </div>
          {data.insights.map((item) => (
            <InsightCard key={item.id} icon={item.icon} text={item.text} />
          ))}
        </div>
      </section>
    </div>
  )
}

