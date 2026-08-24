import { useContext, useEffect, useState } from 'react'
import { Plus, Trash2, ClipboardList, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { taskApi } from '../services/api.js'
import Loader from '../components/Loader.jsx'
import TaskForm from '../components/TaskForm'

function Tasks() {
  const { user } = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [loadingSubtasks, setLoadingSubtasks] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await taskApi.getAllTasks()
      setTasks(res.data.tasks || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev])
    setShowTaskForm(false)
  }

  const handleDelete = async (taskId) => {
    setError('')
    try {
      await taskApi.deleteTask(taskId)
      toast.success('Task deleted successfully!')

      setTasks((prev) => prev.filter((task) => task._id !== taskId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId, status) => {
    setError('')
    try {
      const task = tasks.find((t) => t._id === taskId)
      if (!task) return

      const res = await taskApi.updateTask(
        taskId,
        task.title,
        task.description,
        task.deadline,
        task.priority,
        task.category,
        status
      )

      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleGenerateSubtasks = async (taskId, title, description) => {
    setError('')
    try {
      setLoadingSubtasks(taskId)
      const res = await taskApi.generateSubtasks(taskId, title, description)
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      )
      toast.success('Subtasks generated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate subtasks')
    } finally {
      setLoadingSubtasks(null)
    }
  }

  return (
    <div className='min-h-full w-full bg-gray-100 text-gray-900 px-6 py-8 md:px-10'>
      {/* header */}
      <div className='mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-300 px-6 py-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <div className='flex items-center gap-3'>
            <h1 className='text-3xl font-bold'>
              Tasks
            </h1>

            <span className='flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-600'>
              <Sparkles size={13} />
              AI Powered
            </span>
          </div>

          <p className='mt-3 flex items-center gap-2 text-sm text-gray-600'>
            Click
            <Sparkles size={16} className='text-blue-600' />
            on any task to generate actionable subtasks with AI.
          </p>
        </div>

        {user?.role === 'admin' && !showTaskForm && (
          <button
            type='button'
            onClick={() => setShowTaskForm(true)}
            className='flex items-center gap-2 rounded-2xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-700'
          >
            <Plus size={18} /> Create Task
          </button>
        )}
      </div>

      {/* error */}
      {error && (
        <div className='mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* TaskForm Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* loading */}
      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        /* empty state */
        <div className='rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
            <ClipboardList size={30} />
          </div>

          <h2 className='mt-5 text-xl font-semibold text-gray-800'>
            No tasks found
          </h2>

          <p className='mt-2 text-sm text-gray-500'>
            Create your first task to start working
          </p>
        </div>
      ) : (
        /* task cards */
        <div className='grid gap-6 lg:grid-cols-2'>
          {tasks.map((task) => (
            <div
              key={task._id}
              className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md'
            >
              {/* top section */}
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {task.title}
                  </h3>

                  <p className='mt-2 text-sm leading-6 text-gray-500'>
                    {task.description || 'No description'}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() =>
                      handleGenerateSubtasks(
                        task._id,
                        task.title,
                        task.description
                      )
                    }
                    disabled={loadingSubtasks === task._id}
                    className='rounded-xl border border-blue-200 bg-blue-50 p-3 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed'
                    title='AI Task Breakdown'
                  >
                    {loadingSubtasks === task._id ? (
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600' />
                    ) : (
                      <Sparkles size={18} />
                    )}
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      type='button'
                      onClick={() => handleDelete(task._id)}
                      className='rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100'
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* task info */}
              <div className='mt-5 flex flex-wrap gap-3'>
                <span className='rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-600'>
                  {task.priority || 'medium'}
                </span>

                <select
                  value={task.status || 'pending'}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className='rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 outline-none'
                >
                  <option value='pending'>Pending</option>
                  <option value='inProgress'>In Progress</option>
                  <option value='completed'>Completed</option>
                </select>

                {task.category && (
                  <span className='rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700'>
                    {task.category}
                  </span>
                )}
              </div>

              {/* subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className='mt-5 rounded-2xl bg-blue-50 p-4'>
                  <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-blue-700'>
                    <Sparkles size={15} />
                    AI Generated Subtasks
                  </div>
                  <ul className='space-y-2'>
                    {task.subtasks.map((subtask, idx) => (
                      <li key={idx} className='flex gap-2 text-sm text-blue-600'>
                        <span>•</span>
                        <span>
                          {subtask.title}{' '}
                          <em className='text-xs text-blue-500'>
                            ({subtask.priority})
                          </em>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* deadline */}
              {task.deadline && (
                <p className='mt-5 text-sm text-gray-500'>
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default Tasks
