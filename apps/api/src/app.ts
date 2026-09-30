import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { config } from './config/env'
import { prisma } from './config/prisma'
import { errorHandler, notFound } from './middleware/errorHandler'
import { AuthRequest } from './middleware/auth'
import authRoutes from './routes/auth'
import workspaceRoutes from './routes/workspace'
import driveRoutes from './routes/drive'
import chatRoutes from './routes/chat'
import emailRoutes from './routes/email'
import aiRoutes from './routes/ai'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
  res.json({ name: 'Workroom API', version: '0.1.0', status: 'running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/drive', driveRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/email', emailRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

const server = createServer(app)
const io = new Server(server, {
  cors: { origin: '*' },
})

io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) {
    return next(new Error('Authentication error'))
  }
  next()
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('joinWorkspace', (workspaceId: string) => {
    socket.join(workspaceId)
  })

  socket.on('leaveWorkspace', (workspaceId: string) => {
    socket.leave(workspaceId)
  })

  socket.on('joinChannel', (channelId: string) => {
    socket.join(channelId)
  })

  socket.on('leaveChannel', (channelId: string) => {
    socket.leave(channelId)
  })

  socket.on(
    'message',
    async (data: { channelId: string; content: string; senderId: string }) => {
      const message = await prisma.message.create({
        data: {
          content: data.content,
          channelId: data.channelId,
          senderId: data.senderId,
        },
        include: { sender: { select: { id: true, name: true, email: true, image: true } } },
      })
      io.to(data.channelId).emit('message', message)
    },
  )

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

export { app, io, server }
