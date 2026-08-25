import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../services/api'

function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail')
    if (!resetEmail) {
      navigate('/forgot-password')
      return
    }
    setEmail(resetEmail)
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    if (!password || !confirmPassword) {
      setError('Both password fields are required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authApi.resetPassword(email, password, confirmPassword)

      localStorage.removeItem('resetEmail')
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-500 to-blue-500'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg p-8'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-2xl'>
              🔑
            </div>
          </div>
          <h1 className='text-4xl font-bold tracking-tight'>
            <span className='text-blue-400'>Task</span>
            <span className='text-blue-900'>Nova</span>
          </h1>
        </div>

        <div className='text-center mb-8'>
          <h2 className='text-2xl font-semibold'>
            Create New Password
          </h2>
          <p className='text-gray-600 mt-2 text-sm'>
            Set a strong password for your account
          </p>
        </div>

        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 cursor-text'>
              New Password
            </label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter new password'
              className='w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-gray-900  outline-none focus:ring-2 focus:ring-blue-200'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2 cursor-text'>
              Confirm Password
            </label>
            <input
              type='password'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm your password'
              className='w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-gray-900  outline-none focus:ring-2 focus:ring-blue-200'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-gray-700'>
          <Link
            to='/login'
            className='text-blue-500 hover:text-blue-300 font-medium'
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
