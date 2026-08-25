import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading..🔃
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
