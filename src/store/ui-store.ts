import { create } from 'zustand'
import { comparisonDefaults } from '../data/mock-data'
import type { TaskFilter } from '../types/domain'

interface UiStore {
  sessionFilter: TaskFilter
  sessionSearch: string
  compareLeftId: string
  compareRightId: string
  setSessionFilter: (value: TaskFilter) => void
  setSessionSearch: (value: string) => void
  setCompareLeftId: (value: string) => void
  setCompareRightId: (value: string) => void
}

export const useUiStore = create<UiStore>((set) => ({
  sessionFilter: 'All',
  sessionSearch: '',
  compareLeftId: comparisonDefaults.leftId,
  compareRightId: comparisonDefaults.rightId,
  setSessionFilter: (value) => set({ sessionFilter: value }),
  setSessionSearch: (value) => set({ sessionSearch: value }),
  setCompareLeftId: (value) => set({ compareLeftId: value }),
  setCompareRightId: (value) => set({ compareRightId: value }),
}))

