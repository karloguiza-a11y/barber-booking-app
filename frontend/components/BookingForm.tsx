'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createReservationSchema, CreateReservationData } from '@/lib/schemas/reservation'
import { useServices, useBarbers } from '@/hooks/useBooking'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function BookingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateReservationData>({
    resolver: zodResolver(createReservationSchema),
  })
  const { data: services, isLoading: servicesLoading } = useServices()
  const { data: barbers, isLoading: barbersLoading } = useBarbers()
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = async (data: CreateReservationData) => {
    console.log('Reservation data:', data)
    console.log('Reference image:', referenceImage)
    // API call will be added here
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('La imagen no debe superar 20MB')
        return
      }
      setReferenceImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white dark:bg-dark-secondary rounded-lg shadow-lg p-8"
    >
      <h2 className="font-bebas text-3xl mb-8 text-center text-dark-primary dark:text-accent">
        RESERVAR TU CITA
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Barber Selection */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Selecciona tu Barbero
          </label>
          <select
            {...register('barberId')}
            disabled={barbersLoading}
            className="w-full p-3 border border-gray-300 dark:border-dark-tertiary rounded-lg bg-white dark:bg-dark-tertiary text-dark-primary dark:text-white"
          >
            <option value="">-- Selecciona un barbero --</option>
            {barbers?.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.firstName} {barber.lastName}
              </option>
            ))}
          </select>
          {errors.barberId && <p className="text-red-500 text-sm mt-1">{errors.barberId.message}</p>}
        </div>

        {/* Service Selection */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Selecciona el Servicio
          </label>
          <select
            {...register('serviceId')}
            disabled={servicesLoading}
            className="w-full p-3 border border-gray-300 dark:border-dark-tertiary rounded-lg bg-white dark:bg-dark-tertiary text-dark-primary dark:text-white"
          >
            <option value="">-- Selecciona un servicio --</option>
            {services?.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (${service.price})
              </option>
            ))}
          </select>
          {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
        </div>

        {/* Date Selection */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Fecha de la Cita
          </label>
          <input
            type="date"
            {...register('appointmentDate')}
            className="w-full p-3 border border-gray-300 dark:border-dark-tertiary rounded-lg bg-white dark:bg-dark-tertiary text-dark-primary dark:text-white"
          />
          {errors.appointmentDate && <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Hora de la Cita
          </label>
          <input
            type="time"
            {...register('startTime')}
            className="w-full p-3 border border-gray-300 dark:border-dark-tertiary rounded-lg bg-white dark:bg-dark-tertiary text-dark-primary dark:text-white"
          />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Notas Adicionales (Opcional)
          </label>
          <textarea
            {...register('notes')}
            placeholder="Cuéntanos qué corte deseas o cualquier preferencia especial"
            className="w-full p-3 border border-gray-300 dark:border-dark-tertiary rounded-lg bg-white dark:bg-dark-tertiary text-dark-primary dark:text-white resize-none h-24"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-2 text-dark-primary dark:text-white">
            Sube una imagen de referencia (JPG, PNG, WEBP - Máx 20MB)
          </label>
          <div className="border-2 border-dashed border-accent rounded-lg p-6 text-center cursor-pointer hover:border-yellow-600 transition">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <p className="text-accent font-semibold">📸 Arrastra tu imagen aquí o haz clic</p>
            </label>
          </div>
          {previewUrl && (
            <div className="mt-4 relative">
              <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setReferenceImage(null)
                  setPreviewUrl(null)
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-accent text-dark-primary font-bold py-3 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
        >
          Confirmar Reserva
        </button>
      </form>
    </motion.div>
  )
}
