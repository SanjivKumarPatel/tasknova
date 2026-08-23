import { useContext, useEffect, useState } from 'react'
import { Users, Plus, Trash2, Pencil, UserPlus, X } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { teamApi } from '../services/api.js'
import Loader from '../components/Loader.jsx'
import AddMemberForm from '../components/AddMemberForm'

function Teams() {
  const { user } = useContext(AuthContext)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTeamId, setEditTeamId] = useState(null)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [currentTeamId, setCurrentTeamId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await teamApi.getAllTeams()
      setTeams(res.data.teams || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    })

    setError('')
    setShowForm(false)
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return setError('Team name is required')
    }

    try {
      setError('')

      const res = await teamApi.createTeam(formData.name, formData.description)

      setTeams((prev) => [res.data.team, ...prev])
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team')
    }
  }

  const handleEditClick = (team) => {
    setError('')
    setEditTeamId(team._id)

    setEditFormData({
      name: team.name,
      description: team.description
    })
  }

  const handleUpdateTeam = async (e) => {
    e.preventDefault()

    if (!editFormData.name.trim()) {
      return setError('Team name is required')
    }

    try {
      const res = await teamApi.updateTeam(
        editTeamId,
        editFormData.name,
        editFormData.description
      )

      setTeams((prev) =>
        prev.map((team) => (team._id === editTeamId ? res.data.team : team))
      )

      setEditTeamId(null)

      setEditFormData({
        name: '',
        description: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update team')
    }
  }

  const handleDeleteTeam = async (teamId) => {
    try {
      await teamApi.deleteTeam(teamId)

      setTeams((prev) => prev.filter((team) => team._id !== teamId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete team')
    }
  }

  const handleMemberAdded = (updatedTeam) => {
    setTeams((prev) =>
      prev.map((team) => (team._id === updatedTeam._id ? updatedTeam : team))
    )

    setShowAddMemberForm(false)
    setCurrentTeamId(null)
  }

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      const res = await teamApi.removeMember(teamId, memberId)

      setTeams((prev) =>
        prev.map((team) => (team._id === teamId ? res.data.team : team))
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member')
    }
  }

  return (
    <div className="min-h-full w-full bg-gray-100 text-gray-900 px-6 py-8 md:px-10">
      {/* header */}
      <div className="mb-8 px-6 py-3 flex items-center justify-between bg-gray-300 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>

          <p className="mt-2 text-gray-900">
            Manage your teams and collaborate efficiently.
          </p>
        </div>

        {user?.role === 'admin' && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Team
          </button>
        )}
      </div>

      {/* error */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* AddMemberForm Modal */}
      {showAddMemberForm && (
        <AddMemberForm
          teamId={currentTeamId}
          existingMembers={
            teams.find((team) => team._id === currentTeamId)?.members || []
          }
          onClose={() => {
            setShowAddMemberForm(false)
            setCurrentTeamId(null)
          }}
          onMemberAdded={handleMemberAdded}
        />
      )}

      {/* create form */}
      {showForm && (
        <form
          onSubmit={handleCreateTeam}
          className="mb-8 rounded-3xl border border-gray-300 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-xl font-semibold text-gray-800">
            Create New Team
          </h2>

          <div className="space-y-5">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
              placeholder="Enter team name"
              className="w-full rounded-2xl border border-gray-400 bg-gray-50 px-4 py-3 outline-none focus:border-blue-600"
            />

            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              placeholder="Enter team description"
              className="w-full rounded-2xl border border-gray-400 bg-gray-50 px-4 py-3 outline-none focus:border-blue-600"
            ></textarea>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-blue-600 px-6 py-3 border border-gray-400 font-medium text-white transition hover:bg-blue-700"
              >
                Create
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-gray-400 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* loading */}
      {loading ? (
        <Loader />
      ) : teams.length === 0 ? (
        /* empty state */
        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Users size={30} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-800">
            No Teams Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">Create your first team</p>
        </div>
      ) : (
        /* teams grid */
        <div className="grid gap-6 lg:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team._id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* top */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {team.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {team.description || 'No description'}
                  </p>
                </div>

                {user?.role === 'admin' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditClick(team)}
                      className="rounded-xl border border-green-200 bg-green-50 p-3 text-green-600 hover:bg-green-100"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(team._id)}
                      className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* edit form */}
              {editTeamId === team._id && (
                <form onSubmit={handleUpdateTeam} className="mt-5 space-y-4">
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        name: e.target.value
                      })
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />

                  <textarea
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value
                      })
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  ></textarea>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-2xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditTeamId(null)
                        setError('')
                      }}
                      className="rounded-2xl border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* members */}
              <div className="mt-6">
                <h4 className="mb-3 font-semibold text-gray-700">
                  Team Members ({team.members?.length || 0})
                </h4>

                {team.members && team.members.length > 0 ? (
                  <div className="space-y-3">
                    {team.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between rounded-2xl bg-gray-100 px-4 py-3"
                      >
                        <div>
                          <span className="block text-sm font-medium text-gray-700">
                            {member.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {member.email}
                          </span>
                        </div>

                        {user?.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMember(team._id, member._id)
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-100"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No members added yet</p>
                )}

                {/* add member */}
                {user?.role === 'admin' && (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTeamId(team._id)
                        setShowAddMemberForm(true)
                      }}
                      className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition"
                    >
                      <UserPlus size={18} />
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Teams
