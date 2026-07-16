'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'Juan Pérez',
    comment: 'Excelente servicio, muy profesionales. Definitivamente volveré.',
    rating: 5,
    avatar: '👨',
  },
  {
    id: 2,
    name: 'Carlos García',
    comment: 'El mejor barbero de la ciudad. Recomendado 100%',
    rating: 5,
    avatar: '👨',
  },
  {
    id: 3,
    name: 'Miguel López',
    comment: 'Ambiente premium, atención al detalle impecable.',
    rating: 5,
    avatar: '👨',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-bebas text-5xl mb-4 text-accent">TESTIMONIOS</h2>
          <p className="text-gray-400 text-lg">Lo que dicen nuestros clientes satisfechos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              whileHover={{ y: -5 }}
              className="bg-dark-tertiary p-8 rounded-lg border border-accent/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h3 className="font-bold text-white">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-accent">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"{testimonial.comment}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
