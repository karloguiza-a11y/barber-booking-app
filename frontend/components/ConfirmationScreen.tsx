'use client'

import { motion } from 'framer-motion'

export function ConfirmationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-12 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.6 }}
        className="text-6xl mb-6"
      >
        ✓
      </motion.div>

      <h1 className="font-bebas text-4xl mb-4 text-dark-primary dark:text-accent">
        ¡CITA RESERVADA EXITOSAMENTE!
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        Tu cita ha sido confirmada. Te enviaremos un correo de confirmación.
      </p>

      <div className="bg-dark-secondary dark:bg-dark-tertiary rounded-lg p-6 mb-8 space-y-4 text-left">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Número de Reserva:</span>
          <span className="font-bold text-accent">#RES-2024-001</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Barbero:</span>
          <span className="font-bold">Carlos López</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Servicio:</span>
          <span className="font-bold">Corte + Barba</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Fecha y Hora:</span>
          <span className="font-bold">15/07/2024 - 14:00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Precio Total:</span>
          <span className="font-bold text-accent">$35.00</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="px-6 py-3 bg-accent text-dark-primary font-bold rounded-lg hover:bg-yellow-600 transition">
          Agregar al Calendario
        </button>
        <button className="px-6 py-3 border-2 border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition">
          Volver al Inicio
        </button>
      </div>
    </motion.div>
  )
}
