import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSettings, saveSettings } from './api'
import type { SettingsFormValues } from '../../types/domain'

export function useSettingsQuery() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    select: (response) => response.data.settings,
  })
}

export function useSaveSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SettingsFormValues) => saveSettings(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(['settings'], response)
    },
  })
}

