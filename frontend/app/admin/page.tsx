import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Admin - Barber Shop',
  description: 'Panel de administración',
}

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {/* Dashboard content will be added here */}
    </div>
  )
}
