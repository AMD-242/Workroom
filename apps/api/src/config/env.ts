import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  aiApiKey: process.env.ANTHROPIC_API_KEY,
  aiModel: process.env.AI_MODEL || 'claude-3-sonnet-20240229',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
}
