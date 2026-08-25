import express from 'express'

import protect from '../middleware/authMiddleware.js'

import {
  getAllNotifications,
  getNotification,
  markAllAsRead,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController.js'

const notificationRouter = express.Router()

notificationRouter.use(protect)

notificationRouter.get('/', getAllNotifications)

notificationRouter.put('/mark-all-read', markAllAsRead)

notificationRouter.get('/:id', getNotification)

notificationRouter.put('/:id/read', markAsRead)

notificationRouter.delete('/:id', deleteNotification)

export default notificationRouter