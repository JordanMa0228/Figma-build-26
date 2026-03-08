import type { SessionRecord } from '../../types/domain'
import type { NewSessionSchema } from './newSessionSchema'
import { TASK_ICONS } from './newSessionSchema'

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function buildSessionFromForm(data: NewSessionSchema): SessionRecord {
  const startMin = parseTimeToMinutes(data.startTime)
  const endMin = parseTimeToMinutes(data.endTime)
  const durationMin = Math.max(0, endMin - startMin)
  const id = `session-${Date.now()}`

  return {
    id,
    taskLabel: data.taskLabel,
    taskIcon: TASK_ICONS[data.taskLabel],
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    durationMin,
    avgSTR: 0.7,
    peakSTR: 0.5,
    flowPercent: 50,
    longestFlowStreakMin: Math.floor(durationMin / 3),
    dataQuality: { eye: 90, eeg: 88, hr: 92 },
    flowTimeline: [
      { startMin: 0, endMin: Math.floor(durationMin / 3), state: 'Neutral', avgSTR: 0.95 },
      { startMin: Math.floor(durationMin / 3), endMin: durationMin, state: 'Flow', avgSTR: 0.55 },
    ],
    strTimeseries: [
      { t: 0, str: 1.0 },
      { t: Math.floor(durationMin / 2), str: 0.55 },
      { t: durationMin, str: 0.98 },
    ],
    qualityScore: 90,
    distractionEvents: 0,
    note: data.note || 'New session.',
  }
}
