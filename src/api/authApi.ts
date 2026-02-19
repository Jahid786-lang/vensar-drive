/**
 * Auth API: login, OTP request/verify.
 * All functions throw on non-2xx; errors are already normalised by apiClient interceptors.
 */

import { apiClient } from './client'
import type {
  RequestOtpResponseDto,
  AuthTokenResponseDto,
} from './types/auth.types'

// Re-export for consumers that need response shapes
export type { RequestOtpResponseDto, AuthTokenResponseDto } from './types/auth.types'

const AUTH_PREFIX = '/auth' as const

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Requests an OTP for the given credentials (step 1 of OTP login).
 * Backend validates credentials and returns email + otp (demo: otp in response).
 */
export async function requestOtp(
  email: string,
  password: string,
): Promise<RequestOtpResponseDto> {
  const { data } = await apiClient.post<RequestOtpResponseDto>(
    `${AUTH_PREFIX}/request-otp`,
    { loginId: email.trim(), password },
  )
  return data
}

/**
 * Verifies OTP and returns tokens + user (step 2 of OTP login).
 * Caller is responsible for persisting access_token and user (e.g. in auth slice).
 */
export async function verifyOtp(
  mobile: string,
  otp: string,
): Promise<AuthTokenResponseDto> {
  const { data } = await apiClient.post<AuthTokenResponseDto>(
    `${AUTH_PREFIX}/verify-otp`,
    { identifier: mobile.trim(), otp: otp.trim() },
  )
  return data
}

/**
 * Classic email+password login (no OTP). Returns access_token + user.
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthTokenResponseDto> {
  const { data } = await apiClient.post<AuthTokenResponseDto>(
    `${AUTH_PREFIX}/login`,
    { email: email.trim(), password },
  )
  return data
}
