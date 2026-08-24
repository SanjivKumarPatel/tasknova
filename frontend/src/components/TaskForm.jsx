import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { authApi, taskApi } from '../services/api'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'

function TaskForm({ onClose, onTaskCreated }) {
  const { user } = useContext(AuthContext)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    category: '',
    assignedTo: ''
  })

  // Fetch all members on mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true)
        const res = await authApi.getUsers()
        const users = res.data.users || []

        setMembers(users)

        if (users.length > 0) {
          setFormData((prev) => ({
            ...prev,
            assignedTo: users[0]._id
          }))
        }
      } catch (err) {
        console.error('Failed to fetch members:', err)
        toast.error('Failed to load members')
      } finally {
        setLoadingMembers(false)
      }
    }

    // Only fetch if admin
    if (user?.role === 'admin') {
      fetchMembers()
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }

    if (!formData.assignedTo) {
      setError('Please assign task to a member')
      return
    }

    try {
      setLoading(true)
      const res = await taskApi.createTask(
        formData.title,
        formData.description,
        formData.deadline,
        formData.priority,
        formData.category,
        formData.assignedTo
      )

      toast.success('Task created successfully!')
      onTaskCreated(res.data.task)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md rounded-2xl border border-blue-400/30 bg-gray-900 p-5'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold text-white'>Create Task</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-400 hover:text-white transition'
          >
            <X size={24} />
          </button>
        </div>

        {/* error */}
        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-3'>
          {/* Title */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>Title *</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Task title'
              className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Task description'
              rows='2'
              className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* Assign To */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>
              Assign To *
            </label>
            {loadingMembers ? (
              <div className='text-gray-400 text-sm'>
                Loading members...
              </div>
            ) : members.length === 0 ? (
              <div className='text-gray-400 text-sm'>
                No members available
              </div>
            ) : (
              <select
                name='assignedTo'
                value={formData.assignedTo}
                onChange={handleChange}
                className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
              >
                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                    className='bg-slate-900'
                  >
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>Priority</label>
            <select
              name='priority'
              value={formData.priority}
              onChange={handleChange}
              className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            >
              <option value='low' className='bg-slate-900'>
                Low
              </option>
              <option value='medium' className='bg-slate-900'>
                Medium
              </option>
              <option value='high' className='bg-slate-900'>
                High
              </option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>Category</label>
            <input
              type='text'
              name='category'
              value={formData.category}
              onChange={handleChange}
              placeholder='e.g., Bug, Feature, Design'
              className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* Deadline */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>Deadline</label>
            <input
              type='date'
              name='deadline'
              value={formData.deadline}
              onChange={handleChange}
              className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
            />
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-xl border border-blue-400/20 bg-transparent py-3 text-white font-semibold hover:bg-white/5 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || loadingMembers || members.length === 0}
              className='flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-900 py-3 text-white font-semibold hover:opacity-95 transition disabled:opacity-60'
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
