import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { notificationApi } from '../services/api'
import socket from '../services/socket'

function Navbar({ onOpenSidebar, onToggleSidebar }) {
  const { isLoggedIn, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return

    const fetchUnreadCount = async () => {
      try {
        const res = await notificationApi.getAllNotification()

        const notifications = res.data.notifications || []

        const unread = notifications.filter(
          (notification) => !notification.isRead
        ).length

        setUnreadCount(unread)
      } catch (err) {
        console.error('Failed to fetch notification count:', err)
      }
    }

    fetchUnreadCount()

    const handleNewNotification = () => {
      setUnreadCount((prev) => prev + 1)
    }

    socket.on('task-assigned', handleNewNotification)
    socket.on('task-completed', handleNewNotification)

    return () => {
      socket.off('task-assigned', handleNewNotification)
      socket.off('task-completed', handleNewNotification)
    }
  }, [isLoggedIn])

  if (!isLoggedIn) return null

  const handleProfile = () => {
    navigate('/profile')
  }
    

  const handleNotifications = () => {
    navigate('/notifications')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className='h-20 bg-black bg-linear-to-r from-black to-blue-700 border px-4 md:px-8 flex items-center justify-between'>
      {/* Mobile menu */}
      <button
        type='button'
        onClick={onOpenSidebar}
        className='rounded-xl p-3 text-white transition hover:bg-white/10 md:hidden'
        aria-label='Open sidebar'
      >
        <Menu size={28} />
      </button>

      {/* Desktop menu */}
      <button
        type='button'
        onClick={onToggleSidebar}
        className='hidden rounded-xl p-3 text-white transition hover:bg-white/10 md:flex'
        aria-label='Toggle sidebar'
      >
        <Menu size={28} />
      </button>

      {/* right side */}
      <div className='flex items-center gap-2 md:gap-4'>
        
        {/* profile */}
        <button
          type='button'
          onClick={handleProfile}
          className='flex items-center gap-3 rounded-2xl border border-blue-500/10 bg-[#0b1328] px-3 py-2 text-left transition hover:border-blue-500 md:min-w-[220px] md:px-4'
        >
          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white'>
            <User size={18} />
          </div>

          <div className='hidden flex-1 leading-tight md:block'>
            <p className='text-sm font-semibold text-white'>
              {user?.name || 'User'}
            </p>

            <p className='text-xs text-gray-400 capitalize'>
              {user?.role || 'Member'}
            </p>
          </div>
        </button>

        {/* notifications */}
        <button
          type='button'
          onClick={handleNotifications}
          className='relative flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/10 bg-[#0b1328] text-white hover:border-blue-500 transition'
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* logout */}
        <button
          type='button'
          onClick={handleLogout}
          className='flex h-12 items-center gap-2 rounded-2xl border border-blue-500/10 bg-[#0b1328] px-5 text-white hover:border-red-500 transition'
        >
          <LogOut size={18} />

          <span className='hidden text-sm font-medium md:inline'>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
