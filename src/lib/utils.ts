import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isValid } from 'date-fns'
import type { AccentTone, FlowState } from '../types/domain'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMinutes(value: number) {
  return `${value} min`
}

export function formatPercent(value: number) {
  return `${value}%`
}

export function formatStr(value: number) {
  return value.toFixed(2)
}

export function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

export function getStateTone(state: FlowState): AccentTone {
  if (state === 'Flow') return 'flow'
  if (state === 'Focused') return 'focused'
  if (state === 'Distracted') return 'distracted'
  return 'neutral'
}

export function getToneClasses(tone: AccentTone) {
  const map: Record<AccentTone, string> = {
    flow: 'text-blue-600 border-blue-200 bg-blue-50',
    focused: 'text-sky-600 border-sky-200 bg-sky-50',
    neutral: 'text-slate-600 border-slate-200 bg-slate-50',
    distracted: 'text-amber-600 border-amber-200 bg-amber-50',
    cyan: 'text-sky-600 border-sky-200 bg-sky-50',
  }

  return map[tone]
}

export function getStrNarrative(value: number) {
  if (value <= 0.7) return 'Deep flow'
  if (value <= 0.9) return 'High focus'
  if (value <= 1.1) return 'Neutral pacing'
  return 'Slower subjective time'
}

export function getStrNarrativeKey(value: number): string {
  if (value <= 0.7) return 'interpretation.deepFlow'
  if (value <= 0.9) return 'interpretation.highFocus'
  if (value <= 1.1) return 'interpretation.neutralPacing'
  return 'interpretation.slowerSubjectiveTime'
}

export function getScoreTone(score: number): AccentTone {
  if (score >= 90) return 'focused'
  if (score >= 75) return 'cyan'
  if (score >= 60) return 'neutral'
  return 'distracted'
}

export function getDeltaLabel(left: number, right: number, unit = '') {
  const delta = left - right
  const prefix = delta > 0 ? '+' : ''
  return `${prefix}${delta.toFixed(2)}${unit}`
}

export function safeDateFormat(
  dateStr: string | null | undefined,
  fmt: string,
  options?: Parameters<typeof format>[2],
): string {
  if (!dateStr) return '—'
  const d = parseISO(dateStr)
  return isValid(d) ? format(d, fmt, options) : '—'
}

