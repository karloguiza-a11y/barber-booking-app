import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import { Service, Barber } from '@/lib/types'

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Service[] }>('/services')
      return response.data.data
    },
  })
}

export const useBarbers = () => {
  return useQuery({
    queryKey: ['barbers'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Barber[] }>('/barbers')
      return response.data.data
    },
  })
}
