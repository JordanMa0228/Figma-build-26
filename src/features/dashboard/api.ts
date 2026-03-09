import { api } from '../../lib/api-client'
import type { DashboardPayload } from '../../types/api'
import type { DashboardSummary, InsightItem, SessionRecord, WeeklyFlowDatum, WeeklyStats } from '../../types/domain'

export async function getDashboardData(): Promise<{ success: true; data: DashboardPayload }> {
  const [sessionsRes, summaryRes] = await Promise.all([
    api.get<SessionRecord[]>('/sessions').catch(() => ({ data: [] as SessionRecord[] })),
    api.get<Record<string, unknown>>('/sessions/summary').catch(() => ({ data: {} as Record<string, unknown> })),
  ])

  const sessions = (sessionsRes.data || []).map((s: any) => ({ ...s, note: s.note ?? '' }))
  const summary = summaryRes.data || {}

  const dashboardSummary: DashboardSummary = {
    lastSessionDate: (summary.lastSessionDate as string) ?? sessions[0]?.date ?? '',
    totalFlowTimeMin: (summary.totalFocusMin as number) ?? 0,
    avgSTR: (summary.avgStr as number) ?? 0,
    longestFlowStreakMin: (summary.longestFlowStreakMin as number) ?? 0,
  }

  const weeklyStats: WeeklyStats = {
    totalSessions: (summary.totalSessions as number) ?? sessions.length,
    weeklyFlowTimeMin: (summary.weeklyFlowTimeMin as number) ?? 0,
    avgSTRThisWeek: (summary.avgSTRThisWeek as number) ?? 0,
  }

  return {
    success: true,
    data: {
      summary: dashboardSummary,
      weeklyStats,
      recentSessions: sessions.slice(0, 5),
      weeklyFlowData: (summary.weeklyFlowData as WeeklyFlowDatum[]) ?? [],
      insights: (summary.insights as InsightItem[]) ?? [],
      topSession: sessions[0] ?? null as unknown as SessionRecord,
    },
  }
}

