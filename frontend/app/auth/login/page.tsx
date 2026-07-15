'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/schemas/auth'
import { useLogin } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const { mutate: loginMutation, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data, {
      onSuccess: (user) => {
        // Redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin')
        } else if (user.role === 'BARBER') {
          router.push('/barber')
        } else {
          router.push('/booking')
        }
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
          <h1 className="font-bebas text-3xl text-accent mb-2">INICIAR SESIÓN</h1>
          <p className="text-gray-400">Bienvenido de nuevo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary focus:border-accent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                placeholder="Tu contraseña"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition">
              <input type="checkbox" className="w-4 h-4 rounded" />
              Recuérdame
            </label>
            <Link href="#" className="text-accent hover:text-yellow-600 transition font-semibold">
              ¿Olvidó su contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 bg-accent text-dark-primary font-bold py-3 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-dark-tertiary" />
          <span className="text-gray-500 text-sm">O</span>
          <div className="flex-1 h-px bg-dark-tertiary" />
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-dark-tertiary/80 transition border border-dark-tertiary font-semibold">
            Continuar con Google
          </button>
          <button className="w-full px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-dark-tertiary/80 transition border border-dark-tertiary font-semibold">
            Continuar con Facebook
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register" className="text-accent font-semibold hover:text-yellow-600 transition">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
