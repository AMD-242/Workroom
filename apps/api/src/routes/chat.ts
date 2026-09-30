import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { prisma } from '../config/prisma'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/workspaces/:workspaceId/channels', authMiddleware, async (req: AuthRequest, res: Response) => {
  const channels = await prisma.channel.findMany({
    where: { workspaceId: req.params.workspaceId },
    include: { messages: { take: 50, orderBy: { createdAt: 'desc' } } },
  })
  res.json(channels)
})

router.post('/workspaces/:workspaceId/channels', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name } = req.body
  const channel = await prisma.channel.create({
    data: { name, workspaceId: req.params.workspaceId },
  })
  res.status(201).json(channel)
})

router.get('/channels/:channelId/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  const messages = await prisma.message.findMany({
    where: { channelId: req.params.channelId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, name: true, email: true, image: true } } },
    take: 100,
  })
  res.json(messages)
})

router.post('/channels/:channelId/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { content } = req.body
  const message = await prisma.message.create({
    data: {
      content,
      channelId: req.params.channelId,
      senderId: req.user!.id,
    },
    include: { sender: { select: { id: true, name: true, email: true, image: true } } },
  })
  res.status(201).json(message)
})

export default router
