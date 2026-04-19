import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    throw error
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim()
  })

  if (existingUser) {
    const error = new Error('User already exists')
    error.statusCode = 409
    throw error
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: generateToken(user._id),
    user
  })
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    const error = new Error('Email and password are required')
    error.statusCode = 400
    throw error
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    '+password'
  )

  if (!user) {
    const error = new Error('Invalid credentials')
    error.statusCode = 401
    throw error
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    const error = new Error('Invalid credentials')
    error.statusCode = 401
    throw error
  }

  user.lastLogin = new Date()
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: generateToken(user._id),
    user
  })
})

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const user = await User.findById(userId)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  res.status(200).json({ success: true, user })
})
