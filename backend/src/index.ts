import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth'
import { certificateRoutes } from './routes/certificates'
import { verificationRoutes } from './routes/verification'
import { mlRoutes } from './routes/ml'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './middleware/logger'
import { initializeBlockchain } from './services/blockchain.service'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(logger)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/verification', verificationRoutes)
app.use('/api/ml', mlRoutes)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

async function startServer() {
  try {
    console.log('[Server] Initializing blockchain...')
    await initializeBlockchain()
    console.log('[Server] Blockchain initialized successfully')
  } catch (error) {
    console.error('[Server] Blockchain initialization failed:', error)
  }

  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`)
  })
}

startServer()
