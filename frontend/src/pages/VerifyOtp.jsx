import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../services/api'

function VerifyOtp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail')
    if (!resetEmail) {
      navigate('/forgot-password')
      return
    }
    setEmail(resetEmail)
  }, [navigate])

  const handleVerify = async (e) => {
    e.preventDefault()

    if (loading) return

    if (!otp || otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authApi.verifyOtp(email, otp)

      toast.success('OTP verified successfully!')
      navigate('/reset-password')
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid OTP'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resending) return

    setResending(true)
    setError('')

    try {
      await authApi.forgotPassword(email)
      toast.success('OTP resent to your email!')
      setOtp('')
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend OTP'
      setError(message)
      toast.error(message)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-500 to-blue-500'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg p-8'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <div className='w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-2xl'>
              ✉️
            </div>
          </div>
          <h1 className='text-4xl font-bold tracking-tight'>
            <span className='text-blue-400'>Task</span>
            <span className='text-blue-900'>Nova</span>
          </h1>
        </div>

        <div className='text-center mb-8'>
          <h2 className='text-2xl font-semibold'>Verify OTP</h2>
          <p className='text-gray-700 mt-2 text-sm'>
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2 cursor-text'>
              OTP Code
            </label>
            <input
              type='text'
              maxLength='6'
              inputMode='numeric'
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder='000000'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-3 text-center tracking-widest outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className='mt-6 text-center text-sm text-gray-700'>
          <p className='text-gray-600'>
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resending}
              className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </p>
        </div>

        <div className='mt-4 text-center text-sm text-gray-600'>
          <Link
            to='/forgot-password'
            className='text-blue-500 hover:text-blue-300 font-medium'
          >
            Back to Reset Password
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
