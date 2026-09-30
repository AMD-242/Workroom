# Workroom - Dev Guide

## Project Structure
```
workroom/
├── apps/
│   ├── api/          # Backend (Express + TS + Prisma)
│   └── web/          # Frontend (React + Vite + TS + Tailwind)
├── packages/
│   └── shared/       # Shared TypeScript types
├── prisma/
│   └── schema.prisma # Database schema
└── turbo.json        # Monorepo task runner config
```

## Common Commands

### Install dependencies
```bash
npm install
```

### Generate Prisma client
```bash
npm run prisma:generate
```

### Database setup
```bash
# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Development
```bash
# Run both web and API in parallel
npm run dev

# Run just the API
cd apps/api && npm run dev

# Run just the web
cd apps/web && npm run dev
```

### Build
```bash
npm run build
```

### Typecheck
```bash
npm run typecheck
```

### Lint
```bash
npm run lint
```

## Environment
Create `apps/api/.env` from `apps/api/.env.example`:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `ANTHROPIC_API_KEY`: AI integration (optional)

## API
Base URL: `http://localhost:4000/api`

### Endpoints
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/workspaces` - List workspaces
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/:id` - Get workspace
- `POST /api/drive/upload` - Upload file
- `GET /api/drive/:workspaceId` - List files
- `DELETE /api/drive/:id` - Delete file
- `GET /api/chat/workspaces/:workspaceId/channels` - List channels
- `POST /api/chat/workspaces/:workspaceId/channels` - Create channel
- `GET /api/chat/channels/:channelId/messages` - List messages
- `POST /api/chat/channels/:channelId/messages` - Send message
- `GET /api/email/workspaces/:workspaceId` - List emails
- `POST /api/email/send` - Send email
- `POST /api/ai/chat` - AI chat
- `POST /api/ai/summarize` - AI summarize
