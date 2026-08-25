import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { authApi } from '../services/api'

function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const res = await authApi.login(formData.email, formData.password, formData.remember)

      login(res.data.user, res.data.token, res.data.rememberToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-t from-gray-50 via-cyan-300 to-blue-500 px-4 py-8">

      {/* card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-xl">
       
        <div className='text-center mb-6'>
          <h1 className='text-5xl font-bold tracking-tight'>
            <span className='text-blue-400'>Task</span>
            <span className='text-blue-900'>Nova</span>
          </h1>

          <p className='mt-4 text-[11px] font-semibold tracking-[4px] uppercase'>
            Organize※ Collaborate※ Achieve
          </p>
        </div>

        {/* heading */}
        <div className='text-center mb-6'>
          <h2 className='text-3xl font-semibold'>Welcome Back 🚀</h2>

          <p className='text-gray-600 mt-2 mr-10 text-sm'>
            Sign in to continue your journey
          </p>
        </div>

        {/* error */}
        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* email */}
          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>

            <input
              type='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-3  placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* password */}
          <div>
            <label className='block text-sm font-medium mb-2'>Password</label>

            <input
              type='password'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-3  placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* options */}
          <div className='flex items-center justify-between text-sm'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                name='remember'
                checked={formData.remember}
                onChange={handleChange}
                className='rounded border-gray-900'
              />
              <span className='text-sm text-gray-500'>Remember me</span>
            </label>
            <Link
              to='/forgot-password'
              className='text-blue-400 hover:text-blue-700 transition'
            >
              Forgot Password?
            </Link>
          </div>

          {/* submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-xl bg-gradient-to-r from-blue-400 to-indigo-800 py-3 text-white font-semibold hover:opacity-95 transition disabled:opacity-60'
          >
            {loading ? 'Signing In...' : 'Sign In ➡️'}
          </button>
        </form>
        
        {/* footer */}
        <p className='text-center text-sm text-gray-500 mt-6'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            className='text-blue-500 hover:text-blue-300 font-medium'
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
