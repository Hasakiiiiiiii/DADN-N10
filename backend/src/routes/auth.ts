import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'

const router = Router()

function createUserResponse(user: any) {
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    name: user.name,
    phone: user.phone,
    address: user.address,
  }
}

router.post('/login', async (req, res) => {
  const { email, username, password } = req.body as {
    email?: string
    username?: string
    password?: string
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  const query: Record<string, unknown> = {}
  if (email) {
    query.email = email.toLowerCase().trim()
  } else if (username) {
    query.username = username.trim()
  } else {
    return res.status(400).json({ error: 'Email or username is required' })
  }

  const user = await User.findOne(query).exec()
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '8h',
  })

  return res.json({ token, user: createUserResponse(user) })
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await User.findById(req.user.id).exec()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json({ user: createUserResponse(user) })
})

router.put('/profile', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const patch = req.body as {
    name?: string
    phone?: string
    address?: string
    email?: string
    username?: string
  }

  const update: Record<string, unknown> = {}
  if (patch.name !== undefined) update.name = patch.name
  if (patch.phone !== undefined) update.phone = patch.phone
  if (patch.address !== undefined) update.address = patch.address
  if (patch.email !== undefined) update.email = patch.email.toLowerCase().trim()
  if (patch.username !== undefined) update.username = patch.username.trim()

  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).exec()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json({ user: createUserResponse(user) })
})

router.post('/password', requireAuth, async (req: AuthRequest, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { oldPassword, newPassword } = req.body as { oldPassword?: string; newPassword?: string }
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'oldPassword and newPassword are required' })
  }

  const user = await User.findById(req.user.id).exec()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!isMatch) {
    return res.status(403).json({ error: 'Old password is incorrect' })
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10)
  await user.save()

  return res.json({ success: true })
})

export default router
