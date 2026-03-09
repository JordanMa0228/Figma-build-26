import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  email: string
  name: string
}

interface AuthStore {
  user: AuthUser | null
  token: string | null
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') window.localStorage.setItem('token', token)
        set({ user, token })
      },
      logout: () => {
        if (typeof window !== 'undefined') window.localStorage.removeItem('token')
        set({ user: null, token: null })
      },
    }),
    { name: 'flowsense.auth' },
  ),
)
