import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

function DashboardLayout({ children }) {
  return (
    <div className='h-screen bg-gray-100 flex overflow-hidden'>
      {/* Sidebar */}
      <Sidebar />

      {/* Right section */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className='flex-1 overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout