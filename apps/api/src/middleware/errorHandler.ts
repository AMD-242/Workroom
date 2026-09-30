import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err)

  if (res.headersSent) {
    return
  }

  res.status(500).json({ error: 'Internal server error' })
}

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
}
