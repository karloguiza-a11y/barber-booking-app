'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 bg-dark-primary/95 backdrop-blur-sm border-b border-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <span className="text-dark-primary font-bold">✂️</span>
            </div>
            <span className="font-bebas text-xl text-white">BARBER SHOP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-accent transition">
              Inicio
            </Link>
            <Link href="/booking" className="text-white hover:text-accent transition">
              Reservar
            </Link>
            <Link href="/auth/login" className="px-6 py-2 bg-accent text-dark-primary rounded-lg font-semibold hover:bg-yellow-600 transition">
              Iniciar Sesión
            </Link>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-dark-secondary hover:bg-dark-tertiary transition"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-dark-secondary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-white hover:bg-dark-secondary rounded">
              Inicio
            </Link>
            <Link href="/booking" className="block px-4 py-2 text-white hover:bg-dark-secondary rounded">
              Reservar
            </Link>
            <Link href="/auth/login" className="block px-4 py-2 bg-accent text-dark-primary rounded font-semibold">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
