import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { requestOtp as apiRequestOtp, verifyOtp as apiVerifyOtp } from '@/api/authApi'
import { AUTH_USER_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY } from '@/api/constants'
import { encryptToken, getDecryptedToken } from '@/lib/authStorage'
import type { UserRole } from '@/constants/roles'

export type { UserRole }

export interface User {
  _id: string
  id: string
  email: string
  name: string
  role: UserRole
  avatar: string | null
  phone: string | null
  /** ISO date string – use new Date(createdAt) when you need a Date */
  createdAt: string
  /** ISO date string – use new Date(updatedAt) when you need a Date */
  updatedAt: string
  isActive: boolean
  createdBy: string
  updatedBy: string
  address: string | null
}

// -----------------------------------------------------------------------------
// Persistence helpers (sessionStorage keys from api/constants)
// -----------------------------------------------------------------------------

function loadStoredUser(): User | null {
  try {
    const raw = sessionStorage.getItem(AUTH_USER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    if (!parsed.role) parsed.role = 'user'
    return parsed
  } catch {
    return null
  }
}

/** Exposed for any code that needs the current JWT (decrypted from storage). */
export function getStoredToken(): string | null {
  return getDecryptedToken()
}

const VALID_ROLES: UserRole[] = ['super_admin', 'admin', 'user']

function mapBackendUser(u: { _id: string; email: string; name: string; role: string }): User {
  const role = VALID_ROLES.includes(u.role as UserRole) ? (u.role as UserRole) : 'user'
  const now = new Date().toISOString()
  return {
    _id: u._id,
    id: u._id,
    email: u.email,
    name: u.name ?? u.email?.split('@')[0] ?? 'User',
    role,
    avatar: null,
    phone: null,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    createdBy: '',
    updatedBy: '',
    address: null,
  }
}

// -----------------------------------------------------------------------------
// Async thunks (auth flow)
// -----------------------------------------------------------------------------

/** Step 1: Request OTP from backend; on success, store pending email and return otp for demo UI. */
export const requestOtpThunk = createAsyncThunk<
  { mobile: string; otp: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/requestOtp', async ({ email, password }, { rejectWithValue }) => {
  try {
    if (!email?.trim() || !password?.trim()) {
      return rejectWithValue('Email and password are required')
    }
    const res = await apiRequestOtp(email, password)
    return { mobile: res.mobile, otp: res.otp }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP'
    return rejectWithValue(message)
  }
})

/** Step 2: Verify OTP with backend and store token + user. */
export const verifyOtpThunk = createAsyncThunk<
  User,
  { mobile: string; otp: string },
  { rejectValue: string }
>('auth/verifyOtp', async ({ mobile, otp }, { rejectWithValue }) => {
  try {
    const res = await apiVerifyOtp(mobile, otp)
    const user = mapBackendUser(res.user)
    sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, encryptToken(res.access_token))
    sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
    return user
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.'
    return rejectWithValue(message)
  }
})

interface AuthState {
  user: User | null
  pendingLogin: { mobile: string } | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: loadStoredUser(),
  pendingLogin: null,
  isLoading: false,
  error: null,
}

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.pendingLogin = null
      state.error = null
      sessionStorage.removeItem(AUTH_USER_STORAGE_KEY)
      sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    },
    clearError(state) {
      state.error = null
    },
    clearPendingLogin(state) {
      state.pendingLogin = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(requestOtpThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(requestOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.pendingLogin = { mobile: action.payload.mobile }
        state.error = null
      })
      .addCase(requestOtpThunk.rejected, (state, action) => {
        state.isLoading = false
        state.pendingLogin = null
        state.error = action.payload ?? 'Failed to send OTP'
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.pendingLogin = null
        state.error = null
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Verification failed'
      })
      .addCase(loadPendingOtpThunk.fulfilled, (state, action) => {
        state.pendingLogin = action.payload ? { mobile: action.payload.mobile } : null
      })
  },
})

/** No-op: pending OTP is not persisted; after refresh user sees credentials step again. */
export const loadPendingOtpThunk = createAsyncThunk<
  { mobile: string } | null,
  void,
  { rejectValue: never }
>('auth/loadPendingOtp', async () => {
  return null
})

export const { logout, clearError, clearPendingLogin } = authSlice.actions
