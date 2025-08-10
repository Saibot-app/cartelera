import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { usePermissions } from './hooks/usePermissions'
import { LoginForm } from './components/auth/LoginForm'
import { SignUpForm } from './components/auth/SignUpForm'
import { AdminDashboard } from './components/dashboard/AdminDashboard'
import { Layout } from './components/layout/Layout'
import { ScreensPage } from './pages/ScreensPage'
import { ContentPage } from './pages/ContentPage'
import { Monitor, Shield, Database } from 'lucide-react'

function AuthenticatedApp() {
  const { userProfile, company, signOut } = useAuth()
  const { isAdmin } = usePermissions()

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/screens" element={<ScreensPage />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/playlists" element={<div className="p-6">Playlists (Próximamente)</div>} />
          <Route path="/schedules" element={<div className="p-6">Horarios (Próximamente)</div>} />
          <Route path="/users" element={<div className="p-6">Usuarios (Próximamente)</div>} />
          <Route path="/reports" element={<div className="p-6">Reportes (Próximamente)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
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
  const [showReturnOption, setShowReturnOption] = React.useState(false)
  const [bypassLoading, setBypassLoading] = React.useState(false)

  // Check if user wants to bypass loading on component mount
  React.useEffect(() => {
    const shouldBypass = localStorage.getItem('bypassLoading')
    if (shouldBypass === 'true') {
      setBypassLoading(true)
      localStorage.removeItem('bypassLoading')
    }
  }, [])

  React.useEffect(() => {
    if (loading && !bypassLoading) {
      // Show return option after 5 seconds of loading
      const timer = setTimeout(() => {
        setShowReturnOption(true)
      }, 5000)
      
      return () => clearTimeout(timer)
    } else {
      setShowReturnOption(false)
    }
  }, [loading, bypassLoading])

  const handleReturnToDashboard = () => {
    // Set flag to bypass loading and go directly to dashboard
    localStorage.setItem('bypassLoading', 'true')
    window.location.replace('/')
  }

  const handleGoToDashboard = () => {
    // Set flag to bypass loading and go directly to dashboard  
    localStorage.setItem('bypassLoading', 'true')
    window.location.replace('/')
  }

  // If user wants to bypass loading, show authenticated app immediately
  if (bypassLoading || (user && !loading)) {
    return <AuthenticatedApp />
  }

  // Show loading screen only if still loading and not bypassing
  if (loading && !bypassLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Monitor className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 mb-6">Cargando SignagePro...</p>
          
          {showReturnOption && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                ¿La carga está tomando demasiado tiempo?
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleReturnToDashboard}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Reintentar
                </button>
                <button
                  onClick={handleGoToDashboard}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  Ir al Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // If not loading and no user, show unauthenticated app
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