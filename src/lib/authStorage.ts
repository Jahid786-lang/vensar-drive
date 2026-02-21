/**
 * Encrypted storage for the auth token so it is not usable from DevTools or copy-paste.
 * Uses AES (crypto-js). Key comes from VITE_AUTH_ENC_KEY env variable.
 */

import CryptoJS from 'crypto-js'
import { AUTH_TOKEN_STORAGE_KEY } from '@/api/constants'
import { AUTH_ENC_KEY } from '@/api/config'

export function encryptToken(plainToken: string): string {
  return CryptoJS.AES.encrypt(plainToken, AUTH_ENC_KEY).toString()
}

export function decryptToken(encrypted: string | null): string | null {
  if (!encrypted || typeof encrypted !== 'string') return null
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, AUTH_ENC_KEY)
    const decoded = bytes.toString(CryptoJS.enc.Utf8)
    return decoded || null
  } catch {
    return null
  }
}

export function getDecryptedToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  const stored = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  return decryptToken(stored)
}
