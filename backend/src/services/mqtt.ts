import mqtt, { MqttClient } from 'mqtt'
import { MQTT_URL, MQTT_BASE_TOPIC } from '../config'

export interface DeviceStatus {
  id: string
  online: boolean
  lastSeen: string
  values: Record<string, unknown>
}

const deviceStatus: Record<string, DeviceStatus> = {}

let client: MqttClient | null = null

export function connectMqtt() {
  if (client) return client

  client = mqtt.connect(MQTT_URL)

  client.on('connect', () => {
    console.log('MQTT connected to', MQTT_URL)
    client?.subscribe(`${MQTT_BASE_TOPIC}/+/status`, { qos: 0 }, err => {
      if (err) console.warn('MQTT subscribe error', err)
    })
  })

  client.on('message', (_, message, packet) => {
    const topic = packet.topic ?? ''
    const match = topic.match(new RegExp(`${MQTT_BASE_TOPIC}/([^/]+)/status`))
    if (!match) return

    const deviceId = match[1]
    try {
      const payload = JSON.parse(message.toString())
      deviceStatus[deviceId] = {
        id: deviceId,
        online: true,
        lastSeen: new Date().toISOString(),
        values: payload,
      }
    } catch (e) {
      console.warn('Failed to parse MQTT status payload for', deviceId, e)
    }
  })

  client.on('error', err => {
    console.error('MQTT error', err)
  })

  client.on('offline', () => {
    console.warn('MQTT offline')
  })

  return client
}

export function getDeviceStatus(deviceId: string): DeviceStatus | null {
  return deviceStatus[deviceId] ?? null
}

export function listDevices(): DeviceStatus[] {
  return Object.values(deviceStatus)
}

export function sendCommand(deviceId: string, command: Record<string, unknown>) {
  if (!client) connectMqtt()
  const topic = `${MQTT_BASE_TOPIC}/${deviceId}/command`
  if (!client) throw new Error('MQTT client not initialized')
  client.publish(topic, JSON.stringify(command), { qos: 0 })
}
