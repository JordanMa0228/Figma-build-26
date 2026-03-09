import type { FlowSegment, FlowState, StrPoint, SensorQuality } from '../../types/domain'

/** Inclusive random float rounded to given decimals */
function randFloat(min: number, max: number, decimals = 2): number {
  const val = min + Math.random() * (max - min)
  const factor = Math.pow(10, decimals)
  return Math.round(val * factor) / factor
}

/** Inclusive random integer */
function randInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

/** STR range per state */
const STR_RANGES: Record<FlowState, [number, number]> = {
  Flow: [0.5, 0.75],
  Focused: [0.75, 0.9],
  Neutral: [0.9, 1.05],
  Distracted: [1.05, 1.4],
}

/** Realistic session state sequences */
const STATE_SEQUENCES: FlowState[][] = [
  ['Neutral', 'Flow', 'Focused', 'Flow'],
  ['Neutral', 'Focused', 'Flow', 'Distracted', 'Flow'],
  ['Focused', 'Flow', 'Neutral', 'Flow'],
  ['Neutral', 'Flow', 'Distracted', 'Flow', 'Focused'],
  ['Neutral', 'Focused', 'Flow'],
  ['Focused', 'Flow', 'Distracted', 'Focused', 'Flow', 'Neutral'],
]

export interface GeneratedSessionStats {
  // Fields for local store (SessionRecord)
  avgSTR: number
  peakSTR: number
  flowPercent: number
  longestFlowStreakMin: number
  dataQuality: SensorQuality
  flowTimeline: FlowSegment[]
  strTimeseries: StrPoint[]
  qualityScore: number
  distractionEvents: number
  // Aliases for API call
  avgStr: number
  peakStr: number
  flowRatio: number
  flowIntervals: FlowSegment[]
  quality: SensorQuality
}

export function generateSessionStats(durationMin: number): GeneratedSessionStats {
  // Handle very short sessions
  if (durationMin < 5) {
    const avgSTR = randFloat(0.55, 0.75)
    const quality: SensorQuality = {
      eye: randInt(80, 99),
      eeg: randInt(75, 97),
      hr: randInt(85, 100),
    }
    const flowTimeline: FlowSegment[] = [
      { startMin: 0, endMin: durationMin, state: 'Flow', avgSTR },
    ]
    const strTimeseries: StrPoint[] = [
      { t: 0, str: randFloat(0.55, 0.75) },
      { t: durationMin, str: randFloat(0.55, 0.75) },
    ]
    return {
      avgSTR,
      peakSTR: randFloat(0.75, 0.95),
      flowPercent: 100,
      longestFlowStreakMin: durationMin,
      dataQuality: quality,
      flowTimeline,
      strTimeseries,
      qualityScore: randInt(70, 98),
      distractionEvents: 0,
      avgStr: avgSTR,
      peakStr: randFloat(0.75, 0.95),
      flowRatio: 1.0,
      flowIntervals: flowTimeline,
      quality,
    }
  }

  // Pick a random state sequence
  const sequence = STATE_SEQUENCES[randInt(0, STATE_SEQUENCES.length - 1)]!

  // Distribute durationMin across segments proportionally (random weights)
  const weights = sequence.map(() => Math.random() + 0.3)
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const segmentDurations = weights.map((w) => Math.max(1, Math.round((w / totalWeight) * durationMin)))

  // Fix rounding so total == durationMin
  let remaining = durationMin - segmentDurations.reduce((a, b) => a + b, 0)
  for (let i = 0; remaining !== 0; i = (i + 1) % segmentDurations.length) {
    const delta = remaining > 0 ? 1 : -1
    segmentDurations[i] = Math.max(1, (segmentDurations[i] ?? 1) + delta)
    remaining -= delta
  }

  // Build flow timeline
  const flowTimeline: FlowSegment[] = []
  let cursor = 0
  for (let i = 0; i < sequence.length; i++) {
    const state = sequence[i]!
    const dur = segmentDurations[i] ?? 1
    const [strMin, strMax] = STR_RANGES[state]
    flowTimeline.push({
      startMin: cursor,
      endMin: cursor + dur,
      state,
      avgSTR: randFloat(strMin, strMax),
    })
    cursor += dur
  }
  // Ensure last segment ends exactly at durationMin
  if (flowTimeline.length > 0) {
    flowTimeline[flowTimeline.length - 1]!.endMin = durationMin
  }

  // Compute longestFlowStreakMin
  const longestFlowStreakMin = flowTimeline
    .filter((s) => s.state === 'Flow')
    .reduce((max, s) => Math.max(max, s.endMin - s.startMin), 0)

  // Count distraction events
  const distractionEvents = flowTimeline.filter((s) => s.state === 'Distracted').length

  // Build strTimeseries: one point every 1–3 minutes, clamped between 4 and 20 points
  const strTimeseries: StrPoint[] = []
  const interval = Math.max(1, Math.min(3, Math.floor(durationMin / 10)))
  for (let t = 0; t <= durationMin; t += interval) {
    const seg = flowTimeline.find((s) => t >= s.startMin && t < s.endMin) ?? flowTimeline[flowTimeline.length - 1]!
    const [strMin, strMax] = STR_RANGES[seg.state]
    const baseStr = (strMin + strMax) / 2
    const noise = (Math.random() - 0.5) * 0.1
    const noisyBase = Math.max(0.3, baseStr + noise)
    strTimeseries.push({ t, str: randFloat(noisyBase - 0.05, noisyBase + 0.05) })
  }
  // Ensure we have at least 4 points
  while (strTimeseries.length < 4) {
    const t = Math.round((strTimeseries.length / 4) * durationMin)
    const seg = flowTimeline.find((s) => t >= s.startMin && t < s.endMin) ?? flowTimeline[flowTimeline.length - 1]!
    const [strMin, strMax] = STR_RANGES[seg.state]
    strTimeseries.push({ t, str: randFloat(strMin, strMax) })
  }
  // Cap at 20 points
  if (strTimeseries.length > 20) {
    strTimeseries.splice(20)
    // Ensure last point is at durationMin
    strTimeseries[strTimeseries.length - 1]!.t = durationMin
  }

  // Compute avgSTR as mean of timeseries
  const avgSTR = randFloat(
    strTimeseries.reduce((sum, p) => sum + p.str, 0) / strTimeseries.length - 0.05,
    strTimeseries.reduce((sum, p) => sum + p.str, 0) / strTimeseries.length + 0.05,
  )

  // peakSTR
  const hasDistracted = distractionEvents > 0
  const peakSTR = hasDistracted ? randFloat(1.1, 1.5) : randFloat(0.95, 1.1)

  // flowPercent / flowRatio derived from actual flow timeline
  const flowMinutes = flowTimeline.filter((s) => s.state === 'Flow').reduce((sum, s) => sum + s.endMin - s.startMin, 0)
  const flowRatio = Math.min(1, Math.max(0, Math.round((flowMinutes / durationMin) * 100) / 100))
  const flowPercent = Math.round(flowRatio * 100)

  // qualityScore
  const qualityScore = randInt(70, 98)

  // dataQuality
  const quality: SensorQuality = {
    eye: randInt(80, 99),
    eeg: randInt(75, 97),
    hr: randInt(85, 100),
  }

  return {
    avgSTR,
    peakSTR,
    flowPercent,
    longestFlowStreakMin,
    dataQuality: quality,
    flowTimeline,
    strTimeseries,
    qualityScore,
    distractionEvents,
    avgStr: avgSTR,
    peakStr: peakSTR,
    flowRatio,
    flowIntervals: flowTimeline,
    quality,
  }
}
