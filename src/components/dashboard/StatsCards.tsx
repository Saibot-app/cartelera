import React from 'react'
import { Monitor, Users, Play, FileText, Activity, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  screens: any[]
  content: any[]
  users: any[]
  playlists: any[]
}

export function StatsCards({ screens, content, users, playlists }: StatsCardsProps) {
  const stats = [
    {
      title: 'Pantallas',
      value: screens.length,
      description: `${screens.filter(s => s.status === 'online').length} en línea`,
      icon: Monitor,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Contenido',
      value: content.length,
      description: `${content.filter(c => c.active).length} activo`,
      icon: FileText,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Playlists',
      value: playlists.length,
      description: `${playlists.filter(p => p.active).length} activas`,
      icon: Play,
      color: 'bg-purple-500',
      trend: '+23%'
    },
    {
      title: 'Usuarios',
      value: users.length,
      description: 'Total registrados',
      icon: Users,
      color: 'bg-orange-500',
      trend: '+5%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>{stat.trend}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.description}</div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mt-3">{stat.title}</h3>
        </div>
      ))}
    </div>
  )
}