import { config } from './config/env'
import { app, io, server } from './app'

server.listen(config.port, () => {
  console.log(`\n  🚀 Workroom API running at http://localhost:${config.port}`)
  console.log(`  📊 Health check: http://localhost:${config.port}/`)
  console.log(`  🔌 Socket.IO enabled\n`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
