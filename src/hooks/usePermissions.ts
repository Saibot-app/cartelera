import { useAuth } from '../contexts/AuthContext'

export function usePermissions() {
  const { userProfile } = useAuth()

  const isAdmin = userProfile?.role === 'admin'
  const isEditor = userProfile?.role === 'editor' || isAdmin
  const isViewer = userProfile?.role === 'viewer' || isEditor

  const canManageUsers = isAdmin
  const canManageScreens = isAdmin
  const canManageContent = isEditor
  const canManagePlaylists = isEditor
  const canManageSchedules = isEditor
  const canViewReports = isViewer

  return {
    isAdmin,
    isEditor,
    isViewer,
    canManageUsers,
    canManageScreens,
    canManageContent,
    canManagePlaylists,
    canManageSchedules,
    canViewReports,
  }
}