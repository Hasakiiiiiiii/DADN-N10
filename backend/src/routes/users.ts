import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'

const router = Router()

function requireAdmin(req: AuthRequest, res: any, next: any) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// List all users (admin only)
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select('id email username role name phone address createdAt updatedAt').lean().exec()
  res.json({ users })
})

// Create a new employee
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { username, email, password, name, phone, address } = req.body as {
    username?: string
    email?: string
    password?: string
    name?: string
    phone?: string
    address?: string
  }

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' })
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] }).exec()
  if (existing) {
    return res.status(409).json({ error: 'Username or email already in use' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    email,
    role: 'employee',
    passwordHash,
    name,
    phone,
    address,
  })

  res.status(201).json({ user: { id: user._id, username: user.username, email: user.email, role: user.role, name: user.name, phone: user.phone, address: user.address } })
})

// Delete a user
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: 'User id is required' })
  }

  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (user.role === 'admin') {
    return res.status(403).json({ error: 'Cannot delete admin user' })
  }

  await user.deleteOne()
  res.json({ success: true })
})

export default router
