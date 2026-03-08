import type { AuthUser } from '../../store/auth-store'

const MOCK_TOKEN = 'mock-jwt-token'

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  await new Promise((r) => setTimeout(r, 400))
  if (!email || !password) throw new Error('Invalid credentials')
  return {
    user: { id: '1', email, name: email.split('@')[0] },
    token: MOCK_TOKEN,
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<{ user: AuthUser; token: string }> {
  await new Promise((r) => setTimeout(r, 500))
  if (!email || !password || !name) throw new Error('Invalid input')
  return {
    user: { id: String(Date.now()), email, name },
    token: MOCK_TOKEN,
  }
}
