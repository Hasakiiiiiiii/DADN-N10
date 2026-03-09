import dotenv from 'dotenv'
import path from 'path'

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local'
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'
export const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://mongo:27017/control-panel'

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@example.com'
export const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin'
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'ad12'

export const MQTT_URL = process.env.MQTT_URL ?? 'mqtt://mosquitto:1883'
export const MQTT_BASE_TOPIC = process.env.MQTT_BASE_TOPIC ?? 'devices'
