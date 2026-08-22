import asyncHandler from '../middleware/asyncHandler.js'
import Task from '../models/Task.js'

export const createTask = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const {
    title,
    description,
    deadline,
    priority,
    category,
    assignedTo
  } = req.body

  if (!title || !assignedTo) {
    const error = new Error('Task title and assigned user are required')
    error.statusCode = 400
    throw error
  }

  const task = await Task.create({
    title,
    description,
    deadline,
    priority,
    category,
    createdBy: userId,
    assignedTo
  })

  const populatedTask = await Task.findById(task._id).populate(
    'createdBy assignedTo',
    'name email'
  )

  res.status(201).json({ success: true, message: 'Task created successfully', task: populatedTask })
})

export const getAllTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const query = req.user.role === 'admin'
    ? {}
    : { assignedTo: userId }

  const tasks = await Task.find(query)
    .populate('createdBy assignedTo', 'name email')
    .sort({ createdAt: -1 })

  res.status(200).json({ success: true, count: tasks.length, tasks })
})

export const getTask = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id

  const task = await Task.findById(taskId).populate(
    'createdBy assignedTo',
    'name email'
  )

  if (!task) {
    const error = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  const isAdmin = req.user.role === 'admin'
  const isAssigned = task.assignedTo?._id.toString() === userId

  if (!isAdmin && !isAssigned) {
    const error = new Error('Not authorized')
    error.statusCode = 403
    throw error
  }

  res.status(200).json({ success: true, task })
})

export const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id

  const task = await Task.findById(taskId)

  if (!task) {
    const error = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  const isAdmin = req.user.role === 'admin'
  const isAssigned = task.assignedTo?.toString() === userId

  if (!isAdmin && !isAssigned) {
    const error = new Error('Not authorized')
    error.statusCode = 403
    throw error
  }

  const {
    title,
    description,
    status,
    deadline,
    priority,
    category
  } = req.body

  if (isAdmin) {
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (deadline !== undefined) task.deadline = deadline
    if (priority !== undefined) task.priority = priority
    if (category !== undefined) task.category = category
  }

  if (status !== undefined) {
    task.status = status
  }

  await task.save()

  const updatedTask = await Task.findById(taskId).populate(
    'createdBy assignedTo',
    'name email'
  )

  res.status(200).json({ success: true, message: 'Task updated successfully', task: updatedTask })
})

export const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id

  const task = await Task.findById(taskId)

  if (!task) {
    const error = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  await task.deleteOne()

  res.status(200).json({ success: true, message: 'Task deleted successfully' })
})