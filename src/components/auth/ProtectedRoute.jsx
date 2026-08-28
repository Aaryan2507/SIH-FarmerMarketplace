import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export function ProtectedRoute({ allowedRoles }) {
  const { user, role } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { user, role } = useAuth()

  if (user) {
    return <Navigate to={`/${role}`} replace />
  }

  return <Outlet />
}
