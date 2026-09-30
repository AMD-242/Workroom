import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { AuthRequest, authMiddleware } from '../middleware/auth'

const router = Router()

router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, name } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
      select: { id: true, email: true, name: true, image: true, createdAt: true, updatedAt: true },
    })

    const accessToken = generateAccessToken(user as any)
    const refreshToken = generateRefreshToken(user as any)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    res.status(201).json({ user, accessToken, refreshToken })
  },
)

router.post(
  '/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await comparePassword(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const { password: _, ...userSafe } = user
    res.json({ user: userSafe, accessToken, refreshToken })
  },
)

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' })
  }

  try {
    const payload = verifyRefreshToken(refreshToken)

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' })
    }

    const accessToken = generateAccessToken(storedToken.user)
    res.json({ accessToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

router.get(
  '/me',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, image: true, createdAt: true, updatedAt: true },
    })
    res.json(user)
  },
)

router.post('/logout', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
  }
  res.json({ message: 'Logged out' })
})

export default router
