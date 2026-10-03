import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Route guard.
 *
 * Unauthenticated or under-privileged visits are redirected to the login
 * portal with a `next` parameter, so the user lands back where they wanted to
 * be after authenticating. Authorization is enforced here on the client and
 * again by the backend on every protected API call.
 */
export function RequireAuth({
  children,
  role = 'participant',
}: {
  children: React.ReactNode
  role?: 'participant' | 'admin'
}) {
  const { isAuthenticated, role: sessionRole } = useAuth()
  const location = useLocation()

  const authorized = isAuthenticated && (role === 'participant' || sessionRole === 'admin')

  if (!authorized) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
  }

  return <>{children}</>
}
