'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/schemas/auth'
import { useRegister } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })
  const { mutate: registerMutation, isPending } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = (data: RegisterFormData) => {
    registerMutation(data, {
      onSuccess: () => {
        router.push('/booking')
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-dark-secondary rounded-lg shadow-2xl p-8 border border-accent/20"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-dark-primary">✂️</span>
          </div>
          <h1 className="font-bebas text-3xl text-accent mb-2">CREAR CUENTA</h1>
          <p className="text-gray-400">Únete a nuestra comunidad</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Nombre</label>
            <input
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="Tu nombre"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Apellido</label>
            <input
              type="text"
              {...register('lastName')}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="Tu apellido"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Teléfono</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-accent text-dark-primary font-bold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-accent font-semibold hover:text-yellow-600 transition">
            Inicia sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
