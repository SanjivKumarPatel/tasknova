import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { notificationApi } from '../services/api'

function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
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

    if (isLoggedIn) {
      fetchUnreadCount()
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
    <header className='h-20 bg-black bg-linear-to-r from-black to-blue-700 border rounded-md px-8 flex items-center justify-end'>

      {/* right side */}
      <div className='ml-8 flex items-center gap-4'>
        

        {/* profile */}
        <button
          type='button'
          onClick={handleProfile}
          className='flex items-center gap-3 rounded-2xl border border-blue-500/10 bg-[#0b1328] px-4 py-2 min-w-[220px] text-left hover:border-blue-500 transition'
        >
          <div className='flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white'>
            <User size={18} />
          </div>

          <div className='flex-1 leading-tight'>
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

          <span className='text-sm font-medium'>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
