/**
 * Encrypted storage for the auth token so it is not usable from DevTools or copy-paste.
 * Uses AES (crypto-js). Key should be set via VITE_AUTH_ENC_KEY in production.
 */

import CryptoJS from 'crypto-js'
import { AUTH_TOKEN_STORAGE_KEY } from '@/api/constants'

const ENV = typeof import.meta !== 'undefined' ? import.meta.env : undefined
const DEFAULT_ENC_KEY = 'VensarDriveAuthStorageKey'

function getEncryptionKey(): string {
  const raw = ENV && 'VITE_AUTH_ENC_KEY' in ENV ? ENV.VITE_AUTH_ENC_KEY : undefined
  return (typeof raw === 'string' && raw.trim()) ? raw.trim() : DEFAULT_ENC_KEY
}

/**
 * Encrypts the plain token and returns a string suitable for sessionStorage.
 * Call this before storing the token after login/verify.
 */
export function encryptToken(plainToken: string): string {
  return CryptoJS.AES.encrypt(plainToken, getEncryptionKey()).toString()
}

/**
 * Decrypts a value previously stored with encryptToken.
 * Returns null if the value is missing, invalid, or decryption fails.
 */
export function decryptToken(encrypted: string | null): string | null {
  if (!encrypted || typeof encrypted !== 'string') return null
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, getEncryptionKey())
    const decoded = bytes.toString(CryptoJS.enc.Utf8)
    return decoded || null
  } catch {
    return null
  }
}

/**
 * Reads the stored token from sessionStorage and decrypts it.
 * Use this wherever the raw JWT is needed (e.g. API client interceptor).
 */
export function getDecryptedToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  const stored = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  return decryptToken(stored)
}
