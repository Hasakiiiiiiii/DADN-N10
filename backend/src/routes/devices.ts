import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { listDevices, getDeviceStatus, sendCommand } from '../services/mqtt'

const router = Router()

// List currently known devices (from MQTT status updates)
router.get('/', requireAuth, (_req, res) => {
  const devices = listDevices()
  res.json({ devices })
})

router.get('/:id/status', requireAuth, (req, res) => {
  const deviceId = String(req.params.id)
  const status = getDeviceStatus(deviceId)
  if (!status) {
    return res.status(404).json({ error: 'Device not found' })
  }
  res.json({ status })
})

router.post('/:id/command', requireAuth, (req: AuthRequest, res) => {
  const deviceId = String(req.params.id)
  const command = req.body as Record<string, unknown>
  if (!command || typeof command !== 'object') {
    return res.status(400).json({ error: 'Command must be an object' })
  }

  try {
    sendCommand(deviceId, command)
    res.json({ status: 'sent', deviceId, command })
  } catch (err) {
    res.status(500).json({ error: 'Failed to send command', details: (err as Error).message })
  }
})

export default router
