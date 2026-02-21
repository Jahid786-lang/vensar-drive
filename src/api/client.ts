/**
 * Central Axios instance for all backend requests.
 * - Attaches JWT via request interceptor when available.
 * - Normalises error responses (Nest/class-validator shape) in response interceptor.
 * - Uses api/config for base URL so env is the single source of truth.
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE, REQUEST_TIMEOUT_MS } from './config'
import { getDecryptedToken } from '@/lib/authStorage'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE || undefined,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

// -----------------------------------------------------------------------------
// Request interceptor: attach JWT when present (SSR-safe)
// -----------------------------------------------------------------------------

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getDecryptedToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// -----------------------------------------------------------------------------
// Response interceptor: normalise errors for consistent handling in app
// -----------------------------------------------------------------------------

/**
 * Extracts a single user-facing message from various backend error shapes:
 * - Nest: { message: string | string[], error: string }
 * - class-validator: { message: string[] }
 */
function getErrorMessage(err: {
  response?: { data?: unknown }
  message?: string
}): string {
  const data = err.response?.data as Record<string, unknown> | undefined
  if (!data) return err.message ?? 'Request failed'

  const msg = data.message
  if (Array.isArray(msg) && msg.length > 0 && typeof msg[0] === 'string') {
    return msg[0]
  }
  if (typeof msg === 'string') return msg
  if (typeof data.error === 'string') return data.error

  return err.message ?? 'Request failed'
}

apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const message = getErrorMessage(err)
    return Promise.reject(new Error(message))
  },
)
