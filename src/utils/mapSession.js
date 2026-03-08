const TASK_ICONS = { Coding: '💻', Poker: '🃏', Class: '📚', Music: '🎵', Email: '📧' }

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function mapSession(s) {
  const flowIntervals = s.report ? safeParse(s.report.flowIntervals, []) : []
  const strTimeseries = s.report ? safeParse(s.report.strTimeseries, []) : []
  const summary = s.report ? safeParse(s.report.summary, {}) : {}
  const dataQuality = s.report ? safeParse(s.report.quality, { eye: 0, eeg: 0, hr: 0 }) : { eye: 0, eeg: 0, hr: 0 }
  return {
    id: s.id,
    taskLabel: s.taskLabel || 'Session',
    taskIcon: TASK_ICONS[s.taskLabel] || '🧠',
    date: s.date,
    startTime: '—',
    endTime: '—',
    durationMin: s.durationMin,
    avgSTR: s.avgStr,
    peakSTR: summary.peakStr || s.avgStr,
    flowPercent: Math.round((s.flowRatio || 0) * 100),
    longestFlowStreakMin: summary.longestStreak || 0,
    dataQuality,
    flowTimeline: flowIntervals.map(f => ({ startMin: f.startMin, endMin: f.endMin, state: f.state, avgSTR: f.avgSTR })),
    strTimeseries,
  }
}
