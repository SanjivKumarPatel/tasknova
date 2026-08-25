import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Users, Bell, User } from 'lucide-react'

function Sidebar() {
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
    <aside className='w-xs h-screen bg-gradient-to-b from-cyan-300  to-blue-900  px-8 py-8'>
      {/* logo */}
      <div>
        <div className='flex items-center gap-3'>
          <img
            src='/logo.jpg'
            alt='TaskNova'
            className='w-14 h-14 object-contain'
          />

          <h1 className='text-5xl font-bold tracking-tight'>
            <span className='text-blue-500'>Task</span>
            <span className='text-blue-900'>Nova</span>
          </h1>
        </div>

        <div className='mt-8 border-b border-slate-200'></div>
      </div>

      <nav className='mt-8 space-y-6'>
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 px-6 py-5 rounded-2xl text-[22px] font-medium transition ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-800 hover:bg-white/80'
                }`
              }
            >
              <Icon size={30} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
