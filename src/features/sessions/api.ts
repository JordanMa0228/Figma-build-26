import { api } from '../../lib/api-client'
import type { FlowSegment, SessionRecord, StrPoint, SensorQuality, TaskType } from '../../types/domain'

// Raw shape returned by the backend
interface RawSession {
  id: string
  taskLabel?: string
  date: string
  durationMin: number
  avgStr: number
  flowRatio: number
  report?: {
    flowIntervals?: string
    strTimeseries?: string
    quality?: string
    summary?: string
  } | null
}

const TASK_ICONS: Record<string, string> = {
  Coding: '💻',
  Poker: '🃏',
  Class: '📚',
  Music: '🎵',
  Email: '📧',
}

function mapSession(raw: RawSession): SessionRecord {
  let flowTimeline: FlowSegment[] = []
  let strTimeseries: StrPoint[] = []
  let dataQuality: SensorQuality = { eye: 0, eeg: 0, hr: 0 }
  let peakSTR = 0
  let longestFlowStreakMin = 0
  let startTime = ''
  let endTime = ''

  if (raw.report) {
    try { flowTimeline = JSON.parse(raw.report.flowIntervals || '[]') } catch { /* ignore */ }
    try { strTimeseries = JSON.parse(raw.report.strTimeseries || '[]') } catch { /* ignore */ }
    try { dataQuality = JSON.parse(raw.report.quality || '{}') } catch { /* ignore */ }
    try {
      const summary = JSON.parse(raw.report.summary || '{}')
      peakSTR = summary.peakStr ?? 0
      longestFlowStreakMin = summary.longestStreakMin ?? summary.longestStreak ?? 0
      startTime = summary.startTime ?? ''
      endTime = summary.endTime ?? ''
    } catch { /* ignore */ }
  }

  return {
    id: raw.id,
    taskLabel: (raw.taskLabel || 'Coding') as TaskType,
    taskIcon: TASK_ICONS[raw.taskLabel || 'Coding'] ?? '📋',
    date: raw.date,
    startTime,
    endTime,
    durationMin: raw.durationMin,
    avgSTR: raw.avgStr,
    peakSTR,
    flowPercent: raw.flowRatio * 100,
    longestFlowStreakMin,
    dataQuality,
    flowTimeline,
    strTimeseries,
    qualityScore: 0,
    distractionEvents: 0,
    note: '',
  }
}

export async function getSessions(): Promise<{ success: true; data: SessionRecord[] }> {
  const res = await api.get<RawSession[]>('/sessions')
  return { success: true, data: res.data.map(mapSession) }
}

export async function getSessionDetail(id: string): Promise<{ success: true; data: SessionRecord | undefined }> {
  const res = await api.get<RawSession>(`/sessions/${id}`)
  return { success: true, data: mapSession(res.data) }
}

export async function createSession(data: {
  taskLabel: string
  date: string
  startTime: string
  endTime: string
  durationMin: number
  avgStr: number
  flowRatio: number
  peakStr: number
  longestFlowStreakMin: number
  flowIntervals: FlowSegment[]
  strTimeseries: StrPoint[]
  quality: SensorQuality
}): Promise<{ success: true; data: SessionRecord }> {
  const res = await api.post<RawSession>('/sessions', data)
  return { success: true, data: mapSession(res.data) }
}

export async function deleteSession(id: string): Promise<{ success: true; data: { message: string } }> {
  const res = await api.delete<{ message: string }>(`/sessions/${id}`)
  return { success: true, data: res.data }
}

