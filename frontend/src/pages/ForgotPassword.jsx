import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../services/api'

function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        setLoading(true)
        setError('')

        try {
            await authApi.forgotPassword(email)

            localStorage.setItem('resetEmail', email)
            toast.success('OTP sent to your email')
            navigate('/verify-otp')
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send OTP'
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
                            🔐
                        </div>
                    </div>
                    <h1 className='text-4xl font-bold tracking-tight'>
                        <span className='text-blue-400'>Task</span>
                        <span className='text-blue-900'>Nova</span>
                    </h1>
                </div>

                <div className='text-center mb-8'>
                    <h2 className='text-2xl font-semibold'>Reset Password</h2>
                    <p className='text-gray-700 mt-2 text-sm'>
                        Enter your email to receive an OTP
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
                            Email Address
                        </label>
                        
                    <input
                      type='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='example@gmail.com'
                      className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
                    />
                    </div>

                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                </form>

                <div className='mt-6 text-center text-sm text-gray-700'>
                    Remember your password?{' '}
                    <Link to='/login' className='text-blue-500 hover:text-blue-300 font-medium'>
                      Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword