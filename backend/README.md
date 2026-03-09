# Backend API for Web Interface Control Panel

This backend provides a minimal Express+TypeScript API for:

- User authentication (JWT)
- Device status via MQTT (subscribe to `devices/+/status`)
- Sending commands via MQTT (`devices/{id}/command`)
- Simple logs endpoint

## Run locally

```bash
cd backend
npm install
npm run dev
```

API will be available at http://localhost:4000/api

## Docker (MQTT + API)

```bash
docker compose up --build
```

This will start:
- Mosquitto broker accessible on `1883`
- Backend API on `4000`

## MQTT topics (default)

- Status from device: `devices/{deviceId}/status`  (JSON payload)
- Commands to device: `devices/{deviceId}/command` (JSON payload)

## Default test user

- Email: `admin@example.com`
- Password: `password`


## Frontend integration

Frontend requests should be proxied to `/api` (Vite dev proxy is already configured in `vite.config.ts`).
