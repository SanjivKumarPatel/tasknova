import { useContext, useEffect, useState } from 'react'
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react'

import { notificationApi } from '../services/api'
import { AuthContext } from '../context/AuthContext'
import Loader from '../components/Loader'
import socket from '../services/socket'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn) return

    fetchNotifications()

  const handleNotification = (data) => {
    setNotifications((prev) => [
      data.notification,
      ...prev
    ])
  }

  socket.on('task-assigned', handleNotification)
  socket.on('task-completed', handleNotification)

  return () => {
    socket.off('task-assigned', handleNotification)
    socket.off('task-completed', handleNotification)
  }  
   }, [isLoggedIn])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await notificationApi.getAllNotification()
      setNotifications(res.data.notifications || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }
  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await notificationApi.markAsRead(notificationId)

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? res.data.notification
            : notification
        )
      )
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to mark notification as read'
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date()
        }))
      )
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to mark notifications as read'
      )
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId)

      setNotifications((prev) =>
        prev.filter((item) => item._id !== notificationId)
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification')
    }
  }

  return (
    <div className='min-h-full w-full bg-gray-100 text-gray-900 px-6 py-8 md:px-10'>
      {/* page header */}
      <div className='mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-300 px-6 py-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Notifications
          </h1>

          <p className='mt-2 text-gray-900'>
            Stay updated with your latest activity and alerts.
          </p>
        </div>

        {notifications.some((notification) => !notification.isRead) && (
          <button
            type='button'
            onClick={handleMarkAllAsRead}
            className='flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100'
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        )}
      </div>

      {/* error */}
      {error && (
        <div className='mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      {/* loader */}
      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        /* empty state */
        <div className='flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm'>
          <div className='rounded-full bg-blue-100 p-5 text-blue-600'>
            <Bell size={34} />
          </div>

          <h2 className='mt-5 text-xl font-semibold text-gray-800'>
            No notifications
          </h2>

          <p className='mt-2 max-w-md text-sm leading-6 text-gray-500'>
            You currently don't have any notifications or updates.
          </p>
        </div>
      ) : (
        /* notification list */
        <div className='space-y-5'>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex flex-col gap-5 rounded-3xl border p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-start md:justify-between ${
                notification.isRead
                  ? 'border-gray-400 bg-white'
                  : 'border-blue-400 bg-blue-50/40'
              }`}
            >
              {/* left */}
              <div className='flex min-w-0 flex-1 items-start gap-4'>
                <div className='rounded-2xl bg-blue-100 p-3 text-blue-600'>
                  <Bell size={22} />
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='break-words font-medium text-gray-800'>
                    {notification.message}
                  </p>

                  <p className='mt-1 text-sm capitalize text-gray-700'>
                    Type: {notification.type}
                  </p>
                </div>
              </div>

              {/* delete */}
              <div className='flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center'>
                {!notification.isRead && (
                  <button
                    type='button'
                    onClick={() => handleMarkAsRead(notification._id)}
                    className='flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 md:w-auto'
                  >
                    <Check size={16} />
                    Mark as read
                  </button>
                )}

                <button
                  type='button'
                  onClick={() => handleDelete(notification._id)}
                  className='flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 md:w-auto'
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
