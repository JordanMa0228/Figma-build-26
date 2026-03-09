import { api } from '../../lib/api-client'
import type { AnalyticsPayload } from '../../types/api'
import type { AnalyticsOverview, FocusTimeDatum, InsightItem, TaskAverageDatum, WeeklyFlowDatum } from '../../types/domain'
import { getSessions } from '../sessions/api'

export async function getAnalyticsData(): Promise<{ success: true; data: AnalyticsPayload }> {
  const [sessionsResult, overviewRes] = await Promise.all([
    getSessions().catch(() => ({ success: true as const, data: [] })),
    api.get<Record<string, unknown>>('/analytics/overview').catch(() => ({ data: {} as Record<string, unknown> })),
  ])

  const sessions = sessionsResult.data
  const overview = overviewRes.data || {}

  const analyticsOverview: AnalyticsOverview = {
    totalSessions: (overview.totalSessions as number) ?? sessions.length,
    avgFlowRatio: (overview.avgFlowPercent as number) ?? 0,
    avgSTR: (overview.avgStr as number) ?? 0,
    bestTaskType: (overview.bestTaskType as AnalyticsOverview['bestTaskType']) ?? 'Coding',
  }

  return {
    success: true,
    data: {
      overview: analyticsOverview,
      weeklyFlowData: (overview.weeklyFlowData as WeeklyFlowDatum[]) ?? [],
      avgSTRByTask: (overview.avgSTRByTask as TaskAverageDatum[]) ?? [],
      focusTimeOfDay: (overview.focusTimeOfDay as FocusTimeDatum[]) ?? [],
      insights: (overview.insights as InsightItem[]) ?? [],
      sessions,
    },
  }
}

