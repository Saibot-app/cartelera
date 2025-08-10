import React, { useState } from 'react'
import { useContent } from '../hooks/useContent'
import { usePermissions } from '../hooks/usePermissions'
import {
  FileText,
  Plus,
  Image,
  Video,
  Type,
  Code,
  Edit2,
  Trash2,
  Upload,
  Eye
} from 'lucide-react'
import { ContentForm } from '../components/forms/ContentForm'

export function ContentPage() {
  const { content, loading, addContent, updateContent, deleteContent } = useContent()
  const { canManageContent } = usePermissions()
  const [showForm, setShowForm] = useState(false)
  const [editingContent, setEditingContent] = useState(null)

  const handleAddContent = async (data) => {
    const { error } = await addContent(data)
    if (!error) {
      setShowForm(false)
    }
  }

  const handleEditContent = async (data) => {
    if (editingContent) {
      const { error } = await updateContent(editingContent.id, data)
      if (!error) {
        setEditingContent(null)
      }
    }
  }

  const handleDeleteContent = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      await deleteContent(id)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return Image
      case 'video':
        return Video
      case 'text':
        return Type
      case 'html':
        return Code
      default:
        return FileText
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-green-100 text-green-800'
      case 'video':
        return 'bg-blue-100 text-blue-800'
      case 'text':
        return 'bg-purple-100 text-purple-800'
      case 'html':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contenido</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el contenido multimedia para tus pantallas
          </p>
        </div>
        {canManageContent && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Contenido</span>
          </button>
        )}
      </div>

      {content.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay contenido disponible
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza subiendo tu primer archivo o creando contenido
          </p>
          {canManageContent && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Agregar Primer Contenido
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <TypeIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {item.type === 'image' && item.url && (
                  <div className="mb-4">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {item.type === 'text' && item.text_content && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.text_content}
                    </p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duración:</span>
                    <span className="font-medium">{item.duration}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`font-medium ${item.active ? 'text-green-600' : 'text-red-600'}`}>
                      {item.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {canManageContent && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingContent(item)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {(showForm || editingContent) && (
        <ContentForm
          content={editingContent}
          onSubmit={editingContent ? handleEditContent : handleAddContent}
          onCancel={() => {
            setShowForm(false)
            setEditingContent(null)
          }}
        />
      )}
    </div>
  )
}