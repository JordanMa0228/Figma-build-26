import type {
  AnalyticsOverview,
  DashboardSummary,
  FocusTimeDatum,
  InsightItem,
  SessionRecord,
  TaskAverageDatum,
  TaskFilter,
  TaskType,
  WeeklyFlowDatum,
  WeeklyStats,
} from '../types/domain'
import { average } from '../lib/utils'

const baseSessions: Omit<SessionRecord, 'qualityScore' | 'distractionEvents' | 'note'>[] = [
  {
    id: 'session-001',
    taskLabel: 'Coding',
    taskIcon: '💻',
    date: '2026-03-06',
    startTime: '21:00',
    endTime: '21:23',
    durationMin: 23,
    avgSTR: 0.62,
    peakSTR: 0.48,
    flowPercent: 68,
    longestFlowStreakMin: 11,
    dataQuality: { eye: 98, eeg: 91, hr: 100 },
    flowTimeline: [
      { startMin: 0, endMin: 2, state: 'Neutral', avgSTR: 0.95 },
      { startMin: 2, endMin: 8, state: 'Focused', avgSTR: 0.75 },
      { startMin: 8, endMin: 19, state: 'Flow', avgSTR: 0.51 },
      { startMin: 19, endMin: 21, state: 'Focused', avgSTR: 0.72 },
      { startMin: 21, endMin: 23, state: 'Neutral', avgSTR: 0.98 },
    ],
    strTimeseries: [
      { t: 0, str: 1.02 }, { t: 1, str: 0.95 }, { t: 2, str: 0.88 }, { t: 3, str: 0.8 },
      { t: 4, str: 0.75 }, { t: 5, str: 0.72 }, { t: 6, str: 0.7 }, { t: 7, str: 0.68 },
      { t: 8, str: 0.6 }, { t: 9, str: 0.55 }, { t: 10, str: 0.51 }, { t: 11, str: 0.49 },
      { t: 12, str: 0.48 }, { t: 13, str: 0.5 }, { t: 14, str: 0.52 }, { t: 15, str: 0.53 },
      { t: 16, str: 0.55 }, { t: 17, str: 0.58 }, { t: 18, str: 0.62 }, { t: 19, str: 0.7 },
      { t: 20, str: 0.75 }, { t: 21, str: 0.9 }, { t: 22, str: 0.98 }, { t: 23, str: 1.02 },
    ],
  },
  {
    id: 'session-002',
    taskLabel: 'Poker',
    taskIcon: '🃏',
    date: '2026-03-05',
    startTime: '19:30',
    endTime: '20:15',
    durationMin: 45,
    avgSTR: 0.65,
    peakSTR: 0.45,
    flowPercent: 72,
    longestFlowStreakMin: 18,
    dataQuality: { eye: 95, eeg: 88, hr: 99 },
    flowTimeline: [
      { startMin: 0, endMin: 3, state: 'Neutral', avgSTR: 0.92 },
      { startMin: 3, endMin: 10, state: 'Focused', avgSTR: 0.72 },
      { startMin: 10, endMin: 28, state: 'Flow', avgSTR: 0.5 },
      { startMin: 28, endMin: 32, state: 'Focused', avgSTR: 0.68 },
      { startMin: 32, endMin: 40, state: 'Flow', avgSTR: 0.52 },
      { startMin: 40, endMin: 45, state: 'Neutral', avgSTR: 0.9 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 }, { t: 3, str: 0.9 }, { t: 6, str: 0.78 }, { t: 9, str: 0.68 },
      { t: 12, str: 0.58 }, { t: 15, str: 0.5 }, { t: 18, str: 0.48 }, { t: 21, str: 0.47 },
      { t: 24, str: 0.49 }, { t: 27, str: 0.52 }, { t: 30, str: 0.65 }, { t: 33, str: 0.55 },
      { t: 36, str: 0.5 }, { t: 39, str: 0.52 }, { t: 42, str: 0.82 }, { t: 45, str: 0.95 },
    ],
  },
  {
    id: 'session-003',
    taskLabel: 'Class',
    taskIcon: '📚',
    date: '2026-03-05',
    startTime: '10:00',
    endTime: '11:30',
    durationMin: 90,
    avgSTR: 1.22,
    peakSTR: 1.48,
    flowPercent: 15,
    longestFlowStreakMin: 7,
    dataQuality: { eye: 92, eeg: 85, hr: 97 },
    flowTimeline: [
      { startMin: 0, endMin: 10, state: 'Neutral', avgSTR: 1.1 },
      { startMin: 10, endMin: 20, state: 'Focused', avgSTR: 0.95 },
      { startMin: 20, endMin: 27, state: 'Flow', avgSTR: 0.85 },
      { startMin: 27, endMin: 50, state: 'Distracted', avgSTR: 1.35 },
      { startMin: 50, endMin: 65, state: 'Neutral', avgSTR: 1.2 },
      { startMin: 65, endMin: 75, state: 'Distracted', avgSTR: 1.45 },
      { startMin: 75, endMin: 90, state: 'Neutral', avgSTR: 1.15 },
    ],
    strTimeseries: [
      { t: 0, str: 1.05 }, { t: 10, str: 1.0 }, { t: 20, str: 0.9 }, { t: 30, str: 1.2 },
      { t: 40, str: 1.35 }, { t: 50, str: 1.25 }, { t: 60, str: 1.18 }, { t: 70, str: 1.45 },
      { t: 80, str: 1.3 }, { t: 90, str: 1.15 },
    ],
  },
  {
    id: 'session-004',
    taskLabel: 'Music',
    taskIcon: '🎵',
    date: '2026-03-04',
    startTime: '22:00',
    endTime: '22:35',
    durationMin: 35,
    avgSTR: 0.82,
    peakSTR: 0.62,
    flowPercent: 48,
    longestFlowStreakMin: 12,
    dataQuality: { eye: 88, eeg: 93, hr: 100 },
    flowTimeline: [
      { startMin: 0, endMin: 4, state: 'Neutral', avgSTR: 0.98 },
      { startMin: 4, endMin: 10, state: 'Focused', avgSTR: 0.85 },
      { startMin: 10, endMin: 22, state: 'Flow', avgSTR: 0.65 },
      { startMin: 22, endMin: 28, state: 'Focused', avgSTR: 0.8 },
      { startMin: 28, endMin: 32, state: 'Distracted', avgSTR: 1.05 },
      { startMin: 32, endMin: 35, state: 'Neutral', avgSTR: 0.92 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 }, { t: 5, str: 0.9 }, { t: 10, str: 0.72 }, { t: 15, str: 0.65 },
      { t: 20, str: 0.63 }, { t: 25, str: 0.78 }, { t: 30, str: 1.02 }, { t: 35, str: 0.9 },
    ],
  },
  {
    id: 'session-005',
    taskLabel: 'Email',
    taskIcon: '📧',
    date: '2026-03-04',
    startTime: '09:00',
    endTime: '09:40',
    durationMin: 40,
    avgSTR: 1.18,
    peakSTR: 1.42,
    flowPercent: 10,
    longestFlowStreakMin: 4,
    dataQuality: { eye: 90, eeg: 80, hr: 95 },
    flowTimeline: [
      { startMin: 0, endMin: 8, state: 'Neutral', avgSTR: 1.1 },
      { startMin: 8, endMin: 14, state: 'Focused', avgSTR: 0.98 },
      { startMin: 14, endMin: 18, state: 'Flow', avgSTR: 0.88 },
      { startMin: 18, endMin: 30, state: 'Distracted', avgSTR: 1.3 },
      { startMin: 30, endMin: 40, state: 'Neutral', avgSTR: 1.2 },
    ],
    strTimeseries: [
      { t: 0, str: 1.05 }, { t: 8, str: 1.0 }, { t: 16, str: 0.9 }, { t: 24, str: 1.28 },
      { t: 32, str: 1.4 }, { t: 40, str: 1.22 },
    ],
  },
  {
    id: 'session-006',
    taskLabel: 'Coding',
    taskIcon: '💻',
    date: '2026-03-03',
    startTime: '20:00',
    endTime: '21:00',
    durationMin: 60,
    avgSTR: 0.6,
    peakSTR: 0.44,
    flowPercent: 75,
    longestFlowStreakMin: 25,
    dataQuality: { eye: 99, eeg: 94, hr: 100 },
    flowTimeline: [
      { startMin: 0, endMin: 3, state: 'Neutral', avgSTR: 0.98 },
      { startMin: 3, endMin: 10, state: 'Focused', avgSTR: 0.75 },
      { startMin: 10, endMin: 35, state: 'Flow', avgSTR: 0.48 },
      { startMin: 35, endMin: 42, state: 'Focused', avgSTR: 0.7 },
      { startMin: 42, endMin: 55, state: 'Flow', avgSTR: 0.5 },
      { startMin: 55, endMin: 60, state: 'Neutral', avgSTR: 0.95 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 }, { t: 5, str: 0.88 }, { t: 10, str: 0.7 }, { t: 15, str: 0.55 },
      { t: 20, str: 0.5 }, { t: 25, str: 0.46 }, { t: 30, str: 0.45 }, { t: 35, str: 0.68 },
      { t: 40, str: 0.72 }, { t: 45, str: 0.55 }, { t: 50, str: 0.5 }, { t: 55, str: 0.9 },
      { t: 60, str: 0.98 },
    ],
  },
  {
    id: 'session-007',
    taskLabel: 'Class',
    taskIcon: '📚',
    date: '2026-03-03',
    startTime: '14:00',
    endTime: '15:00',
    durationMin: 60,
    avgSTR: 1.25,
    peakSTR: 1.5,
    flowPercent: 12,
    longestFlowStreakMin: 5,
    dataQuality: { eye: 88, eeg: 82, hr: 96 },
    flowTimeline: [
      { startMin: 0, endMin: 10, state: 'Neutral', avgSTR: 1.15 },
      { startMin: 10, endMin: 20, state: 'Distracted', avgSTR: 1.4 },
      { startMin: 20, endMin: 30, state: 'Neutral', avgSTR: 1.22 },
      { startMin: 30, endMin: 37, state: 'Focused', avgSTR: 0.95 },
      { startMin: 37, endMin: 42, state: 'Flow', avgSTR: 0.82 },
      { startMin: 42, endMin: 60, state: 'Distracted', avgSTR: 1.48 },
    ],
    strTimeseries: [
      { t: 0, str: 1.1 }, { t: 10, str: 1.38 }, { t: 20, str: 1.22 }, { t: 30, str: 0.98 },
      { t: 40, str: 0.85 }, { t: 50, str: 1.45 }, { t: 60, str: 1.5 },
    ],
  },
  {
    id: 'session-008',
    taskLabel: 'Poker',
    taskIcon: '🃏',
    date: '2026-03-02',
    startTime: '21:00',
    endTime: '22:30',
    durationMin: 90,
    avgSTR: 0.63,
    peakSTR: 0.42,
    flowPercent: 78,
    longestFlowStreakMin: 30,
    dataQuality: { eye: 96, eeg: 90, hr: 100 },
    flowTimeline: [
      { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 0.95 },
      { startMin: 5, endMin: 15, state: 'Focused', avgSTR: 0.75 },
      { startMin: 15, endMin: 45, state: 'Flow', avgSTR: 0.45 },
      { startMin: 45, endMin: 52, state: 'Focused', avgSTR: 0.7 },
      { startMin: 52, endMin: 80, state: 'Flow', avgSTR: 0.48 },
      { startMin: 80, endMin: 90, state: 'Neutral', avgSTR: 0.92 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 }, { t: 10, str: 0.8 }, { t: 20, str: 0.55 }, { t: 30, str: 0.46 },
      { t: 40, str: 0.44 }, { t: 50, str: 0.68 }, { t: 60, str: 0.52 }, { t: 70, str: 0.45 },
      { t: 80, str: 0.9 }, { t: 90, str: 0.95 },
    ],
  },
  {
    id: 'session-009',
    taskLabel: 'Music',
    taskIcon: '🎵',
    date: '2026-03-01',
    startTime: '23:00',
    endTime: '23:45',
    durationMin: 45,
    avgSTR: 0.8,
    peakSTR: 0.6,
    flowPercent: 50,
    longestFlowStreakMin: 15,
    dataQuality: { eye: 85, eeg: 91, hr: 100 },
    flowTimeline: [
      { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 0.98 },
      { startMin: 5, endMin: 12, state: 'Focused', avgSTR: 0.82 },
      { startMin: 12, endMin: 27, state: 'Flow', avgSTR: 0.62 },
      { startMin: 27, endMin: 35, state: 'Focused', avgSTR: 0.8 },
      { startMin: 35, endMin: 45, state: 'Neutral', avgSTR: 0.95 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 }, { t: 5, str: 0.88 }, { t: 10, str: 0.75 }, { t: 15, str: 0.63 },
      { t: 20, str: 0.61 }, { t: 25, str: 0.65 }, { t: 30, str: 0.8 }, { t: 35, str: 0.88 },
      { t: 40, str: 0.92 }, { t: 45, str: 0.95 },
    ],
  },
  {
    id: 'session-010',
    taskLabel: 'Email',
    taskIcon: '📧',
    date: '2026-03-01',
    startTime: '08:00',
    endTime: '08:30',
    durationMin: 30,
    avgSTR: 1.15,
    peakSTR: 1.38,
    flowPercent: 8,
    longestFlowStreakMin: 3,
    dataQuality: { eye: 91, eeg: 78, hr: 94 },
    flowTimeline: [
      { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 1.08 },
      { startMin: 5, endMin: 10, state: 'Focused', avgSTR: 0.98 },
      { startMin: 10, endMin: 13, state: 'Flow', avgSTR: 0.88 },
      { startMin: 13, endMin: 25, state: 'Distracted', avgSTR: 1.32 },
      { startMin: 25, endMin: 30, state: 'Neutral', avgSTR: 1.18 },
    ],
    strTimeseries: [
      { t: 0, str: 1.05 }, { t: 5, str: 1.0 }, { t: 10, str: 0.9 }, { t: 15, str: 1.25 },
      { t: 20, str: 1.35 }, { t: 25, str: 1.2 }, { t: 30, str: 1.15 },
    ],
  },
]

const sessionNotes: Record<TaskType, string> = {
  Coding: 'Stable immersion after the warm-up segment with minimal interruption.',
  Poker: 'Fast drop in STR with sustained high-confidence flow intervals.',
  Class: 'Flow windows are short and fragile, with longer distracted stretches.',
  Music: 'Smooth pacing with strong evening focus and moderate recovery latency.',
  Email: 'High context switching profile with elevated subjective time drag.',
}

export const taskOptions: TaskType[] = ['Coding', 'Poker', 'Class', 'Music', 'Email']
export const taskFilterOptions: TaskFilter[] = ['All', ...taskOptions]
export const annotationOptions = ['Very focused', 'Distracted', 'Flow zone', 'Tired', 'Energized']
/** i18n keys for annotation chips (use with t(`annotations.${key}`)). */
export const annotationOptionKeys = ['veryFocused', 'distracted', 'flowZone', 'tired', 'energized'] as const

export const sessions: SessionRecord[] = baseSessions.map((session) => {
  const qualityScore = Math.round(average([session.dataQuality.eye, session.dataQuality.eeg, session.dataQuality.hr]))
  const distractionEvents = session.flowTimeline.filter((segment) => segment.state === 'Distracted').length

  return {
    ...session,
    qualityScore,
    distractionEvents,
    note: sessionNotes[session.taskLabel],
  }
})

export const dashboardSummary: DashboardSummary = {
  lastSessionDate: '2026-03-06',
  totalFlowTimeMin: 16,
  avgSTR: 0.62,
  longestFlowStreakMin: 11,
}

export const weeklyStats: WeeklyStats = {
  totalSessions: sessions.length,
  weeklyFlowTimeMin: 142,
  avgSTRThisWeek: 0.85,
}

export const insights: InsightItem[] = [
  { id: 1, text: 'You enter Flow 2.3x more during Coding than Email sessions.', icon: '💡' },
  { id: 2, text: 'Your STR bottoms out most often between 9 PM and 11 PM.', icon: '🌙' },
  { id: 3, text: 'Poker sessions show the highest average flow ratio this week.', icon: '🃏' },
  { id: 4, text: 'Class sessions carry the highest distraction load and recovery time.', icon: '📚' },
]

export const weeklyFlowData: WeeklyFlowDatum[] = [
  { day: 'Mon', flowMin: 16 },
  { day: 'Tue', flowMin: 32 },
  { day: 'Wed', flowMin: 8 },
  { day: 'Thu', flowMin: 54 },
  { day: 'Fri', flowMin: 28 },
  { day: 'Sat', flowMin: 45 },
  { day: 'Sun', flowMin: 23 },
]

export const avgSTRByTask: TaskAverageDatum[] = [
  { task: 'Email', avgSTR: 1.17 },
  { task: 'Class', avgSTR: 1.24 },
  { task: 'Music', avgSTR: 0.81 },
  { task: 'Coding', avgSTR: 0.61 },
  { task: 'Poker', avgSTR: 0.64 },
]

export const focusTimeOfDay: FocusTimeDatum[] = [
  { period: 'Morning', avgFlow: 18 },
  { period: 'Afternoon', avgFlow: 32 },
  { period: 'Evening', avgFlow: 58 },
  { period: 'Night', avgFlow: 72 },
]

export const analyticsOverview: AnalyticsOverview = {
  totalSessions: sessions.length,
  avgFlowRatio: Math.round(average(sessions.map((session) => session.flowPercent))),
  avgSTR: Number(average(sessions.map((session) => session.avgSTR)).toFixed(2)),
  bestTaskType: 'Poker',
}

export const comparisonDefaults = {
  leftId: sessions[0]?.id ?? '',
  rightId: sessions[1]?.id ?? '',
}

export const bestSession = [...sessions].sort((left, right) => right.flowPercent - left.flowPercent)[0]

export function getSessionById(id?: string) {
  return sessions.find((session) => session.id === id)
}

