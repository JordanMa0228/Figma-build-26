import type { SessionRecord, TaskType } from '../../types/domain'
import type { NewSessionSchema } from './newSessionSchema'
import { TASK_ICONS } from './newSessionSchema'
import { generateSessionStats } from './generateSessionStats'

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function buildSessionFromForm(data: NewSessionSchema, overrideTaskLabel?: string): SessionRecord {
  const startMin = parseTimeToMinutes(data.startTime)
  const endMin = parseTimeToMinutes(data.endTime)
  const durationMin = Math.max(0, endMin - startMin)
  const id = `session-${Date.now()}`
  const resolvedTaskLabel = overrideTaskLabel ?? data.taskLabel

  return {
    id,
    taskLabel: resolvedTaskLabel as TaskType,
    taskIcon: data.taskLabel === 'Custom' ? '✏️' : (TASK_ICONS[data.taskLabel] ?? '✏️'),
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    durationMin,
    ...generateSessionStats(durationMin),
    note: data.note || 'New session.',
  }
}
