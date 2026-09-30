export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface DriveFile {
  id: string
  name: string
  size: number
  mimeType: string
  path: string
  workspaceId: string
  parentId: string | null
  uploadedById: string
  createdAt: string
  updatedAt: string
}

export interface Channel {
  id: string
  name: string
  workspaceId: string
  createdAt: string
}

export interface Message {
  id: string
  content: string
  channelId: string
  senderId: string
  sender?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  createdAt: string
}

export interface Email {
  id: string
  subject: string
  body: string
  fromEmail: string
  toEmails: string[]
  workspaceId: string
  sentAt: string
}

export interface AiInteraction {
  id: string
  userId: string
  workspaceId: string
  prompt: string
  response: string
  type: 'chat' | 'drive' | 'email'
  createdAt: string
}
