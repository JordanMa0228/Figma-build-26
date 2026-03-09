import { api } from '../../lib/api-client'
import type { AnalyticsPayload } from '../../types/api'
import type {
  AnalyticsOverview,
  FocusTimeDatum,
  InsightItem,
  TaskAverageDatum,
  TaskType,
  WeeklyFlowDatum,
} from '../../types/domain'
import { getSessions } from '../sessions/api'

interface BackendAnalytics {
  weeklyFlowData: WeeklyFlowDatum[]
  avgSTRByTask: { task: string; avgSTR: number }[]
  focusTimeOfDay: FocusTimeDatum[]
  analyticsOverview: {
    totalSessions: number
    avgFlowRatio: number
    avgSTR: number
    bestTaskType: string
  }
}

export async function getAnalyticsData(): Promise<{ success: true; data: AnalyticsPayload }> {
  const [sessionsResult, analyticsRes] = await Promise.all([
    getSessions(),
    api.get<BackendAnalytics>('/sessions/analytics'),
  ])

  const sessions = sessionsResult.data
  const analytics = analyticsRes.data

  const overview: AnalyticsOverview = {
    totalSessions: analytics.analyticsOverview.totalSessions,
    avgFlowRatio: analytics.analyticsOverview.avgFlowRatio,
    avgSTR: analytics.analyticsOverview.avgSTR,
    bestTaskType: (analytics.analyticsOverview.bestTaskType || 'Coding') as TaskType,
  }

  const avgSTRByTask: TaskAverageDatum[] = analytics.avgSTRByTask.map(item => ({
    task: (item.task || 'Coding') as TaskType,
    avgSTR: item.avgSTR,
  }))

  const insights: InsightItem[] = [
    {
      id: 1,
      icon: '🏆',
      text: `Best task type: ${overview.bestTaskType}`,
    },
    {
      id: 2,
      icon: '📈',
      text: `Average STR: ${overview.avgSTR.toFixed(2)}`,
    },
    {
      id: 3,
      icon: '⏱️',
      text: `Average flow ratio: ${(overview.avgFlowRatio * 100).toFixed(0)}%`,
    },
  ]

  return {
    success: true,
    data: {
      overview,
      weeklyFlowData: analytics.weeklyFlowData,
      avgSTRByTask,
      focusTimeOfDay: analytics.focusTimeOfDay,
      insights,
      sessions,
    },
  }
}

