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