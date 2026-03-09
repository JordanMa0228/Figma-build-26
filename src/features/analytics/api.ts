import { analyticsOverview, avgSTRByTask, focusTimeOfDay, insights, sessions, weeklyFlowData } from '../../data/mock-data'
import { respond } from '../../lib/mock-server'
import type { AnalyticsPayload } from '../../types/api'

export async function getAnalyticsData() {
  return respond<AnalyticsPayload>({
    overview: analyticsOverview,
    weeklyFlowData,
    avgSTRByTask,
    focusTimeOfDay,
    insights,
    sessions,
  })
}

