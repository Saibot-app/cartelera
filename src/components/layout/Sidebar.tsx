import React from 'react'
import { NavLink } from 'react-router-dom'
import { usePermissions } from '../../hooks/usePermissions'
import {
  LayoutDashboard,
  Monitor,
  FileText,
  Play,
  Calendar,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'

export function Sidebar() {
  const { canManageUsers, canManageScreens, canManageContent, canManagePlaylists, canManageSchedules } = usePermissions()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      permission: true
    },
    {
      name: 'Pantallas',
      href: '/screens',
      icon: Monitor,
      permission: canManageScreens
    },
    {
      name: 'Contenido',
      href: '/content',
      icon: FileText,
      permission: canManageContent
    },
    {
      name: 'Playlists',
      href: '/playlists',
      icon: Play,
      permission: canManagePlaylists
    },
    {
      name: 'Horarios',
      href: '/schedules',
      icon: Calendar,
      permission: canManageSchedules
    },
    {
      name: 'Usuarios',
      href: '/users',
      icon: Users,
      permission: canManageUsers
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: BarChart3,
      permission: true
    }
  ]

  const filteredNavigation = navigation.filter(item => item.permission)

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}