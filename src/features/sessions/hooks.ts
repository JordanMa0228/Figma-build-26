import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteSession, getSessionDetail, getSessions } from './api'
import { useCreatedSessionsStore } from '../../store/created-sessions-store'

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

export function useDeleteSession() {
  const queryClient = useQueryClient()
  const removeSession = useCreatedSessionsStore((s) => s.removeSession)
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteSession(id)
      } catch {
        // ignore API error — may be a locally-created session
      }
      removeSession(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

