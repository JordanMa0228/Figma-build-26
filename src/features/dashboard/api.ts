import { api } from '../../lib/api-client'
import type { DashboardPayload } from '../../types/api'
import type { SessionRecord, WeeklyFlowDatum } from '../../types/domain'
import type { TaskType } from '../../types/domain'
import { getSessions } from '../sessions/api'

interface BackendSummary {
  totalSessions: number
  weeklyFlowTimeMin: number
  avgSTRThisWeek: number
  lastSessionDate: string | null
  todayFlowTimeMin: number
  todayAvgSTR: number
  todayLongestStreakMin: number
}

const DAYS: WeeklyFlowDatum['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function buildWeeklyFlowData(sessions: SessionRecord[]): WeeklyFlowDatum[] {
  const map: Record<string, number> = {}
  DAYS.forEach(d => { map[d] = 0 })
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  for (const s of sessions) {
    const d = new Date(s.date)
    if (d >= sevenDaysAgo) {
      const jsDay = d.getDay()
      const label = DAYS[(jsDay + 6) % 7]
      map[label] += Math.round(s.durationMin * (s.flowPercent / 100))
    }
  }
  return DAYS.map(day => ({ day, flowMin: map[day] }))
}

export async function getDashboardData(): Promise<{ success: true; data: DashboardPayload }> {
  const [sessionsResult, summaryRes] = await Promise.all([
    getSessions(),
    api.get<BackendSummary>('/sessions/summary'),
  ])

  const sessions = sessionsResult.data
  const summary = summaryRes.data

  const recentSessions = sessions.slice(0, 5)
  const topSession: SessionRecord = sessions.reduce<SessionRecord | undefined>(
    (best, s) => (!best || s.flowPercent > best.flowPercent ? s : best),
    undefined,
  ) ?? {
    id: '',
    taskLabel: 'Coding' as TaskType,
    taskIcon: '💻',
    date: '',
    startTime: '',
    endTime: '',
    durationMin: 0,
    avgSTR: 0,
    peakSTR: 0,
    flowPercent: 0,
    longestFlowStreakMin: 0,
    dataQuality: { eye: 0, eeg: 0, hr: 0 },
    flowTimeline: [],
    strTimeseries: [],
    qualityScore: 0,
    distractionEvents: 0,
    note: 'No sessions yet. Start your first session!',
  }
  const weeklyFlowData = buildWeeklyFlowData(sessions)

  const insights = [
    {
      id: 1,
      icon: '🏆',
      textKey: 'insights.bestTask',
      textValues: {
        task: topSession ? topSession.taskLabel : '',
        percent: topSession ? topSession.flowPercent.toFixed(0) : '0',
      },
      text: '',
    },
    {
      id: 2,
      icon: '📈',
      textKey: 'insights.peakSTR',
      textValues: { value: summary.avgSTRThisWeek.toFixed(2) },
      text: '',
    },
    {
      id: 3,
      icon: '⏱️',
      textKey: 'insights.totalFlowTime',
      textValues: { value: summary.weeklyFlowTimeMin },
      text: '',
    },
  ]

  return {
    success: true,
    data: {
      summary: {
        lastSessionDate: summary.lastSessionDate ?? '',
        totalFlowTimeMin: summary.weeklyFlowTimeMin,
        avgSTR: summary.avgSTRThisWeek,
        longestFlowStreakMin: summary.todayLongestStreakMin,
      },
      weeklyStats: {
        totalSessions: summary.totalSessions,
        weeklyFlowTimeMin: summary.weeklyFlowTimeMin,
        avgSTRThisWeek: summary.avgSTRThisWeek,
      },
      recentSessions,
      weeklyFlowData,
      insights,
      topSession,
    },
  }
}

