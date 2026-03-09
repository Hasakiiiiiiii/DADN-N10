import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { PORT } from './config'
import authRouter from './routes/auth'
import devicesRouter from './routes/devices'
import logsRouter from './routes/logs'
import usersRouter from './routes/users'
import { connectMqtt } from './services/mqtt'
import { connectDb } from './db'
import { ensureDefaultAdmin, ensureDefaultEmployee } from './seed'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRouter)
app.use('/api/devices', devicesRouter)
app.use('/api/logs', logsRouter)
app.use('/api/users', usersRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

async function start() {
  try {
    await connectDb()
    await ensureDefaultAdmin()
    await ensureDefaultEmployee()
    connectMqtt()

    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend listening on http://localhost:${PORT}`)
    })

    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server stopped')
        process.exit(0)
      })
    })
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
