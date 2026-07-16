import { DashboardStats } from '@/components/admin/DashboardStats'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">DASHBOARD</h1>
        <p className="text-gray-600">Bienvenido al panel de administración</p>
      </div>

      <DashboardStats />

      {/* Placeholder for more admin content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Citas Recientes</h2>
          <p className="text-gray-600">Próximamente se mostrarán las citas más recientes</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Ingresos</h2>
          <p className="text-gray-600">Próximamente se mostrarán los ingresos</p>
        </div>
      </div>
    </div>
  )
}
