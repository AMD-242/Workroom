import { Router, Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/:workspaceId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const files = await prisma.driveFile.findMany({
    where: { workspaceId: req.params.workspaceId },
    orderBy: { createdAt: 'desc' },
  })
  res.json(files)
})

router.post('/upload', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const { workspaceId, parentId } = req.body
  const file = req.file as Express.Multer.File

  const saved = await prisma.driveFile.create({
    data: {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: file.path,
      workspaceId,
      parentId: parentId || null,
      uploadedById: req.user!.id,
    },
  })

  res.status(201).json(saved)
})

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const file = await prisma.driveFile.findUnique({ where: { id: req.params.id } })
  if (!file) return res.status(404).json({ error: 'File not found' })

  await prisma.driveFile.delete({ where: { id: req.params.id } })
  res.json({ message: 'File deleted' })
})

export default router
