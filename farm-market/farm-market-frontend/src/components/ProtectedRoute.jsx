import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route and only renders it if the logged-in user's role
 * matches. This is a client-side convenience only -- the real
 * enforcement MUST also happen in Django (permission_classes on
 * your DRF views). Never trust the frontend as the source of truth
 * for access control.
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "seller" ? "/seller" : "/shop"} replace />;
  }
  return children;
}
