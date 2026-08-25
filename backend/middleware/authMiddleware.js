import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('No token provided')
    error.statusCode = 401
    throw error
  }

  const token = authHeader.split(' ')[1]

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  req.user = { id: decoded.id, role: decoded.role }

  next()
})

export default protect
