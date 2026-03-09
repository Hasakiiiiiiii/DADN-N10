import bcrypt from 'bcryptjs'
import { User } from './models/User'
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_USERNAME } from './config'

export async function ensureDefaultAdmin() {
  const existing = await User.findOne({ role: 'admin' }).exec()
  if (existing) {
    return
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)
  await User.create({
    email: DEFAULT_ADMIN_EMAIL,
    username: DEFAULT_ADMIN_USERNAME,
    role: 'admin',
    passwordHash,
    name: 'Admin',
  })
  console.log('Created default admin user', DEFAULT_ADMIN_EMAIL)
}

export async function ensureDefaultEmployee() {
  const existing = await User.findOne({ role: 'employee' }).exec()
  if (existing) {
    return
  }

  const passwordHash = await bcrypt.hash('em1', 10)
  await User.create({
    email: 'employee@example.com',
    username: 'employee',
    role: 'employee',
    passwordHash,
    name: 'Employee',
  })
  console.log('Created default employee user employee@example.com')
}
