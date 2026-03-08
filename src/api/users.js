const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const SETTINGS_KEY = 'flowsense_settings'

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

const DEFAULT_SETTINGS = {
  sensors: { eye: true, eeg: true, hr: true },
  qualityThreshold: 80,
  flowSensitivity: 'Balanced',
  cloudSync: false,
}

/**
 * GET /api/users/settings — returns user settings.
 * Falls back to localStorage if the request fails (e.g. network error or 404).
 */
export async function getSettings() {
  try {
    const res = await fetch(`${BASE_URL}/api/users/settings`, {
      headers: authHeaders(),
    })
    if (!res.ok) throw Object.assign(new Error('Failed to fetch settings'), { status: res.status })
    const data = await res.json()
    // Cache to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
    return { ...DEFAULT_SETTINGS, ...data }
  } catch (err) {
    // Fall back to localStorage cache on network error or server unavailability
    console.warn('Failed to fetch settings from server, falling back to local cache:', err)
    const cached = localStorage.getItem(SETTINGS_KEY)
    if (cached) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) } } catch { /* ignore */ }
    }
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * PATCH /api/users/settings — saves user settings to the server.
 * Also writes to localStorage as a cache.
 */
export async function saveSettings(data) {
  // Always write to localStorage as cache
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(data))
  const res = await fetch(`${BASE_URL}/api/users/settings`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to save settings'), { status: res.status })
  return res.json()
}
