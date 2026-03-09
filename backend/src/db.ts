import mongoose from 'mongoose'
import { MONGO_URL } from './config'

export async function connectDb() {
  if (mongoose.connection.readyState === 1) return mongoose

  mongoose.set('strictQuery', true)
  await mongoose.connect(MONGO_URL)
  console.log('MongoDB connected to', MONGO_URL)
  return mongoose
}
