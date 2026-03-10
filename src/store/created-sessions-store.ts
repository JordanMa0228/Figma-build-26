import { create } from 'zustand'
import type { SessionRecord } from '../types/domain'

interface CreatedSessionsStore {
  sessions: SessionRecord[]
  addSession: (session: SessionRecord) => void
  removeSession: (id: string) => void
}

export const useCreatedSessionsStore = create<CreatedSessionsStore>((set) => ({
  sessions: [],
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
  removeSession: (id) => set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
}))
