import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import getTransporter from '../config/email.js'
import { generateOtp } from '../utils/generateOtp.js'
import { resetOtpTemplate } from '../utils/emailTemplates.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password ||!role) {
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

  const user = await User.create({ name, email, password, role })

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token: generateToken(user._id, user.role),
    user
  })
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body

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

  let rememberToken = null
  if (rememberMe) {
    rememberToken = generateToken(user._id, user.role, '30d')
    user.rememberToken = rememberToken
    user.rememberTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token: generateToken(user._id, user.role),
    rememberToken: rememberMe ? rememberToken : null,
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


export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    const error = new Error('Email is required')
    error.statusCode = 400
    throw error
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const otp = generateOtp()

  user.resetOtp = otp
  user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000)
  user.resetOtpVerified = false
  await user.save()

  try {
    const transporter = getTransporter()

    const emailContent = resetOtpTemplate(user.name, otp)

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset OTP',
      html: emailContent
    })

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (err) {
    user.resetOtp = null
    user.resetOtpExpiry = null
    await user.save()

    const error = new Error('Failed to send OTP email')
    error.statusCode = 500
    throw error
  }
})

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    const error = new Error('Email and OTP are required')
    error.statusCode = 400
    throw error
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    resetOtp: otp,
    resetOtpExpiry: { $gt: Date.now() }
  })

  if (!user) {
    const error = new Error('Invalid or expired OTP')
    error.statusCode = 400
    throw error
  }

  user.resetOtpVerified = true
  await user.save()

  res.status(200).json({ success: true, message: 'OTP verified successfully'})
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body

  if (!email || !password || !confirmPassword) {
    const error = new Error('All fields are required')
    error.statusCode = 400
    throw error
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  if (!user.resetOtpVerified) {
    const error = new Error('Please verify OTP first')
    error.statusCode = 400
    throw error
  }

  user.password = password
  user.resetOtp = null
  user.resetOtpExpiry = null
  user.resetOtpVerified = false
  await user.save()

  res.status(200).json({ success: true, message: 'Password reset successfully'})
})

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('_id name email role')

  res.status(200).json({
    success: true,
    count: users.length,
    users
  })
})

//update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { name, email } = req.body

  if (!name || !email) {
    const error = new Error('Name and email are required')
    error.statusCode = 400
    throw error
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
    _id: { $ne: userId }
  })

  if (existingUser) {
    const error = new Error('Email already in use')
    error.statusCode = 409
    throw error
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      name: name.trim(),
      email: email.toLowerCase().trim()
    },
    { new: true, runValidators: true }
  )

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user
  })
})

//delete profile
export const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const user = await User.findById(userId)

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Profile deleted successfully'
  })
})