import { useEffect, useState } from 'react'
import { authApi, teamApi } from '../services/api'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'

function AddMemberForm({ teamId, existingMembers, onClose, onMemberAdded }) {
  const [members, setMembers] = useState([])
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true)

        const res = await authApi.getUsers()

        const users = res.data.users || []

        const availableMembers = users.filter(
          (user) =>
            !existingMembers.some(
              (member) => String(member._id) === String(user._id)
            )
      )

    setMembers(availableMembers)

    if (availableMembers.length > 0) {
      setSelectedMemberId(availableMembers[0]._id)
    }
      } catch (err) {
        console.error('Failed to fetch members:', err)

        const message =
          err.response?.data?.message || 'Failed to load members'

        setError(message)
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchMembers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedMemberId) {
      setError('Please select a member')
      return
    }

    try {
      setLoading(true)
      const res = await teamApi.addMember(teamId, selectedMemberId)

      toast.success('Member added successfully!')
      onMemberAdded(res.data.team)
      onClose()
    } catch (err) {
      const message =
      err.response?.data?.message || 'Failed to add member'

    setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-[#04112ad9] rounded-2xl border border-blue-400/30 w-full max-w-md p-6 backdrop-blur-xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-white'>Add Team Member</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-400 hover:text-white transition'
          >
            <X size={24} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Member Selection */}
          <div>
            <label className='block text-sm text-gray-200 mb-2'>
              Select Member *
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
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className='w-full rounded-xl border border-blue-400/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30'
              >
                {members.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                    className='bg-gray-900'
                  >
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
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
              className='flex-1 rounded-xl bg-linear-to-r from-blue-500 to-indigo-800 py-3 text-white font-semibold hover:opacity-95 transition disabled:opacity-60'
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMemberForm
