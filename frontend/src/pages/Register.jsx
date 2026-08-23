import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { authApi } from '../services/api'

function Register() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await authApi.registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      )

      register(res.data.user, res.data.token)

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center p-0 bg-linear-to-t from-gray-50 via-cyan-300 to-blue-500">

      {/* card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
        
        <div className='text-center mb-2'>        
          <h1 className='text-4xl font-bold tracking-tight'>
            <span className='text-blue-400'>Task</span>
            <span className='text-blue-900'>Nova</span>
          </h1>

          <p className='mt-2 text-[11px] font-semibold tracking-[4px] uppercase'>
            Organize※ Collaborate※ Achieve
          </p>
        </div>

        {/* heading */}
        <div className='text-center mb-2'>
          <h2 className='text-2xl font-semibold'>
            Create Account ✨
          </h2>

          <p className='text-gray-600 mr-6 text-sm'>
            Start your productivity journey
          </p>
        </div>

        {/* error */}
        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className='space-y-3'>
          {/* name */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Full name
            </label>
            <input
              type='text'
              name='name'
              required
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your full name'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* email */}
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>

            <input
              type='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* role */}
          <div>
            <label className='block text-sm font-medium mb-1'>Register as</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            >
              <option value='member' className='bg-gray-300'>Member</option>
              <option value='admin' className='bg-gray-300'>Admin</option>
            </select>
          </div>

          {/* password */}
          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>

            <input
              type='password'
              name='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='Create password'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* confirm password */}
          <div>
            <label className='block text-sm font-medium mb-1'>
              Confirm password
            </label>

            <input
              type='password'
              name='confirmPassword'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='Confirm password'
              className='w-full rounded-xl border border-gray-700 bg-gray-100 px-4 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* submit */}
          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 mt-5 py-2 text-white font-semibold hover:opacity-75 transition disabled:opacity-60'
          >
            {loading ? 'Creating Account...' : 'Create Account ➡️'}
          </button>

          {/* footer */}
          <p className='text-center text-sm text-gray-500 mt-3'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-500 hover:text-blue-300 font-medium'
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
