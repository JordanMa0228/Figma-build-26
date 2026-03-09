import { create } from 'zustand'
import type { SessionRecord } from '../types/domain'

interface CreatedSessionsStore {
  sessions: SessionRecord[]
  addSession: (session: SessionRecord) => void
}

export const useCreatedSessionsStore = create<CreatedSessionsStore>((set) => ({
  sessions: [],
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
}))
