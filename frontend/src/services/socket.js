import { io } from 'socket.io-client'

const socket = io('https://tasknova-7qz0.onrender.com', {
  autoConnect: false
})

export default socket