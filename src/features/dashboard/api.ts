import { bestSession, dashboardSummary, insights, sessions, weeklyFlowData, weeklyStats } from '../../data/mock-data'
import { respond } from '../../lib/mock-server'
import type { DashboardPayload } from '../../types/api'

export async function getDashboardData() {
  return respond<DashboardPayload>({
    summary: dashboardSummary,
    weeklyStats,
    recentSessions: sessions.slice(0, 5),
    weeklyFlowData,
    insights: insights.slice(0, 3),
    topSession: bestSession,
  })
}

