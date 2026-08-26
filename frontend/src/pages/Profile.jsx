import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, Pencil, Trash2 } from 'lucide-react'

import { AuthContext } from '../context/AuthContext'
import { authApi } from '../services/api'
import Loader from '../components/Loader'

function Profile() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useContext(AuthContext)

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  })

  const handleEdit = () => {
    setError('')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setError('')
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return setError('Name is required')
    }

    if (!formData.email.trim()) {
      return setError('Email is required')
    }

    try {
      setError('')
      setLoading(true)

      const res = await authApi.updateProfile(
        formData.name,
        formData.email,
        formData.password
      )

      updateUser(res.data.user)
      setFormData((prev) => ({ ...prev, password: '' }))
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return

    try {
      setLoading(true)
      await authApi.deleteProfile()
      logout()
      navigate('/register')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <Loader />

  return (
    <div className='min-h-full w-full bg-gray-100 text-gray-900 px-6 py-8 md:px-10'>
      <div className='mb-6 rounded-xl border border-gray-200 bg-gray-300 px-6 py-4'>
        <h1 className='text-3xl font-bold'>Profile</h1>

        <p className='mt-1 text-sm text-gray-700'>
          Manage your account information
        </p>
      </div>

      {error && (
        <div className='mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {!isEditing ? (
        <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-sm'>
          <div className='flex items-center gap-4 border-b-2 border-gray-300 pb-6'>
            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
              <User size={30} />
            </div>
            <div className='min-w-0'>
              <h2 className='text-xl font-bold text-gray-800'>{user.name}</h2>
              <p className='mt-1 text-gray-500'>{user.email}</p>
            </div>
          </div>

          <div className='mt-6 flex w-full flex-col gap-4'>
            <div className='flex items-start gap-4 rounded-2xl bg-blue-100 p-5'>
              <div className='shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600'>
                <User size={20} />
              </div>
              <div className='min-w-0'>
                <p className='text-sm text-gray-500'>Full Name</p>
                <h3 className='mt-1 text-lg font-semibold text-gray-800'>
                  {user.name}
                </h3>
              </div>
            </div>

            <div className='flex items-start gap-4 rounded-2xl bg-blue-100 p-5'>
              <div className='shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600'>
                <Mail size={20} />
              </div>
              <div className='min-w-0'>
                <p className='text-sm text-gray-500'>Email Address</p>
                <h3 className='mt-1 text-lg font-semibold text-gray-800 break-all leading-tight'>
                  {user.email}
                </h3>
              </div>
            </div>

            <div className='flex items-start gap-4 rounded-2xl bg-blue-100 p-5'>
              <div className='shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600'>
                <Shield size={20} />
              </div>
              <div className='min-w-0'>
                <p className='text-sm text-gray-500'>Role</p>
                <h3 className='mt-1 text-lg font-semibold capitalize text-gray-800'>
                  {user.role || 'member'}
                </h3>
              </div>
            </div>
          </div>

          <div className='mt-6 flex flex-wrap gap-4'>
            <button
              onClick={handleEdit}
              className='flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700'
            >
              <Pencil size={18} />
              Edit Profile
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className='flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-2 font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50'
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      ) : (
        <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-6 text-2xl font-bold text-gray-800'>
            Edit Profile
          </h2>

          <form onSubmit={handleSave} className='space-y-5'>
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='Enter full name'
                className='w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder='Enter email address'
                className='w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                New Password
              </label>
              <input
                type='password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder='Leave blank to keep current password'
                className='w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500'
              />
            </div>

            <div className='mt-8 flex flex-wrap gap-4'>
              <button
                type='submit'
                disabled={loading}
                className='rounded-2xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50'
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type='button'
                onClick={handleCancel}
                disabled={loading}
                className='rounded-2xl border border-gray-300 px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Profile
