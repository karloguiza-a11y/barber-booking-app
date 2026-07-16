import { DashboardStats } from '@/components/admin/DashboardStats'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-bebas text-4xl text-accent mb-2">DASHBOARD</h1>
        <p className="text-gray-400">Bienvenido al panel de administración</p>
      </motion.div>

      <DashboardStats />

      {/* Placeholder for more admin content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-secondary rounded-lg p-6 border border-dark-tertiary"
        >
          <h2 className="text-xl font-bold text-white mb-4">Citas Recientes</h2>
          <p className="text-gray-400">Próximamente se mostrarán las citas más recientes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-secondary rounded-lg p-6 border border-dark-tertiary"
        >
          <h2 className="text-xl font-bold text-white mb-4">Resumen de Ingresos</h2>
          <p className="text-gray-400">Próximamente se mostrarán los ingresos</p>
        </motion.div>
      </div>
    </div>
  )
}
