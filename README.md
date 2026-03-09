
  # Web interface for control panel

  This is a code bundle for Web interface for control panel. The original project is available at https://www.figma.com/design/q0kxHCqdIGVGiFOt3GNVD9/Web-interface-for-control-panel.

## Running the frontend

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  > The Vite dev server proxies `/api` to a backend running on `http://localhost:4000`.

  ## Running the backend (optional)

  A minimal Node/Express backend has been added under `backend/`.

  ```bash
  cd backend
  npm install
  npm run dev
  ```

  ## Docker (backend + MQTT broker)

  A `docker-compose.yml` is included to run the backend together with an MQTT broker:

  ```bash
  docker compose up --build
  ```

  - Backend API: http://localhost:4000/api
  - MQTT broker: mqtt://localhost:1883
  