import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOtp from './pages/VerifyOtp'
import ResetPassword from './pages/ResetPassword'
import socket from './services/socket'
import { useContext, useEffect } from 'react'
import { AuthContext } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Teams from './pages/Teams'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  const { user, isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn || !user?._id) return

    const handleConnect = () => {
      console.log('🔌 Connected to Socket.IO:', socket.id)

      socket.emit('join-room', user._id)

      console.log('👤 Joined user room:', user._id)
    }

    socket.on('connect', handleConnect)
    socket.connect()

    return () => {
      socket.off('connect', handleConnect)
      socket.disconnect()
    }
  }, [isLoggedIn, user?._id])

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/tasks'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/teams'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Teams />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/notifications'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
