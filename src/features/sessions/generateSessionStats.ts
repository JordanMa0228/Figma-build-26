import type { FlowSegment, FlowState, SensorQuality, StrPoint } from '../../types/domain'

interface SessionStats {
  // For API (createSession payload)
  avgStr: number
  flowRatio: number
  peakStr: number
  longestFlowStreakMin: number
  flowIntervals: FlowSegment[]
  strTimeseries: StrPoint[]
  quality: SensorQuality
  // For local store (SessionRecord fields)
  avgSTR: number
  flowPercent: number
  peakSTR: number
  dataQuality: SensorQuality
  flowTimeline: FlowSegment[]
  qualityScore: number
  distractionEvents: number
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

const STATE_PATTERNS: FlowState[][] = [
  ['Neutral', 'Flow', 'Focused', 'Flow'],
  ['Neutral', 'Focused', 'Flow', 'Distracted', 'Flow'],
  ['Neutral', 'Flow', 'Distracted', 'Neutral', 'Flow'],
  ['Focused', 'Flow', 'Focused', 'Flow'],
  ['Neutral', 'Flow'],
  ['Neutral', 'Focused', 'Flow'],
]

function avgSTRForState(state: FlowState): number {
  switch (state) {
    case 'Flow':
      return randFloat(0.50, 0.75, 2)
    case 'Focused':
      return randFloat(0.76, 0.90, 2)
    case 'Neutral':
      return randFloat(0.91, 1.05, 2)
    case 'Distracted':
      return randFloat(1.06, 1.40, 2)
    default:
      return randFloat(0.70, 0.90, 2)
  }
}

export function generateSessionStats(durationMin: number): SessionStats {
  if (durationMin <= 0) {
    const quality: SensorQuality = { eye: 90, eeg: 88, hr: 95 }
    const segment: FlowSegment = { startMin: 0, endMin: 0, state: 'Flow', avgSTR: 0.65 }
    return {
      avgStr: 0.7,
      avgSTR: 0.7,
      flowRatio: 0.5,
      flowPercent: 50,
      peakStr: 0.95,
      peakSTR: 0.95,
      longestFlowStreakMin: 0,
      flowIntervals: [segment],
      flowTimeline: [segment],
      strTimeseries: [{ t: 0, str: 0.7 }],
      quality,
      dataQuality: quality,
      qualityScore: 85,
      distractionEvents: 0,
    }
  }

  // Pick a random state pattern
  const pattern = STATE_PATTERNS[Math.floor(Math.random() * STATE_PATTERNS.length)]
  const segmentCount = pattern.length

  // Divide durationMin among segments (each gets 10%–40% of total, last absorbs remainder)
  const rawWeights: number[] = pattern.map(() => randFloat(0.10, 0.40, 4))
  const totalWeight = rawWeights.reduce((a, b) => a + b, 0)

  const segments: FlowSegment[] = []
  let cursor = 0
  for (let i = 0; i < segmentCount; i++) {
    const segDuration =
      i === segmentCount - 1
        ? durationMin - cursor
        : Math.max(1, Math.round((rawWeights[i] / totalWeight) * durationMin))

    const state = pattern[i]
    segments.push({
      startMin: cursor,
      endMin: cursor + segDuration,
      state,
      avgSTR: avgSTRForState(state),
    })
    cursor += segDuration
  }

  // Ensure last segment ends exactly at durationMin
  segments[segments.length - 1].endMin = durationMin

  // Build STR timeseries — one point every 2–4 minutes
  const samplingIntervalMin = randInt(2, 4)
  const timeseries: StrPoint[] = []

  const getSegmentForTime = (t: number): FlowSegment => {
    for (const seg of segments) {
      if (t >= seg.startMin && t <= seg.endMin) return seg
    }
    return segments[segments.length - 1]
  }

  // Always include t=0
  timeseries.push({
    t: 0,
    str: parseFloat(
      Math.min(1.6, Math.max(0.4, getSegmentForTime(0).avgSTR + Math.random() * 0.1 - 0.05)).toFixed(2),
    ),
  })

  for (let t = samplingIntervalMin; t < durationMin; t += samplingIntervalMin) {
    const seg = getSegmentForTime(t)
    const str = parseFloat(
      Math.min(1.6, Math.max(0.4, seg.avgSTR + Math.random() * 0.1 - 0.05)).toFixed(2),
    )
    timeseries.push({ t, str })
  }

  // Always include t=durationMin as last point
  const lastSeg = getSegmentForTime(durationMin)
  const lastStr = parseFloat(
    Math.min(1.6, Math.max(0.4, lastSeg.avgSTR + Math.random() * 0.1 - 0.05)).toFixed(2),
  )
  if (timeseries[timeseries.length - 1].t !== durationMin) {
    timeseries.push({ t: durationMin, str: lastStr })
  }

  // Derived statistics
  const totalDuration = segments.reduce((sum, s) => sum + (s.endMin - s.startMin), 0)
  const weightedSTR = segments.reduce(
    (sum, s) => sum + s.avgSTR * (s.endMin - s.startMin),
    0,
  )
  const avgSTR = parseFloat((weightedSTR / totalDuration).toFixed(2))

  const flowMinutes = segments
    .filter((s) => s.state === 'Flow')
    .reduce((sum, s) => sum + (s.endMin - s.startMin), 0)
  const flowRatio = parseFloat((flowMinutes / durationMin).toFixed(2))
  const flowPercent = Math.round(flowRatio * 100)

  const peakSTR = parseFloat(Math.max(...timeseries.map((p) => p.str)).toFixed(2))

  const longestFlowSegment = segments
    .filter((s) => s.state === 'Flow')
    .reduce((best, s) => Math.max(best, s.endMin - s.startMin), 0)

  const distractionEvents = segments.filter((s) => s.state === 'Distracted').length
  const qualityScore = randInt(72, 98)
  const quality: SensorQuality = {
    eye: randInt(82, 99),
    eeg: randInt(76, 97),
    hr: randInt(86, 100),
  }

  return {
    avgStr: avgSTR,
    avgSTR,
    flowRatio,
    flowPercent,
    peakStr: peakSTR,
    peakSTR,
    longestFlowStreakMin: longestFlowSegment,
    flowIntervals: segments,
    flowTimeline: segments,
    strTimeseries: timeseries,
    quality,
    dataQuality: quality,
    qualityScore,
    distractionEvents,
  }
}
