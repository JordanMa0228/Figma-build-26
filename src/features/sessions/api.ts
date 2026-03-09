import { api } from '../../lib/api-client'
import type { FlowSegment, SessionRecord, StrPoint, SensorQuality } from '../../types/domain'

interface RawSession {
  id: string
  taskLabel: string
  date: string
  startTime?: string
  endTime?: string
  durationMin: number
  avgStr: number
  flowRatio: number
  peakStr?: number
  longestFlowStreakMin?: number
  report?: {
    flowIntervals?: string
    strTimeseries?: string
    quality?: string
    summary?: string
  }
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
  let peakSTR = raw.peakStr ?? 0
  let longestFlowStreakMin = raw.longestFlowStreakMin ?? 0
  let startTime = raw.startTime ?? ''
  let endTime = raw.endTime ?? ''

  if (raw.report) {
    try { flowTimeline = JSON.parse(raw.report.flowIntervals ?? '[]') } catch (e) { console.error('[mapSession] Failed to parse flowIntervals:', e); flowTimeline = [] }
    try { strTimeseries = JSON.parse(raw.report.strTimeseries ?? '[]') } catch (e) { console.error('[mapSession] Failed to parse strTimeseries:', e); strTimeseries = [] }
    try { dataQuality = JSON.parse(raw.report.quality ?? '{}') } catch (e) { console.error('[mapSession] Failed to parse quality:', e); dataQuality = { eye: 0, eeg: 0, hr: 0 } }
    try {
      const summary = JSON.parse(raw.report.summary ?? '{}')
      peakSTR = summary.peakStr ?? peakSTR
      longestFlowStreakMin = summary.longestStreakMin ?? longestFlowStreakMin
      startTime = summary.startTime ?? startTime
      endTime = summary.endTime ?? endTime
    } catch (e) { console.error('[mapSession] Failed to parse summary:', e) }
  }

  return {
    id: raw.id,
    taskLabel: raw.taskLabel as SessionRecord['taskLabel'],
    taskIcon: TASK_ICONS[raw.taskLabel] ?? '📋',
    date: raw.date,
    startTime,
    endTime,
    durationMin: raw.durationMin,
    avgSTR: raw.avgStr,
    flowPercent: raw.flowRatio,
    peakSTR,
    longestFlowStreakMin,
    flowTimeline,
    strTimeseries,
    dataQuality,
    qualityScore: Math.round((dataQuality.eye + dataQuality.eeg + dataQuality.hr) / 3),
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

