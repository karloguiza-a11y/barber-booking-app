'use client'

import { useDashboardStats } from '@/hooks/useAdmin'
import { motion } from 'framer-motion'
import { BarChart, Calendar, Users, TrendingUp } from 'lucide-react'

export function DashboardStats() {
  const { data: stats, isLoading } = useDashboardStats()

  const statCards = [
    {
      title: 'Total de Citas',
      value: stats?.totalReservations || 0,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Citas Hoy',
      value: stats?.todayReservations || 0,
      icon: BarChart,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Próximas Citas',
      value: stats?.upcomingReservations || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Clientes',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
  ]

  if (isLoading) {
    return <div>Cargando estadísticas...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-semibold">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <Icon size={40} className="opacity-80" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
