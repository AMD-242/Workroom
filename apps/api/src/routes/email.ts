import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { prisma } from '../config/prisma'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/workspaces/:workspaceId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const emails = await prisma.email.findMany({
    where: { workspaceId: req.params.workspaceId },
    orderBy: { sentAt: 'desc' },
  })
  res.json(emails)
})

router.post('/send', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { subject, body: emailBody, fromEmail, toEmails, workspaceId } = req.body

  const email = await prisma.email.create({
    data: {
      subject,
      body: emailBody,
      fromEmail,
      toEmails,
      workspaceId,
    },
  })

  res.status(201).json(email)
})

export default router
