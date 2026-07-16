'use client'

import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    name: 'Corte Clásico',
    description: 'Corte tradicional con tijeras de precisión',
    price: '$25',
    duration: '30 min',
    icon: '✂️',
  },
  {
    id: 2,
    name: 'Corte + Barba',
    description: 'Corte completo con afeitado de barba profesional',
    price: '$35',
    duration: '45 min',
    icon: '💈',
  },
  {
    id: 3,
    name: 'Peinado Especial',
    description: 'Peinado con productos premium',
    price: '$15',
    duration: '20 min',
    icon: '💇',
  },
  {
    id: 4,
    name: 'Tingido de Barba',
    description: 'Tingido profesional con tintes de calidad',
    price: '$20',
    duration: '30 min',
    icon: '🎨',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function ServicesSection() {
  return (
    <section className="py-20 bg-white dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-bebas text-5xl mb-4 text-dark-primary dark:text-accent">SERVICIOS</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Ofrecemos los mejores servicios de barbería con profesionales altamente calificados
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-dark-secondary dark:bg-dark-tertiary p-6 rounded-lg border border-accent/20 hover:border-accent transition"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-bebas text-xl mb-2 text-accent">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center text-accent font-bold">
                <span>{service.price}</span>
                <span className="text-sm">{service.duration}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
