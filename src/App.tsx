import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginForm } from './components/auth/LoginForm'
import { SignUpForm } from './components/auth/SignUpForm'
import { Monitor, Shield, Database } from 'lucide-react'

function AuthenticatedApp() {
  const { userProfile, company, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-sm text-gray-700">
                {userProfile?.first_name || userProfile?.email}
                <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                  {userProfile?.role}
                </span>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a SignagePro!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Tu plataforma SaaS multiempresa está configurada correctamente
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Base de Datos</h3>
              <p className="text-sm text-gray-600">
                ✅ Configuración multiempresa completa con RLS
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Autenticación</h3>
              <p className="text-sm text-gray-600">
                ✅ Sistema de usuarios y roles funcionando
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Gestión</h3>
              <p className="text-sm text-gray-600">
                ✅ Listo para gestionar pantallas y contenido
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">
              Estado de la Plataforma ✅
            </h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Base de datos multiempresa configurada</li>
              <li>• Políticas RLS activas para aislamiento multiempresa</li>
              <li>• Sistema de autenticación funcionando</li>
              <li>• Roles y permisos establecidos</li>
              <li>• Storage configurado para archivos multimedia</li>
              <li>• Triggers de sincronización activos</li>
              {company && (
                <li>• Empresa: <strong>{company.name}</strong> (ID: {company.id.slice(0, 8)}...)</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

function UnauthenticatedApp() {
  const [showSignUp, setShowSignUp] = React.useState(false)

  const handleSwitchToSignUp = () => {
    console.log('Switching to sign up')
    setShowSignUp(true)
  }

  const handleSwitchToLogin = () => {
    console.log('Switching to login')
    setShowSignUp(false)
  }

  if (showSignUp) {
    return <SignUpForm onSwitchToLogin={handleSwitchToLogin} />
  }

  return <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando SignagePro...</p>
        </div>
      </div>
    )
  }

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App