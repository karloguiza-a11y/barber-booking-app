import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'

export interface DashboardStats {
  totalReservations: number
  todayReservations: number
  upcomingReservations: number
  totalClients: number
  totalRevenue: number
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/admin/stats')
      return response.data.data
    },
  })
}
