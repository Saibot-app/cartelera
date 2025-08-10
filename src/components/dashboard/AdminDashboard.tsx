import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Monitor, 
  Users, 
  Play, 
  FileText, 
  Calendar,
  Settings,
  Activity,
  BarChart3
} from 'lucide-react'

export function AdminDashboard() {
  const { userProfile, company } = useAuth()

  const dashboardCards = [
    {
      title: 'Pantallas',
      icon: Monitor,
      value: '0',
      description: 'Pantallas activas',
      color: 'bg-blue-500',
      href: '/screens'
    },
    {
      title: 'Usuarios',
      icon: Users,
      value: '1',
      description: 'Usuarios registrados',
      color: 'bg-green-500',
      href: '/users'
    },
    {
      title: 'Playlists',
      icon: Play,
      value: '0',
      description: 'Listas de reproducción',
      color: 'bg-purple-500',
      href: '/playlists'
    },
    {
      title: 'Contenido',
      icon: FileText,
      value: '0',
      description: 'Archivos multimedia',
      color: 'bg-orange-500',
      href: '/content'
    }
  ]

  const quickActions = [
    {
      title: 'Añadir Pantalla',
      description: 'Registra una nueva pantalla digital',
      icon: Monitor,
      action: () => console.log('Add screen')
    },
    {
      title: 'Subir Contenido',
      description: 'Sube imágenes o videos',
      icon: FileText,
      action: () => console.log('Upload content')
    },
    {
      title: 'Crear Playlist',
      description: 'Organiza tu contenido',
      icon: Play,
      action: () => console.log('Create playlist')
    },
    {
      title: 'Programar Horarios',
      description: 'Define cuándo mostrar cada playlist',
      icon: Calendar,
      action: () => console.log('Schedule')
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Administrador
        </h1>
        <p className="text-gray-600">
          Gestiona tu sistema de señalización digital
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-500">{card.description}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Ver todos →
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.action}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
            >
              <action.icon className="h-8 w-8 text-gray-600 group-hover:text-indigo-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Sistema inicializado correctamente</span>
              <span className="text-gray-400 ml-auto">Ahora</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Usuario administrador creado</span>
              <span className="text-gray-400 ml-auto">Hace 1 min</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Empresa configurada: {company?.name}</span>
              <span className="text-gray-400 ml-auto">Hace 2 min</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Estado del Sistema</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de datos</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Conectada</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Autenticación</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Activa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Disponible</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">RLS</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Configurado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}