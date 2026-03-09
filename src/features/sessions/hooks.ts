import { useQuery } from '@tanstack/react-query'
import { getSessionDetail, getSessions } from './api'

export function useSessionsData() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
    select: (response) => response.data,
  })
}

export function useSessionDetail(id?: string) {
  return useQuery({
    queryKey: ['sessions', id],
    enabled: Boolean(id),
    queryFn: async () => getSessionDetail(id as string),
    select: (response) => response.data,
  })
}

