import asyncHandler from './asyncHandler.js'

const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        const error = new Error('User not authenticated')
        error.statusCode = 401
        throw error
    }

    if (req.user.role !== 'admin') {
        const error = new Error('Access denied. Only for Admin')
        error.statusCode = 403
        throw error
    }

    next()
})

export default adminMiddleware