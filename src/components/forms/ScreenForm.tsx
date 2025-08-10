import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Monitor, MapPin, Settings, X } from 'lucide-react'

const screenSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  location: z.string().min(1, 'La ubicación es requerida'),
  resolution: z.string().min(1, 'La resolución es requerida'),
  status: z.enum(['online', 'offline', 'maintenance'])
})

type ScreenFormData = z.infer<typeof screenSchema>

interface ScreenFormProps {
  screen?: any
  onSubmit: (data: ScreenFormData) => Promise<void>
  onCancel: () => void
}

export function ScreenForm({ screen, onSubmit, onCancel }: ScreenFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ScreenFormData>({
    resolver: zodResolver(screenSchema),
    defaultValues: screen || {
      name: '',
      location: '',
      resolution: '1920x1080',
      status: 'offline'
    }
  })

  const resolutionOptions = [
    '1920x1080',
    '1366x768',
    '3840x2160',
    '2560x1440',
    '1280x720'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Monitor className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {screen ? 'Editar Pantalla' : 'Agregar Pantalla'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la pantalla
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Pantalla Principal"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('location')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Recepción - Planta Baja"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolución
            </label>
            <select
              {...register('resolution')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {resolutionOptions.map(resolution => (
                <option key={resolution} value={resolution}>
                  {resolution}
                </option>
              ))}
            </select>
            {errors.resolution && (
              <p className="text-red-500 text-sm mt-1">{errors.resolution.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="offline">Desconectada</option>
              <option value="online">En línea</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : screen ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}