import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ['taskAssignment', 'deadline', 'completion'],
      required: true
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },

    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
)

notificationSchema.index({ recipient: 1, createdAt: -1 })
notificationSchema.index({ recipient: 1, isRead: 1 })

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
