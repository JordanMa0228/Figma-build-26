import { respond, readStorage, writeStorage } from '../../lib/mock-server'
import type { SettingsPayload } from '../../types/api'
import type { SettingsFormValues } from '../../types/domain'

const storageKey = 'flowsense.settings'

export const defaultSettings: SettingsFormValues = {
  sensors: {
    eye: true,
    eeg: true,
    hr: true,
  },
  qualityThreshold: 80,
  flowSensitivity: 'Balanced',
  cloudSync: false,
  localOnly: true,
  allowAnonTraining: false,
}

export async function getSettings() {
  const settings = readStorage<SettingsFormValues>(storageKey, defaultSettings)
  return respond<SettingsPayload>({ settings })
}

export async function saveSettings(nextSettings: SettingsFormValues) {
  writeStorage(storageKey, nextSettings)
  return respond<SettingsPayload>({ settings: nextSettings }, 260)
}

