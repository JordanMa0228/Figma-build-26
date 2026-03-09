import type { ApiSuccess } from '../types/api'

const defaultDelay = 200

export async function respond<T>(data: T, delay = defaultDelay): Promise<ApiSuccess<T>> {
  await new Promise((resolve) => window.setTimeout(resolve, delay))

  return {
    success: true,
    data,
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(key, JSON.stringify(value))
}

