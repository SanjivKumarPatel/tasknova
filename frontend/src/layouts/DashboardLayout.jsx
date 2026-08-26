import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function DashboardLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true)
  }

  const closeSidebar = () => {
    setMobileSidebarOpen(false)
  }

  const toggleDesktopSidebar = () => {
    setDesktopSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className='flex h-dvh overflow-hidden bg-gray-100'>

      {/* Sidebar */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        desktopSidebarCollapsed={desktopSidebarCollapsed}
        onClose={closeSidebar}
      />

      {/* Right section */}
      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>

        {/* Navbar */}
        <Navbar
          onOpenSidebar={openMobileSidebar}
          onToggleSidebar={toggleDesktopSidebar}
        />

        {/* Page content */}
        <main className='min-w-0 flex-1 overflow-x-hidden overflow-y-auto'>
          {children}
        </main>

      </div>
    </div>
  )
}

export default DashboardLayout