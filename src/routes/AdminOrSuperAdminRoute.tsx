import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { isAdminOrAbove } from '@/constants/roles'

interface AdminOrSuperAdminRouteProps {
  children: React.ReactNode
}

/**
 * Protects routes for admin or super_admin (e.g. /users, /users/create, /services/create, create project).
 * Redirects to / when not admin or super_admin.
 */
export function AdminOrSuperAdminRoute({ children }: AdminOrSuperAdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="route-loader">
        <div className="route-loader-spinner" aria-hidden />
        <span>Loading…</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdminOrAbove(user?.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
