/**
 * Shared constants for API and auth.
 * Centralising keys avoids typos and keeps storage contract in one place.
 */

/** sessionStorage key for the JWT (used by client interceptors and auth slice). */
export const AUTH_TOKEN_STORAGE_KEY = 'vensar_auth_token'

/** sessionStorage key for the current user payload (after login/verify). */
export const AUTH_USER_STORAGE_KEY = 'vensar_auth_user'
