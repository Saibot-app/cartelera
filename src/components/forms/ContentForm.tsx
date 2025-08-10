import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileText, Upload, X, Image, Video, Type, Code } from 'lucide-react'

const contentSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  type: z.enum(['image', 'video', 'text', 'html']),
  url: z.string().optional(),
  text_content: z.string().optional(),
  duration: z.number().min(1, 'La duración debe ser mayor a 0'),
  active: z.boolean()
}).refine((data) => {
  if (data.type === 'text' || data.type === 'html') {
    return data.text_content && data.text_content.length > 0
  }
  if (data.type === 'image' || data.type === 'video') {
    return data.url && data.url.length > 0
  }
  return true
}, {
  message: 'El contenido es requerido según el tipo seleccionado',
  path: ['text_content']
})

type ContentFormData = z.infer<typeof contentSchema>

interface ContentFormProps {
  content?: any
  onSubmit: (data: ContentFormData) => Promise<void>
  onCancel: () => void
}

export function ContentForm({ content, onSubmit, onCancel }: ContentFormProps) {
  const [selectedType, setSelectedType] = useState(content?.type || 'text')
  const [uploading, setUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: content || {
      title: '',
      type: 'text',
      url: '',
      text_content: '',
      duration: 10,
      active: true
    }
  })

  const watchedType = watch('type')

  const contentTypes = [
    { value: 'text', label: 'Texto', icon: Type, description: 'Texto simple con formato' },
    { value: 'html', label: 'HTML', icon: Code, description: 'Contenido HTML personalizado' },
    { value: 'image', label: 'Imagen', icon: Image, description: 'Archivos JPG, PNG, GIF' },
    { value: 'video', label: 'Video', icon: Video, description: 'Archivos MP4, WebM' }
  ]

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setValue('type', type as any)
    // Clear previous content when changing type
    setValue('url', '')
    setValue('text_content', '')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Here you would implement actual file upload to Supabase Storage
      // For now, we'll just set a placeholder URL
      const placeholderUrl = `https://via.placeholder.com/800x600/${selectedType === 'image' ? 'jpg' : 'mp4'}`
      setValue('url', placeholderUrl)
      
      // Auto-set title if empty
      if (!watch('title')) {
        setValue('title', file.name)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {content ? 'Editar Contenido' : 'Agregar Contenido'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nombre del contenido"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de contenido
            </label>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    watchedType === type.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <type.icon className={`h-5 w-5 ${
                      watchedType === type.value ? 'text-indigo-600' : 'text-gray-500'
                    }`} />
                    <span className="font-medium text-gray-900">{type.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
            <input {...register('type')} type="hidden" />
          </div>

          {(watchedType === 'image' || watchedType === 'video') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept={watchedType === 'image' ? 'image/*' : 'video/*'}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-indigo-600 hover:text-indigo-700"
                >
                  {uploading ? 'Subiendo...' : `Seleccionar ${watchedType === 'image' ? 'imagen' : 'video'}`}
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  {watchedType === 'image' ? 'PNG, JPG, GIF hasta 10MB' : 'MP4, WebM hasta 100MB'}
                </p>
              </div>
              <input {...register('url')} type="hidden" />
            </div>
          )}

          {watchedType === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido de texto
              </label>
              <textarea
                {...register('text_content')}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ingresa el texto que se mostrará en la pantalla..."
              />
              {errors.text_content && (
                <p className="text-red-500 text-sm mt-1">{errors.text_content.message}</p>
              )}
            </div>
          )}

          {watchedType === 'html' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código HTML
              </label>
              <textarea
                {...register('text_content')}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                placeholder="<div>Tu código HTML aquí...</div>"
              />
              {errors.text_content && (
                <p className="text-red-500 text-sm mt-1">{errors.text_content.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (segundos)
              </label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <div className="flex items-center space-x-3 pt-3">
                <input
                  {...register('active')}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Contenido activo</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : content ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}