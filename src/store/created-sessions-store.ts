import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionRecord } from '../types/domain'

interface CreatedSessionsStore {
  sessions: SessionRecord[]
  addSession: (session: SessionRecord) => void
}

export const useCreatedSessionsStore = create<CreatedSessionsStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
    }),
    { name: 'flowsense.created-sessions' },
  ),
)
