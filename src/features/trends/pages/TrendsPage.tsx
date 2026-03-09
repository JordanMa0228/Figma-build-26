import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../../../components/ui/PageHeader'
import { MetricCard } from '../../../components/ui/MetricCard'
import { Surface } from '../../../components/ui/Surface'
import { InsightCard } from '../../../components/cards/InsightCard'
import { useAnalyticsData } from '../../analytics/hooks'
import { formatStr } from '../../../lib/utils'

export function TrendsPage() {
  const { t } = useTranslation()
  const { data } = useAnalyticsData()

  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('trends.eyebrow')}
        title={t('trends.title')}
        description={t('trends.description')}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="brain"
          label={t('dashboard.totalSessions')}
          value={String(data.overview.totalSessions)}
          description={t('trends.totalSessionsDesc')}
          tone="neutral"
        />
        <MetricCard
          icon="activity"
          label={t('dashboard.flowRatio')}
          value={`${data.overview.avgFlowRatio}%`}
          description={t('trends.avgFlowRatioDesc')}
          tone="flow"
        />
        <MetricCard
          icon="trending"
          label={t('dashboard.avgSTR')}
          value={formatStr(data.overview.avgSTR)}
          description={t('trends.avgSTRDesc')}
          tone="cyan"
        />
        <MetricCard
          icon="star"
          label={t('trends.bestTaskLabel')}
          value={data.overview.bestTaskType}
          description={t('trends.bestTaskDesc')}
          tone="focused"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Surface className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('trends.weeklyTrend')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('trends.flowMinutesByDay')}</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyFlowData}>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="flowMin" radius={[10, 10, 0, 0]}>
                  {data.weeklyFlowData.map((entry) => (
                    <Cell key={entry.day} fill={entry.flowMin > 40 ? '#3b82f6' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <Surface className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('trends.taskBenchmark')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('trends.avgSTRByTask')}</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.avgSTRByTask} layout="vertical">
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="task"
                  type="category"
                  width={70}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey="avgSTR" radius={[0, 10, 10, 0]}>
                  {data.avgSTRByTask.map((entry) => (
                    <Cell key={entry.task} fill={entry.avgSTR < 1 ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Surface className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('trends.daypartAnalysis')}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('trends.bestFocusTime')}</h3>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.focusTimeOfDay}>
                <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="avgFlow" radius={[10, 10, 0, 0]}>
                  {data.focusTimeOfDay.map((entry) => (
                    <Cell key={entry.period} fill={entry.avgFlow >= 60 ? '#3b82f6' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('trends.insightFeed')}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{t('trends.narrativeTakeaways')}</h3>
          </div>
          {data.insights.map((item) => (
            <InsightCard key={item.id} icon={item.icon} text={t(item.textKey, item.textParams)} />
          ))}
        </div>
      </section>
    </div>
  )
}

