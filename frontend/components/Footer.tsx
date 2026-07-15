'use client'

export function Footer() {
  return (
    <footer className="bg-dark-primary border-t border-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bebas text-xl text-accent mb-4">BARBER SHOP</h3>
            <p className="text-gray-400">La mejor experiencia de barbería premium en la ciudad.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Menú</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-accent transition">Inicio</a></li>
              <li><a href="/booking" className="hover:text-accent transition">Reservar</a></li>
              <li><a href="#" className="hover:text-accent transition">Servicios</a></li>
              <li><a href="#" className="hover:text-accent transition">Contacto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contacto</h4>
            <p className="text-gray-400 mb-2">📞 +1 (555) 123-4567</p>
            <p className="text-gray-400 mb-2">📧 info@barbershop.com</p>
            <p className="text-gray-400">📍 Calle Principal 123, Ciudad</p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-white mb-4">Horarios</h4>
            <p className="text-gray-400 text-sm mb-1">Lun - Vie: 09:00 - 19:00</p>
            <p className="text-gray-400 text-sm mb-1">Sábado: 10:00 - 17:00</p>
            <p className="text-gray-400 text-sm">Domingo: Cerrado</p>
          </div>
        </div>

        <div className="border-t border-dark-secondary pt-8 flex justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2024 Barber Shop. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-accent transition">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-accent transition">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-accent transition">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
