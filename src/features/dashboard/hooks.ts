import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from './api'
import { useAuthStore } from '../../store/auth-store'

export function useDashboardData() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    enabled: Boolean(token),
    select: (response) => response.data,
  })
}

