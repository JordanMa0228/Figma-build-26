/**
 * Analytics / tracking facade for backend integration.
 * Call track() at key user actions; replace sendToBackend() with real API when ready.
 */

export type TrackEvent =
  | 'page_view'
  | 'language_change'
  | 'login'
  | 'register'
  | 'logout'
  | 'login_fail'
  | 'register_fail'
  | 'session_create'

export type TrackPayload = Record<string, unknown> & {
  timestamp?: string
  locale?: string
  path?: string
}

let queue: Array<{ event: TrackEvent; payload: TrackPayload }> = []

function sendToBackend(event: TrackEvent, payload: TrackPayload) {
  // TODO: replace with real backend call, e.g. api.post('/analytics/events', { event, ...payload })
  if (import.meta.env.DEV) {
    console.log('[track]', event, payload)
  }
  queue.push({ event, payload })
}

/**
 * Emit a tracking event. Use for analytics; backend can subscribe to these later.
 */
export function track(event: TrackEvent, payload: TrackPayload = {}) {
  const fullPayload: TrackPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
    locale: typeof window !== 'undefined' ? document.documentElement.lang || undefined : undefined,
    path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  }
  sendToBackend(event, fullPayload)
}

/**
 * Flush queued events (e.g. before logout or for batch upload).
 * Backend integration can call this and send queue to server.
 */
export function flushTrackQueue(): typeof queue {
  const copy = [...queue]
  queue = []
  return copy
}
