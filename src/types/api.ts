import type {
  AnalyticsOverview,
  DashboardSummary,
  FocusTimeDatum,
  InsightItem,
  SessionRecord,
  SettingsFormValues,
  TaskAverageDatum,
  WeeklyFlowDatum,
  WeeklyStats,
} from './domain'

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface DashboardPayload {
  summary: DashboardSummary
  weeklyStats: WeeklyStats
  recentSessions: SessionRecord[]
  weeklyFlowData: WeeklyFlowDatum[]
  insights: InsightItem[]
  topSession: SessionRecord
}

export interface AnalyticsPayload {
  overview: AnalyticsOverview
  weeklyFlowData: WeeklyFlowDatum[]
  avgSTRByTask: TaskAverageDatum[]
  focusTimeOfDay: FocusTimeDatum[]
  insights: InsightItem[]
  sessions: SessionRecord[]
}

export interface SettingsPayload {
  settings: SettingsFormValues
}

