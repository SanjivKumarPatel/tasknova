import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000
    },

    category: { type: String, default: '' },

    status: {
      type: String,
      enum: ['pending', 'inProgress', 'completed'],
      default: 'pending'
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    deadline: {
      type: Date,
      default: null,
      index: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

/* Dashboard filters */
taskSchema.index({ assignedTo: 1, status: 1 })

/* User task history */
taskSchema.index({ createdBy: 1, createdAt: -1 })

const Task = mongoose.model('Task', taskSchema)

export default Task
