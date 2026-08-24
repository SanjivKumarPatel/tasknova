import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

function NotFound() {
  return (
    <div className='flex min-h-full items-center justify-center bg-gray-100 px-6 py-16'>
      <div className='w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-lg'>
        {/* icon */}
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500'>
          <AlertTriangle size={38} />
        </div>

        {/* title */}
        <h1 className='mt-6 text-5xl font-bold text-gray-900'>404</h1>

        <h2 className='mt-3 text-2xl font-semibold text-gray-800'>
          Page Not Found
        </h2>

        {/* description */}
        <p className='mt-4 text-sm leading-7 text-gray-500'>
          The page you are looking for does not exist or may have been moved.
        </p>

        {/* button */}
        <Link
          to='/'
          className='mx-auto mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700'
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
