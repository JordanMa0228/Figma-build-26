const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const TASK_ICONS = { Coding: '💻', Poker: '🃏', Class: '📚', Music: '🎵', Email: '📧' }

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

/**
 * Normalize a raw session from the API into the shape expected by components.
 * API fields:  avgStr, flowRatio, report.{flowIntervals,strTimeseries,quality,summary}
 * Component fields: avgSTR, flowPercent, peakSTR, longestFlowStreakMin, startTime, endTime,
 *                   flowTimeline, strTimeseries, dataQuality, taskIcon
 */
function normalizeSession(s) {
  let summary = {}
  let flowTimeline = []
  let strTimeseries = []
  let dataQuality = {}

  if (s.report) {
    try { summary = JSON.parse(s.report.summary) } catch (e) { console.warn('Failed to parse session summary:', e) }
    try { flowTimeline = JSON.parse(s.report.flowIntervals) } catch (e) { console.warn('Failed to parse flowIntervals:', e) }
    try { strTimeseries = JSON.parse(s.report.strTimeseries) } catch (e) { console.warn('Failed to parse strTimeseries:', e) }
    try { dataQuality = JSON.parse(s.report.quality) } catch (e) { console.warn('Failed to parse quality:', e) }
  }

  return {
    ...s,
    taskIcon: TASK_ICONS[s.taskLabel] || '📋',
    avgSTR: s.avgStr,
    flowPercent: Math.round(s.flowRatio * 100),
    peakSTR: summary.peakStr ?? 0,
    longestFlowStreakMin: summary.longestStreakMin ?? summary.longestStreak ?? 0,
    startTime: summary.startTime || '',
    endTime: summary.endTime || '',
    flowTimeline,
    strTimeseries,
    dataQuality,
  }
}

/** GET /api/sessions — returns all sessions for the logged-in user, normalized */
export async function fetchSessions() {
  const res = await fetch(`${BASE_URL}/api/sessions`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to fetch sessions'), { status: res.status })
  const data = await res.json()
  return data.map(normalizeSession)
}

/** GET /api/sessions/summary — returns dashboard statistics */
export async function fetchSessionSummary() {
  const res = await fetch(`${BASE_URL}/api/sessions/summary`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to fetch summary'), { status: res.status })
  return res.json()
}

/** GET /api/sessions/:id — returns a single session, normalized */
export async function fetchSessionById(id) {
  const res = await fetch(`${BASE_URL}/api/sessions/${id}`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw Object.assign(new Error('Session not found'), { status: res.status })
  return normalizeSession(await res.json())
}

/** POST /api/sessions — create a new session */
export async function createSession(data) {
  const res = await fetch(`${BASE_URL}/api/sessions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to create session'), { status: res.status })
  return normalizeSession(await res.json())
}

/** DELETE /api/sessions/:id — delete a session */
export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/api/sessions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to delete session'), { status: res.status })
  return res.json()
}

/** GET /api/sessions/analytics — returns analytics data */
export async function fetchSessionAnalytics() {
  const res = await fetch(`${BASE_URL}/api/sessions/analytics`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw Object.assign(new Error('Failed to fetch analytics'), { status: res.status })
  return res.json()
}
