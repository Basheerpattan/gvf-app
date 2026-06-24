import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    // You can replace this with a loading spinner component
    return <div className="flex justify-center p-10">Loading...</div>
  }

  // If not logged in, redirect to the admin login page
  if (!user) {
    return <Navigate to="/admin" replace />
  }

  // If the user's role is not in the list of allowed roles, redirect to home
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // If everything is fine, render the protected component
  return children
}