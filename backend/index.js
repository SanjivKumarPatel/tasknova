import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dns from 'dns'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { setSocket } from './utils/socket.js'

import connectDB from './config/db.js'

import authRouter from './routes/authRoutes.js'
import taskRouter from './routes/taskRoutes.js'
import teamRouter from './routes/teamRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'

import errorMiddleware from './middleware/errorMiddleware.js'

dns.setDefaultResultOrder('ipv4first')

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 3001
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

setSocket(io)

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`)

  socket.on('test-event', (message) => {
    console.log('📨 Test event received:', message)
  })

  socket.on('join-room', (userId) => {
    socket.join(`user:${userId}`)
    console.log(`👤 User ${userId} joined room`)
  })

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`)
  })
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/teams', teamRouter)
app.use('/api/notifications', notificationRouter)

app.get('/', (req, res) => {
  res.send('🚀 TaskNova API running')
})

app.use(errorMiddleware)

const startServer = async () =>{
  try {
    await connectDB()

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
      console.error(error.message)
      process.exit(1)
  }
}

startServer()