/**
 * ============================================================
 * config.ts – Frontend Environment Configuration
 * ============================================================
 * Saare VITE_ env variables yahan ek jagah se read karo.
 * Direct import.meta.env kabhi use mat karo – hamesha ye file import karo.
 * ============================================================
 */

const env = import.meta.env

// ── API ──────────────────────────────────────────────────────

/** Backend NestJS API base URL (no trailing slash). */
export const API_BASE: string = (env.VITE_API_URL ?? 'http://localhost:3000')
  .toString()
  .trim()
  .replace(/\/+$/, '')

// ── Auth ─────────────────────────────────────────────────────

/**
 * AES encryption key for JWT token stored in sessionStorage.
 * Production mein strong random key set karo via VITE_AUTH_ENC_KEY.
 */
export const AUTH_ENC_KEY: string =
  (env.VITE_AUTH_ENC_KEY ?? 'VensarDriveAuthStorageKey_ChangeInProduction')
    .toString()
    .trim()

// ── App Identity ─────────────────────────────────────────────

/** Application display name (shown in TopBar, page titles). */
export const APP_NAME: string = (env.VITE_APP_NAME ?? 'Vensar Drive').toString().trim()

/** Semantic version string. */
export const APP_VERSION: string = (env.VITE_APP_VERSION ?? '1.0.0').toString().trim()

// ── Upload ───────────────────────────────────────────────────

/** Max upload file size in bytes (must match backend UPLOAD_MAX_SIZE). */
export const UPLOAD_MAX_SIZE: number = parseInt(
  env.VITE_UPLOAD_MAX_SIZE ?? '104857600',
  10,
)

/** Human-readable max upload size (e.g. "100 MB"). */
export const UPLOAD_MAX_SIZE_LABEL: string = (() => {
  const mb = UPLOAD_MAX_SIZE / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(0)} MB` : `${(UPLOAD_MAX_SIZE / 1024).toFixed(0)} KB`
})()

// ── HTTP Client ───────────────────────────────────────────────

/** Axios request timeout in ms. */
export const REQUEST_TIMEOUT_MS: number = parseInt(
  env.VITE_REQUEST_TIMEOUT_MS ?? '30000',
  10,
)

// ── Signed URLs ───────────────────────────────────────────────

/**
 * How long (ms) to cache S3 presigned URLs in memory before re-fetching.
 * Must be less than backend AWS_SIGNED_URL_EXPIRY (default 5 min = 300s).
 */
export const SIGNED_URL_CACHE_MS: number = parseInt(
  env.VITE_SIGNED_URL_CACHE_MS ?? '240000',
  10,
)
