'use client'

export function AdminSidebar() {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', href: '/admin' },
    { label: 'Calendario', icon: '📅', href: '/admin/calendar' },
    { label: 'Citas', icon: '🗓️', href: '/admin/reservations' },
    { label: 'Barberos', icon: '💈', href: '/admin/barbers' },
    { label: 'Servicios', icon: '✂️', href: '/admin/services' },
    { label: 'Clientes', icon: '👥', href: '/admin/clients' },
    { label: 'Reportes', icon: '📈', href: '/admin/reports' },
  ]

  return (
    <aside className="w-64 bg-dark-secondary border-r border-dark-tertiary hidden md:flex flex-col fixed h-screen">
      <div className="p-6 border-b border-dark-tertiary">
        <h1 className="font-bebas text-2xl text-accent">ADMIN</h1>
        <p className="text-sm text-gray-400">Panel de Control</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-dark-tertiary transition"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-semibold">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-6 border-t border-dark-tertiary">
        <button className="w-full px-4 py-2 bg-accent text-dark-primary font-bold rounded-lg hover:bg-yellow-600 transition">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
