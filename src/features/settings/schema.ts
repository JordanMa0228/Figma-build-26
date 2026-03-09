import { z } from 'zod'

export const settingsSchema = z.object({
  sensors: z.object({
    eye: z.boolean(),
    eeg: z.boolean(),
    hr: z.boolean(),
  }),
  qualityThreshold: z.number().min(50).max(100),
  flowSensitivity: z.enum(['Conservative', 'Balanced', 'Aggressive']),
  cloudSync: z.boolean(),
  localOnly: z.boolean(),
  allowAnonTraining: z.boolean(),
})

export type SettingsSchema = z.infer<typeof settingsSchema>

