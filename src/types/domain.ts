export type TaskType = 'Coding' | 'Poker' | 'Class' | 'Music' | 'Email'
export type TaskFilter = 'All' | TaskType
export type FlowState = 'Flow' | 'Focused' | 'Neutral' | 'Distracted'
export type AccentTone = 'flow' | 'focused' | 'neutral' | 'distracted' | 'cyan'
export type FlowSensitivity = 'Conservative' | 'Balanced' | 'Aggressive'

export interface FlowSegment {
  startMin: number
  endMin: number
  state: FlowState
  avgSTR: number
}

export interface StrPoint {
  t: number
  str: number
}

export interface SensorQuality {
  eye: number
  eeg: number
  hr: number
}

export interface SessionRecord {
  id: string
  taskLabel: TaskType
  taskIcon: string
  date: string
  startTime: string
  endTime: string
  durationMin: number
  avgSTR: number
  peakSTR: number
  flowPercent: number
  longestFlowStreakMin: number
  dataQuality: SensorQuality
  flowTimeline: FlowSegment[]
  strTimeseries: StrPoint[]
  qualityScore: number
  distractionEvents: number
  note: string
}

export interface DashboardSummary {
  lastSessionDate: string
  totalFlowTimeMin: number
  avgSTR: number
  longestFlowStreakMin: number
}

export interface WeeklyStats {
  totalSessions: number
  weeklyFlowTimeMin: number
  avgSTRThisWeek: number
}

export interface InsightItem {
  id: number
  icon: string
  text: string
}

export interface WeeklyFlowDatum {
  day: string
  flowMin: number
}

export interface TaskAverageDatum {
  task: TaskType
  avgSTR: number
}

export interface FocusTimeDatum {
  period: string
  avgFlow: number
}

export interface AnalyticsOverview {
  totalSessions: number
  avgFlowRatio: number
  avgSTR: number
  bestTaskType: TaskType
}

export interface SensorToggleConfig {
  eye: boolean
  eeg: boolean
  hr: boolean
}

export interface SettingsFormValues {
  sensors: SensorToggleConfig
  qualityThreshold: number
  flowSensitivity: FlowSensitivity
  cloudSync: boolean
  localOnly: boolean
  allowAnonTraining: boolean
}

