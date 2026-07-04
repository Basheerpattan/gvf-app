import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Captured once, at module load (before any client-side navigation happens),
// so we can tell whether the browser's very first load of this tab landed
// directly on a protected route (as opposed to reaching it later via an
// in-app redirect after signing in).
const initialPathname = window.location.pathname
let hasCheckedInitialLoad = false

function isProtectedPath(pathname) {
  return pathname.startsWith('/admin/dashboard') || pathname === '/staff/forms'
}

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading, signOut } = useAuth()

  // Force logout if this protected page was reached via a browser refresh
  // or a back/forward navigation that reloaded the page.
  useEffect(() => {
    if (hasCheckedInitialLoad) return
    hasCheckedInitialLoad = true

    const [navEntry] = performance.getEntriesByType('navigation')
    const navType = navEntry?.type
    if (isProtectedPath(initialPathname) && (navType === 'reload' || navType === 'back_forward')) {
      signOut()
    }
  }, [signOut])

  // Force logout on browser back/forward button presses while viewing a
  // protected page (popstate does not fire for normal in-app link clicks).
  useEffect(() => {
    const handlePopState = () => signOut()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [signOut])

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