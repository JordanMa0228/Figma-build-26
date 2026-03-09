import { z } from 'zod'

export const newSessionSchema = z.object({
  taskLabel: z.enum(['Coding', 'Poker', 'Class', 'Music', 'Email']),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^\d{1,2}:\d{2}$/, 'Use HH:mm'),
  endTime: z.string().regex(/^\d{1,2}:\d{2}$/, 'Use HH:mm'),
  note: z.string(),
}).refine(
  (data) => {
    const [sh, sm] = data.startTime.split(':').map(Number)
    const [eh, em] = data.endTime.split(':').map(Number)
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    return endMin > startMin
  },
  { message: 'End time must be after start time', path: ['endTime'] },
)

export type NewSessionSchema = z.infer<typeof newSessionSchema>

export const TASK_ICONS: Record<NewSessionSchema['taskLabel'], string> = {
  Coding: '💻',
  Poker: '🃏',
  Class: '📚',
  Music: '🎵',
  Email: '📧',
}
