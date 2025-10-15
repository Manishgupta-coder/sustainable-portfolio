import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from "../supabase/supabase";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoading(false)
    }

    checkSession()

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Checking authentication...
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" replace />
}

export default ProtectedRoute
