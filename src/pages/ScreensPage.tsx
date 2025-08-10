import React, { useState } from 'react'
import { useScreens } from '../hooks/useScreens'
import { usePermissions } from '../hooks/usePermissions'
import {
  Monitor,
  Plus,
  Edit2,
  Trash2,
  Wifi,
  WifiOff,
  MapPin,
  Settings,
  Activity
} from 'lucide-react'
import { ScreenForm } from '../components/forms/ScreenForm'

export function ScreensPage() {
  const { screens, loading, addScreen, updateScreen, deleteScreen } = useScreens()
  const { canManageScreens } = usePermissions()
  const [showForm, setShowForm] = useState(false)
  const [editingScreen, setEditingScreen] = useState(null)

  const handleAddScreen = async (data) => {
    const { error } = await addScreen(data)
    if (!error) {
      setShowForm(false)
    }
  }

  const handleEditScreen = async (data) => {
    if (editingScreen) {
      const { error } = await updateScreen(editingScreen.id, data)
      if (!error) {
        setEditingScreen(null)
      }
    }
  }

  const handleDeleteScreen = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta pantalla?')) {
      await deleteScreen(id)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100'
      case 'offline':
        return 'text-red-600 bg-red-100'
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    return status === 'online' ? Wifi : WifiOff
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Cargando pantallas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pantallas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las pantallas digitales de tu empresa
          </p>
        </div>
        {canManageScreens && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Pantalla</span>
          </button>
        )}
      </div>

      {screens.length === 0 ? (
        <div className="text-center py-12">
          <Monitor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay pantallas registradas
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza agregando tu primera pantalla digital
          </p>
          {canManageScreens && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Agregar Primera Pantalla
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {screens.map((screen) => {
            const StatusIcon = getStatusIcon(screen.status)
            
            return (
              <div
                key={screen.id}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Monitor className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{screen.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {screen.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(screen.status)}`}>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className="h-3 w-3" />
                      <span className="capitalize">{screen.status}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Resolución:</span>
                    <span className="font-medium">{screen.resolution}</span>
                  </div>
                  {screen.last_ping && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Último ping:</span>
                      <span className="font-medium">
                        {new Date(screen.last_ping).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {canManageScreens && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingScreen(screen)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteScreen(screen.id)}
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

      {(showForm || editingScreen) && (
        <ScreenForm
          screen={editingScreen}
          onSubmit={editingScreen ? handleEditScreen : handleAddScreen}
          onCancel={() => {
            setShowForm(false)
            setEditingScreen(null)
          }}
        />
      )}
    </div>
  )
}