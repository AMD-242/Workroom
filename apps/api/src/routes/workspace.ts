import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/prisma'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = Router()

router.post(
  '/',
  authMiddleware,
  body('name').trim().notEmpty(),
  body('slug').trim().notEmpty(),
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, slug } = req.body
    const userId = req.user!.id

    const existing = await prisma.workspace.findUnique({ where: { slug } })
    if (existing) {
      return res.status(409).json({ error: 'Workspace with that slug already exists' })
    }

    const workspace = await prisma.workspace.create({
      data: { name, slug, ownerId: userId, members: { create: { userId, role: 'OWNER' } } },
    })

    res.status(201).json(workspace)
  },
)

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      members: { some: { userId: req.user!.id } },
    },
    include: { channels: true, members: { include: { user: true } } },
  })
  res.json(workspaces)
})

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: req.params.id, members: { some: { userId: req.user!.id } } },
    include: {
      channels: true,
      files: { take: 10, orderBy: { createdAt: 'desc' } },
      members: { include: { user: { select: { id: true, email: true, name: true, image: true } } } },
    },
  })
  if (!workspace) return res.status(404).json({ error: 'Workspace not found' })
  res.json(workspace)
})

export default router
