/**
 * Auth API request/response types (aligned with Nest backend DTOs and responses).
 */

/** User shape returned by auth endpoints (backend toPublic). */
export interface AuthUserDto {
  _id: string
  email: string
  name: string
  role: string
  isActive?: boolean
}

/** POST /auth/request-otp response (demo: includes otp in body). */
export interface RequestOtpResponseDto {
  message: string
  mobile: string
  otp: string
}

/** POST /auth/verify-otp and POST /auth/login response. */
export interface AuthTokenResponseDto {
  access_token: string
  user: AuthUserDto
}
