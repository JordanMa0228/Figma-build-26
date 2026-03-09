import { api } from '../../lib/api-client'
import { readStorage, writeStorage } from '../../lib/mock-server'
import type { SettingsPayload } from '../../types/api'
import type { ApiSuccess } from '../../types/api'
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

export async function getSettings(): Promise<ApiSuccess<SettingsPayload>> {
  try {
    const res = await api.get<SettingsPayload>('/users/settings')
    const settings = res.data.settings && Object.keys(res.data.settings).length > 0
      ? res.data.settings
      : readStorage<SettingsFormValues>(storageKey, defaultSettings)
    return { success: true, data: { settings } }
  } catch {
    const settings = readStorage<SettingsFormValues>(storageKey, defaultSettings)
    return { success: true, data: { settings } }
  }
}

export async function saveSettings(nextSettings: SettingsFormValues): Promise<ApiSuccess<SettingsPayload>> {
  writeStorage(storageKey, nextSettings)
  try {
    await api.patch('/users/settings', nextSettings)
  } catch {
    // fall back to localStorage only if request fails
  }
  return { success: true, data: { settings: nextSettings } }
}

