export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? '/api'
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const base = getApiBaseUrl().replace(/\/+$/, '')
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`

  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { ...init, headers })

  let json: any = null
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    json = await response.json()
  }

  if (!response.ok) {
    const error = json?.error || response.statusText
    throw new Error(error)
  }

  return json
}
