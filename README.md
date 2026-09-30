# Workroom

Workroom is an all-in-one platform built for workspace employees to optimise their tasks faster and save time with the platform's embeddings of integrated office softwares for productivity, scalability and efficiency, making your day effortless.

## Features

- **Cloud Drive** - File storage and sharing (like Google Drive)
- **Social Chat** - Real-time messaging with channels and workspaces
- **Email Platform** - Send and manage emails within the workspace
- **AI Assistant** - Integrated AI for chat, summarization, and productivity

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp apps/api/.env.example apps/api/.env

# Generate Prisma client
npm run prisma:generate

# Run everything
npm run dev
```

- API: http://localhost:4000
- Web: http://localhost:3000

## Architecture

```
apps/
  api/     - Express + TypeScript backend with Prisma ORM
  web/     - React + Vite frontend with Tailwind CSS
packages/
  shared/  - Shared TypeScript interfaces
prisma/
  schema.prisma
```

See [AGENTS.md](./AGENTS.md) for full development guide.
