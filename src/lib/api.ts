/**
 * Generic HTTP API wrapper around the shared Axios client.
 * Use for REST resources (folders, uploads, etc.) with a simple get/post/put/delete interface.
 * Auth is handled by api/client interceptors (token attachment and error normalisation).
 */

import { apiClient } from '@/api/client'
import type { Method } from 'axios'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
}

/**
 * Executes a request via apiClient and returns the response body.
 * Path is relative to API_BASE; use full URL only for external endpoints.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET') as Method
  const { data } = await apiClient.request<T>({
    url: path,
    method,
    data: options.body,
  })
  return data
}

/** Typed REST helpers; all use the same client (base URL + auth + error handling). */
export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
