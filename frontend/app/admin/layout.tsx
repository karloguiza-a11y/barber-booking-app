import { Navbar } from '@/components/Navbar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { DashboardStats } from '@/components/admin/DashboardStats'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-dark-primary">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
