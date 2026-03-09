import { getSessionById, sessions } from '../../data/mock-data'
import { respond } from '../../lib/mock-server'
import type { SessionRecord } from '../../types/domain'

export async function getSessions() {
  return respond<SessionRecord[]>(sessions)
}

export async function getSessionDetail(id: string) {
  return respond<SessionRecord | undefined>(getSessionById(id))
}

