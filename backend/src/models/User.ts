import { Schema, model, Document } from 'mongoose'

export type UserRole = 'admin' | 'employee'

export interface IUser extends Document {
  email: string
  username: string
  role: UserRole
  name?: string
  phone?: string
  address?: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, enum: ['admin', 'employee'], default: 'employee' },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export const User = model<IUser>('User', UserSchema)
