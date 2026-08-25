import { useEffect, useState, useContext } from 'react'
import { taskApi } from '../services/api'
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import socket from '../services/socket'

function Dashboard() {
  const { user } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    try {
      setError('')
      setLoading(true)

      const res = await taskApi.getAllTasks()
      setTasks(res.data.tasks || [])
    } catch (err) {
      console.error('Failed to load tasks:', err)

      const message =
        err.response?.data?.message ||
        'Failed to load tasks. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTasks()

    const handleTaskUpdate = () => {
      fetchTasks()
    }

    socket.on('task-assigned', handleTaskUpdate)
    socket.on('task-completed', handleTaskUpdate)

    return () => {
      socket.off('task-assigned', handleTaskUpdate)
      socket.off('task-completed', handleTaskUpdate)
    }
  }, [])

  // Stats
  const total = tasks.length

  const completed = tasks.filter(
    (task) => task.status === 'completed'
  ).length

  const inProgress = tasks.filter(
    (task) => task.status === 'inProgress'
  ).length

  const pending = tasks.filter(
    (task) => task.status === 'pending'
  ).length

  return (
    <div className='min-h-full w-full bg-gray-100 text-gray-900 px-6 py-8 md:px-10'>
      
      {/* Main */}
      
        <div className='mb-8 px-6 text-center py-8 bg-gray-100 border border-gray-400 rounded-2xl'>
          <h1 className='text-3xl font-bold'>
            Welcome back,
            <span className='ml-2 text-indigo-700'>
              {user?.name || 'User'} 🚀
            </span>
          </h1>

          <p className='mt-4'>
            Organize your tasks, collaborate with your team, and achieve more every day.
          </p>
        </div>
        {/* Error */}
        {error && (
          <div className='mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>

          {/* Total */}
        <div className="relative rounded-xl bg-gray-400 p-5 text-center border border-gray-400 transition duration-300 hover:-translate-y-2 hover:bg-gray-600 hover:shadow-xl">
          <p className="text-2xl font-semibold text-blue-900">Total Tasks</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{total}</h2>
        </div>

          {/* Completed */}
        <div className='relative rounded-xl bg-green-400 p-5 text-center border border-gray-400 transition duration-300 hover:-translate-y-2 hover:bg-green-600 hover:shadow-xl'>
          <p className='text-xl font-semibold text-blue-900'>Completed</p>
            <h2 className='mt-2 text-3xl font-bold text-white'>{completed}</h2>
        </div>

          {/* In Progress */}
        <div className='relative rounded-xl bg-blue-400 p-5 text-center border border-gray-400 transition duration-300 hover:-translate-y-2 hover:bg-blue-600 hover:shadow-xl'>
          <p className='text-xl font-semibold text-blue-900'>In Progress</p>
            <h2 className='mt-2 text-3xl font-bold text-white'>{inProgress}</h2>
        </div>


          {/* Pending */}
        <div className='relative rounded-xl bg-yellow-400 p-5 text-center border border-gray-400 transition duration-300 hover:-translate-y-2 hover:bg-yellow-600 hover:shadow-xl'>
          <p className='text-xl font-semibold text-blue-900'>Pending</p>
            <h2 className='mt-2 text-3xl font-bold text-white'>{pending}</h2>
        </div>
        </div>

        {/* Task List */}
        <div className='relative rounded-xl bg-gray-50 p-5 border border-gray-400'>
          <h2 className='text-lg font-semibold mb-4'>
            Recent Tasks
          </h2>

          {loading ? (
            <Loader />
          ) : tasks.length === 0 ? (
            <p className='text-gray-700'>
              No tasks found
            </p>
          ) : (
            <div className='space-y-4'>
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task._id}
                  className='flex justify-between items-center border-b-2 border-gray-300 pb-3'
                >
                  <div>
                    <p className='font-medium'>
                      {task.title}
                    </p>

                    <p className='text-sm text-gray-700'>
                      {task.description || 'No description'}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      task.status === 'completed'
                        ? 'text-green-400'
                        : task.status === 'inProgress'
                        ? 'text-blue-500'
                        : 'text-yellow-400'
                    }`}
                  >
                    {task.status === 'inProgress'
                        ? 'In Progress'
                        : task.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}

export default Dashboard