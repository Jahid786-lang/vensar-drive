/// <reference types="vite/client" />

/**
 * Type-safe declarations for all VITE_ environment variables.
 * Add new variables here whenever you add them to .env / .env.example
 */
interface ImportMetaEnv {
  /** Backend NestJS API base URL – no trailing slash */
  readonly VITE_API_URL: string

  /** AES encryption key for auth token in sessionStorage */
  readonly VITE_AUTH_ENC_KEY: string

  /** Application display name */
  readonly VITE_APP_NAME: string

  /** Application semantic version */
  readonly VITE_APP_VERSION: string

  /** Max allowed file upload size in bytes (must match backend UPLOAD_MAX_SIZE) */
  readonly VITE_UPLOAD_MAX_SIZE: string

  /** Axios request timeout in milliseconds */
  readonly VITE_REQUEST_TIMEOUT_MS: string

  /** How long (ms) to cache S3 presigned URLs in memory */
  readonly VITE_SIGNED_URL_CACHE_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
