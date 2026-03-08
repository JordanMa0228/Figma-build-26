import { useQuery } from '@tanstack/react-query'
import { getAnalyticsData } from './api'

export function useAnalyticsData() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalyticsData,
    select: (response) => response.data,
  })
}

