import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { config } from '../config/env'
import { User } from '@prisma/client'

export const generateAccessToken = (user: User) => {
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as any }
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret as Secret, options)
}

export const generateRefreshToken = (user: User) => {
  const options: SignOptions = { expiresIn: config.jwtRefreshExpiresIn as any }
  return jwt.sign(
    { id: user.id, email: user.email },
    config.jwtRefreshSecret as Secret,
    options,
  )
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwtRefreshSecret as Secret) as { id: string }
}
