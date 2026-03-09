import { Router } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  meta?: Record<string, unknown>
}

const logs: LogEntry[] = []

export function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  })
  if (logs.length > 500) logs.pop()
}

router.get('/', requireAuth, (req, res) => {
  const limit = Number(req.query.limit || 50)
  res.json({ logs: logs.slice(0, Math.min(limit, logs.length)) })
})

export default router
