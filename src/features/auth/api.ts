import { api } from '../../lib/api-client'
import type { AuthUser } from '../../store/auth-store'

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const res = await api.post<{ user: AuthUser; token: string }>('/auth/login', { email, password })
  return res.data
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<{ user: AuthUser; token: string }> {
  const res = await api.post<{ user: AuthUser; token: string }>('/auth/register', { email, password, name })
  return res.data
}
