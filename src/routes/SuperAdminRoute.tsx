import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROLE_SUPER_ADMIN } from '@/constants/roles'

interface SuperAdminRouteProps {
  children: React.ReactNode
}

/**
 * Protects super-admin-only routes (e.g. /users, /users/create).
 * Redirects to / when not super_admin.
 */
export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
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

  if (user?.role !== ROLE_SUPER_ADMIN) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
