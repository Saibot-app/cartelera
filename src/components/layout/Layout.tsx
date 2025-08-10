import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Sidebar } from './Sidebar'
import { Monitor, User } from 'lucide-react'

export function Layout() {
  const { userProfile, company, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Monitor className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">SignagePro</span>
              {company && (
                <div className="text-sm text-gray-500 pl-4 border-l">
                  {company.name}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {userProfile?.first_name || userProfile?.email?.split('@')[0]}
                  </div>
                  <div className="text-gray-500">
                    {userProfile?.role}
                  </div>
                </div>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}