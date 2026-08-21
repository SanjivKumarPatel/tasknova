import asyncHandler from '../middleware/asyncHandler.js'
import Notification from '../models/Notification.js'

export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, type, taskId, message } = req.body

  if (!recipient || !type || !message) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    throw error
  }

  const notification = await Notification.create({recipient,type,message,taskId})

  res.status(201).json({success: true,message: 'Notification created successfully',notification})
})

export const getAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const notifications = await Notification.find({ recipient: userId }).sort({createdAt: -1})

  res.status(200).json({success: true,count: notifications.length,notifications })
})

export const getNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const notificationId = req.params.id

  const notification = await Notification.findById(notificationId)

  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('You are not authorized to view this notification')
    error.statusCode = 403
    throw error
  }

  res.status(200).json({ success: true, notification })
})

export const updateNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const notificationId = req.params.id
  const { message, type } = req.body

  const notification = await Notification.findById(notificationId)
  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('Only authorized user can update this notification')
    error.statusCode = 403
    throw error
  }

  if (message !== undefined) notification.message = message
  if (type !== undefined) notification.type = type

  await notification.save()

  res.status(200).json({success: true,message: 'Notification updated successfully',notification})
})

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const notificationId = req.params.id

  const notification = await Notification.findById(notificationId)

  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('Not authorized to update this notification')
    error.statusCode = 403
    throw error
  }

  notification.isRead = true
  notification.readAt = new Date()

  await notification.save()

  res.status(200).json({success: true,message: 'Notification marked as read',notification})
})

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id

  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  )

  res.status(200).json({ success: true, message: 'All notifications marked as read' })
})

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const notificationId = req.params.id

  const notification = await Notification.findById(notificationId)

  if (!notification) {
    const error = new Error('Notification not found')
    error.statusCode = 404
    throw error
  }

  if (notification.recipient.toString() !== userId) {
    const error = new Error('Not authorized to delete this notification')
    error.statusCode = 403
    throw error
  }

  await notification.deleteOne()

  res.status(200).json({ success: true, message: 'Notification deleted successfully' })
})
