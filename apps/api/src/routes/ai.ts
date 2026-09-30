import { Router, Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../config/prisma'
import { AuthRequest, authMiddleware } from '../middleware/auth'
import { config } from '../config/env'

const router = Router()

const getAiClient = () => {
  if (!config.aiApiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }
  return new Anthropic({ apiKey: config.aiApiKey })
}

router.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { workspaceId, prompt } = req.body

  let response = ''
  let aiType = 'CHAT'

  try {
    const anthropic = getAiClient()
    const msg = await anthropic.messages.create({
      model: config.aiModel,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
    response = msg.content[0].type === 'text' ? msg.content[0].text : ''
  } catch (error: any) {
    if (error.message?.includes('not configured') || !config.aiApiKey) {
      response = `AI integration is not configured yet. Your prompt was: ${prompt}`
    } else {
      response = `AI error: ${error.message}. Please check your API key configuration.`
    }
    aiType = 'CHAT'
  }

  const interaction = await prisma.aiInteraction.create({
    data: {
      userId: req.user!.id,
      workspaceId,
      prompt,
      response,
      type: aiType as any,
    },
  })

  res.json({ response, interaction })
})

router.post('/summarize', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { workspaceId, text } = req.body

  let response = ''
  try {
    const anthropic = getAiClient()
    const msg = await anthropic.messages.create({
      model: config.aiModel,
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Summarize the following text concisely:\n\n${text}`,
        },
      ],
    })
    response = msg.content[0].type === 'text' ? msg.content[0].text : ''
  } catch (error: any) {
    response = `Summary could not be generated: ${error.message}`
  }

  await prisma.aiInteraction.create({
    data: {
      userId: req.user!.id,
      workspaceId,
      prompt: `summarize: ${text?.substring(0, 200)}...`,
      response,
      type: 'DRIVE',
    },
  })

  res.json({ summary: response })
})

export default router
