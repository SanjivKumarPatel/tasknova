import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bell,
  User,
  X
} from 'lucide-react'

function Sidebar({ mobileSidebarOpen,desktopSidebarCollapsed, onClose }) {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: ClipboardList
    },
    {
      name: 'Teams',
      path: '/teams',
      icon: Users
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 md:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-gradient-to-b from-cyan-300 to-blue-900
          px-6 py-8
          transition-all duration-300 ease-in-out
          w-72
          md:static md:z-auto md:translate-x-0
          ${desktopSidebarCollapsed ? 'md:w-20 md:px-3' : 'md:w-64 md:px-8'}

          ${
            mobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Logo / header */}
        <div>
          <div className='flex items-center justify-between'>
            <div
              className={`flex items-center gap-3 ${
                desktopSidebarCollapsed ? 'md:justify-center' : ''
              }`}
            >
              <img
                src='/logo.jpg'
                alt='TaskNova'
                className='h-12 w-12 object-contain md:h-14 md:w-14'
              />

              <h1
                className={`text-4xl font-bold tracking-tight md:text-[28px] whitespace-nowrap ${
                  desktopSidebarCollapsed ? 'md:hidden' : ''
                }`}
              >
                <span className='text-blue-500'>Task</span>
                <span className='text-blue-900'>Nova</span>
              </h1>
            </div>

            {/* Mobile close button */}
            <button
              type='button'
              onClick={onClose}
              className='rounded-xl p-2 text-blue-900 transition hover:bg-white/50 md:hidden'
              aria-label='Close sidebar'
            >
              <X size={24} />
            </button>
          </div>

          <div className='mt-8 border-b border-slate-200' />
        </div>

        {/* Navigation */}
        <nav className='mt-8 space-y-4 md:space-y-4'>
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={desktopSidebarCollapsed ? item.name : ''}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium transition
                   md:gap-3 md:px-4 md:py-4 md:text-[20px]
                   ${
                     desktopSidebarCollapsed
                       ? 'md:justify-center md:px-3'
                       : ''
                   }
                   ${
                     isActive
                       ? 'bg-white text-blue-600 shadow-sm'
                       : 'text-slate-800 hover:bg-white/80'
                   }`
                }
              >
                <Icon
                  size={26}
                  strokeWidth={1.8}
                  className='shrink-0 md:h-[30px] md:w-[30px]'
                />

                <span className={desktopSidebarCollapsed ? 'md:hidden' : ''}>
                  {item.name}
                </span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar