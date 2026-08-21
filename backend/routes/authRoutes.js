import express from 'express'
import { registerUser, loginUser, getProfile, forgotPassword, verifyOtp, resetPassword, getAllUsers, updateProfile, deleteProfile } from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'

const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.get('/profile', protect, getProfile)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/verify-otp', verifyOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/users', protect, adminMiddleware, getAllUsers)
authRouter.put('/profile', protect, updateProfile)
authRouter.delete('/profile', protect, deleteProfile)

export default authRouter
