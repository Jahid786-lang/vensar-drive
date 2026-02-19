/**
 * API configuration and environment-derived settings.
 * Keeps all env access in one place for easier testing and overrides.
 */

const ENV = typeof import.meta !== 'undefined' ? import.meta.env : undefined

/** Default base URL when VITE_API_URL is not set (e.g. local Nest backend). */
const DEFAULT_API_BASE = 'http://localhost:3000'

/**
 * Resolves the backend API base URL (no trailing slash).
 * Prefer VITE_API_URL in .env for different environments.
 */
export function getApiUrl(): string {
  const raw = ENV && 'VITE_API_URL' in ENV ? ENV.VITE_API_URL : undefined
  const url = typeof raw === 'string' ? raw.trim() : undefined
  if (!url) return DEFAULT_API_BASE
  return url.replace(/\/+$/, '')
}

/** Cached base URL for the API client. */
export const API_BASE = getApiUrl()
